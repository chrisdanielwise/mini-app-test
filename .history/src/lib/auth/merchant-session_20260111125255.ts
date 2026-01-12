import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🛰️ GET SESSION (Universal Identity Hub)
 * Handles Platform Staff, Merchants, and Standard Users in one unified flow.
 */
export const getSession = cache(async (retryCount = 0): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. JWT DECRYPTION
    const { payload } = await jose.jwtVerify(token, SECRET);
    const userId = (payload.sub || payload.userId) as string;
    const merchantId = payload.merchantId as string; // Optional for Staff

    if (!userId) return null;

    // 2. RESILIENT DB FETCH (Universal Identity)
    const user = await prisma.user.findUnique({
      where: { id: userId }, 
      include: { 
        // We include both team memberships AND merchant profile if it exists
        teamMemberships: merchantId ? {
          where: { merchantId: merchantId },
          include: { merchant: true }
        } : false,
        merchantProfile: true 
      },
    });

    if (!user) return null;

    // 3. ROLE-BASED STEERING
    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(user.role);
    const membership = user.teamMemberships?.[0];

    // 🔒 SECURITY CHECK
    // If not staff and no membership, they are just a standard 'USER' node.
    if (!isStaff && !membership) {
        return { user: { id: user.id, role: user.role, fullName: user.fullName }, isGuest: true };
    }

    // 4. INSTITUTIONAL SESSION PAYLOAD
    return {
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        telegramId: user.telegramId?.toString(),
      },
      // 🛡️ STAFF OVERLAY: Staff get an 'isStaff' flag and global clearance
      isStaff,
      
      // 🏘️ MERCHANT CLUSTER: Only present if user is a merchant or member
      merchantId: membership?.merchantId || user.merchantProfile?.id || null,
      staffRole: membership?.role || (user.merchantProfile ? "OWNER" : null),
      
      config: membership?.merchant ? {
        companyName: membership.merchant.companyName,
        botUsername: membership.merchant.botUsername,
        isSetup: !!membership.merchant.botUsername,
      } : (isStaff ? { companyName: "Zipha Headquarters", isStaffCluster: true } : null)
    };

  } catch (error: any) {
    console.error("[Session_Sync_Failure]", error.message);
    return null;
  }
});

/**
 * 🛡️ REQUIRE AUTH SESSION
 * Generic redirect for any non-authenticated user.
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/dashboard/login?reason=unauthorized");
  return session;
}

/**
 * 🛡️ REQUIRE STAFF SESSION
 * Strict barrier for Platform Administration.
 */
export async function requireStaff() {
  const session = await getSession();
  if (!session || !session.isStaff) redirect("/dashboard/login?reason=forbidden");
  return session;
}