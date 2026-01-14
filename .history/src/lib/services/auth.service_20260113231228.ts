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

 