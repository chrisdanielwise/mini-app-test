import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import  crypto  from "node:crypto";

/**
 * 🛰️ ZIPHA MULTI-TIER WEBHOOK (Updated for /home routing)
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

    if (token !== botToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 200 });
    }

    // 🏁 DYNAMIC ORIGIN DETECTION (Essential for Ngrok/Production redirects)
    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const currentActiveUrl = `${protocol}://${host}`;

    const update = await request.json();

    /**
     * 🛡️ PROTOCOL A: PRE-CHECKOUT QUERY (Inventory Lock)
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
     */
    if (message.successful_payment) {
      const paymentInfo = message.successful_payment;
      const metadata = JSON.parse(paymentInfo.invoice_payload);
      const telegramId = BigInt(chatId);

      const user = await prisma.user.findUnique({ where: { telegramId } });
      const tier = await prisma.serviceTier.findUnique({
        where: { id: metadata.tierId },
        include: { service: true },
      });

      if (user && tier) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        await prisma.$transaction([
          prisma.payment.updateMany({
            where: {
              userId: user.id,
              serviceId: tier.service.id,
              status: "PENDING",
            },
            data: { status: "COMPLETED" },
          }),
          prisma.subscription.create({
            data: {
              userId: user.id,
              serviceId: tier.service.id,
              tierId: tier.id,
              status: "ACTIVE",
              expiresAt: expiryDate,
            },
          }),
        ]);

        await fetch(`${telegramApi}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `✅ *Node Activated!*\n\nService: *${tier.service.name}*\nProtocol: *${tier.name}*\n\nYour access is now live. Click below to view your dashboard.`,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "View Active Services",
                    web_app: { url: `${currentActiveUrl}/home` },
                  },
                ],
              ],
            },
          }),
        });
      }
      return NextResponse.json({ success: true });
    }

    /**
     * 🔐 PROTOCOL C: MERCHANT IDENTITY HANDSHAKE
     */
    if (text.startsWith("/start merchant_login")) {
      const merchant = await prisma.merchantProfile.findFirst({
        where: { adminUser: { telegramId: BigInt(chatId) } },
        include: { adminUser: true },
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
          text: `🔐 *Identity Verified*\n\nMerchant: *${merchant.companyName}*`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "Access Command Center", url: callbackUrl }],
            ],
          },
        }),
      });
      return NextResponse.json({ success: true });
    }

    /**
     * 🛡️ PROTOCOL D: DEFAULT START (Redirecting to /home)
     */
    if (text === "/start") {
      await fetch(`${telegramApi}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🚀 *Zipha Server Online*\n\nYour user cluster is ready at: \`${currentActiveUrl}/home\``,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Open Mini App",
                  web_app: { url: `${currentActiveUrl}/home` },
                },
              ],
            ],
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
