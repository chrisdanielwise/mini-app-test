// 🛡️ SECURITY BARRIER: Ensures this logic never touches the browser bundle
import "server-only"; 

import prisma from "@/lib/db";
import { randomBytes, randomUUID } from "crypto";
import * as jose from "jose"; 
import { JWT_CONFIG, getSecurityContext } from "@/lib/auth/config";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

/**
 * 🛰️ AUTHENTICATION ENGINE (v14.7.0)
 * Logic: Tiered Expiry, Global Kill Switch (Security Stamp), & Thin Validation.
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
    const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER"].includes(role);
    const expiration = isStaff ? "24h" : "7d";

    const token = await new jose.SignJWT({
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
   * ⚡ THIN CHECK: VALIDATE SECURITY STAMP
   * Performance: Queries only the essential column to protect database IO.
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
   * Invalidates all active sessions for this user instantly.
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

      const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret);
      return (payload.user as any);
    } catch (error) { return null; }
  },

  /**
   * 🍪 COOKIE PROTOCOL GENERATOR
   */
  getCookieMetadata(host: string | null, protocol: string | null, role?: string) {
    const context = getSecurityContext(host, protocol);
    const roleUpper = role?.toUpperCase() || "";
    const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER"].includes(roleUpper);
    const maxAge = isStaff ? 86400 : 604800;

    return {
      name: JWT_CONFIG.cookieName,
      options: {
        ...JWT_CONFIG.cookieOptions,
        maxAge: maxAge,
        secure: context.secure,
        sameSite: context.sameSite as any,
        partitioned: context.partitioned,
      },
    };
  },
};