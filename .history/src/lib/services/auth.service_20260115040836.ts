// 🛡️ SECURITY BARRIER: Ensures this logic never touches the browser bundle
import "server-only"; 

import prisma from "@/lib/db";
import { randomBytes, randomUUID } from "crypto";
import * as jose from "jose"; 
import { JWT_CONFIG } from "@/lib/auth/config";
import { cookies, headers } from "next/headers";

/**
 * 🔑 GENERATE MAGIC TOKEN
 * Performance: Optimized for sub-50ms bot handshakes.
 */
export async function generateMagicToken(telegramId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: { id: true } 
    });
    if (!user) return null;

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10m TTL

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
 * 🔐 UNIVERSAL SESSION GENERATION (v16.16.12)
 * Logic: Tiered Expiry (Staff: 24h | User: 7d) with Role-Sync.
 */
export async function createSession(user: any) {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, securityStamp: true }
  });

  const role = dbUser?.role?.toLowerCase() || "user";
  const isStaff = ["super_admin", "platform_manager", "amber"].includes(role);
  const expiration = isStaff ? "24h" : "7d"; 

  // 🏛️ Sign with the jose library for Edge Runtime compatibility
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
 * 🛡️ INSTITUTIONAL VERIFICATION (Thin-Fetch)
 * Performance: Selection-limited lookup to prevent DB contention.
 */
export async function verifySession(token: string) {
  try {
    if (!token) return null;

    const { payload } = await jose.jwtVerify(
      token, 
      new TextEncoder().encode(JWT_CONFIG.secret), 
      { clockTolerance: 60, algorithms: ['HS256'] }
    );

    // 🚀 THIN-FETCH: We only select the stamp to verify revocation state.
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: { securityStamp: true, role: true } 
    });

    if (!dbUser || dbUser.securityStamp !== (payload.user as any).securityStamp) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * 🕵️ IDENTITY RESOLUTION (Sub-10ms)
 * Logic: Header-first resolution for proxied requests.
 */
export async function getUserFromRequest() {
  try {
    const headerList = await headers();
    
    // Attempt Proxy-Injected Identity first
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
 * 🧹 GLOBAL IDENTITY ANCHOR ROTATION
 * Action: Invalidates all active JWTs globally for this user.
 */
export async function rotateSecurityStamp(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { securityStamp: randomUUID() }
  });
}

/**
 * 🍪 2026 COOKIE PROTOCOL (CHIPS Compatible)
 * Standard: v9.4.4 Security Guard.
 */
export function getCookieMetadata(role?: string) {
  const isStaff = ["SUPER_ADMIN", "AMBER"].includes(role?.toUpperCase() || "");
  const maxAge = isStaff ? 86400 : 604800;

  return {
    name: JWT_CONFIG.cookieName,
    options: {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const, // Essential for Telegram Mini App contexts
      path: "/",
      maxAge,
      partitioned: true, // 🌐 CHIPS: Allows cookies in cross-site (TMA) contexts
    },
  };
}