import "server-only";
import { cookies, headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { verifySession } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";
import { unstable_cache } from "next/cache";


/**
 * 🛡️ SESSION_PAYLOAD_PROTOCOL
 */
interface SessionPayload {
  user: {
    id: string;
    role: string;
  };
  securityStamp: string;
}

/**
 * 🧼 SERIALIZATION UTILITY
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
 */
const getCachedProfile = unstable_cache(
  async (userId: string) => {
    // 🔍 TRACE: Database Lookup
    console.log(`📡 [DB_Fetch]: Fetching Profile for Node_${userId.slice(0,8)}`);
    
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

    if (!user) {
      console.error(`❌ [DB_Error]: User Node_${userId} not found in registry`);
      return null;
    }
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
 */
const transformUserToSession = (user: any, hStamp?: string | null) => {
  if (!user) {
    console.warn("⚠️ [Transformer]: Identity block is null");
    return null;
  }
  
  if (user.deletedAt) {
    console.warn(`🚨 [Transformer]: Node_${user.id.slice(0,8)} is marked DELETED`);
    return null;
  }

  // 🛡️ REVOCATION CHECK: Instant session kill if stamp mismatch
  if (hStamp && user.securityStamp && hStamp !== user.securityStamp) {
    console.error("🔥 [Security_Breach]: Stamp Mismatch detected!", {
      header_stamp: hStamp,
      db_stamp: user.securityStamp
    });
    return null;
  }

  const role = user.role.toLowerCase();
  const isStaff = JWT_CONFIG.staffRoles.includes(role);

  const session = {
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

  console.log(`✅ [Transformer]: Session compiled for Role: ${role.toUpperCase()}`);
  return session;
};

/**
 * 🌊 UNIVERSAL_SESSION_RESOLVER
 */


/**
 * 🛡️ SERVER_GATEKEEPERS
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    console.warn("🔐 [Gatekeeper]: Auth required. Redirecting to /login");
    redirect("/login?reason=auth_required");
  }
  return session;
}

export async function requireStaff() {
  const session = await getSession();
  if (!session || !session.isStaff) {
    console.warn(`🔐 [Gatekeeper]: Staff clearance failed for Node_${session?.user?.id?.slice(0,8) || 'Unknown'}`);
    redirect("/dashboard?error=unauthorized");
  }
  return session;
}