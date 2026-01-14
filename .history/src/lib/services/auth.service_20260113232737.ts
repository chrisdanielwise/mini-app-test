"use client";

import prisma from "@/lib/db";
import { randomBytes } from "crypto";
import * as jose from "jose"; 
import { JWT_CONFIG, getSecurityContext } from "@/lib/auth/config";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

/**
 * 🛰️ AUTHENTICATION ENGINE (v14.6.0)
 * Features: Global Security Stamp, Tiered Expiry, & Server-Side "Thin Checks".
 */
export const AuthService = {
  /**
   * 🔑 GENERATE MAGIC TOKEN
   */
  async generateMagicToken(telegramId: string): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
      });
      if (!user) return null;

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
   * 📡 VERIFY SESSION JWT (Institutional)
   */
  async verifySession(token: string) {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret);
      const sessionUser = (payload.user as any);

      // ✅ Perform validation via the new Thin Check
      const isValid = await this.validateSecurityStamp(sessionUser.id, sessionUser.securityStamp);
      if (!isValid) throw new Error("SECURITY_STAMP_INVALID");

      return payload;
    } catch (error) { return null; }
  },

  /**
   * ⚡ THIN CHECK: VALIDATE SECURITY STAMP
   * Logic: Used by Middleware, Heartbeats, and Server Components to verify revocation.
   * Optimization: Queries only the essential column to protect Neon DB performance.
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