import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🚀 GET MERCHANT SESSION (Schema-Optimized)
 * Handles stateless JWT verification and resilient database lookups.
 */
export async function getMerchantSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. Verify JWT (Stateless)
    const { payload } = await jose.jwtVerify(token, SECRET);
    const merchantId = payload.merchantId as string;

    /**
     * 2. DB FETCH WITH COLD-START RESILIENCE
     * Neon wake-up takes ~4s. We set a 15s window to ensure the 
     * handshake succeeds even if the database was idle.
     */
    const merchant = await Promise.race([
      prisma.merchantProfile.findUnique({
        where: { id: merchantId },
        // 🏁 SCHEMA FIX: Relation name is 'adminUser' per your schema
        include: { adminUser: true }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("DB_HANDSHAKE_TIMEOUT")), 15000)
      )
    ]) as any;

    if (!merchant || !merchant.adminUser) {
      console.warn(`[Auth] No Profile found for Merchant ID: ${merchantId}`);
      return null;
    }

    // 3. Return mapped session object
    return {
      user: merchant.adminUser,
      merchant: {
        id: merchant.id,
        companyName: merchant.companyName,
       botUsername: merchant.botUsername || "Setup Pending",
        // Role comes from the User model (UserRole enum)
        role: merchant.adminUser.role 
      }
    };
  } catch (error) {
    console.error("🔐 Auth Handshake Failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * 🛡️ REQUIRE MERCHANT SESSION
 * Guard function for Server Components and API Routes.
 */
export async function requireMerchantSession() {
  const session = await getMerchantSession();
  
  // If no session, bounce to login. 
  // The 'return' is never reached due to the redirect.
  if (!session) {
    redirect("/dashboard/login?reason=session_expired");
  }
  
  return session;
}