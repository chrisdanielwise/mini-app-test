import prisma from "@/lib/db";
import { randomBytes } from "crypto";
import { SignJWT, jwtVerify } from "jose"; // Institutional standard for 2026
import { JWT_CONFIG, getSecurityContext } from "@/lib/auth/config";

/**
 * 🛰️ AUTHENTICATION ENGINE (v13.0.3)
 * Integration: JWT_CONFIG & Protocol Guard v12.3.0
 */
export const AuthService = {
  /**
   * 🔑 GENERATE MAGIC TOKEN
   * Creates a one-time use token for browser cross-auth.
   */
async generateMagicToken(telegramId: string): Promise<string | null> {
    try {
      // 🛡️ FIX: Convert string to BigInt to match Prisma Schema requirements
      const user = await prisma.user.findUnique({
        where: { 
          telegramId: BigInt(telegramId) 
        },
      });

      if (!user) {
        console.warn(`⚠️ [AuthService]: No user found for Telegram ID: ${telegramId}`);
        return null;
      }

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10m TTL

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
   * Exchanges a token for user data and burns the token.
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
      console.error("❌ [AuthService.verifyMagicToken]:", error);
      return null;
    }
  },

 /**
   * 🔐 TIERED SESSION GENERATION
   * Super Admins: 24 Hour Hard Limit
   * Merchants/Users: 7 Day Persistence
   */
  async createSession(user: any) {
    const role = user.role?.toUpperCase();
    
    // 🛡️ Determine expiration based on Role Hierarchy
    const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER"].includes(role);
    const expiration = isStaff ? "24h" : "7d";

    const token = await new jose.SignJWT({ 
      user: {
        id: user.id,
        role: user.role,
        merchantId: user.merchantId
      }
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiration) // 🚀 Dynamic Expiration
      .sign(new TextEncoder().encode(JWT_CONFIG.secret));

    return token;
  },

  /**
   * 📡 VERIFY SESSION JWT
   */
  async verifySession(token: string) {
    try {
      const { payload } = await jwtVerify(token, JWT_CONFIG.secret);
      return payload;
    } catch (error) {
      return null;
    }
  },

  /**
   * 🍪 COOKIE PROTOCOL GENERATOR
   * Generates flags using the Protocol Guard (getSecurityContext)
   */
  getCookieMetadata(host: string | null, protocol: string | null) {
    const context = getSecurityContext(host, protocol);
    
    return {
      name: JWT_CONFIG.cookieName,
      options: {
        ...JWT_CONFIG.cookieOptions,
        secure: context.secure,
        sameSite: context.sameSite,
        partitioned: context.partitioned, // 🚀 2026 iframe support
      }
    };
  }
};