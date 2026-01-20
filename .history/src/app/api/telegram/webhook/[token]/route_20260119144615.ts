import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot";
import { webhookCallback, InlineKeyboard } from "grammy";
import {
  generateMagicToken,
  rotateSecurityStamp,
} from "@/lib/services/auth.service";
import { after } from "next/server";
import crypto from "crypto";
import {
  UserRole,
  PaymentStatus,
  SubscriptionStatus,
} from "@generated/prisma";
import { IntervalUnit } from "@/generated/prisma";

/**
 * 🚀 GLOBAL BIGINT SERIALIZATION PATCH
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: webhookToken } = await params;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  // 🛡️ SECURITY GATE: Early exit to stop unauthorized requests
  if (!botToken || webhookToken !== botToken) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await request.json();

    /**
     * 🏎️ NEXT.JS 15 "AFTER" PROTOCOL
     * We respond to Telegram instantly (200 OK) to stop the retry loop,
     * then execute heavy database/API logic in the background.
     */
    after(async () => {
      try {
        // --- 💳 1. PAYMENT RECONCILIATION ---
        if (body.pre_checkout_query) {
          await telegramBot.api.answerPreCheckoutQuery(
            body.pre_checkout_query.id,
            true
          );
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

        // 🛰️ STANDARD UPDATE DISPATCHER (GrammY)
        const handleUpdate = webhookCallback(telegramBot, "std/http");
        await handleUpdate(
          new Request(request.url, {
            method: "POST",
            headers: request.headers,
            body: JSON.stringify(body),
          })
        );
      } catch (innerError: any) {
        console.error("🔥 [Background_Process_Fault]:", innerError.message);
      }
    });

    // 🚀 RESPOND INSTANTLY
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("🔥 [Webhook_Ingress_Fault]:", error.message);
    return NextResponse.json({ ok: true });
  }
}

/**
 * 🚀 HANDLER: Identity Handshake
 */
async function handleIdentityHandshake(message: any) {
  const telegramId = BigInt(message.chat.id);
  const host = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  // 1. SYNC IDENTITY NODE
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
      role: UserRole.USER, // ✅ FIXED: UPPERCASE
      securityStamp: crypto.randomUUID(),
    },
    select: { role: true, id: true },
  });

  // 2. GENERATE DUAL MAGIC TOKENS
  const [homeToken, dashToken] = await Promise.all([
    generateMagicToken(telegramId.toString()),
    generateMagicToken(telegramId.toString()),
  ]);

  const homeWebLink = `${host}/api/auth/magic?token=${homeToken}&redirect=/home`;
  const dashWebLink = `${host}/api/auth/magic?token=${dashToken}&redirect=/dashboard`;

  const keyboard = new InlineKeyboard()
    .webApp("📱 HOME: MOBILE", `${host}/home`)
    .url("🌐 HOME: WEB", homeWebLink)
    .row()
    .webApp("📱 DASH: MOBILE", `${host}/dashboard`)
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

/**
 * 🛠️ HANDLER: Hardware Diagnostics
 */
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

/**
 * 🧹 HANDLER: Remote Wipe
 */
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

/**
 * 💳 HANDLER: Successful Payment Reconciliation
 * Logic: Atomic transaction to settle ledger and provision access.
 * Fix: Resolved IntervalUnit Enum comparison (TS2367).
 */
async function handleSuccessfulPayment(message: any) {
  const paymentData = message.successful_payment;
  const payload = JSON.parse(paymentData.invoice_payload);

  try {
    // 🛡️ ATOMIC TRANSACTION: Ensuring ledger and subscription are in sync
    await prisma.$transaction(async (tx) => {
      
      // 1. UPDATE LEDGER: Settle the pending payment node
      await tx.payment.updateMany({
        where: {
          userId: payload.userId,
          serviceTierId: payload.tierId,
          status: PaymentStatus.PENDING, // ✅ Strictly typed Enum
        },
        data: {
          status: PaymentStatus.SUCCESS, // ✅ Strictly typed Enum
          gatewayReference: paymentData.telegram_payment_charge_id,
        },
      });

      // 2. FETCH TIER METADATA: Determine subscription duration
      const tier = await tx.serviceTier.findUnique({
        where: { id: payload.tierId },
      });

      const expirationDate = new Date();
      
      // ✅ FIX: Using IntervalUnit Enum for comparison instead of raw string
      // Resolves: "types 'IntervalUnit | undefined' and '\"YEAR\"' have no overlap"
      const monthsToAdd = tier?.interval === IntervalUnit.YEAR ? 12 : 1;
      
      expirationDate.setMonth(expirationDate.getMonth() + monthsToAdd);

      // 3. PROVISION ACCESS: Upsert the active subscription node
      await tx.subscription.upsert({
        where: {
          userId_serviceId: {
            userId: payload.userId,
            serviceId: payload.serviceId,
          },
        },
        update: {
          status: SubscriptionStatus.ACTIVE,
          expiresAt: expirationDate,
          renewals: { increment: 1 },
          serviceTierId: payload.tierId, // Keep tier updated on renewal
        },
        create: {
          userId: payload.userId,
          serviceId: payload.serviceId,
          merchantId: payload.merchantId,
          serviceTierId: payload.tierId,
          status: SubscriptionStatus.ACTIVE, // ✅ Strictly typed Enum
          expiresAt: expirationDate,
        },
      });
    });

    // 🛰️ NOTIFY OPERATOR: Finalize the UI handshake
    await telegramBot.api.sendMessage(
      message.chat.id,
      "✅ <b>TRANSACTION VERIFIED</b>\n\nYour access node has been provisioned. You can now access the service terminal.",
      { parse_mode: "HTML" }
    );

  } catch (err: any) {
    console.error("🔥 [Payment_Reconciliation_Fault]:", err.message);
    
    // Optional: Notify user of internal reconciliation delay
    await telegramBot.api.sendMessage(
      message.chat.id,
      "⚠️ <b>LEDGER DELAY</b>\n\nPayment received but ledger synchronization is pending. Please contact support if access is not granted within 5 minutes.",
      { parse_mode: "HTML" }
    );
  }
}