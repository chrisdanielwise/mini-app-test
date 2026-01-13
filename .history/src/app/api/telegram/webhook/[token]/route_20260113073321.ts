import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { completePayment } from "@/lib/services/payment.service";
import { AuthService } from "@/lib/services/auth.service"; // 🚀 Integrated
import { JWT_CONFIG } from "@/lib/auth/config";

/**
 * 🛰️ TELEGRAM WEBHOOK HANDLER (Institutional v13.1.2)
 * Logic: Triple-Mode Handshake (Auth, Payment, System Lifecycle).
 * Security: Uses MagicToken table for browser entry to prevent session hijacking.
 */

/**
 * 🛡️ HARDENED TELEGRAM REQUEST WRAPPER
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token: webhookToken } = await params;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // 🛡️ 1. SECURITY CHECK
    if (!botToken || webhookToken !== botToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 200 });
    }

    // 🌐 2. DYNAMIC ORIGIN RESOLUTION
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const baseUrl = `${protocol}://${host}`.replace(/\/$/, "");

    const update = await request.json();

    /**
     * 🛡️ PROTOCOL A: PRE-CHECKOUT
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
              [{ text: "🛰️ Open Dashboard", web_app: { url: `${baseUrl}/home` } }],
            ],
          },
        });
      }
      return NextResponse.json({ ok: true });
    }

    /**
     * 🔐 PROTOCOL C: PRIVILEGED DEEP-LINK ACCESS
     * Logic: Upgraded to use MagicToken table for secure browser handshake.
     */
    if (text.startsWith("/start terminal_access")) {
      const telegramId = chatId.toString();

      const user = await prisma.user.findUnique({
        where: { telegramId },
        include: { merchantProfile: true }
      });

      // Clearance validation
      const userRole = user?.role.toLowerCase() || "";
      const isPrivileged = user && (
        JWT_CONFIG.staffRoles.includes(userRole) || !!user.merchantProfile
      );

      if (!isPrivileged) {
        await telegramFetch("sendMessage", botToken, {
          chat_id: chatId,
          text: "❌ *Clearance Required*\nYour current identity node lacks terminal access rights.",
          parse_mode: "Markdown",
        });
        return NextResponse.json({ ok: true });
      }

      // 🛡️ ATOMIC TOKEN GENERATION
      // This uses the new AuthService and writes to the MagicToken table
      const loginToken = await AuthService.generateMagicToken(telegramId);

      if (!loginToken) {
        console.error("❌ [Webhook_Auth] Failed to generate magic token for UID:", user.id);
        return NextResponse.json({ ok: true });
      }

      // 🚀 SECURE ENTRY URL
      // Points to the magic handshake route that sets the HttpOnly Cookie
      const secureEntryUrl = `${baseUrl}/api/auth/magic?token=${loginToken}`;

      await telegramFetch("sendMessage", botToken, {
        chat_id: chatId,
        text: `🔐 *Clearance Verified*\n\nOperator: *${user.firstName || 'Unknown'}*\nLevel: *${user.role}*\n\n_Browser link valid for 10 minutes._`,
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
        text: `🚀 *Zipha Network Online*\n\nIdentity node synchronized.\nLaunch the application to begin.`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🚀 Launch App", web_app: { url: `${baseUrl}/home` } }],
          ],
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("🔥 [Webhook_Critical_Failure]:", error.message);
    return NextResponse.json({ ok: true }); // Always 200 for Telegram
  }
}