import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/src/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🛰️ GET MERCHANT SESSION (Apex Tier)
 * Fixed: Synchronized with dual-layer UserRole and MerchantRole architecture.
 */
export const getMerchantSession = cache(async (retryCount = 0): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. JWT Decryption
    const { payload } = await jose.jwtVerify(token, SECRET);
    const merchantId = payload.merchantId as string;
    const userId = payload.sub as string;

    /**
     * 2. RESILIENT DB FETCH
     * Fixed: Joins MerchantMember to verify specific MerchantRole (OWNER/ADMIN/AGENT).
     */
    const identityNode = await Promise.race([
      prisma.user.findUnique({
        where: { id: userId },
        include: { 
          // Join the specific membership for this merchant node
          merchantMemberships: {
            where: { merchantId: merchantId },
            include: { merchant: true }
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
        (err.message.includes("TIMEOUT") || err.code === "P2028")
      ) {
        console.warn(`⏳ DB Warming... Auth Retry ${retryCount + 1}`);
        await new Promise((res) => setTimeout(res, 2000));
        return getMerchantSession(retryCount + 1);
      }
      throw err;
    }) as any;

    // 🔒 Security Guard: Verify both existence and global Merchant status
    if (!identityNode || identityNode.role !== "MERCHANT") return null;

    // 🔒 Specific Guard: Ensure user is actually a member of this node
    const membership = identityNode.merchantMemberships[0];
    if (!membership) return null;

    // 3. Return Institutional Session
    return {
      user: {
        id: identityNode.id,
        role: identityNode.role, // Global Tier: e.g., "MERCHANT"
        fullName: identityNode.fullName,
        telegramId: identityNode.telegramId?.toString(),
      },
      merchantId: membership.merchantId,
      // 🛡️ Specific Node Tier: "OWNER", "ADMIN", or "AGENT"
      staffRole: membership.role, 
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
  if (!session) redirect("/dashboard/login?reason=session_expired");
  return session;
}