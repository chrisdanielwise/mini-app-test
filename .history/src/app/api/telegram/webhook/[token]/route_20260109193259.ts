import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { crypto } from "node:crypto";

/**
 * 🛰️ TELEGRAM WEBHOOK NODE
 * Handles all automated bot logic and the Staff Identity Handshake.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // 1. Security Check: Block unauthorized webhooks
    if (token !== botToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 200 });
    }

    // 🏁 DYNAMIC ORIGIN DETECTION (Critical for Ngrok/Production stability)
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const currentActiveUrl = `${protocol}://${host}`;

    const update = await request.json();
    const message = update.message;

    if (!message || !message.text) {
      return NextResponse.json({ success: true });
    }

    const chatId = message.chat.id;
    const text = message.text;
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // 🛡️ PROTOCOL A: Basic Start / Connection Check
    if (text === "/start") {
      await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🚀 *Zipha Server Online*\n\nYour cluster is officially linked at: \n\`${currentActiveUrl}\``,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: "Open Mini App", web_app: { url: currentActiveUrl } }]],
          },
        }),
      });
    }

    // 🔐 PROTOCOL B: Merchant Identity Handshake (Staff Login)
    if (text.startsWith("/start merchant_login")) {
      // Find the merchant linked to this Telegram ID
      const merchant = await prisma.merchantProfile.findFirst({
        where: { adminUser: { telegramId: BigInt(chatId) } },
        include: { adminUser: true }
      });

      if (!merchant) {
        await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "❌ *Access Denied*\nNo merchant profile linked to this account.",
            parse_mode: "Markdown",
          }),
        });
        return NextResponse.json({ success: true });
      }

      // Generate a one-time cryptographic token valid for 5 minutes
      const loginToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date(Date.now() + 5 * 60 * 1000);

      await prisma.merchantProfile.update({
        where: { id: merchant.id },
        data: { lastLoginToken: loginToken, tokenExpires },
      });

      // Construct the secure callback URL
      const callbackUrl = `${currentActiveUrl}/api/auth/callback?token=${loginToken}&merchantId=${merchant.id}`;

      await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔐 *Identity Verified*\n\nMerchant: *${merchant.companyName}*\nSession Window: 5 Minutes`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: "Access Command Center", url: callbackUrl }]],
          },
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 Webhook Handler Error:", error);
    // Always return 200 to Telegram so it stops retrying failed messages
    return NextResponse.json({ success: true });
  }
}