"use server";

import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot";

/**
 * 🛡️ AUDIT & SENTINEL SERVICE (Institutional v16.16.14)
 * Logic: Atomic Named Exports for Turbopack Compatibility.
 * Fix: Resolves "Export logAuthEvent doesn't exist" and "found object" errors.
 */

/**
 * 🛰️ IP_GEO_SERVICE (Institutional v16.16.14)
 * Logic: Encrypted Resolution with Rate-Limit Resilience.
 * Named Export: Required for static analysis.
 */
export async function resolveIPGeo(ip: string) {
  // 🛡️ 1. INTERNAL NODE DETECTION
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168") || ip.startsWith("10.")) {
    return { success: true, data: { countryCode: "LOC", city: "Localhost" } };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Zipha-Identity-Sentinel' }
    });

    clearTimeout(timeout);
    if (!res.ok) throw new Error("API_REJECTED");

    const data = await res.json();

    return {
      success: true,
      data: {
        countryCode: data.country_code || "UNK",
        city: data.city || "Unknown",
        isp: data.org || "Unknown Provider"
      }
    };
  } catch (err: any) {
    clearTimeout(timeout);
    console.warn(`⚠️ [Geo_Fault] for ${ip}: ${err.message}`);
    return { success: false, data: { countryCode: "ERR", city: "Error" } };
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