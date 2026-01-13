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
   * 🛰️ CREATE SESSION JWT
   * Uses JWT_CONFIG.secret (Uint8Array) for signing.
   */
  async createSession(user: any): Promise<string> {
    const session = await new SignJWT({
      sub: user.id,
      telegramId: user.telegramId,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_CONFIG.expiresIn)
      .sign(JWT_CONFIG.secret);

    return session;
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