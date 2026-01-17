import "server-only";
import { cookies, headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { verifySession } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";
import { unstable_cache } from "next/cache";

/**
 * 🕵️ INTERNAL: CACHED PROFILE DATA
 * Logic: Decouples profile fetching from the main auth handshake.
 * Revalidates every 5 minutes to keep DB load near zero.
 */
const getCachedProfile = unstable_cache(
  async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        telegramId: true, 
        firstName: true, 
        role: true,
        deletedAt: true,
        securityStamp: true, 
        merchantProfile: { 
          select: { id: true, companyName: true, botUsername: true, planStatus: true } 
        }
      }
    });
  },
  ["user-profiles"],
  { revalidate: 300, tags: ["auth"] }
);

/**
 * 🌊 UNIVERSAL_SESSION_RESOLVER (v16.16.23)
 * Logic: Header-First Ingress with Memoized Cached Fallback.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const headerList = await headers();
    
    // 🛡️ SHIELD 0: HEADER-FIRST INGRESS (Fast Path)
    // If the Middleware already did the work, we stop here.
    const hUserId = headerList.get("x-user-id");
    const hRole = headerList.get("x-user-role");
    const hStamp = headerList.get("x-security-stamp");

    if (hUserId && hRole) {
      // Fetch profile data from cache instead of fresh DB query
      const user = await getCachedProfile(hUserId);
      if (!user || user.deletedAt) return null;

      // Stamp Alignment (Instant Check)
      if (hStamp && user.securityStamp && hStamp !== user.securityStamp) return null;

      const role = user.role.toLowerCase();
      const isStaff = JWT_CONFIG.staffRoles.includes(role);

      return {
        user: {
          id: user.id,
          role,
          firstName: user.firstName,
          telegramId: user.telegramId?.toString() || null,
        },
        isStaff,
        merchantId: user.merchantProfile?.id || null,
        config: {
          companyName: user.merchantProfile?.companyName || (isStaff ? "Zipha HQ" : "Node"),
          botUsername: user.merchantProfile?.botUsername || null,
          planStatus: user.merchantProfile?.planStatus || "FREE",
          isOwner: !!user.merchantProfile,
        }
      };
    }

    // 🛡️ SHIELD 1: COOKIE FALLBACK (For Direct Server Actions)
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;
    if (!token) return null;

    const payload = await verifySession(token);
    if (!payload?.sub) return null;

    // Recurse once with verified ID
    return getSession(); 
  } catch (error) {
    return null;
  }
});

/**
 * 🛡️ SERVER_GATEKEEPERS
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login?reason=auth_required");
  return session;
}

export async function requireStaff() {
  const session = await getSession();
  // ⚡ FIX: Normalize role check to prevent "USER" vs "user" mismatch loop
  if (!session || !session.isStaff) {
    console.warn(`🚫 [Gate_Denial]: Non-staff ingress attempt.`);
    redirect("/dashboard?error=unauthorized");
  }
  return session;
}