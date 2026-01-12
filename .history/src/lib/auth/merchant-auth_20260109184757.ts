import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/src/lib/db";
import { redirect } from "next/navigation";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🚀 GET MERCHANT SESSION (High Resiliency)
 * Handles stateless JWT verification and resilient database lookups.
 * * FIXES:
 * 1. Recursive retry logic for Neon cold starts.
 * 2. Extended timeout for high-latency Ngrok tunnels.
 * 3. Graceful error handling for expired vs. malformed tokens.
 */
export async function getMerchantSession(retryCount = 0): Promise<any | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. Verify JWT (Stateless)
    // jose.jwtVerify will throw an error if the token is expired.
    const { payload } = await jose.jwtVerify(token, SECRET);
    const merchantId = payload.merchantId as string;

    /**
     * 2. DB FETCH WITH COLD-START RETRY
     * We race the query against a 15s timeout.
     */
    const merchant = await Promise.race([
      prisma.merchantProfile.findUnique({
        where: { id: merchantId },
        include: { adminUser: true },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB_HANDSHAKE_TIMEOUT")), 15000)
      ),
    ]).catch(async (err: any) => {
      // If it's a timeout or connection pool issue, retry once.
      // This prevents "Session Expired" kicks during Neon boot-up.
      if (
        retryCount < 1 &&
        (err.message.includes("TIMEOUT") ||
          err.message.includes("connection") ||
          err.code === "P2028")
      ) {
        console.warn(
          `⏳ Auth retry ${retryCount + 1}/1: Database is lagging...`
        );
        await new Promise((res) => setTimeout(res, 2000)); // Wait 2s for DB to warm up
        return getMerchantSession(retryCount + 1);
      }
      throw err;
    });

    if (!merchant || !merchant.adminUser) {
      console.warn(
        `[Auth] No merchant profile linked to token ID: ${merchantId}`
      );
      return null;
    }

    // 3. Return a consistent session object
    return {
      user: merchant.adminUser,
      merchant: {
        id: merchant.id,
        companyName: merchant.companyName || "GreysuitFx",
        botUsername: merchant.botUsername || "Setup Pending",
        role: merchant.adminUser.role,
      },
    };
  } catch (error: any) {
    // If JWT is explicitly expired, log it clearly
    if (error.code === "ERR_JWT_EXPIRED") {
      console.error("🔐 Session Security: JWT has expired.");
    } else {
      console.error(
        "🔐 Auth Handshake Failed:",
        error instanceof Error ? error.message : "Unknown Error"
      );
    }
    return null;
  }
}

/**
 * 🛡️ REQUIRE MERCHANT SESSION
 * Protects routes by redirecting to login if no valid session exists.
 */
export async function requireMerchantSession() {
  const session = await getMerchantSession();

  if (!session) {
    // We only reach this if the token is missing, expired, or DB retries failed.
    redirect("/dashboard/login?reason=session_expired");
  }

  return session;
}
