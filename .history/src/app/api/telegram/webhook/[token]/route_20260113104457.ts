import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { completePayment } from "@/lib/services/payment.service";
import { AuthService } from "@/lib/services/auth.service"; 
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🚀 GLOBAL BIGINT PATCH
 * Essential for Next.js 16 / Prisma BigInt compatibility.
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

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
    console.error(`🔥 [Network_Critical] Fetch failed: ${err.message}`);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token: webhookToken } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken || webhookToken !== botToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 200 });
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const baseUrl = `${protocol}://${host}`.replace(/\/$/, "");

    const update = await request.json();

    // --- 💰 PAYMENT HANDLER ---
    if (update.pre_checkout_query) {
      await telegramFetch("answerPreCheckoutQuery", botToken, {
        pre_checkout_query_id: update.pre_checkout_query.id,
        ok: true,
      });
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text || "";

    /**
     * 🛰️ ROLE-BASED START HANDLER
     */
    // if (text.startsWith("/start")) {
    //   const telegramId = BigInt(chatId); // Ensure BigInt for DB comparison
    //   const firstName = message.from.first_name || "Operator";

    //   // 1. IDENTITY SYNC
    //   // Cast to 'any' to handle the 'merchantProfile' TS error while maintaining runtime include
    //   const user = await prisma.user.upsert({
    //     where: { telegramId },
    //     update: { firstName, username: message.from.username },
    //     create: { telegramId, firstName, username: message.from.username, role: 'USER' },
    //     include: { merchantProfile: true }
    //   }) as any;

    //   const role = user.role.toUpperCase();
    //   const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "STAFF"].includes(role);
    //   const isMerchant = !!user.merchantProfile || role === "MERCHANT";

    //   // --- 🏛️ CASE A: STAFF & MERCHANT ---
    //   if (isStaff || isMerchant) {
    //     const loginToken = await AuthService.generateMagicToken(telegramId.toString());
    //     const magicLink = `${baseUrl}/api/auth/magic?token=${loginToken}`;
    //     const clearance = isStaff ? `STAFF_${role}` : "MERCHANT_OPERATOR";

    //     await telegramFetch("sendMessage", botToken, {
    //       chat_id: chatId,
    //       text: `🛰️ *PRIVILEGED ACCESS ENABLED*\n\n*Operator:* ${firstName}\n*Clearance:* ${clearance}\n\nChoose your environment:`,
    //       parse_mode: "Markdown",
    //       reply_markup: {
    //         inline_keyboard: [
    //           [{ text: "🛰️ OPEN MOBILE DASHBOARD", web_app: { url: `${baseUrl}/dashboard/login` } }],
    //           [{ text: "🔑 LOGIN TO WEB (LAPTOP)", url: magicLink }],
    //           [{ text: "👤 SWITCH TO USER VIEW", web_app: { url: `${baseUrl}/home` } }]
    //         ],
    //       },
    //     });
    //   } 
    //   // --- 📱 CASE B: STANDARD USER ---
    //   else {
    //     await telegramFetch("sendMessage", botToken, {
    //       chat_id: chatId,
    //       text: `🚀 *ZIPHA NETWORK ONLINE*\n\nWelcome, ${firstName}. Your node is synchronized.\nLaunch the application below:`,
    //       parse_mode: "Markdown",
    //       reply_markup: {
    //         inline_keyboard: [
    //           [{ text: "🚀 Launch App", web_app: { url: `${baseUrl}/home` } }],
    //           [{ text: "🌐 Visit Website", url: baseUrl }]
    //         ],
    //       },
    //     });
    //   }
    //   return NextResponse.json({ ok: true });
    // }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("🔥 [Webhook_Critical]:", error.message);
    // Returning 200 stops Telegram from retrying the failed request endlessly
    return NextResponse.json({ ok: true });
  }
}