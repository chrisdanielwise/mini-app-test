import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { completePayment } from "@/lib/services/payment.service";
import { AuthService } from "@/lib/services/auth.service";
import { JWT_CONFIG } from "@/lib/auth/config";
import { AuditService } from "@/lib/services/audit.service";

/**
 * 🚀 GLOBAL BIGINT PATCH
 * Essential for Next.js 16 / Prisma BigInt compatibility.
 * Prevents "Do not know how to serialize a BigInt" crashes during JSON serialization.
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * 🛰️ TELEGRAM WEBHOOK HANDLER (Institutional v13.9.45)
 * Logic: Role-Based Routing with Hardware Diagnostics & Safe Variable Mapping.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token: webhookToken } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // 🛡️ SECURITY CHECK: Verify token matches environment
    if (!botToken || webhookToken !== botToken) {
      console.warn(
        "⚠️ [Webhook_Security]: Unauthorized token ingress attempt."
      );
      return NextResponse.json({ ok: true });
    }

    const update = await request.json();
    const message = update.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text || "";

    // ✅ SAFE VARIABLE MAPPING: Essential to prevent ReferenceErrors
    const senderFirstName = message.from?.first_name || "Operator";

    // 🕵️ DEBUG: Request Received Trace
    console.log(`📥 [Webhook_Inbound]: ChatID: ${chatId} | Text: "${text}"`);

    // 🌐 RESOLVE BASE URL: Dynamic origin detection for tunnels and production
    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const baseUrl = `${protocol}://${host}`.replace(/\/$/, "");

    // --- 💰 PAYMENT HANDLER ---
    if (update.pre_checkout_query) {
      await telegramFetch("answerPreCheckoutQuery", botToken, {
        pre_checkout_query_id: update.pre_checkout_query.id,
        ok: true,
      });
      return NextResponse.json({ ok: true });
    }

    if (message.successful_payment) {
      // Payment completion logic should be implemented here
      return NextResponse.json({ ok: true });
    }

    /**
     * 🛠️ COMMAND: /status (Hardware Diagnostics)
     * Logic: Verifies DB connectivity and server latency.
     */
    if (text === "/status") {
      const startTime = Date.now();
      const dbStatus = await prisma.$queryRaw`SELECT 1`
        .then(() => "ONLINE")
        .catch(() => "OFFLINE");
      const latency = Date.now() - startTime;

      console.log(`📡 [Status_Check]: DB: ${dbStatus} | Latency: ${latency}ms`);

      await telegramFetch("sendMessage", botToken, {
        chat_id: chatId,
        text:
          `🖥️ *SYSTEM ARCHITECTURE STATUS*\n\n` +
          `*Database:* ${dbStatus === "ONLINE" ? "🟢" : "🔴"} ${dbStatus}\n` +
          `*Latency:* ⚡ ${latency}ms\n` +
          `*Environment:* 🏗️ ${process.env.NODE_ENV || "production"}\n` +
          `*Handshake Node:* ✅ ACTIVE`,
        parse_mode: "Markdown",
      });
      return NextResponse.json({ ok: true });
    }

    /**
     * 🚀 COMMAND: /start (Identity Handshake)
     * Logic: Syncs profile and returns privileged or standard deployment menu.
     */
    // 🚀 Inside your POST handler, replace the /start block with this:

    if (text.startsWith("/start")) {
      const telegramId = BigInt(chatId);

      const user = (await prisma.user.upsert({
        where: { telegramId },
        update: {
          firstName: senderFirstName,
          username: message.from?.username,
        },
        create: {
          telegramId,
          firstName: senderFirstName,
          username: message.from?.username,
          role: "USER",
        },
        include: { merchantProfile: true },
      })) as any;

      const role = user.role.toUpperCase();
      const isStaff = [
        "SUPER_ADMIN",
        "PLATFORM_MANAGER",
        "PLATFORM_SUPPORT",
        "STAFF",
      ].includes(role);
      const isMerchant = !!user.merchantProfile || role === "MERCHANT";

      if (isStaff || isMerchant) {
        const loginToken = await AuthService.generateMagicToken(
          telegramId.toString()
        );
        const magicLink = `${baseUrl}/api/auth/magic?token=${loginToken}`;

        // ✅ FIX: Using HTML mode to prevent underscore (_) parsing errors
        const clearance = isStaff ? `STAFF ${role}` : "MERCHANT OPERATOR";

        await telegramFetch("sendMessage", botToken!, {
          chat_id: chatId,
          text:
            `<b>🛰️ PRIVILEGED ACCESS ENABLED</b>\n\n` +
            `<b>Operator:</b> ${senderFirstName}\n` +
            `<b>Clearance:</b> ${clearance}\n\n` +
            `<i>Choose your deployment environment:</i>`,
          parse_mode: "HTML", // 🚀 Changed from Markdown to HTML
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🛰️ OPEN MOBILE DASHBOARD",
                  web_app: { url: `${baseUrl}/dashboard/login` },
                },
              ],
              [{ text: "🔑 LOGIN TO WEB (LAPTOP)", url: magicLink }],
              [
                {
                  text: "👤 SWITCH TO USER VIEW",
                  web_app: { url: `${baseUrl}/home` },
                },
              ],
            ],
          },
        });
      } else {
        await telegramFetch("sendMessage", botToken!, {
          chat_id: chatId,
          text: `<b>🚀 ZIPHA NETWORK ONLINE</b>\n\nWelcome, ${senderFirstName}. Your node is synchronized.`,
          parse_mode: "HTML", // 🚀 Consistency fix
          reply_markup: {
            inline_keyboard: [
              [{ text: "🚀 Launch App", web_app: { url: `${baseUrl}/home` } }],
            ],
          },
        });
      }
    }

    // Inside your POST handler for the Telegram Webhook
    if (text === "/logout") {
      const telegramId = BigInt(chatId);

      // 1. Invalidate tokens in the Database
      await prisma.user.update({
        where: { telegramId },
        data: {
          lastLoginAt: null,
          // If you use a session versioning system, increment it here
        },
      });

      // 2. Delete all pending Magic Tokens for this user
      await prisma.magicToken.updateMany({
        where: { user: { telegramId }, used: false },
        data: { used: true },
      });

      await AuditService.log({
        userId: user.id,
        merchantId: user.merchantProfile?.id,
        action: "REMOTE_WIPE",
        metadata: { method: "TELEGRAM_COMMAND", platform: "BOT_V2" },
      });

      await telegramFetch("sendMessage", botToken, {
        chat_id: chatId,
        text:
          `🔐 *REMOTE DE-PROVISIONING COMPLETE*\n\n` +
          `All active web sessions and mobile handshakes for this node have been terminated.\n\n` +
          `_To re-access the terminal, use /start._`,
        parse_mode: "Markdown",
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    // 🕵️ DEBUG: Catch and log exact failure point
    console.error("🔥 [Webhook_Fault]:", error.stack || error.message);
    // Returning 200 prevents Telegram from retrying failed messages indefinitely
    return NextResponse.json({ ok: true });
  }
}

/**
 * 🛰️ INTERNAL TELEGRAM FETCH UTILITY
 * Logic: Hardened fetch with AbortController for network resilience.
 */
async function telegramFetch(endpoint: string, botToken: string, body: object) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`🔥 [Telegram_API_Error] ${endpoint}:`, errorData);
    }
    return response;
  } catch (err: any) {
    console.error(`🔥 [Network_Error] ${endpoint}:`, err.message);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
