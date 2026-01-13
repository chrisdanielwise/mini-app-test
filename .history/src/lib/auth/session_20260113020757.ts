import { cookies, headers } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { JWT_CONFIG } from "./config";

/**
 * 🛰️ UNIVERSAL SESSION RESOLVER (v12.1.0)
 * Logic: Dual-Ingress (Cookie + Bearer) with Relational Sync.
 * Optimized: React 'cache' prevents redundant DB lookups in a single request.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const headerList = await headers();

    // 🛡️ SHIELD 0: DUAL-INGRESS EXTRACTION
    // Priority 1: HttpOnly Cookie (Standard Browsers)
    // Priority 2: Authorization Header (Telegram SecureStorage Recovery)
    let token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    if (!token) {
      const authHeader = headerList.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Extract "Bearer " prefix
        console.log("🛰️ [Session_Audit] Cookie missing. Session recovered via Bearer Token.");
      }
    }

    if (!token) return null;

    // 🛡️ SHIELD 1: CRYPTOGRAPHIC VERIFICATION
    const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret);
    
    const userId = (payload.sub || payload.userId) as string;
    const tokenMerchantId = (payload.merchantId as string | null) || null;
    const tokenIsStaff = !!payload.isStaff;

    if (!userId) return null;

    // 🛡️ SHIELD 2: RELATIONAL CROSS-CHECK
    // Pulls the latest roles and merchant links from the database.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        merchantProfile: { select: { id: true, companyName: true, botUsername: true } },
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    });

    // Security Killswitch: Ban/Deletion check
    if (!user || user.deletedAt) {
      console.warn(`🚫 [Session_Audit] Rejected: User ${userId} no longer exists or is suspended.`);
      return null;
    }

    // 🛡️ SHIELD 3: IDENTITY CONVERGENCE
    const normalizedRole = user.role.toLowerCase();
    const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(normalizedRole);

    // Resolve Merchant ID from Owner Profile OR Team Membership OR Token Fallback
    const currentMerchantId = 
      user.merchantProfile?.id || 
      user.teamMemberships[0]?.merchantId || 
      tokenMerchantId;

    return {
      user: {
        id: user.id,
        role: normalizedRole,
        fullName: user.fullName,
        username: user.username,
        // 🛡️ BIGINT SAFETY: Standardized for Server Component serialization
        telegramId: user.telegramId?.toString() || null,
      },
      isStaff: isPlatformStaff || tokenIsStaff,
      merchantId: currentMerchantId,
      // Identity Manifest for UI Context
      config: {
        companyName: user.merchantProfile?.companyName || (isPlatformStaff ? "Zipha Systems HQ" : "Standard Node"),
        botUsername: user.merchantProfile?.botUsername || null,
        isOwner: !!user.merchantProfile,
        isSetup: !!user.merchantProfile?.botUsername,
      }
    };

  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") {
       console.warn("🔐 [Session_Audit] Expired JWT blocked.");
    } else {
       console.error("🔥 [Session_Critical] Handshake Failure:", error.message);
    }
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

  if (!session.isStaff) {
    console.warn(`🚫 [Gatekeeper] Unauthorized access attempt by ${session.user.id}.`);
    return redirect("/dashboard?error=access_denied");
  }
  return session;
}