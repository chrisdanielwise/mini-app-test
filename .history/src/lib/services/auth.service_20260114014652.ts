// 🛡️ SECURITY BARRIER: Ensures this logic never touches the browser bundle
import "server-only"; 

import prisma from "@/lib/db";
import { randomBytes, randomUUID } from "crypto";
import * as jose from "jose"; 
import { JWT_CONFIG, getSecurityContext } from "@/lib/auth/config";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

/**
 * 🛰️ AUTHENTICATION ENGINE (v14.38.0)
 * Logic: Tiered Expiry, Role-Aware Sessioning, & Clock-Tolerant Verification.
 * Environment: Strictly Server-Side.
 */
export const AuthService = {
  /**
   * 🔑 GENERATE MAGIC TOKEN
   * Creates a one-time cryptographic anchor for Telegram Ingress.
   */
  async generateMagicToken(telegramId: string): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
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
   * Exchanges one-time token for user identity and rotates the token state.
   */
  async verifyMagicToken(token: string) {
    try {
      const magicToken = await prisma.magicToken.findUnique({
        where: { token },
        include: { user: true },
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
   * 🔐 TIERED SESSION GENERATION
   * Logic: Admins (24h) | Merchants (7d).
   * Anchor: Injects securityStamp for global revocation capabilities.
   */
  async createSession(user: any) {
    const role = user.role?.toUpperCase();
    const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT"].includes(role);
    const expiration = isStaff ? "24h" : "7d";

    const token = await new jose.SignJWT({
      sub: user.id,
      user: {
        id: user.id,
        role: user.role,
        merchantId: user.merchantId || null,
        securityStamp: user.securityStamp, 
      },
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiration)
      .sign(JWT_CONFIG.secret);

    return token;
  },

  /**
   * 🛡️ INSTITUTIONAL VERIFICATION (v14.38.0)
   * Logic: Standardized verification with 60s clock tolerance for slow dev builds.
   * Fix: Explicitly handles "expired" vs "signature" faults for better debugging.
   */
  async verifySession(token: string) {
    try {
      if (!token) return null;

      const { payload } = await jose.jwtVerify(
        token, 
        JWT_CONFIG.secret, 
        {
          clockTolerance: 60, // ⬆️ Survives 15s+ compilation delays
          algorithms: ['HS256']
        }
      );

      return payload;
    } catch (error: any) {
      if (error.code === 'ERR_JWT_EXPIRED') {
        console.error("⏳ [AuthService_Trace]: Token expired mathematically.");
      } else if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        console.error("🔑 [AuthService_Trace]: Signature Mismatch. Check JWT_SECRET.");
      } else {
        console.error(`🔐 [AuthService_Trace]: ${error.code} | ${error.message}`);
      }
      return null;
    }
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

      if (!dbUser) return false;
      return dbUser.securityStamp === sessionStamp;
    } catch (error) {
      console.error("🔥 [Auth_Stamp_Validation_Error]:", error);
      return false;
    }
  },

  /**
   * 🧹 ROTATE IDENTITY ANCHOR (Global Logout)
   */
  async rotateSecurityStamp(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { securityStamp: randomUUID() }
    });
  },

  /**
   * 🕵️ IDENTITY EXTRACTION
   */
  async getUserFromRequest(request: NextRequest) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;
      if (!token) return null;

      const payload = await this.verifySession(token);
      return payload ? (payload.user as any) : null;
    } catch (error) { return null; }
  },

  /**
   * 🍪 COOKIE PROTOCOL GENERATOR
   * Fix: Enforces strict path and domain synchronization to prevent cookie collision.
   */
  getCookieMetadata(host: string | null, protocol: string | null, role?: string) {
    const context = getSecurityContext(host, protocol);
    const roleUpper = role?.toUpperCase() || "";
    const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT"].includes(roleUpper);
    const maxAge = isStaff ? 86400 : 604800;

    // Ensure we don't use wildcard domains that cause collisions
    const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

    return {
      name: JWT_CONFIG.cookieName,
      options: {
        ...JWT_CONFIG.cookieOptions,
        maxAge: maxAge,
        path: "/", // 🚀 Essential for global visibility
        domain: cookieDomain,
        secure: context.secure,
        sameSite: context.sameSite as any,
        partitioned: context.partitioned,
      },
    };
  },
};