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
 * Logic: Fetches the LIVE role and Merchant status to override stale JWT data.
 * Standard: Revalidates every 60s or on-demand via 'auth' tag.
 */
const getCachedSecurityStamp = unstable_cache(
  async (userId: string) => {
    console.log(`📡 [DB_Fetch]: Refreshing Security Stamp & Profile for ${userId}`);
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        securityStamp: true, 
        role: true,
        merchantProfile: { select: { id: true } } // ✅ Critical for Merchant resolution
      }
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
 * 🔐 CREATE_JWT
 */
export async function createJWT(payload: { 
  sub: string; 
  telegramId: string; 
  role: string; 
  securityStamp: string;
  merchantId?: string | null; // ✅ Added to payload
}) {
  const roleLower = payload.role.toLowerCase();
  const isStaff = ["super_admin", "platform_manager", "amber"].includes(roleLower);
  const expiration = isStaff ? "24h" : "7d";

  return await new jose.SignJWT({
    sub: payload.sub,
    user: {
      id: payload.sub,
      telegramId: payload.telegramId,
      role: roleLower,
      merchantId: payload.merchantId || null, // ✅ Injected into vault
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
    select: { 
      role: true, 
      securityStamp: true,
      telegramId: true,
      merchantProfile: { select: { id: true } } // ✅ Fetch merchant link
    }
  });

  return await createJWT({
    sub: user.id,
    telegramId: dbUser?.telegramId.toString() || "0",
    role: dbUser?.role || "USER",
    securityStamp: dbUser?.securityStamp || randomUUID(),
    merchantId: dbUser?.merchantProfile?.id // ✅ Pass to JWT
  });
}

/**
 * 🛡️ INSTITUTIONAL VERIFICATION (v16.16.20 - Optimized)
 * Logic: Hydrates stale JWT data with live Cache state to fix "Role Lag".
 */
export async function verifySession(token: string) {
  try {
    if (!token) return null;

    const { payload } = await jose.jwtVerify(
      token, 
      new TextEncoder().encode(JWT_CONFIG.secret), 
      { clockTolerance: 60, algorithms: ['HS256'] }
    );

    const userId = payload.sub as string;
    const sessionStamp = (payload.user as any)?.securityStamp;

    // 2. 🛰️ Fetch LIVE state (Override the JWT payload)
    const dbNode = await getCachedSecurityStamp(userId);

    // 3. 🏁 Kill-Switch & Dynamic Update
    if (!dbNode || dbNode.securityStamp !== sessionStamp) {
      console.warn(`🔐 [Auth_Revoked]: Stamp mismatch for ${userId}`);
      return null;
    }

    // ✅ RE-CALIBRATION: Update the payload with live database truth
    (payload.user as any).role = dbNode.role.toLowerCase();
    (payload.user as any).merchantId = dbNode.merchantProfile?.id || null;

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
        merchantId: headerList.get("x-merchant-id"), // ✅ Support for merchant headers
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
 * 🍪 2026 COOKIE PROTOCOL
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
 */
export async function rotateSecurityStamp(userId: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { securityStamp: randomUUID() },
      select: { id: true }
    });

    revalidateTag("auth", CACHE_PROFILES.IDENTITY);
    return updatedUser;
  } catch (error) {
    console.error("🔥 [Rotation_Error]:", error);
    return null;
  }
}