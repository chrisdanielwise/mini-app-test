import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot"; // Your Bot instance
import { InlineKeyboard } from "grammy";
import {
  generateMagicToken,
  rotateSecurityStamp,
} from "@/lib/services/auth.service";
import { after } from "next/server";
import crypto from "crypto";
import {
  UserRole,
  IntervalUnit,
  PaymentStatus,
  SubscriptionStatus,
} from "@/generated/prisma";

export const maxDuration = 60; 
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 🛰️ GLOBAL BIGINT SERIALIZATION PATCH
 */
if (!(BigInt.prototype as any).toJSON) {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

export async function POST(request: Request) {
  try {
    // 🛡️ SECURITY HANDSHAKE
    const secretToken = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    
    if (secretToken !== process.env.BOT_SECRET_TOKEN) {
      return NextResponse.json({ ok: true }); 
    }

    const body = await request.json();

    /**
     * 🏎️ LAMINAR_FLOW (Background Execution)
     * Next.js 15 'after' ensures the user gets a 200 OK immediately.
     */
    after(async () => {
      try {
        // --- 💳 1. PAYMENT RECONCILIATION ---
        if (body.pre_checkout_query) {
          await telegramBot.api.answerPreCheckoutQuery(body.pre_checkout_query.id, true);
          return;
        }

        if (body.message?.successful_payment) {
          await handleSuccessfulPayment(body.message);
          return;
        }

        // --- 🛡️ 2. COMMAND INTERCEPTORS ---
        const text = body.message?.text || "";
        const chatId = body.message?.chat?.id;

        if (text.startsWith("/status")) {
          await handleStatusCheck(chatId);
          return;
        }

        if (text.startsWith("/start")) {
          await handleIdentityHandshake(body.message);
          return;
        }

        // --- 🛡️ 3. CALLBACK INTERCEPTORS ---
        if (body.callback_query?.data === "trigger_remote_wipe") {
          await handleRemoteWipe(body.callback_query);
          return;
        }

        // 🛰️ DISPATCH TO GENERAL MIDDLEWARE
        // This handles all other messages not caught above
        await telegramBot.handleUpdate(body);

      } catch (innerError: any) {
        console.error("🔥 [Background_Process_Fault]:", innerError.message);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("🔥 [Webhook_Ingress_Fault]:", error.message);
    return NextResponse.json({ ok: true });
  }
}

// --- 🏗️ LOGIC HANDLERS ---

async function handleIdentityHandshake(message: any) {
  const telegramId = BigInt(message.chat.id);
  const host = (process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "").replace(/\/$/, "");
  const cleanHost = host.startsWith('http') ? host : `https://${host}`;

  const user = await prisma.user.upsert({
    where: { telegramId },
    update: {
      firstName: message.from.first_name,
      username: message.from.username,
      lastLoginAt: new Date(),
    },
    create: {
      telegramId,
      firstName: message.from.first_name,
      username: message.from.username,
      role: UserRole.USER,
      securityStamp: crypto.randomUUID(),
    },
    select: { role: true, id: true },
  });

  const [homeToken, dashToken] = await Promise.all([
    generateMagicToken(telegramId.toString()),
    generateMagicToken(telegramId.toString()),
  ]);

  const homeWebLink = `${cleanHost}/api/auth/magic?token=${homeToken}&redirect=/home`;
  const dashWebLink = `${cleanHost}/api/auth/magic?token=${dashToken}&redirect=/dashboard`;

  const keyboard = new InlineKeyboard()
    .webApp("📱 HOME: MOBILE", `${cleanHost}/home`)
    .url("🌐 HOME: WEB", homeWebLink)
    .row()
    .webApp("📱 DASH: MOBILE", `${cleanHost}/dashboard`)
    .url("🌐 DASH: WEB", dashWebLink);

  if (["SUPER_ADMIN", "MERCHANT"].includes(user.role)) {
    keyboard.row().text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");
  }

  await telegramBot.api.sendMessage(
    message.chat.id,
    `<b>🛰️ ZIPHA IDENTITY GATEWAY</b>\n\n` +
      `<b>Clearance:</b> <code>${user.role}</code>\n\n` +
      `Select a <b>Mobile</b> node for native ingress or <b>Web</b> for browser sync.`,
    { parse_mode: "HTML", reply_markup: keyboard }
  );
}

async function handleStatusCheck(chatId: number) {
  const startTime = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  const latency = Date.now() - startTime;

  await telegramBot.api.sendMessage(
    chatId,
    `🖥️ <b>SYSTEM STATUS</b>\n\n<b>Database:</b> 🟢 ONLINE\n<b>Latency:</b> ⚡ ${latency}ms`,
    { parse_mode: "HTML" }
  );
}

async function handleRemoteWipe(callback: any) {
  const telegramId = BigInt(callback.from.id);
  const user = await prisma.user.findUnique({
    where: { telegramId },
    select: { id: true },
  });

  if (user) {
    await rotateSecurityStamp(user.id);
    await telegramBot.api.sendMessage(
      callback.from.id,
      "🔐 <b>SESSIONS VOIDED.</b>",
      { parse_mode: "HTML" }
    );
  }
  await telegramBot.api.answerCallbackQuery(callback.id);
}

async function handleSuccessfulPayment(message: any) {
  const paymentData = message.successful_payment;
  const payload = JSON.parse(paymentData.invoice_payload);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: {
          userId: payload.userId,
          serviceTierId: payload.tierId,
          status: PaymentStatus.PENDING,
        },
        data: {
          status: PaymentStatus.SUCCESS,
          gatewayReference: paymentData.telegram_payment_charge_id,
        },
      });

      const tier = await tx.serviceTier.findUnique({
        where: { id: payload.tierId },
      });

      const expirationDate = new Date();
      const monthsToAdd = tier?.interval === IntervalUnit.YEAR ? 12 : 1;
      expirationDate.setMonth(expirationDate.getMonth() + monthsToAdd);

      await tx.subscription.upsert({
        where: {
          userId_serviceId: { userId: payload.userId, serviceId: payload.serviceId },
        },
        update: {
          status: SubscriptionStatus.ACTIVE,
          expiresAt: expirationDate,
          renewals: { increment: 1 },
          serviceTierId: payload.tierId,
        },
        create: {
          userId: payload.userId,
          serviceId: payload.serviceId,
          merchantId: payload.merchantId,
          serviceTierId: payload.tierId,
          status: SubscriptionStatus.ACTIVE,
          expiresAt: expirationDate,
        },
      });
    });

    await telegramBot.api.sendMessage(
      message.chat.id,
      "✅ <b>TRANSACTION VERIFIED</b>",
      { parse_mode: "HTML" }
    );
  } catch (err: any) {
    console.error("🔥 [Payment_Reconciliation_Fault]:", err.message);
  }
}