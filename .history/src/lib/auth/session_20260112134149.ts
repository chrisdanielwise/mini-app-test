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
 * Hardened: Strategic Telemetry added to diagnose registration/login loops.
 * Optimized: React 'cache' prevents redundant DB lookups.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      // 🚩 LOG: Missing Token
      console.log("📡 [Session_Audit] No 'auth_token' found in cookies.");
      return null;
    }

    // 1. DECRYPT JWT
    const { payload } = await jose.jwtVerify(token, SECRET);
    const userId = (payload.sub || payload.userId) as string;
    const merchantId = payload.merchantId as string | null;

    if (!userId) {
      console.warn("⚠️ [Session_Audit] Token verified but 'userId' is missing.");
      return null;
    }

    // 2. FETCH IDENTITY (Cached via Prisma & React)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teamMemberships: merchantId ? {
          where: { merchantId },
          include: { merchant: true }
        } : false,
        merchantProfile: true
      }
    });

    if (!user) {
      console.error(`❌ [Session_Audit] Identity Node Not Found. ID: ${userId}`);
      return null;
    }

    /**
     * 🚀 ROLE NORMALIZATION & TELEMETRY
     * We log the raw DB role vs the normalized role to catch casing issues.
     */
    const normalizedRole = user.role.toLowerCase();
    
    console.log(`✅ [Session_Audit] Identity Resolved:
      -> User_ID: ${user.id}
      -> DB_Role: ${user.role}
      -> Target_Role: ${normalizedRole}
      -> Is_Staff: ${["super_admin", "platform_manager", "platform_support"].includes(normalizedRole)}
      -> Merchant_Linked: ${!!user.merchantProfile || user.teamMemberships.length > 0}
    `);

    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(normalizedRole);
    const membership = user.teamMemberships?.[0];

    return {
      user: {
        id: user.id,
        role: normalizedRole,
        fullName: user.fullName,
        telegramId: user.telegramId?.toString(),
      },
      isStaff,
      merchantId: merchantId || membership?.merchantId || user.merchantProfile?.id || null,
      config: membership?.merchant ? {
        companyName: membership.merchant.companyName,
        botUsername: membership.merchant.botUsername,
        availableBalance: membership.merchant.availableBalance?.toString(),
        isSetup: !!membership.merchant.botUsername,
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
  
  if (!session) {
    console.log("🚩 [Gatekeeper] Unauthorized access. Redirecting to Login.");
    return redirect("/dashboard/login?reason=auth_required");
  }
  
  return session;
}

export async function requireStaff() {
  const session = await getSession();
  
  if (!session) {
    return redirect("/dashboard/login?reason=auth_required");
  }

  if (!session.isStaff) {
    console.warn(`🚫 [Gatekeeper] Access Denied. User ${session.user.id} attempted to access Staff node.`);
    return redirect("/dashboard?error=access_denied");
  }
  
  return session;
}