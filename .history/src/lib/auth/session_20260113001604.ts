import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { JWT_CONFIG } from "./config";

/**
 * 🛰️ UNIVERSAL SESSION RESOLVER (v11.6.0)
 * Logic: Stateless Priority with Relational Cross-Check.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    if (!token) return null;

    // 🛡️ SHIELD 1: CRYPTOGRAPHIC VERIFICATION
    // We trust the signature first. This is "Stateless" and fast.
    const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret);
    
    const userId = (payload.sub || payload.userId) as string;
    const tokenMerchantId = (payload.merchantId as string | null) || null;
    const tokenIsStaff = !!payload.isStaff;

    if (!userId) return null;

    // 🛡️ SHIELD 2: RELATIONAL CROSS-CHECK
    // We check the DB to see if the user's status has changed since the JWT was issued.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        merchantProfile: { select: { id: true, companyName: true } },
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    });

    // If user was deleted or banned in the DB, kill the session immediately.
    if (!user || user.deletedAt) return null;

    // 🛡️ SHIELD 3: IDENTITY CONVERGENCE
    // We combine the Token's "fast" data with the DB's "true" data.
    const currentMerchantId = 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      tokenMerchantId; // Fallback to token if DB relations are somehow empty

    const normalizedRole = user.role.toLowerCase();
    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(normalizedRole);

    return {
      user: {
        id: user.id,
        role: normalizedRole,
        fullName: user.fullName,
        telegramId: user.telegramId?.toString() || null,
      },
      isStaff: isStaff || tokenIsStaff, // Staff status from either source
      merchantId: currentMerchantId,
      // Metadata for UI branding
      config: {
        companyName: user.merchantProfile?.companyName || (isStaff ? "Zipha HQ" : "Standard Node"),
        isOwner: !!user.merchantProfile,
        isSetup: !!user.merchantProfile?.id
      }
    };

  } catch (error: any) {
    console.error("🔥 [Session_Sync_Failure]:", error.message);
    return null;
  }
});

/**
 * 🛡️ THE GATEKEEPERS
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) return redirect("/dashboard/login?reason=auth_required");
  return session;
}

export async function requireStaff() {
  const session = await getSession();
  if (!session) return redirect("/dashboard/login?reason=auth_required");
  if (!session.isStaff) return redirect("/dashboard?error=access_denied");
  return session;
}