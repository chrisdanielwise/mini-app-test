import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🛰️ UNIVERSAL SESSION RESOLVER
 * Resolves identity for Staff, Merchants, and Riders.
 * Fixes: Prevents crashes when merchantId is null (Staff oversight mode).
 */
export const getSession = cache(async (retryCount = 0): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. DECRYPT JWT
    const { payload } = await jose.jwtVerify(token, SECRET);
    const userId = (payload.sub || payload.userId) as string;
    const merchantId = payload.merchantId as string | null;

    if (!userId) return null;

    // 2. PARALLEL IDENTITY FETCH
    // We fetch the core user and conditionally include the merchant cluster data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        // Staff don't always have memberships, so we check for this safely
        teamMemberships: merchantId ? {
          where: { merchantId },
          include: { merchant: true }
        } : false,
        merchantProfile: true
      }
    });

    if (!user) return null;

    // 3. ROLE ARCHITECTURE
    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(user.role);
    const membership = user.teamMemberships?.[0];

    /**
     * 🏁 SESSION PAYLOAD CONSTRUCTION
     * If Staff: Provide global clearance.
     * If Merchant: Provide tenant-isolated config.
     */
    return {
      user: {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
        telegramId: user.telegramId?.toString(),
      },
      isStaff,
      // Priority: Membership ID -> Owned Profile ID -> Null (Staff/Guest)
      merchantId: merchantId || membership?.merchantId || user.merchantProfile?.id || null,
      
      config: membership?.merchant ? {
        companyName: membership.merchant.companyName,
        botUsername: membership.merchant.botUsername,
        availableBalance: membership.merchant.availableBalance?.toString(),
        isSetup: !!membership.merchant.botUsername,
      } : (isStaff ? { companyName: "Zipha Systems HQ", isGlobal: true } : null)
    };

  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") return null;
    console.error("🔥 [Session_Crash]:", error.message);
    return null;
  }
});

/**
 * 🛡️ THE GATEKEEPERS
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/dashboard/login?reason=unauthorized");
  return session;
}

export async function requireStaff() {
  const session = await getSession();
  if (!session || !session.isStaff) redirect("/dashboard/login?reason=forbidden");
  return session;
}