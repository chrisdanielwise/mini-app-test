import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { JWT_CONFIG } from "./config"; // 🛡️ Source of Truth for Secrets

/**
 * 🛰️ UNIVERSAL SESSION RESOLVER
 * Hardened: Uses JWT_CONFIG to prevent decryption mismatches in Turbopack.
 * Optimized: React 'cache' prevents redundant DB lookups during a single request.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

    if (!token) {
      // 🚩 LOG: Helps diagnose if cookies are reaching the server via Cloudflare
      console.log(`📡 [Session_Audit] No '${JWT_CONFIG.cookieName}' found in cookies.`);
      return null;
    }

    // 1. DECRYPT JWT using Universal Secret
    const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret);
    
    // Support multiple sub-key conventions
    const userId = (payload.sub || payload.userId) as string;
    const merchantId = (payload.merchantId as string | null) || null;

    if (!userId) {
      console.warn("⚠️ [Session_Audit] Token verified but 'userId' is missing from payload.");
      return null;
    }

    // 2. FETCH IDENTITY (Cached via Prisma & React)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        // Updated to use your standardized MerchantProfile relation
        merchantProfile: true 
      }
    });

    if (!user) {
      console.error(`❌ [Session_Audit] Identity Node Not Found in DB. ID: ${userId}`);
      return null;
    }

    /**
     * 🚀 ROLE NORMALIZATION
     * Forces lowercase to match the RBAC arrays in proxy.ts
     */
    const normalizedRole = user.role.toLowerCase();
    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(normalizedRole);

    console.log(`✅ [Session_Audit] Resolved: ${user.id} | Role: ${normalizedRole}`);

    return {
      user: {
        id: user.id,
        role: normalizedRole,
        fullName: user.fullName,
        telegramId: user.telegramId?.toString(),
      },
      isStaff,
      // Priority: JWT payload -> User profile
      merchantId: merchantId || user.merchantProfile?.id || null,
      config: user.merchantProfile ? {
        companyName: user.merchantProfile.companyName,
        botUsername: user.merchantProfile.botUsername,
        isSetup: !!user.merchantProfile.botUsername,
      } : (isStaff ? { companyName: "Zipha Systems HQ", isGlobal: true } : null)
    };

  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") {
       console.warn("🔐 [Session_Audit] JWT Session Expired.");
    } else {
       console.error("🔥 [Session_Critical] Cryptographic Handshake Failed:", error.message);
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
    console.warn(`🚫 [Gatekeeper] Access Denied for User ${session.user.id}.`);
    return redirect("/dashboard?error=access_denied");
  }
  return session;
}