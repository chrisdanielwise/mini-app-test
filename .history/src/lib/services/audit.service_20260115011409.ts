"use server";

import prisma from "@/lib/db";
import { JWT_CONFIG } from "../auth/config";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { IPGeoService } from "./ip-geo.service";
import { telegramBot } from "@/lib/telegram/bot";

/**
 * 🌊 AUDIT_&_IDENTITY_SENTINEL (v16.16.12)
 * Logic: Event-driven security telemetry with Geographic Pulse-Check.
 * Architecture: Non-blocking "Fire-and-Forget" Sentinel Analysis.
 */
export const AuditService = {
  /**
   * 📝 SECURITY_AUDIT_LOG
   * Hardened: Atomic creation with metadata normalization.
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

      // 🚨 SENTINEL ACTIVATION
      // On login, we trigger a background geo-audit. 
      // We do not await this to maintain sub-100ms handshake speeds.
      if (params.action === "LOGIN" && params.ip) {
        this.performSentinelAnalysis(params.userId, params.ip).catch((e) => 
          console.error("🔐 [Sentinel_Fail]:", e)
        );
      }

      return currentLog;
    } catch (err) {
      console.error("🔥 [Audit_Log_Failed]:", err);
      return null;
    }
  },

  /**
   * 🛰️ SENTINEL_ANALYSIS: Geographic Velocity Check
   * Logic: Compares current ingress vector with the previous authenticated node.
   */
  async performSentinelAnalysis(userId: string, currentIp: string) {
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { telegramId: true }
    });

    if (!user?.telegramId) return;

    const previousLogin = await prisma.activityLog.findFirst({
      where: { actorId: userId, action: "LOGIN" },
      orderBy: { createdAt: "desc" },
      skip: 1 
    });

    if (!previousLogin) return;

    // 🏛️ Parallel Geo-Resolution
    const [currentGeo, prevGeo] = await Promise.all([
      IPGeoService.resolve(currentIp),
      IPGeoService.resolve(previousLogin.ipAddress ?? "0.0.0.0") 
    ]);

    // Threshold: Trigger alert only on Country-level mismatch
    const isMismatch = currentGeo.countryCode !== prevGeo.countryCode;
    const isRealNode = currentGeo.countryCode !== "LOC"; // Ignore localhost/internal

    if (isMismatch && isRealNode) {
      await this.dispatchSecurityAlert(user.telegramId.toString(), currentIp, currentGeo);
    }
  },

  /**
   * 📣 TELEGRAM_SECURITY_DISPATCH
   * Standard: MarkdownV2 formatted institutional alerts.
   */
  async dispatchSecurityAlert(telegramId: string, ip: string, geo: any) {
    const alertMessage = 
      `⚠️ *SECURITY ALERT: IDENTITY INGRESS*\n` +
      `----------------------------\n` +
      `A new login was detected from an unrecognized location\\.\n\n` +
      `📍 *Node:* ${geo.city || 'Unknown'}, ${geo.countryCode}\n` +
      `🌐 *IP Address:* \`${ip.replaceAll('.', '\\.')}\`\n` +
      `----------------------------\n` +
      `*Action Required:* If this was not you, trigger a Remote Wipe.`;

    await telegramBot.api.sendMessage(telegramId, alertMessage, {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [[
          { text: "🚨 TRIGGER REMOTE WIPE", callback_data: "security_wipe_all" }
        ]]
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