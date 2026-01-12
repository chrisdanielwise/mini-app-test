import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { JWT_CONFIG } from "./config";

/**
 * 🛰️ UNIVERSAL SESSION RESOLVER (Institutional v9.7.6)
 * Hardened: BigInt safety and role normalization.
 * Optimized: React 'cache' prevents redundant DB lookups in the same request cycle.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    if (!token) {
      console.log(`📡 [Session_Audit] No '${JWT_CONFIG.cookieName}' found in ingress.`);
      return null;
    }

    // 1. DECRYPT JWT (Source of Truth: config.ts)
    const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret);
    
    // Support multiple sub-key conventions for flexible ingress
    const userId = (payload.sub || payload.userId) as string;
    const merchantIdFromToken = (payload.merchantId as string | null) || null;

    if (!userId) {
      console.warn("⚠️ [Session_Audit] Token verified but identity signature ('sub') is missing.");
      return null;
    }

    // 2. FETCH IDENTITY (Standardized Relation: merchantProfile)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        merchantProfile: true 
      }
    });

    if (!user) {
      console.error(`❌ [Session_Audit] Identity Node Not Found in DB: ${userId}`);
      return null;
    }

    /**
     * 🚀 ROLE NORMALIZATION
     * Forces lowercase to prevent string-match failures in the RBAC layer.
     */
    const normalizedRole = user.role.toLowerCase();
    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(normalizedRole);

    console.log(`✅ [Session_Audit] Resolved Identity: ${user.id} | Protocol: ${normalizedRole}`);

    return {
      user: {
        id: user.id,
        role: normalizedRole,
        fullName: user.fullName,
        // 🛡️ BIGINT SAFETY: Next.js SSR cannot serialize raw BigInts
        telegramId: user.telegramId?.toString() || null,
      },
      isStaff,
      // Priority: Payload Signature -> User DB Profile
      merchantId: merchantIdFromToken || user.merchantProfile?.id || null,
      config: user.merchantProfile ? {
        companyName: user.merchantProfile.companyName,
        botUsername: user.merchantProfile.botUsername,
        isSetup: !!user.merchantProfile.botUsername,
      } : (isStaff ? { companyName: "Zipha Systems HQ", isGlobal: true } : null)
    };

  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") {
       console.warn("🔐 [Session_Audit] Ingress Blocked: JWT Expired.");
    } else {
       console.error("🔥 [Session_Critical] Cryptographic Handshake Failure:", error.message);
    }
    return null;
  }
});

/**
 * 🛡️ THE GATEKEEPERS
 * Optimized for Server Component use (requireAuth / requireStaff).
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
    console.warn(`🚫 [Gatekeeper] Unauthorized Oversight Attempt: User ${session.user.id}.`);
    return redirect("/dashboard?error=access_denied");
  }
  return session;
}