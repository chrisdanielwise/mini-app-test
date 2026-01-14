import prisma from "@/lib/db";
import { randomBytes } from "crypto";
import * as jose from "jose"; // ✅ Fixed: Institutional standard for 2026
import { JWT_CONFIG, getSecurityContext } from "@/lib/auth/config";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

/**
 * 🛰️ AUTHENTICATION ENGINE (v14.0.5)
 * Features: Global Security Stamp, Tiered Expiry, & Safari 2026 Partitioning.
 */
export const AuthService = {
  /**
   * 🔑 GENERATE MAGIC TOKEN
   * One-time use token for cross-platform browser ingress.
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
        data: {
          token,
          userId: user.id,
          expiresAt,
          used: false,
        },
      });

      return token;
    } catch (error) {
      console.error("❌ [AuthService.generateMagicToken]:", error);
      return null;
    }
  },

  /**
   * 🛡️ VERIFY MAGIC TOKEN
   * Consumes magic link and returns user node with security stamp.
   */
  async verifyMagicToken(token: string) {
    try {
      const magicToken = await prisma.magicToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!magicToken || magicToken.used || new Date() > magicToken.expiresAt) {
        return null;
      }

      await prisma.magicToken.update({
        where: { id: magicToken.id },
        data: { used: true },
      });

      return magicToken.user;
    } catch (error) {
      return null;
    }
  },

  /**
   * 🔐 TIERED SESSION GENERATION
   * Logic: Super Admin (24h) | Merchant/User (7d).
   * Integration: Injects Security Stamp for global revocation.
   */
  async createSession(user: any) {
    const role = user.role?.toUpperCase();
    const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER"].includes(role);
    const expiration = isStaff ? "24h" : "7d";

    // ✅ Jose expects the Uint8Array secret directly from JWT_CONFIG
    const token = await new jose.SignJWT({
      user: {
        id: user.id,
        role: user.role,
        merchantId: user.merchantId || null,
        securityStamp: user.securityStamp, // 🚀 The Global Kill Switch
      },
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiration)
      .sign(JWT_CONFIG.secret);

    return token;
  },

  /**
   * 📡 VERIFY SESSION JWT
   * Hardened: Validates the token signature AND the database security stamp.
   */
  async verifySession(token: string) {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret);
      const sessionUser = (payload.user as any);

      // 🛡️ GLOBAL REVOCATION CHECK
      const dbUser = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: { securityStamp: true, role: true, id: true, merchantId: true }
      });

      // If stamp has changed in DB, the token is instantly voided
      if (!dbUser || dbUser.securityStamp !== sessionUser.securityStamp) {
        throw new Error("SECURITY_STAMP_INVALID");
      }

      return payload;
    } catch (error) {
      return null;
    }
  },

  /**
   * 🕵️ IDENTITY EXTRACTION
   * Extract User object from current request headers/cookies.
   */
  async getUserFromRequest(request: NextRequest) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;
      if (!token) return null;

      const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret);
      return (payload.user as any);
    } catch (error) {
      return null;
    }
  },

  /**
   * 🍪 COOKIE PROTOCOL GENERATOR
   * Logic: Syncs maxAge with tiered session rules.
   */
  getCookieMetadata(host: string | null, protocol: string | null, role?: string) {
    const context = getSecurityContext(host, protocol);
    const roleUpper = role?.toUpperCase() || "";
    const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER"].includes(roleUpper);
    
    // 24h vs 7d in seconds
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