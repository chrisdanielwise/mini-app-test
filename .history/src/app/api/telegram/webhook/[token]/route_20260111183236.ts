import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "node:crypto";
import { completePayment } from "@/lib/services/payment.service";

/**
 * 🛰️ TELEGRAM WEBHOOK HANDLER
 * Optimized: Implements "Deep Link" redirection to prevent pre-fetch token consumption.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramApi = `https://api.telegram.org/bot${botToken}`;

    // 🛡️ Security Handshake
    if (token !== botToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 200 });
    }

    // 🏁 Dynamic Origin Detection
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const currentActiveUrl = `${protocol}://${host}`;

    const update = await request.json();

    /**
     * 🛡️ PROTOCOL A: PRE-CHECKOUT QUERY
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
     * 💰 PROTOCOL B: SUCCESSFUL PAYMENT
     */
    if (message.successful_payment) {
      const paymentInfo = message.successful_payment;
      const metadata = JSON.parse(paymentInfo.invoice_payload);
      
      const pendingPayment = await prisma.payment.findFirst({
        where: {
          userId: metadata.userId,
          serviceId: metadata.serviceId,
          status: "PENDING"
        },
        orderBy: { createdAt: "desc" }
      });

      if (pendingPayment) {
        await completePayment(
          pendingPayment.id, 
          paymentInfo.provider_payment_charge_id, 
          paymentInfo
        );

        await fetch(`${telegramApi}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `✅ *Protocol Synchronized*\n\nYour access is now live.`,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🛰️ Launch Dashboard", web_app: { url: `${currentActiveUrl}/home` } }],
              ],
            },
          }),
        });
      }
      return NextResponse.json({ success: true });
    }

    /**
     * 🔐 PROTOCOL C: UNIVERSAL TERMINAL ACCESS
     * Fixed: Redirects to Login Page with token param to prevent pre-fetch burn.
     */
    if (text.startsWith("/start terminal_access")) {
      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(chatId) },
        include: { merchantProfile: true }
      });

      const isPrivileged = user && (user.role !== "USER" || user.merchantProfile);

      if (!isPrivileged) {
        await fetch(`${telegramApi}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "❌ *Access Denied*\nIdentity node lacks sufficient clearance.",
            parse_mode: "Markdown",
          }),
        });
        return NextResponse.json({ success: true });
      }

      // Generate a fresh token with a 10-minute TTL
      const loginToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginToken: loginToken, tokenExpires },
      });

      // 🛡️ THE REDIRECT FIX: 
      // Pointing to the UI page first ensures the API is only hit by a human browser.
      const secureEntryUrl = `${currentActiveUrl}/dashboard/login?token=${loginToken}`;

      await fetch(`${telegramApi}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔐 *Handshake Initialized*\n\nIdentity: *${user.fullName || 'Operator'}*\nRole: *${user.role}*`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🚀 ENTER TERMINAL", url: secureEntryUrl }],
            ],
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
          text: `🚀 *Zipha Network Online*\n\nYour user node has been synchronized.`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🛰️ Open Mini App", web_app: { url: `${currentActiveUrl}/home` } }],
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