import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "node:crypto";
import { completePayment } from "@/lib/services/payment.service";
import { JWT_CONFIG } from "@/lib/auth/config"; // 🚀 New: Centralized Config

/**
 * 🛡️ HARDENED TELEGRAM REQUEST WRAPPER
 * Architecture: AbortController-driven timeouts for serverless resilience.
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
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`🔥 [Telegram_API_Error] ${endpoint}:`, errorData);
    }
    return response;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error(`🛰️ [Network_Timeout] Telegram API unreachable: ${endpoint}`);
    } else {
      console.error(`🔥 [Network_Critical] Fetch failed: ${err.message}`);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 🛰️ TELEGRAM WEBHOOK HANDLER (Institutional v12.4.0)
 * Logic: Triple-Mode Handshake (Auth, Payment, System Lifecycle).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // 🛡️ Security Check: Prevent unauthorized webhook spoofing
    if (!botToken || token !== botToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 200 });
    }

    // Resolve Origin for Deep-Links and WebApp launches
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const currentActiveUrl = `${protocol}://${host}`;

    const update = await request.json();

    /**
     * 🛡️ PROTOCOL A: PRE-CHECKOUT (Stars & Payments)
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
     * 💰 PROTOCOL B: SUCCESSFUL PAYMENT RESOLUTION
     * Hardened: Verifies metadata.paymentId to prevent transaction ghosting.
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
          text: `✅ *Protocol Synchronized*\n\nTX: \`${paymentInfo.provider_payment_charge_id}\`\nYour access node is now fully active.`,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🛰️ Open Dashboard", web_app: { url: `${currentActiveUrl}/home` } }],
            ],
          },
        });
      }
      return NextResponse.json({ ok: true });
    }

    /**
     * 🔐 PROTOCOL C: PRIVILEGED DEEP-LINK ACCESS
     * Logic: Generates a short-lived OTT (One-Time Token) for secure entry.
     */
    if (text.startsWith("/start terminal_access")) {
      const user = await prisma.user.findUnique({
        where: { telegramId: BigInt(chatId) },
        include: { merchantProfile: true }
      });

      // Clearance validation based on central staff roles
      const userRole = user?.role.toLowerCase() || "";
      const isPrivileged = user && (
        JWT_CONFIG.staffRoles.includes(userRole) || user.merchantProfile
      );

      if (!isPrivileged) {
        await telegramFetch("sendMessage", botToken, {
          chat_id: chatId,
          text: "❌ *Clearance Required*\nYour current identity node lacks terminal access rights.",
          parse_mode: "Markdown",
        });
        return NextResponse.json({ ok: true });
      }

      // Generate secure entry node
      const loginToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 Min Window

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginToken: loginToken, tokenExpires },
      });

      // 🛰️ BUILD ENTRY URL: Now uses centralized endpoints from config
      const secureEntryUrl = `${currentActiveUrl}/dashboard/login?token=${loginToken}`;

      await telegramFetch("sendMessage", botToken, {
        chat_id: chatId,
        text: `🔐 *Clearance Verified*\n\nOperator: *${user.fullName || 'Unknown'}*\nLevel: *${user.role}*\n\n_System will anchor session to device SecureStorage._`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🚀 ACCESS TERMINAL", url: secureEntryUrl }],
          ],
        },
      });
      return NextResponse.json({ ok: true });
    }

    /**
     * 🛰️ PROTOCOL D: SYSTEM WAKE-UP
     */
    if (text === "/start") {
      await telegramFetch("sendMessage", botToken, {
        chat_id: chatId,
        text: `🚀 *Zipha Network Online*\n\nIdentity node synchronized with cluster.\nLaunch the Mini App to begin operations.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🛰️ Launch Mini App", web_app: { url: `${currentActiveUrl}/home` } }],
          ],
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("🔥 [Webhook_Critical_Failure]:", error.message);
    // Always return 200 to Telegram to prevent update delivery loops
    return NextResponse.json({ ok: true });
  }
}