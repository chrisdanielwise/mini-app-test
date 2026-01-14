// 🛡️ SECURITY BARRIER: Ensures this logic never touches the browser bundle
import "server-only"; 

import prisma from "@/lib/db";
import { randomBytes, randomUUID } from "crypto";
import * as jose from "jose"; 
import { JWT_CONFIG, getSecurityContext } from "@/lib/auth/config";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

/**
 * 🛰️ AUTHENTICATION ENGINE (v16.11.0)
 * Logic: 30-Day Unified Expiry & CHIPS-Compliant Cookie Metadata.
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
   * 🔐 UNIFIED SESSION GENERATION
   * Logic: Standardized 30-day persistence for all authorized roles.
   */
  async createSession(user: any) {
    // 🚀 SIGNING: Matches 30-day global persistence
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
      .setExpirationTime(JWT_CONFIG.expiresIn) // 30d
      .sign(JWT_CONFIG.secret);

    return token;
  },

  /**
   * 🛡️ INSTITUTIONAL VERIFICATION (v16.11.0)
   */
  async verifySession(token: string) {
    try {
      if (!token) return null;

      const { payload } = await jose.jwtVerify(
        token, 
        JWT_CONFIG.secret, 
        {
          clockTolerance: 60, 
          algorithms: ['HS256']
        }
      );

      return payload;
    } catch (error: any) {
      if (error.code === 'ERR_JWT_EXPIRED') {
        console.warn("⏳ [AuthService_Trace]: Session reached its 30-day limit.");
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
      return dbUser?.securityStamp === sessionStamp;
    } catch (error) { return false; }
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
   * 🍪 COOKIE PROTOCOL GENERATOR
   * Logic: Synchronizes 30-day TTL and CHIPS partitioning for TMA.
   */
  getCookieMetadata(host: string | null, protocol: string | null) {
    const context = getSecurityContext(host, protocol);
    
    // Optimized domain resolution to prevent apex collisions
    const cookieDomain = host?.includes("localhost") ? undefined : host?.split(":")[0];

    return {
      name: JWT_CONFIG.cookieName,
      options: {
        ...JWT_CONFIG.cookieOptions,
        maxAge: 2592000, // 🚀 30 Days in seconds
        path: "/",
        domain: cookieDomain,
        secure: true,
        sameSite: context.sameSite as any,
        partitioned: context.partitioned,
      },
    };
  },
};