import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { crypto } from "node:crypto";

/**
 * 🛰️ ZIPHA MULTI-TIER WEBHOOK
 * Handles Merchant Auth, Pre-Checkout Validation, and Payment Fulfillment.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramApi = `https://api.telegram.org/bot${botToken}`;

    // 1. Security Check
    if (token !== botToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 200 });
    }

    // 🏁 DYNAMIC ORIGIN DETECTION (Critical for Ngrok/Production redirects)
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const currentActiveUrl = `${protocol}://${host}`;

    const update = await request.json();

    /**
     * 🛡️ PROTOCOL A: PRE-CHECKOUT QUERY
     * Triggered when a user clicks 'Pay'. We must verify the node is ready.
     */
    if (update.pre_checkout_query) {
      await fetch(`${telegramApi}/answerPreCheckoutQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pre_checkout_query_id: update.pre_checkout_query.id,
          ok: true, 
        }),
      });
      return NextResponse.json({ success: true });
    }

    const message = update.message;
    if (!message) return NextResponse.json({ success: true });

    const chatId = message.chat.id;
    const text = message.text || "";

    /**
     * 💰 PROTOCOL B: SUCCESSFUL PAYMENT FULFILLMENT
     * Money cleared. We now activate the User's subscription record.
     */
    if (message.successful_payment) {
      const paymentInfo = message.successful_payment;
      const metadata = JSON.parse(paymentInfo.invoice_payload); 
      const telegramId = BigInt(chatId);

      // Find user and tier identity
      const user = await prisma.user.findUnique({ where: { telegramId } });
      const tier = await prisma.serviceTier.findUnique({
        where: { id: metadata.tierId },
        include: { service: true }
      });

      if (user && tier) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // Default 30-day window

        await prisma.$transaction([
          // Update Ledger
          prisma.payment.updateMany({
            where: { userId: user.id, serviceId: tier.service.id, status: "PENDING" },
            data: { status: "COMPLETED" }
          }),
          // Create Subscription Access
          prisma.subscription.create({
            data: {
              userId: user.id,
              serviceId: tier.service.id,
              tierId: tier.id,
              status: "ACTIVE",
              expiresAt: expiryDate,
            }
          })
        ]);

        await fetch(`${telegramApi}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `✅ *Node Activated!*\n\nService: *${tier.service.name}*\nProtocol: *${tier.name}*\n\nYour access is now live until ${expiryDate.toLocaleDateString()}.`,
            parse_mode: "Markdown",
          }),
        });
      }
      return NextResponse.json({ success: true });
    }

    /**
     * 🔐 PROTOCOL C: MERCHANT IDENTITY HANDSHAKE (Staff Login)
     */
    if (text.startsWith("/start merchant_login")) {
      const merchant = await prisma.merchantProfile.findFirst({
        where: { adminUser: { telegramId: BigInt(chatId) } },
        include: { adminUser: true }
      });

      if (!merchant) {
        await fetch(`${telegramApi}/sendMessage`, {
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

      const loginToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date(Date.now() + 5 * 60 * 1000);

      await prisma.merchantProfile.update({
        where: { id: merchant.id },
        data: { lastLoginToken: loginToken, tokenExpires },
      });

      const callbackUrl = `${currentActiveUrl}/api/auth/callback?token=${loginToken}&merchantId=${merchant.id}`;

      await fetch(`${telegramApi}/sendMessage`, {
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
      return NextResponse.json({ success: true });
    }

    /**
     * 🛡️ PROTOCOL D: DEFAULT START
     */
    if (text === "/start") {
      await fetch(`${telegramApi}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🚀 *Zipha Server Online*\n\nCluster URL: \`${currentActiveUrl}\``,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: "Open Mini App", web_app: { url: currentActiveUrl } }]],
          },
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 Webhook Handler Error:", error);
    return NextResponse.json({ success: true });
  }
}