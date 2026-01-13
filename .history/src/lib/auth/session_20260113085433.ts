import { cookies, headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { AuthService } from "@/lib/services/auth.service"; // 🚀 Unified Auth
import { JWT_CONFIG } from "./config";

/**
 * 🛰️ UNIVERSAL SESSION RESOLVER (Institutional v13.2.10)
 * Logic: Dual-Ingress (Cookie + Bearer) with Server-Side Memoization.
 * Performance: Uses React 'cache' to ensure getSession() only runs once per request.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const headerList = await headers();

    // 🛡️ SHIELD 0: DUAL-INGRESS EXTRACTION
    let token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    if (!token) {
      const authHeader = headerList.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
        console.log("🛰️ [Session_Audit] Cookie hidden. Recovered via Bearer.");
      }
    }

    if (!token) return null;

    // 🛡️ SHIELD 1: CRYPTOGRAPHIC VERIFICATION
    // Uses the centralized AuthService for signature & expiry validation
    const payload = await AuthService.verifySession(token);
    
    if (!payload || !payload.sub) return null;

    const userId = payload.sub as string;

    // 🛡️ SHIELD 2: RELATIONAL CROSS-CHECK
    // 🚀 OPTIMIZATION: Stripping 'turtle' slow queries by selecting only vital fields.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        telegramId: true, 
        firstName: true, // 🔄 Aligned with v13 schema
        username: true,
        role: true,
        deletedAt: true,
        merchantProfile: { 
          select: { id: true, companyName: true, botUsername: true, planStatus: true } 
        },
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    });

    // 🚫 SECURITY KILLSWITCH
    if (!user || user.deletedAt) return null;

    // 🛡️ SHIELD 3: IDENTITY CONVERGENCE
    const normalizedRole = user.role.toLowerCase();
    const isPlatformStaff = JWT_CONFIG.staffRoles.includes(normalizedRole) || !!payload.isStaff;

    const currentMerchantId = 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      (payload.merchantId as string | null);

    return {
      user: {
        id: user.id,
        role: normalizedRole,
        firstName: user.firstName,
        username: user.username,
        // 🛡️ BIGINT RESILIENCE: Explicitly cast to string for RSC serialization
        telegramId: user.telegramId?.toString() || null,
      },
      isStaff: isPlatformStaff,
      merchantId: currentMerchantId,
      config: {
        companyName: user.merchantProfile?.companyName || (isPlatformStaff ? "Zipha HQ" : "Standard Node"),
        botUsername: user.merchantProfile?.botUsername || null,
        planStatus: user.merchantProfile?.planStatus || "FREE",
        isOwner: !!user.merchantProfile,
        isSetup: !!user.merchantProfile?.botUsername,
      }
    };

  } catch (error: any) {
    console.error("🔥 [Session_Critical] Resolution Failure:", error.message);
    return null;
  }
});

/**
 * 🛡️ THE GATEKEEPERS (Server Component Guards)
 */
export async function requireAuth() {
  const session = await getSession();
  // 🚀 FIX: Update this redirect path
  if (!session) return redirect("/dashboard/login?reason=auth_required");
  return session;
}

export async function requireStaff() {
  const session = await getSession();

  // 1. If no session exists, send to the login page
  if (!session) {
    return redirect("/dashboard/login?reason=auth_required");
  }

  // 2. If session exists but user is not staff, send to login with error
  // Note: We avoid redirecting to /dashboard to prevent loops.
  if (!session.isStaff) {
    console.warn(`🔐 [Security] Access Denied for User: ${session.user.id}`);
    return redirect("/dashboard/login?reason=access_denied");
  }

  return session;
}