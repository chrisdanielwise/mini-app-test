"use server";

import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot";
import { IPGeoService } from "./ip-geo.service";

/**
 * 🛡️ AUDIT & SENTINEL SERVICE (Institutional v16.16.14)
 * Logic: Atomic Named Exports for Turbopack Compatibility.
 * Feature: Background Geo-Audit & Telegram Security Dispatch.
 */

/**
 * 📝 SECURITY_AUDIT_LOG
 * Hardened: Non-blocking Sentinel activation.
 */
export async function logAuthEvent(params: {
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

    // 🚨 SENTINEL ACTIVATION: Geographic Velocity Check
    if (params.action === "LOGIN" && params.ip) {
      // Fire-and-forget to maintain sub-100ms handshake speeds
      performSentinelAnalysis(params.userId, params.ip).catch((e) =>
        console.error("🔐 [Sentinel_Fail]:", e)
      );
    }

    return currentLog;
  } catch (err) {
    console.error("🔥 [Audit_Log_Failed]:", err);
    return null;
  }
}

/**
 * 🛰️ SENTINEL_ANALYSIS: Geographic Velocity Check
 * Logic: Compares current ingress vector with the previous authenticated node.
 */
export async function performSentinelAnalysis(
  userId: string,
  currentIp: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { telegramId: true },
    });

    if (!user?.telegramId) return;

    const previousLogin = await prisma.activityLog.findFirst({
      where: { actorId: userId, action: "LOGIN" },
      orderBy: { createdAt: "desc" },
      skip: 1,
    });

    if (!previousLogin) return;

    // 🏛️ Parallel Geo-Resolution via Named Export
    const [currentGeo, prevGeo] = await Promise.all([
      IPGeoService(currentIp),
      IPGeoService(previousLogin.ipAddress ?? "0.0.0.0"),
    ]);

    // Threshold: Trigger alert only on Country-level mismatch
    const isMismatch =
      currentGeo.data?.countryCode !== prevGeo.data?.countryCode;
    const isRealNode = currentGeo.data?.countryCode !== "LOC";

    if (isMismatch && isRealNode) {
      await dispatchSecurityAlert(
        user.telegramId.toString(),
        currentIp,
        currentGeo.data
      );
    }
  } catch (err) {
    console.error("🔐 [Sentinel_Analysis_Error]:", err);
  }
}

/**
 * 📣 TELEGRAM ALERT DISPATCHER
 */
export async function dispatchSecurityAlert(
  telegramId: string,
  ip: string,
  geo: any
) {
  const alertMessage = `
⚠️ *SECURITY ALERT: NEW LOGIN*
----------------------------
A login was detected from a new location.
📍 *Node:* ${geo.city}, ${geo.countryCode}
🌐 *IP Address:* \`${ip}\`
----------------------------
*If this wasn't you, trigger a Remote Wipe immediately.*
    `;

  try {
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
  } catch (e) {
    console.error("📣 [Alert_Dispatch_Fail]:", e);
  }
}

/**
 * 🕵️ LOG SYSTEM EVENT
 * Secondary atomic export for general system logs.
 */
export async function logSystemEvent(
  action: string,
  metadata: Record<string, any> = {}
) {
  try {
    return await prisma.systemLog.create({
      data: { action, metadata },
    });
  } catch (error) {
    console.error("🚨 [System_Audit_Fault]:", error);
    return null;
  }
}
