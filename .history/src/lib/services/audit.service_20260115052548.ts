"use server";

import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot";

/**
 * 🛡️ AUDIT & SENTINEL SERVICE (Institutional v16.16.14)
 * Logic: Atomic Named Exports for Turbopack Compatibility.
 * Fix: Resolves "Export logAuthEvent doesn't exist" and "found object" errors.
 */

/**
 * 🛡️ AUDIT_SERVICE (v16.16.15)
 * Fix: Explicitly maps "action" to prevent Prisma validation crashes.
 */
export async function logAuthEvent(userId: string, ip: string, actionType: string) {
  try {
    const geo = await resolveIPGeo(ip);

    // Ensure the action matches your Prisma Enum 'UserRole' or 'AuditAction'
    return await prisma.activityLog.create({
      data: {
        actorId: userId,
        action: actionType as any, // Cast to any to bypass strict enum if needed
        ipAddress: ip,
        resource: "IDENTITY_NODE",
        metadata: {
          geo_city: geo?.data?.city || "Unknown",
          geo_country: geo?.data?.countryCode || "Unknown"
        }
      }
    });
  } catch (err) {
    console.error("🔥 [Audit_Log_Failed]:", err);
    return null;
  }
}

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
 */
export async function performSentinelAnalysis(userId: string, currentIp: string) {
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

    // 🏛️ Parallel Geo-Resolution via Named Export (Fixed Syntax)
    const [currentGeo, prevGeo] = await Promise.all([
      resolveIPGeo(currentIp),
      resolveIPGeo(previousLogin.ipAddress ?? "0.0.0.0"),
    ]);

    const isMismatch = currentGeo.data?.countryCode !== prevGeo.data?.countryCode;
    const isRealNode = currentGeo.data?.countryCode !== "LOC";

    if (isMismatch && isRealNode) {
      await dispatchSecurityAlert(user.telegramId.toString(), currentIp, currentGeo.data);
    }
  } catch (err) {
    console.error("🔐 [Sentinel_Analysis_Error]:", err);
  }
}

/**
 * 📣 TELEGRAM ALERT DISPATCHER
 */
export async function dispatchSecurityAlert(telegramId: string, ip: string, geo: any) {
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