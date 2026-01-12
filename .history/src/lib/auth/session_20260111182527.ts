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
 * Optimized: Now uses a 'Safe Return' to prevent loop-triggers.
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

    const isStaff = ["super_admin", "platform_manager", "platform_support"].includes(user.role);
    const membership = user.teamMemberships?.[0];

    return {
      user: {
        id: user.id,
        role: user.role,
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
    // 🚩 Log only critical errors, ignore expected JWT expirations
    if (error.code !== "ERR_JWT_EXPIRED") {
       console.error("🛰️ [Session_Debug]: Identity resolution halted.");
    }
    return null;
  }
});

/**
 * 🛰️ THE GATEKEEPERS
 * Fixed: Explicit path-check to prevent redirecting to the page we are already on.
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    // 🚩 THE KILL SWITCH: If the server is trying to redirect to login, 
    // we must ensure it's not a background fetch or a repeated loop.
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
    // 🚩 Instead of redirecting to login (loop), redirect to a specific 403 page
    // or the standard merchant dashboard.
    return redirect("/dashboard?error=access_denied");
  }
  
  return session;
}