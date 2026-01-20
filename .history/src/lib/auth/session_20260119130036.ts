import "server-only";
import { cookies, headers } from "next/headers";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { cache } from "react"; 
import { verifySession } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "./config";
import { unstable_cache } from "next/cache";

/**
 * 🛡️ SESSION_PROTOCOL_TYPES
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
 * Logic: Safely stringifies BigInt values for Telegram IDs during transport.
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
 * Strategy: Revalidates every 5 minutes or upon manual 'auth' tag purge.
 */
const getCachedProfile = unstable_cache(
  async (userId: string) => {
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
 */
const transformUserToSession = (user: any, hStamp?: string | null) => {
  if (!user || user.deletedAt) return null;

  // 🛡️ REVOCATION CHECK: Instant session kill if stamp mismatch
  if (hStamp && user.securityStamp && hStamp !== user.securityStamp) {
    console.error("🔥 [Security_Breach]: Stamp Mismatch detected!");
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
 * 🌊 UNIVERSAL_SESSION_RESOLVER (Hardened v2026.1.19)
 * Architecture: Optimized for Next.js 15 Asynchronous Header APIs.
 */
export const getSession = cache(async (): Promise<any | null> => {
  try {
    const headerList = await headers();
    
    // 🛰️ FAST PATH: Extracting injected headers from Middleware Proxy
    const hUserId = headerList.get("x-user-id");
    const hStamp = headerList.get("x-security-stamp");

    if (hUserId && hUserId !== "undefined" && hUserId !== "null") {
      const user = await getCachedProfile(hUserId);
      return transformUserToSession(user, hStamp);
    }

    // 🛡️ DEEP PATH: Cookie Fallback with Cryptographic Verification
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;
    
    if (!token) return null;

    const payload = (await verifySession(token)) as unknown as SessionPayload;

    if (!payload?.user?.id) return null;

    const user = await getCachedProfile(payload.user.id);
    
    // Final check for token stamp vs DB stamp to handle manual logout/rotation
    return transformUserToSession(user, payload.securityStamp);
    
  } catch (error: any) {
    console.error("🔥 [Session_Trace]: Terminal Resolver Fault ->", error.message);
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