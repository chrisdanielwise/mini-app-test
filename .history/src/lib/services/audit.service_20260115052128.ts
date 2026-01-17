// 🛡️ SECURITY BARRIER: Ensures this logic never touches the browser bundle
import "server-only"; 

import prisma from "@/lib/db";
import { randomBytes, randomUUID } from "crypto";
import * as jose from "jose"; 
import { JWT_CONFIG } from "@/lib/auth/config";
import { cookies, headers } from "next/headers";

/**
 * 🛰️ AUTH_SERVICE (Institutional v16.16.14)
 * Logic: Atomic Named Exports for Turbopack Stabilization.
 */

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
 * 🔐 VERIFY MAGIC TOKEN
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
 * 🛡️ INSTITUTIONAL VERIFICATION (Thin-Fetch)
 */
export async function verifySession(token: string) {
  try {
    if (!token) return null;

    const { payload } = await jose.jwtVerify(
      token, 
      new TextEncoder().encode(JWT_CONFIG.secret), 
      { clockTolerance: 60, algorithms: ['HS256'] }
    );

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

    return await verifySession(token).then(p => p ? p.user : null);
  } catch (error) { 
    return null; 
  }
}

/**
 * 🧹 GLOBAL IDENTITY ANCHOR ROTATION
 */
export async function rotateSecurityStamp(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { securityStamp: randomUUID() }
  });
}

/**
 * 🍪 2026 COOKIE PROTOCOL (CHIPS)
 */
export function getCookieMetadata(role?: string) {
  const roleUpper = role?.toUpperCase() || "";
  const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "AMBER"].includes(roleUpper);
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