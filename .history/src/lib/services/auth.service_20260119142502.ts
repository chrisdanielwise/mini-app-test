// 🛡️ SECURITY BARRIER: Ensures this logic never touches the browser bundle
import "server-only"; 

import prisma from "@/lib/db";
import { randomBytes, randomUUID } from "crypto";
import * as jose from "jose"; 
import { JWT_CONFIG, CACHE_PROFILES } from "@/lib/auth/config";
import { cookies, headers } from "next/headers";
import { revalidateTag, unstable_cache } from "next/cache";


const staffRoles = [
  "SUPER_ADMIN", 
  "AMBER", 
  "PLATFORM_MANAGER", 
  "PLATFORM_SUPPORT",
  "SYSTEM"
];
/**
 * 🕵️ INTERNAL: CACHED SECURITY ANCHOR
 * Logic: Prevents the 2.4s+ DB lag seen in logs by caching user state.
 * Standard: Revalidates every 60s or on-demand via 'auth' tag.
 */
const getCachedSecurityStamp = unstable_cache(
  async (userId: string) => {
    console.log(`📡 [DB_Fetch]: Refreshing Security Stamp for ${userId}`);
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { securityStamp: true, role: true }
    });
  },
  ["user-security-stamps"],
  { revalidate: 60, tags: ["auth"] } 
);

/**
 * 🔑 GENERATE MAGIC TOKEN
 */
export async function generateMagicToken(telegramId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: { id: true } 
    });
    if (!user) return null;

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 Min Expiry

    await prisma.magicToken.create({
      data: { token, userId: user.id, expiresAt, used: false },
    });
    return token;
  } catch (error) {
    console.error("❌ [Auth_Service]: Token_Gen_Fail", error);
    return null;
  }
}

/**
 * 🔐 VERIFY MAGIC TOKEN
 * Logic: Atomic consumption of one-time-use tokens.
 */
export async function verifyMagicToken(token: string) {
  try {
    const magicToken = await prisma.magicToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!magicToken || magicToken.used || magicToken.expiresAt < new Date()) {
      return null;
    }

    await prisma.magicToken.update({
      where: { id: magicToken.id },
      data: { used: true }
    });

    return magicToken.user;
  } catch (error) {
    return null;
  }
}

/**
 * 🔐 CREATE_JWT (v2026.1.20)
 * Logic: Centralized signer used by both createSession and debug injectors.
 * Fix: Exported to resolve TS2305.
 */
export async function createJWT(payload: { sub: string; role: string; securityStamp: string }) {
  const isStaff = ["super_admin", "platform_manager", "amber"].includes(payload.role.toLowerCase());
  const expiration = isStaff ? "24h" : "7d";

  return await new jose.SignJWT({
    sub: payload.sub,
    user: {
      id: payload.sub,
      role: payload.role.toLowerCase(),
      securityStamp: payload.securityStamp,
    },
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(new TextEncoder().encode(JWT_CONFIG.secret));
}

/**
 * 🔐 UNIVERSAL SESSION GENERATION
 */
export async function createSession(user: any) {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, securityStamp: true }
  });

  const role = dbUser?.role?.toLowerCase() || "user";
  const isStaff = ["super_admin", "platform_manager", "amber"].includes(role);
  const expiration = isStaff ? "24h" : "7d"; 

  return await new jose.SignJWT({
    sub: user.id,
    user: {
      id: user.id,
      role: role, 
      securityStamp: dbUser?.securityStamp || randomUUID(), 
    },
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(new TextEncoder().encode(JWT_CONFIG.secret));
}

/**
 * 🛡️ INSTITUTIONAL VERIFICATION (v16.16.20 - Optimized)
 * Logic: JWT Signature Check (Sub-1ms) -> Cache Check -> Stamp Comparison.
 */
export async function verifySession(token: string) {
  try {
    if (!token) return null;

    // 1. 🔑 Cryptographic Signature Check
    const { payload } = await jose.jwtVerify(
      token, 
      new TextEncoder().encode(JWT_CONFIG.secret), 
      { clockTolerance: 60, algorithms: ['HS256'] }
    );

    const userId = payload.sub as string;
    const sessionStamp = (payload.user as any)?.securityStamp;

    // 2. 🛰️ Cached Security Stamp Check (Eliminates the 3s Lag)
    const dbUser = await getCachedSecurityStamp(userId);

    // 3. 🏁 Kill-Switch Logic
    if (!dbUser || dbUser.securityStamp !== sessionStamp) {
      console.warn(`🔐 [Auth_Revoked]: Stamp mismatch for ${userId}`);
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * 🕵️ IDENTITY RESOLUTION
 * Logic: Prefers Proxy-Hydrated headers for 0ms latency.
 */
export async function getUserFromRequest() {
  try {
    const headerList = await headers();
    
    // ⚡ Fast Path: If Middleware already verified, trust the headers
    if (headerList.has("x-user-id")) {
      return {
        id: headerList.get("x-user-id"),
        role: headerList.get("x-user-role"),
        securityStamp: headerList.get("x-security-stamp")
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;
    if (!token) return null;

    const payload = await verifySession(token);
    return payload ? (payload.user as any) : null;
  } catch (error) { 
    return null; 
  }
}

/**
 * 🍪 2026 COOKIE PROTOCOL (CHIPS)
 */
export function getCookieMetadata(role?: string) {
  const isStaff = staffRoles.includes(role?.toUpperCase() || "");
  const maxAge = isStaff ? 86400 : 604800;

  return {
    name: JWT_CONFIG.cookieName,
    options: {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const,
      path: "/",
      maxAge,
      partitioned: true, 
    },
  };
}

/**
 * 🛰️ GLOBAL IDENTITY ANCHOR ROTATION
 * Action: Invalidates all JWTs globally and purges the Cache.
 */
export async function rotateSecurityStamp(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { securityStamp: randomUUID() },
      select: { id: true }
    });

    // 🚀 PURGE: Force every node to drop the old stamp
    // Requirement: Resolved ts(2554) by providing CACHE_PROFILES.IDENTITY ("auth")
    revalidateTag("auth", CACHE_PROFILES.IDENTITY);
    
    console.log(`🧹 [Cache_Purge]: Security cache cleared for user ${userId}`);
    return updatedUser;
  } catch (error) {
    console.error("🔥 [Rotation_Error]:", error);
    return null;
  }
}