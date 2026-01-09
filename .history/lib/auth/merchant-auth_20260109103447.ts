import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🚀 GET MERCHANT SESSION (Resilient)
 * Handles stateless JWT verification and resilient database lookups.
 * FIXED: Added retry logic to prevent kicks during DB cold starts.
 */
export async function getMerchantSession(retryCount = 0): Promise<any | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. Verify JWT (Stateless)
    const { payload } = await jose.jwtVerify(token, SECRET);
    const merchantId = payload.merchantId as string;

    /**
     * 2. DB FETCH WITH RETRY LOGIC
     * Uses a race against a timeout to detect DB hanging.
     */
    const merchant = await Promise.race([
      prisma.merchantProfile.findUnique({
        where: { id: merchantId },
        include: { adminUser: true },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB_HANDSHAKE_TIMEOUT")), 15000)
      ),
    ]).catch(async (err) => {
      // 🔥 THE FIX: If DB is waking up or timed out, retry once after a short delay
      if (retryCount < 1 && (err.message.includes("TIMEOUT") || err.message.includes("connection"))) {
        console.warn(`⏳ Auth retry 1/1: DB is waking up...`);
        await new Promise((res) => setTimeout(res, 1500)); // wait 1.5s
        return getMerchantSession(retryCount + 1);
      }
      throw err;
    });

    if (!merchant || !merchant.adminUser) {
      console.warn(`[Auth] Profile mismatch for ID: ${merchantId}`);
      return null;
    }

    return {
      user: merchant.adminUser,
      merchant: {
        id: merchant.id,
        companyName: merchant.companyName || "GreysuitFx",
        botUsername: merchant.botUsername || "Setup Pending",
        role: merchant.adminUser.role,
      },
    };
  } catch (error) {
    console.error(
      "🔐 Auth Handshake Failed:",
      error instanceof Error ? error.message : "Unknown Error"
    );
    return null;
  }
}

/**
 * 🛡️ REQUIRE MERCHANT SESSION
 * Guard function that forces a redirect if no session is found.
 */
export async function requireMerchantSession() {
  const session = await getMerchantSession();

  if (!session) {
    // 🔥 Ensure we only redirect if it's a genuine lack of token, 
    // not just a temporary database hiccup handled by the retry.
    redirect("/dashboard/login?reason=session_expired");
  }

  return session;
}