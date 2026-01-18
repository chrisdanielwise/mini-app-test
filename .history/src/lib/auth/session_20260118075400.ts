import "server-only";
import { cookies, headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { verifySession } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";
import { unstable_cache } from "next/cache";


/**
 * 🛡️ IDENTITY_PAYLOAD_SCHEMA
 * Logic: Defines the exact structure of our encrypted session token.
 */
interface CustomJWTPayload {
  user: {
    id: string;
    role: string;
  };
  securityStamp: string;
}

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
    return sanitizeData(user);
  },
  ["user-profiles"],
  { 
    revalidate: 300, 
    tags: ["auth"] 
  }
);

/**
 * 🛡️ INTERNAL: SESSION_TRANSFORMER
 * Converts raw database profile into the Standardized Session Shape.
 */
const transformUserToSession = (user: any, hStamp?: string | null) => {
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
};



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