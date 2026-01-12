import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🛰️ GET MERCHANT SESSION (Apex Tier)
 * Corrected to match Zipha V2 Schema (fullName instead of name).
 */
export const getMerchantSession = cache(async (retryCount = 0): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. JWT Decryption
    const { payload } = await jose.jwtVerify(token, SECRET);
    const merchantId = payload.merchantId as string;

    /**
     * 2. RESILIENT DB FETCH
     * Uses a race condition to handle Neon cold starts.
     */
    const merchant = await Promise.race([
      prisma.merchantProfile.findUnique({
        where: { id: merchantId },
        include: { 
          adminUser: {
            select: { 
              id: true, 
              email: true, 
              role: true, 
              fullName: true,  // ✅ FIXED: Matches your schema's 'fullName'
              firstName: true, // ✅ Added for UI greetings
              lastName: true,  // ✅ Added for UI greetings
              telegramId: true // ✅ Added for session context
            } 
          } 
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB_HANDSHAKE_TIMEOUT")), 15000)
      ),
    ]).catch(async (err: any) => {
      // Retry Logic for Neon cold starts
      if (
        retryCount < 1 &&
        (err.message.includes("TIMEOUT") || err.code === "P2028" || err.message.includes("database"))
      ) {
        console.warn(`⏳ DB Warming... Auth Retry ${retryCount + 1}`);
        await new Promise((res) => setTimeout(res, 2000));
        return getMerchantSession(retryCount + 1);
      }
      throw err;
    }) as any;

    if (!merchant || !merchant.adminUser) return null;

    // 3. Return Institutional Session with Serialized BigInts
    return {
      user: {
        ...merchant.adminUser,
        telegramId: merchant.adminUser.telegramId.toString(), // 🔒 Stringify for Next.js 15 hydration
      },
      merchantId: merchant.id,
      config: {
        companyName: merchant.companyName || "Zipha Merchant",
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
 */
export async function requireMerchantSession() {
  const session = await getMerchantSession();
  if (!session) redirect("/dashboard/login?reason=session_expired");
  return session;
}