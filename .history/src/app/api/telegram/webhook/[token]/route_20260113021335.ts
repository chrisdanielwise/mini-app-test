import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "node:crypto";
import { completePayment } from "@/lib/services/payment.service";

/**
 * 🛡️ HARDENED TELEGRAM REQUEST WRAPPER
 * Prevents serverless hangs and timeout errors (UND_ERR_CONNECT_TIMEOUT).
 */
async function telegramFetch(endpoint: string, botToken: string, body: object) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s Hard Cap

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`🔥 [Telegram_API_Error] ${endpoint}:`, errorData);
    }
    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error(`🛰️ [Network_Timeout] Telegram API unreachable within 15s: ${endpoint}`);
    } else {
      console.error(`🔥 [Network_Critical] Fetch failed: ${err.message}`);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 🛰️ TELEGRAM WEBHOOK HANDLER (Institutional v12.2.1)
 * Logic: Triple-Mode Handshake (Auth, Payment, Systems).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // 🛡️ Security: Immediate drop if token doesn't match env secret
    if (!botToken || token !== botToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 200 });
    }

    // Capture dynamic host for Mini App deep-linking
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const currentActiveUrl = `${protocol}://${host}`;

    const update = await request.json();

    /**
     * 🛡️ PROTOCOL A: PRE-CHECKOUT HANDSHAKE (Stars/Payments)
     */
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
     * 💰 PROTOCOL B: PAYMENT RESOLUTION
     * Logic: Verifies specific Payment ID from payload to prevent concurrency drift.
     */
    if (message.successful_payment) {
      const paymentInfo = message.successful_payment;
      const metadata = JSON.parse(paymentInfo.invoice_payload);
      
      const pendingPayment = await prisma.payment.findUnique({
        where: { id: metadata.paymentId }
      });

      if (pendingPayment && pendingPayment.status === "PENDING") {
        await completePayment(pendingPayment.id, paymentInfo.provider_payment_charge_id, paymentInfo);

        await telegramFetch("sendMessage", botToken, {
          chat_id: chatId,
          text: `✅ *Protocol Synchronized*\n\nTransaction: \`${paymentInfo.provider_payment_charge_id}\`\nYour access node is now active.`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🛰️ Launch Dashboard", web_app: { url: `${currentActiveUrl}/home` } }],
            ],
          },
        });
      }
      return NextResponse.json({ ok: true });
    }

    /**
     * 🔐 PROTOCOL C: PRIVILEGED TERMINAL ACCESS (Admin/Merchant Staff)
     * Logic: Generates a short-lived token for Dashboard entry.
     */
    if (text.startsWith("/start terminal_access")) {
      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(chatId) },
        include: { merchantProfile: true }
      });

      // Clearance check (Admins and Merchant Staff only)
      const isPrivileged = user && (user.role !== "USER" || user.merchantProfile);

      if (!isPrivileged) {
        await telegramFetch("sendMessage", botToken, {
          chat_id: chatId,
          text: "❌ *Clearance Required*\nYour identity node lacks terminal access rights.",
          parse_mode: "Markdown",
        });
        return NextResponse.json({ ok: true });
      }

      const loginToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10m TTL

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginToken: loginToken, tokenExpires },
      });

      const secureEntryUrl = `${currentActiveUrl}/dashboard/login?token=${loginToken}`;

      await telegramFetch("sendMessage", botToken, {
        chat_id: chatId,
        text: `🔐 *Clearance Verified*\n\nOperator: *${user.fullName || 'Unknown'}*\nAccess Level: *${user.role}*\n\n_Identity will be anchored to device SecureStorage._`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🚀 ENTER TERMINAL", url: secureEntryUrl }],
          ],
        },
      });
      return NextResponse.json({ ok: true });
    }

    /**
     * 🛰️ PROTOCOL D: SYSTEM INITIALIZATION (/start)
     */
    if (text === "/start") {
      await telegramFetch("sendMessage", botToken, {
        chat_id: chatId,
        text: `🚀 *Zipha Network Online*\n\nCluster identity synchronized.\nWelcome to the operational node.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🛰️ Open Mini App", web_app: { url: `${currentActiveUrl}/home` } }],
          ],
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("🔥 [Webhook_Critical_Failure]:", error.message);
    // Return 200 to prevent Telegram from retrying failed updates indefinitely
    return NextResponse.json({ ok: true });
  }
}