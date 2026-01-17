import "server-only";
import { cookies, headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { verifySession } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";
import { unstable_cache } from "next/cache";

/**
 * 🧼 SERIALIZATION UTILITY
 * Logic: Recursively converts BigInt values to strings.
 * This prevents the JSON.stringify crash during caching and handover.
 */
export const sanitizeData = (obj: any): any => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

/**
 * 🕵️ INTERNAL: CACHED PROFILE DATA
 * Logic: Decouples profile fetching from the main auth handshake.
 */
const getCachedProfile = unstable_cache(
  async (userId: string) => {
    const user = await prisma.user.findUnique({
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

    if (!user) return null;

    // 🛡️ CRITICAL FIX: Sanitize before returning to unstable_cache
    // This prevents BigInt serialization errors inside the Next.js cache layer.
    return sanitizeData(user);
  },
  ["user-profiles"],
  { revalidate: 300, tags: ["auth"] }
);

/**
 * 🌊 UNIVERSAL_SESSION_RESOLVER
 * Logic: Header-First Ingress with Memoized Cached Fallback.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const headerList = await headers();
    
    const hUserId = headerList.get("x-user-id");
    const hRole = headerList.get("x-user-role");
    const hStamp = headerList.get("x-security-stamp");

    if (hUserId && hRole) {
      // 🧪 Data comes back already sanitized from getCachedProfile
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
          telegramId: user.telegramId, // Already a string from sanitizeData
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

    // 🛡️ SHIELD 1: COOKIE FALLBACK
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;
    if (!token) return null;

    const payload = await verifySession(token);
    if (!payload?.sub) return null;

    // Recurse with verified ID (will hit getCachedProfile)
    return getSession(); 
  } catch (error) {
    console.error("SESSION_RESOLVER_ERROR:", error);
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
  
  if (!session || !session.isStaff) {
    console.warn(`🚫 [Gate_Denial]: Non-staff ingress attempt.`,session);
    // ⚡ Redirecting here prevents the page from attempting to render 
    // with invalid/non-serializable data.
    redirect("/dashboard?error=unauthorized");
  }
  
  // Return the sanitized session object
  return session;
}