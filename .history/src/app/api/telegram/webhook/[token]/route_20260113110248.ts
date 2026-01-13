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

    const update = await request.json();
    const message = update.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text || "";
    const senderFirstName = message.from?.first_name || "Operator";

    // 🕵️ DEBUG 1: Request Received
    console.log(`📥 [Webhook_Inbound]: ChatID: ${chatId} | Text: "${text}"`);

    if (text.startsWith("/start")) {
      const telegramId = BigInt(chatId);
      console.log(`🔍 [Start_Logic]: Attempting DB Upsert for ${telegramId}...`);

      // 1. IDENTITY SYNC
      const user = await prisma.user.upsert({
        where: { telegramId },
        update: { firstName: senderFirstName, username: message.from?.username },
        create: { telegramId, firstName: senderFirstName, username: message.from?.username, role: 'USER' },
        include: { merchantProfile: true }
      }) as any;

      // 🕵️ DEBUG 2: Database Result
      console.log(`👤 [User_Node]: ID: ${user.id} | Role: ${user.role} | Merchant: ${!!user.merchantProfile}`);

      const role = user.role.toUpperCase();
      const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "STAFF"].includes(role);
      const isMerchant = !!user.merchantProfile || role === "MERCHANT";

      // 🕵️ DEBUG 3: Permission Check
      console.log(`🛡️ [Permissions]: isStaff: ${isStaff} | isMerchant: ${isMerchant}`);

      const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const baseUrl = `${protocol}://${host}`.replace(/\/$/, "");

      if (isStaff || isMerchant) {
        console.log(`🔐 [Privileged_Path]: Generating magic link for ${baseUrl}`);
        
        const loginToken = await AuthService.generateMagicToken(telegramId.toString());
        const magicLink = `${baseUrl}/api/auth/magic?token=${loginToken}`;

        // 🕵️ DEBUG 4: Payload Ready
        console.log(`🚀 [Dispatching_Staff_Menu]: Link generated.`);

        const response = await telegramFetch("sendMessage", botToken!, {
          chat_id: chatId,
          text: `🛰️ *PRIVILEGED ACCESS ENABLED*\n\n*Operator:* ${senderFirstName}\n*Clearance:* ${role}`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🛰️ OPEN MOBILE DASHBOARD", web_app: { url: `${baseUrl}/dashboard/login` } }],
              [{ text: "🔑 LOGIN TO WEB (LAPTOP)", url: magicLink }]
            ],
          },
        });
        
        console.log(`🏁 [Final_Status]: ${response.ok ? "✅ SENT" : "❌ FAILED"}`);
      } else {
        console.log(`📱 [Standard_Path]: Dispatching User Menu.`);
        await telegramFetch("sendMessage", botToken!, {
          chat_id: chatId,
          text: `🚀 *ZIPHA NETWORK ONLINE*\n\nWelcome, ${senderFirstName}.`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: "🚀 Launch App", web_app: { url: `${baseUrl}/home` } }]],
          },
        });
      }
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

   
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("🔥 [Webhook_Fault]:", error.message);
    return NextResponse.json({ ok: true });
  }
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
}}