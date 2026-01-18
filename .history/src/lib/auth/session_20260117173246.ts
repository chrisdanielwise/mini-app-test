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
 * Architecture: Prevents JSON.stringify crashes during Next.js handover.
 */
export const sanitizeData = (obj: any): any => {
  if (!obj) return obj;
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

/**
 * 🕵️ INTERNAL: CACHED PROFILE DATA
 * Logic: Decouples profile fetching from the cryptographic handshake.
 * Tag: "auth" (Synchronized with CACHE_PROFILES.IDENTITY)
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

    // 🛡️ CRITICAL FIX: Ensure BigInts are strings before entering the cache
    return sanitizeData(user);
  },
  ["user-profiles"],
  { 
    revalidate: 300, 
    tags: ["auth"] // This tag is purged via revalidateTag("auth", "auth")
  }
);

/**
 * 🌊 UNIVERSAL_SESSION_RESOLVER (v16.16.20)
 * Logic: Header-First > Cookie Fallback > Cache Handshake.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const headerList = await headers();
    
    const hUserId = headerList.get("x-user-id");
    const hRole = headerList.get("x-user-role");
    const hStamp = headerList.get("x-security-stamp");

    if (hUserId && hRole) {
      const user = await getCachedProfile(hUserId);
      if (!user || user.deletedAt) return null;

      // 🛡️ REVOCATION CHECK: Instant session kill if stamp mismatch
      if (hStamp && user.securityStamp && hStamp !== user.securityStamp) {
        return null;
      }

      const role = user.role.toLowerCase();
      const isStaff = JWT_CONFIG.staffRoles.includes(role);

      return {
        user: {
          id: user.id,
          role,
          firstName: user.firstName,
          telegramId: user.telegramId,
        },
        isStaff,
        merchantId: user.merchantProfile?.id || null,
        config: {
          companyName: user.merchantProfile?.companyName || (isStaff ? "HQ" : "Node"),
          botUsername: user.merchantProfile?.botUsername || null,
          planStatus: user.merchantProfile?.planStatus || "FREE",
          isOwner: !!user.merchantProfile,
        }
      };
    }

    // 🛡️ COOKIE FALLBACK (Used if Middleware headers are missing)
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;
    if (!token) return null;

    const payload = await verifySession(token);
    if (!payload?.user?.id) return null;

    return getSession(); // Recurse to use Header logic with the verified ID
  } catch (error) {
    console.error("🔥 [Session_Resolver_Fault]:", error);
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
    redirect("/dashboard?error=unauthorized");
  }
  return session;
}