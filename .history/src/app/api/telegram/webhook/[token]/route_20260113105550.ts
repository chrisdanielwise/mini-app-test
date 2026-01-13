import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { completePayment } from "@/lib/services/payment.service";
import { AuthService } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🚀 GLOBAL BIGINT PATCH
 * Essential for Next.js 16 / Prisma BigInt compatibility.
 * Prevents "Do not know how to serialize a BigInt" crashes during JSON serialization.
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * 🛰️ TELEGRAM WEBHOOK HANDLER (Institutional v13.9.40)
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
      return NextResponse.json({ ok: true }); 
    }

    const update = await request.json();
    const message = update.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text || "";
    
    // ✅ SAFE VARIABLE MAPPING: Extracting sender context early
    const senderFirstName = message.from?.first_name || "Operator";

    // 🌐 RESOLVE BASE URL: Dynamic origin detection for tunnels
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
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
      // Payment resolution logic goes here
      return NextResponse.json({ ok: true });
    }

    /**
     * 🛠️ COMMAND: /status (Hardware Diagnostics)
     * Logic: Verifies DB connectivity and server latency.
     */
    if (text === "/status") {
      const startTime = Date.now();
      const dbStatus = await prisma.$queryRaw`SELECT 1`.then(() => "ONLINE").catch(() => "OFFLINE");
      const latency = Date.now() - startTime;

      await telegramFetch("sendMessage", botToken, {
        chat_id: chatId,
        text: `🖥️ *SYSTEM ARCHITECTURE STATUS*\n\n` +
              `*Database:* ${dbStatus === "ONLINE" ? "🟢" : "🔴"} ${dbStatus}\n` +
              `*Latency:* ⚡ ${latency}ms\n` +
              `*Environment:* 🏗️ ${process.env.NODE_ENV || 'production'}\n` +
              `*Handshake Node:* ✅ ACTIVE`,
        parse_mode: "Markdown",
      });
      return NextResponse.json({ ok: true });
    }

    /**
     * 🚀 COMMAND: /start (Identity Handshake)
     * Logic: Syncs profile and returns privileged/standard deployment menu.
     */
    if (text.startsWith("/start")) {
      const telegramId = BigInt(chatId);

      // 1. IDENTITY SYNC: Relational Upsert
      const user = await prisma.user.upsert({
        where: { telegramId },
        update: { firstName: senderFirstName, username: message.from?.username },
        create: { telegramId, firstName: senderFirstName, username: message.from?.username, role: 'USER' },
        include: { merchantProfile: true }
      }) as any;

      const role = user.role.toUpperCase();
      const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "STAFF"].includes(role);
      const isMerchant = !!user.merchantProfile || role === "MERCHANT";

      // --- 🏛️ CASE A: STAFF & MERCHANT (Privileged Access) ---
      if (isStaff || isMerchant) {
        const loginToken = await AuthService.generateMagicToken(telegramId.toString());
        const magicLink = `${baseUrl}/api/auth/magic?token=${loginToken}`;
        const clearance = isStaff ? `STAFF_${role}` : "MERCHANT_OPERATOR";

        await telegramFetch("sendMessage", botToken, {
          chat_id: chatId,
          text: `🛰️ *PRIVILEGED ACCESS ENABLED*\n\n*Operator:* ${senderFirstName}\n*Clearance:* ${clearance}\n\nChoose your deployment environment:`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🛰️ OPEN MOBILE DASHBOARD", web_app: { url: `${baseUrl}/dashboard/login` } }],
              [{ text: "🔑 LOGIN TO WEB (LAPTOP)", url: magicLink }],
              [{ text: "👤 SWITCH TO USER VIEW", web_app: { url: `${baseUrl}/home` } }]
            ],
          },
        });
      } 
      // --- 📱 CASE B: STANDARD USER (Customer Access) ---
      else {
        await telegramFetch("sendMessage", botToken, {
          chat_id: chatId,
          text: `🚀 *ZIPHA NETWORK ONLINE*\n\nWelcome, ${senderFirstName}. Your node is synchronized.\nLaunch the application below:`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🚀 Launch App", web_app: { url: `${baseUrl}/home` } }],
              [{ text: "🌐 Visit Website", url: baseUrl }]
            ],
          },
        });
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("🔥 [Webhook_Fault]:", error.message);
    return NextResponse.json({ ok: true });
  }
}

/**
 * 🛰️ INTERNAL TELEGRAM FETCH UTILITY
 */
async function telegramFetch(endpoint: string, botToken: string, body: object) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); 

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return response;
  } catch (err: any) {
    console.error(`🔥 [Telegram_API_Error] ${endpoint}:`, err.message);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}