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
 * Logic: Caches user state to eliminate DB latency on every request.
 */
const getCachedSecurityStamp = unstable_cache(
  async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { securityStamp: true, role: true },
    });
  },
  ["user-security-stamps"],
  { revalidate: 60, tags: ["auth"] }
);

/**
 * 🔑 GENERATE MAGIC TOKEN
 */
export async function generateMagicToken(
  telegramId: string
): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: { id: true },
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
 * 🔐 CREATE_JWT (v2026.1.20)
 * Logic: Centralized signer used by both createSession and debug injectors.
 * Fix: Exported to resolve TS2305.
 */
export async function createJWT(payload: {
  sub: string;
  role: string;
  securityStamp: string;
}) {
  const isStaff = ["super_admin", "platform_manager", "amber"].includes(
    payload.role.toLowerCase()
  );
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
export async function createSession(user: { id: string }) {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, securityStamp: true },
  });

  return await createJWT({
    sub: user.id,
    role: dbUser?.role || "USER",
    securityStamp: dbUser?.securityStamp || randomUUID(),
  });
}

/**
 * 🛡️ INSTITUTIONAL VERIFICATION
 */
export async function verifySession(token: string) {
  try {
    if (!token) return null;

    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(JWT_CONFIG.secret),
      { clockTolerance: 60, algorithms: ["HS256"] }
    );

    const userId = payload.sub as string;
    const sessionStamp = (payload.user as any)?.securityStamp;

    const dbUser = await getCachedSecurityStamp(userId);

    if (!dbUser || dbUser.securityStamp !== sessionStamp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * 🕵️ IDENTITY RESOLUTION (Next.js 15 Async Standard)
 * Fix: Resolved TS2554 by making this an arg-less async standard.
 */
export async function getUserFromRequest() {
  try {
    const headerList = await headers();

    // ⚡ Fast Path: Middleware Hydration
    if (headerList.has("x-user-id")) {
      return {
        id: headerList.get("x-user-id"),
        role: headerList.get("x-user-role"),
        securityStamp: headerList.get("x-security-stamp"),
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;
    if (!token) return null;

    const payload = await verifySession(token);
    return payload ? (payload.user as any) : null;
  } catch {
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
 */
export async function rotateSecurityStamp(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { securityStamp: randomUUID() },
      select: { id: true },
    });

    // ✅ FIX: revalidateTag only takes ONE argument in Next.js 15
    revalidateTag("auth");

    return updatedUser;
  } catch (error) {
    console.error("🔥 [Rotation_Error]:", error);
    return null;
  }
}
