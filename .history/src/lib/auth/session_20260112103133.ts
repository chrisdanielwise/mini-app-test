import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zipha_secure_secret_2026"
);

/**
 * 🛰️ UNIVERSAL SESSION RESOLVER (v8.9.9)
 * Hardened: Role normalization and passive error handling to kill redirect storms.
 * Optimized: React 'cache' prevents redundant DB lookups in a single request tree.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    // 1. DECRYPT JWT
    const { payload } = await jose.jwtVerify(token, SECRET);
    const userId = (payload.sub || payload.userId) as string;
    const merchantId = payload.merchantId as string | null;

    if (!userId) return null;

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

    if (!user) return null;

    /**
     * 🚀 ROLE NORMALIZATION
     * Forces lowercase to match Middleware RBAC.
     */
    const normalizedRole = user.role.toLowerCase();
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
    if (error.code !== "ERR_JWT_EXPIRED") {
       console.error("🛰️ [Session_Debug]: Identity resolution halted.");
    }
    return null;
  }
});

/**
 * 🛡️ THE GATEKEEPERS
 * Hardened with 'Loop Terminators' to stop recursive redirects in Next.js 15.
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    // 🚩 THE KILL SWITCH: We explicitly use the normalized login path.
    // Cloudflare/Proxy redirection logic will handle the origin reconstruction.
    return redirect("/dashboard/login?reason=auth_required");
  }
  
  return session;
}

export async function requireStaff() {
  const session = await getSession();
  
  if (!session) {
    return redirect("/dashboard/login?reason=auth_required");
  }

  // Use the normalized role from getSession()
  if (!session.isStaff) {
    // 🛡️ RE-ROUTE: Redirect to a safe dashboard instead of login
    // This prevents a user who is logged in but lacks staff perms 
    // from being bounced back and forth to the login page.
    return redirect("/dashboard?error=access_denied");
  }
  
  return session;
}