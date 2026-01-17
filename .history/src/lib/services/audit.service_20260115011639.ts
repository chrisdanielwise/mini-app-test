import prisma from "@/lib/db";
import { JWT_CONFIG } from "../auth/config";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { IPGeoService } from "./ip-geo.service"; // ✅ New: Geo-location resolution
import { telegramBot } from "@/lib/telegram/bot"; // ✅ New: Bot Dispatcher

/**
 * 🛡️ AUDIT & IDENTITY SERVICE (v14.3.0)
 * Logic: Security Logging, Session Resolution, & Suspicious Activity Sentinel.
 */
export const AuditService = {
  /**
   * 📝 SECURITY AUDIT LOG
   * Records critical identity events and triggers the Security Sentinel on LOGIN.
   */
  async log(params: {
    userId: string;
    merchantId?: string;
    action: "LOGIN" | "LOGOUT" | "REMOTE_WIPE" | "MAGIC_LINK_ISSUE";
    metadata?: any;
    ip?: string;
  }) {
    try {
      const currentLog = await prisma.activityLog.create({
        data: {
          actorId: params.userId,
          merchantId: params.merchantId || null,
          action: params.action,
          resource: "IDENTITY_NODE",
          metadata: params.metadata || {},
          ipAddress: params.ip || "0.0.0.0",
        },
      });

      // 🚨 SENTINEL TRIGGER: Perform background security analysis on new logins
      if (params.action === "LOGIN" && params.ip) {
        // We do not await this to keep the login handshake fast
        this.checkSuspiciousActivity(params.userId, params.ip);
      }

      return currentLog;
    } catch (err) {
      console.error("🔥 [Audit_Log_Failed]:", err);
    }
  },

  /**
   * 🛰️ SECURITY SENTINEL: GEOGRAPHIC MISMATCH CHECK
   * Logic: Compares current login country with the previous session.
   */
  async checkSuspiciousActivity(userId: string, currentIp: string) {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { telegramId: true }
    });

    if (!user || !user.telegramId) return;

    const previousLogin = await prisma.activityLog.findFirst({
      where: { actorId: userId, action: "LOGIN" },
      orderBy: { createdAt: "desc" },
      skip: 1 
    });

    // If no previous login exists, we can't compare.
    if (!previousLogin) return;

    // ✅ RESOLVED: Use the nullish coalescing operator (??) 
    // to ensure IPGeoService always receives a string.
    const [currentGeo, prevGeo] = await Promise.all([
      IPGeoService.resolve(currentIp),
      IPGeoService.resolve(previousLogin.ipAddress ?? "0.0.0.0") 
    ]);

    if (currentGeo.countryCode !== prevGeo.countryCode && currentGeo.countryCode !== "LOC") {
      this.dispatchSecurityAlert(user.telegramId.toString(), currentIp, currentGeo);
    }
  } catch (err) {
    console.error("🔐 [Sentinel_Analysis_Error]:", err);
  }
},

  /**
   * 📣 TELEGRAM ALERT DISPATCHER
   */
  async dispatchSecurityAlert(telegramId: string, ip: string, geo: any) {
    const alertMessage = `
⚠️ *SECURITY ALERT: NEW LOGIN*
----------------------------
A login was detected from a new location.
📍 *Node:* ${geo.city}, ${geo.countryCode}
🌐 *IP Address:* \`${ip}\`
----------------------------
*If this wasn't you, trigger a Remote Wipe immediately.*
    `;

    await telegramBot.api.sendMessage(telegramId, alertMessage, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚨 REMOTE WIPE ALL SESSIONS",
              url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
            },
          ],
        ],
      },
    });
  },

 /**
   * 🕵️ IDENTITY_RESOLUTION
   * Logic: Stateless extraction from the Secure HttpOnly session.
   */
  async getUserFromRequest(request: NextRequest) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(JWT_CONFIG.cookieName)?.value;

      if (!token) return null;

      const { payload } = await jose.jwtVerify(
        token, 
        new TextEncoder().encode(JWT_CONFIG.secret)
      );
      
      return payload.user as any;
    } catch (error) {
      return null;
    }
  },
};
