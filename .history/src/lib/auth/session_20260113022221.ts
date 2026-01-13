import { cookies, headers } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { JWT_CONFIG } from "./config";

/**
 * 🛰️ UNIVERSAL SESSION RESOLVER (v12.7.0)
 * Logic: Dual-Ingress (Cookie + Bearer) with Relational Sync.
 * Optimized: React 'cache' prevents redundant DB lookups within a single render cycle.
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
        console.log("🛰️ [Session_Audit] Cookie blocked or missing. Session recovered via Bearer Ingress.");
      }
    }

    if (!token) return null;

    // 🛡️ SHIELD 1: CRYPTOGRAPHIC VERIFICATION
    // Ensures the token hasn't been tampered with and is signed by our institutional secret.
    const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret);
    
    const userId = (payload.sub || payload.userId) as string;
    const tokenMerchantId = (payload.merchantId as string | null) || null;
    const tokenIsStaff = !!payload.isStaff;

    if (!userId) return null;

    // 🛡️ SHIELD 2: RELATIONAL CROSS-CHECK
    // Pulls real-time identity data to override potentially stale JWT claims.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        merchantProfile: { 
          select: { id: true, companyName: true, botUsername: true, planStatus: true } 
        },
        teamMemberships: { take: 1, select: { merchantId: true } }
      }
    });

    // 🚫 SECURITY KILLSWITCH: Immediate ejection if user is banned or deleted
    if (!user || user.deletedAt) {
      console.warn(`🚫 [Session_Audit] Rejected: User ${userId} is no longer active in the cluster.`);
      return null;
    }

    // 🛡️ SHIELD 3: IDENTITY CONVERGENCE
    const normalizedRole = user.role.toLowerCase();
    
    // Use centralized roles from JWT_CONFIG for RBAC consistency
    const isPlatformStaff = JWT_CONFIG.staffRoles.includes(normalizedRole);

    // Resolve Merchant context: Owner Profile > Team Membership > Token Metadata
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
        // 🛡️ BIGINT SAFETY: Stringified for Server Component & Client Hook serialization
        telegramId: user.telegramId?.toString() || null,
      },
      isStaff: isPlatformStaff || tokenIsStaff,
      merchantId: currentMerchantId,
      // Identity Manifest: Used for UI Flavoring (Merchant vs Staff views)
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
       console.warn("🔐 [Session_Audit] Attempted access with expired token.");
    } else {
       console.error("🔥 [Session_Critical] Resolution Failure:", error.message);
    }
    return null;
  }
});

/**
 * 🛡️ THE GATEKEEPERS
 * High-order functions for Page-level and Action-level security.
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
    console.warn(`🚫 [Gatekeeper] High-clearance access denied for ${session.user.id}.`);
    return redirect("/dashboard?error=access_denied");
  }
  return session;
}