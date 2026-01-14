// 🛡️ SECURITY BARRIER: Ensures this logic never touches the browser bundle
import "server-only"; 

import prisma from "@/lib/db";
import { randomBytes, randomUUID } from "crypto";
import * as jose from "jose"; 
import { JWT_CONFIG, getSecurityContext } from "@/lib/auth/config";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";

/**
 * 🛰️ AUTHENTICATION ENGINE (v16.16.1)
 * Logic: Optimized Thin-Fetch Verification & Tiered Persistence Sync.
 * Performance: Mitigates 2500ms+ latencies via targeted selection.
 */
export const AuthService = {
  /**
   * 🔑 GENERATE MAGIC TOKEN
   * Fix: Added 'select' to bypass slow full-row scans.
   */
  async generateMagicToken(telegramId: string): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
        select: { id: true } // 🚀 Only need the ID to link the token
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
   * 🔐 TIERED SESSION GENERATION
   * Logic: Staff (24h) | Merchants (7d).
   */
 
  async createSession(user: any) {
    // 🚀 FIX: Force a fresh role check from the DB to ensure 'MERCHANT' status is captured
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, securityStamp: true }
    });

    const role = dbUser?.role?.toUpperCase() || "user";
    
    // 🛡️ TIERED EXPIRY LOGIC
    // Staff/Amber = 24h | Merchants = 7d | Users = 7d (or 30d if preferred)
    const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "AMBER"].includes(role);
    const expiration = isStaff ? "24h" : "7d"; 

    const token = await new jose.SignJWT({
      sub: user.id,
      user: {
        id: user.id,
        role: role.toLowerCase(), // 🚀 Standardize to lowercase for Middleware
        securityStamp: dbUser?.securityStamp, 
      },
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiration)
      .sign(JWT_CONFIG.secret);

    return token;
  },

  /**
   * 🛡️ INSTITUTIONAL VERIFICATION (v16.16.1)
   * 🚀 CRITICAL OPTIMIZATION: Removed heavy relation fetching.
   * This fixes the 3000ms+ hang on the callback page.
   */
  async verifySession(token: string) {
    try {
      if (!token) return null;

      const { payload } = await jose.jwtVerify(token, JWT_CONFIG.secret, {
        clockTolerance: 60,
        algorithms: ['HS256']
      });

      // ⚡ THIN FETCH: Validate only the essential security anchor
      const dbUser = await prisma.user.findUnique({
        where: { id: payload.sub as string },
        select: { securityStamp: true, role: true } // 🚀 Do NOT include teams/merchants here
      });

      if (!dbUser || dbUser.securityStamp !== (payload.user as any).securityStamp) {
        return null;
      }

      return payload;
    } catch (error: any) {
      return null;
    }
  },

  /**
   * 🕵️ IDENTITY EXTRACTION
   */
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
   * 🍪 COOKIE PROTOCOL GENERATOR
   */
  getCookieMetadata(host: string | null, protocol: string | null, role?: string) {
    const context = getSecurityContext(host, protocol);
    const roleUpper = role?.toUpperCase() || "";
    const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "AMBER"].includes(roleUpper);
    const maxAge = isStaff ? 86400 : 604800;

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
        partitioned: true,
      },
    };
  },
};