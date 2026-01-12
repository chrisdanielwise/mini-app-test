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
 * Fixed: Robust ID extraction to prevent Prisma 'id: undefined' crashes.
 * Integrated: Synced with 'MerchantTeam' (teamMemberships) schema.
 */
export const getMerchantSession = cache(async (retryCount = 0): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. JWT Decryption
    const { payload } = await jose.jwtVerify(token, SECRET);
    
    // ✅ IDENTITY HANDSHAKE: Ensure sub (User ID) and merchantId are present
    const userId = (payload.sub || payload.userId) as string;
    const merchantId = payload.merchantId as string;

    if (!userId || !merchantId) {
      console.warn("[Auth_Failure] Token verified but claims are missing.");
      return null;
    }

    /**
     * 2. RESILIENT DB FETCH
     * Implements a 15s timeout and automatic retry for Neon cold starts.
     */
    const identityNode = await Promise.race([
      prisma.user.findUnique({
        where: { id: userId }, 
        include: { 
          // ✅ SCHEMA FIX: Renamed from merchantMemberships to teamMemberships
          teamMemberships: {
            where: { merchantId: merchantId },
            include: { merchant: true }
          }
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB_HANDSHAKE_TIMEOUT")), 15000)
      ),
    ]).catch(async (err: any) => {
      // Retry Logic: Gives the DB time to provision if it's currently suspended
      if (
        retryCount < 2 && 
        (err.message.includes("TIMEOUT") || err.code === "P2028" || err.code === "P1001")
      ) {
        console.warn(`⏳ DB Warming... Auth Retry ${retryCount + 1}`);
        await new Promise((res) => setTimeout(res, 3000));
        return getMerchantSession(retryCount + 1);
      }
      throw err;
    }) as any;

    // 🔒 Security Guard: Verify existence and Merchant role
    if (!identityNode || identityNode.role.toUpperCase() !== "MERCHANT") {
      console.warn(`[Auth_Guard] Access denied for role: ${identityNode?.role}`);
      return null;
    }

    // 🔒 Specific Guard: Check membership in 'teamMemberships'
    const membership = identityNode.teamMemberships?.[0];
    if (!membership) {
      console.warn(`[Auth_Guard] User ${userId} is not a member of node ${merchantId}`);
      return null;
    }

    // 3. Return Institutional Session
    return {
      user: {
        id: identityNode.id,
        role: identityNode.role,
        fullName: identityNode.fullName,
        telegramId: identityNode.telegramId?.toString(),
      },
      merchantId: membership.merchantId,
      staffRole: membership.role, // OWNER, ADMIN, or AGENT
      config: {
        companyName: membership.merchant.companyName || "Zipha Merchant",
        botUsername: membership.merchant.botUsername,
        isSetup: !!membership.merchant.botUsername,
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
  
  if (!session) {
    redirect("/dashboard/login?reason=session_expired");
  }
  
  return session;
}