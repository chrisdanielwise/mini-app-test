// 🛡️ SECURITY BARRIER: Ensures this logic never touches the browser bundle
import "server-only"; 

import prisma from "@/lib/db";
import { randomBytes, randomUUID } from "crypto";
import * as jose from "jose"; 
import { JWT_CONFIG, getSecurityContext } from "@/lib/auth/config";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";

/**
 * 🛰️ AUTHENTICATION ENGINE (v16.16.9)
 * Logic: Optimized Thin-Fetch Verification & Tiered Persistence Sync.
 * Performance: Mitigates 9s+ database lockups via targeted selection.
 */
export const AuthService = {
  /**
   * 🔑 GENERATE MAGIC TOKEN
   * Logic: Optimized for sub-50ms token generation during Bot Handshakes.
   */
  async generateMagicToken(telegramId: string): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
        select: { id: true } // 🚀 Only need the ID to link the token
      });
      if (!user) return null;

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10m TTL

      await prisma.magicToken.create({
        data: { token, userId: user.id, expiresAt, used: false },
      });
      return token;
    } catch (error) {
      console.error("❌ [AuthService.generateMagicToken]:", error);
      return null;
    }
  },

  /**
   * 🛡️ VERIFY MAGIC TOKEN
   */
  async verifyMagicToken(token: string) {
    try {
      const magicToken = await prisma.magicToken.findUnique({
        where: { token },
        include: { 
          user: {
            select: {
              id: true,
              role: true,
              securityStamp: true,
              fullName: true
            }
          } 
        },
      });
      if (!magicToken || magicToken.used || new Date() > magicToken.expiresAt) return null;

      await prisma.magicToken.update({
        where: { id: magicToken.id },
        data: { used: true },
      });
      return magicToken.user;
    } catch (error) { return null; }
  },

  /**
   * 🔐 UNIVERSAL SESSION GENERATION (v16.16.6)
   * Logic: Highest Clearance Detection (Merchant/Staff)
   */
  async createSession(user: any) {
    // 🚀 STEP 1: Fresh Database lookup to ensure 'MERCHANT' status is captured
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, securityStamp: true }
    });

    const role = dbUser?.role?.toLowerCase() || "user";
    
    // 🚀 STEP 2: Enforce Tiered Expiry (Staff: 24h | Merchant/User: 7d)
    const isStaff = ["super_admin", "platform_manager", "amber"].includes(role);
    const expiration = isStaff ? "24h" : "7d"; 

    // 🚀 STEP 3: Sign the JWT with the synchronized role
    return await new jose.SignJWT({
      sub: user.id,
      user: {
        id: user.id,
        role: role, 
        securityStamp: dbUser?.securityStamp, 
      },
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiration)
      .sign(JWT_CONFIG.secret);
  },

  /**
   * 🛡️ INSTITUTIONAL VERIFICATION (v16.16.1)
   * Logic: Thin-fetch validation of security stamps
   */
async verifySession(token: string) {
    try {
      if (!token) return null;

      const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret, {
        clockTolerance: 60,
        algorithms: ['HS256']
      });

      // 🚀 CRITICAL: Only fetch the absolute minimum to verify the stamp.
      // This prevents the 11s lockout during the login handshake.
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.sub as string },
        select: { id: true, securityStamp: true, role: true } 
      });

      if (!dbUser || dbUser.securityStamp !== (payload.user as any).securityStamp) {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  },

  /**
   * 🕵️ IDENTITY EXTRACTION (v16.16.5)
   * Logic: Prioritizes Proxy-Injected Headers for sub-10ms resolution.
   */
  async getUserFromRequest(request?: NextRequest) {
    try {
      // 🚀 PHASE 1: Try high-speed headers first (Injected by Proxy)
      const headerList = await headers();
      const headerId = headerList.get("x-user-id");
      const headerRole = headerList.get("x-user-role");
      const headerStamp = headerList.get("x-security-stamp");

      if (headerId && headerRole) {
        return {
          id: headerId,
          role: headerRole,
          securityStamp: headerStamp
        };
      }

      // 🚀 PHASE 2: Fallback to Cookie verification if headers are missing
      const cookieStore = await cookies();
      const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;
      if (!token) return null;

      const payload = await this.verifySession(token);
      return payload ? (payload.user as any) : null;
    } catch (error) { 
      return null; 
    }
  },

  /**
   * 🧹 ROTATE IDENTITY ANCHOR (Global Logout / Remote Wipe)
   * Logic: Revokes all active sessions for a specific node.
   */
  async rotateSecurityStamp(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { securityStamp: randomUUID() }
    });
  },

  /**
   * ⚡ THIN CHECK: VALIDATE SECURITY STAMP
   */
  async validateSecurityStamp(userId: string, sessionStamp: string): Promise<boolean> {
    if (!userId || !sessionStamp) return false;
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { securityStamp: true }
      });
      return dbUser?.securityStamp === sessionStamp;
    } catch (error) {
      return false;
    }
  },

  /**
   * 🍪 COOKIE PROTOCOL GENERATOR
   */
  getCookieMetadata(host: string | null, protocol: string | null, role?: string) {
    const context = getSecurityContext(host, protocol);
    const roleUpper = role?.toUpperCase() || "";
    const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "AMBER"].includes(roleUpper);
    const maxAge = isStaff ? 86400 : 604800; // 24h vs 7d

    const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

    return {
      name: JWT_CONFIG.cookieName,
      options: {
        ...JWT_CONFIG.cookieOptions,
        maxAge: maxAge,
        path: "/",
        domain: cookieDomain,
        secure: true,
        sameSite: "none" as const,
        partitioned: true, // 🌐 Essential for Safari 2026
      },
    };
  },
};