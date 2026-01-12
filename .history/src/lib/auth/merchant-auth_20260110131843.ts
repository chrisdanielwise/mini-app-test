import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; // 🚀 Added for Request Memoization

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🛰️ GET MERCHANT SESSION (Apex Tier)
 * Wrapped in React 'cache' to ensure that if 5 different components 
 * call this on one page, only 1 DB query is executed.
 */
export const getMerchantSession = cache(async (retryCount = 0): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. JWT Decryption (Stateless)
    const { payload } = await jose.jwtVerify(token, SECRET);
    const merchantId = payload.merchantId as string;

    /**
     * 2. RESILIENT DB FETCH
     * Uses a race condition to prevent serverless hang-ups.
     */
    const merchant = await Promise.race([
      prisma.merchantProfile.findUnique({
        where: { id: merchantId },
        include: { 
          adminUser: {
            select: { id: true, email: true, role: true, name: true } // 🔒 Security: Only select safe fields
          } 
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB_HANDSHAKE_TIMEOUT")), 15000)
      ),
    ]).catch(async (err: any) => {
      // Retry Logic for Neon/Serverless cold starts
      if (
        retryCount < 1 &&
        (err.message.includes("TIMEOUT") || err.code === "P2028")
      ) {
        console.warn(`⏳ DB Warming... Auth Retry ${retryCount + 1}`);
        await new Promise((res) => setTimeout(res, 2000));
        return getMerchantSession(retryCount + 1);
      }
      throw err;
    }) as any;

    if (!merchant || !merchant.adminUser) return null;

    // 3. Return Institutional Session
    return {
      user: merchant.adminUser,
      merchantId: merchant.id,
      config: {
        companyName: merchant.companyName,
        botUsername: merchant.botUsername,
        isSetup: !!merchant.botUsername,
      }
    };
  } catch (error: any) {
    if (error.code !== "ERR_JWT_EXPIRED") {
      console.error("[Auth_System_Failure]", error.message);
    }
    return null;
  }
});

/**
 * 🛡️ REQUIRE MERCHANT SESSION
 * Institutional gatekeeper for administrative routes.
 */
export async function requireMerchantSession() {
  const session = await getMerchantSession();
  if (!session) redirect("/dashboard/login?reason=session_expired");
  return session;
}