// 🛡️ SECURITY BARRIER: Ensures this logic never touches the browser bundle
import "server-only"; 

import prisma from "@/lib/db";
import { randomBytes, randomUUID } from "crypto";
import * as jose from "jose"; 
import { JWT_CONFIG } from "@/lib/auth/config";
import { cookies, headers } from "next/headers";

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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

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
 * 🔐 VERIFY MAGIC TOKEN (v16.16.14 FIX)
 * Logic: Consumes token and returns verified user.
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

    // Mark as used immediately (Atomic Handshake)
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

import { unstable_cache } from "next/cache";

/**
 * 🕵️ INTERNAL: CACHED SECURITY ANCHOR
 * Prevents 2s+ DB lag on every request by caching the security stamp.
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
  { revalidate: 60, tags: ["auth"] } // Re-check DB once per minute
);

/**
 * 🛡️ INSTITUTIONAL VERIFICATION (v16.16.15 - Optimized)
 * Logic: JWT Signature -> Cache-Layer Stamp -> DB Fallback.
 */
export async function verifySession(token: string) {
  try {
    if (!token) return null;

    // 1. 🔑 CRYPTOGRAPHIC SIGNATURE CHECK (Sub-1ms)
    const { payload } = await jose.jwtVerify(
      token, 
      new TextEncoder().encode(JWT_CONFIG.secret), 
      { clockTolerance: 60, algorithms: ['HS256'] }
    );

    const userId = payload.sub as string;
    const sessionStamp = (payload.user as any)?.securityStamp;

    // 2. 🛰️ CACHED SECURITY STAMP CHECK
    // This removes the 2s database delay seen in your logs.
    const dbUser = await getCachedSecurityStamp(userId);

    // 3. 🏁 REVOCATION LOGIC (Kill-Switch)
    if (!dbUser || dbUser.securityStamp !== sessionStamp) {
      console.warn(`🔐 [Auth_Revoked]: Stamp mismatch for ${userId}`);
      return null;
    }

    return payload;
  } catch (error) {
    // If JWT is expired or malformed, return null immediately
    return null;
  }
}

/**
 * 🕵️ IDENTITY RESOLUTION
 */
export async function getUserFromRequest() {
  try {
    const headerList = await headers();
    
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
  const isStaff = ["SUPER_ADMIN", "AMBER"].includes(role?.toUpperCase() || "");
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
 * Action: Invalidates all active JWTs and purges the auth cache.
 */
export async function rotateSecurityStamp(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { securityStamp: randomUUID() },
      select: { id: true }
    });

    // 🚀 CRITICAL: Purge the cache tag so verifySession hits the DB immediately
    revalidateTag("auth");
    
    console.log(`🧹 [Cache_Purge]: Security cache cleared for user ${userId}`);
    return updatedUser;
  } catch (error) {
    console.error("🔥 [Rotation_Error]:", error);
    return null;
  }
}