import { cookies, headers } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { JWT_CONFIG } from "./config";

/**
 * 🛰️ UNIVERSAL SESSION RESOLVER (Institutional v12.20.0)
 * Logic: Dual-Ingress (Cookie + Bearer) with Relational Sync.
 * Performance: Optimized 'select' patterns to eliminate "Turtle" slow queries.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const headerList = await headers();

    // 🛡️ SHIELD 0: DUAL-INGRESS EXTRACTION
    // Priority 1: HttpOnly Cookie (Standard Browser Ingress)
    // Priority 2: Authorization Header (Telegram SecureStorage Recovery)
    let token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    if (!token) {
      const authHeader = headerList.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Strip "Bearer " prefix
        console.log("🛰️ [Session_Audit] Cookie hidden. Session recovered via Bearer Ingress.");
      }
    }

    if (!token) return null;

    // 🛡️ SHIELD 1: CRYPTOGRAPHIC VERIFICATION
    // Verification against institutional JWT_SECRET (Uint8Array)
    const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret);
    
    const userId = (payload.sub || payload.userId) as string;
    const tokenMerchantId = (payload.merchantId as string | null) || null;
    const tokenIsStaff = !!payload.isStaff;

    if (!userId) return null;

    // 🛡️ SHIELD 2: RELATIONAL CROSS-CHECK
    // 🚀 OPTIMIZATION: We only 'select' vital fields to prevent disk-heavy scans.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        telegramId: true, // BigInt handled below
        fullName: true,
        username: true,
        role: true,
        deletedAt: true,
        merchantProfile: { 
          select: { id: true, companyName: true, botUsername: true, planStatus: true } 
        },
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    });

    // 🚫 SECURITY KILLSWITCH: Immediate ejection if node is compromised or deleted
    if (!user || user.deletedAt) {
      console.warn(`🚫 [Session_Audit] Rejected: User Node ${userId} is inactive or purged.`);
      return null;
    }

    // 🛡️ SHIELD 3: IDENTITY CONVERGENCE
    const normalizedRole = user.role.toLowerCase();
    
    // Validate against centralized RBAC from JWT_CONFIG
    const isPlatformStaff = JWT_CONFIG.staffRoles.includes(normalizedRole);

    // Context Resolution: Owner Profile > Team Membership > Token Fallback
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
        // 🛡️ BIGINT RESILIENCE: Stringified for React Server Components
        telegramId: user.telegramId?.toString() || null,
      },
      isStaff: isPlatformStaff || tokenIsStaff,
      merchantId: currentMerchantId,
      // Identity Manifest for Frontend Context
      config: {
        companyName: user.merchantProfile?.companyName || (isPlatformStaff ? "Zipha HQ" : "Standard Node"),
        botUsername: user.merchantProfile?.botUsername || null,
        planStatus: user.merchantProfile?.planStatus || "FREE",
        isOwner: !!user.merchantProfile,
        isSetup: !!user.merchantProfile?.botUsername,
      }
    };

  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") {
       console.warn("🔐 [Session_Audit] Handshake aborted: Expired Token.");
    } else {
       console.error("🔥 [Session_Critical] Resolution Failure:", error.message);
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
    console.warn(`🚫 [Gatekeeper] Unauthorized platform access attempt by ${session.user.id}.`);
    return redirect("/dashboard?error=access_denied");
  }
  return session;
}