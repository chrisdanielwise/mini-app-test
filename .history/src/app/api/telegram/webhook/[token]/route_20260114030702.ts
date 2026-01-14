import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot";
import { webhookCallback, InlineKeyboard } from "grammy";
import { AuthService } from "@/lib/services/auth.service";
import { AuditService } from "@/lib/services/audit.service";

/**
 * 🚀 GLOBAL BIGINT SERIALIZATION PATCH
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

/**
 * 🛰️ TELEGRAM WEBHOOK HANDLER (Institutional v14.44.0)
 * Logic: Handles Identity Handshakes, Remote Wipes, and Payment Reconciliation.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: webhookToken } = await params;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  // 🛡️ SECURITY GATE
  if (!botToken || webhookToken !== botToken) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await request.json();
    
    // --- 💳 1. PAYMENT RECONCILIATION INGRESS ---
    
    // A. Pre-Checkout Verification: Required to "Approve" the transaction before processing
    if (body.pre_checkout_query) {
      await telegramBot.api.answerPreCheckoutQuery(body.pre_checkout_query.id, true);
      return NextResponse.json({ ok: true });
    }

    // B. Successful Payment: Triggered after money moves
    if (body.message?.successful_payment) {
      return await handleSuccessfulPayment(body.message);
    }

    // --- 🛡️ 2. COMMAND INTERCEPTORS ---
    const text = body.message?.text || "";

    if (text.startsWith("/status")) {
      return await handleStatusCheck(body.message.chat.id);
    }

    if (text.startsWith("/start")) {
      return await handleIdentityHandshake(body.message);
    }

    // --- 🛡️ 3. CALLBACK INTERCEPTORS ---
    if (body.callback_query?.data === "trigger_remote_wipe") {
      return await handleRemoteWipe(body.callback_query);
    }

    // Pass everything else to grammY middleware
    const handleUpdate = webhookCallback(telegramBot, "std/http");
    return await handleUpdate(new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(body),
    }));

  } catch (error: any) {
    console.error("🔥 [Webhook_Fault]:", error.message);
    return NextResponse.json({ ok: true });
  }
}

/**
 * 💳 HANDLER: Successful Payment Reconciliation
 * Logic: Updates PENDING ledger nodes to SUCCESS and activates subscriptions.
 */
async function handleSuccessfulPayment(message: any) {
  const paymentData = message.successful_payment;
  const payload = JSON.parse(paymentData.invoice_payload);

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update Payment Record
      const payment = await tx.payment.updateMany({
        where: { 
          userId: payload.userId, 
          serviceTierId: payload.tierId, 
          status: "PENDING" 
        },
        data: { 
          status: "SUCCESS",
          gatewayReference: paymentData.telegram_payment_charge_id
        }
      });

      // 2. Activate/Extend Subscription
      // Fetch tier for duration logic
      const tier = await tx.serviceTier.findUnique({ where: { id: payload.tierId } });
      if (!tier) throw new Error("TIER_NOT_FOUND");

      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + (tier.intervalCount || 1));

      await tx.subscription.upsert({
        where: { userId_serviceId: { userId: payload.userId, serviceId: payload.serviceId } },
        update: { status: "ACTIVE", expiresAt: expirationDate, renewals: { increment: 1 } },
        create: {
          userId: payload.userId,
          serviceId: payload.serviceId,
          merchantId: payload.merchantId,
          serviceTierId: payload.tierId,
          status: "ACTIVE",
          expiresAt: expirationDate
        }
      });
    });

    await telegramBot.api.sendMessage(message.chat.id, 
      "✅ <b>TRANSACTION VERIFIED</b>\n\nYour subscription node is now ACTIVE. Access the service terminal to begin.",
      { parse_mode: "HTML" }
    );
  } catch (err) {
    console.error("🔥 [Payment_Sync_Error]:", err);
  }

  return NextResponse.json({ ok: true });
}

/**
 * 🚀 HANDLER: Identity Handshake
 */
async function handleIdentityHandshake(message: any) {
  const telegramId = BigInt(message.chat.id);
  const host = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  const user = await prisma.user.upsert({
    where: { telegramId },
    update: { fullName: message.from.first_name, username: message.from.username },
    create: { 
      telegramId, 
      fullName: message.from.first_name, 
      username: message.from.username,
      role: "USER" // Default to User; can be elevated manually or via Merchant Invite
    }
  });

  const loginToken = await AuthService.generateMagicToken(telegramId.toString());
  const magicLink = `${host}/api/auth/magic?token=${loginToken}`;

  const keyboard = new InlineKeyboard()
    .webApp("🛰️ ACCESS APP", `${host}/home`)
    .url("🔑 ONE-TAP LOGIN", magicLink)
    .row()
    .url("🌐 WEBSITE", `${host}/`);

  if (["SUPER_ADMIN", "MERCHANT"].includes(user.role)) {
    keyboard.row().text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");
  }

  await telegramBot.api.sendMessage(message.chat.id,
    `<b>🛰️ IDENTITY NODE SYNCED</b>\n\n` +
    `<b>Operator:</b> ${message.from.first_name}\n` +
    `<b>Role:</b> <code>${user.role}</code>\n\n` +
    `Access your terminal via the buttons below:`,
    { parse_mode: "HTML", reply_markup: keyboard }
  );

  return NextResponse.json({ ok: true });
}

/**
 * 🛠️ HANDLER: Hardware Diagnostics
 */
async function handleStatusCheck(chatId: number) {
  const startTime = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  const latency = Date.now() - startTime;

  await telegramBot.api.sendMessage(chatId, 
    `🖥️ <b>SYSTEM ARCHITECTURE STATUS</b>\n\n<b>Database:</b> 🟢 ONLINE\n<b>Latency:</b> ⚡ ${latency}ms`,
    { parse_mode: "HTML" }
  );
  return NextResponse.json({ ok: true });
}

/**
 * 🧹 HANDLER: Remote Wipe
 */
async function handleRemoteWipe(callback: any) {
  const telegramId = BigInt(callback.from.id);
  const user = await prisma.user.findUnique({ where: { telegramId } });
  
  if (user) {
    await AuthService.rotateSecurityStamp(user.id);
    await telegramBot.api.sendMessage(callback.from.id, "🔐 <b>SESSIONS VOIDED.</b> Node de-provisioned.");
  }

  await telegramBot.api.answerCallbackQuery(callback.id);
  return NextResponse.json({ ok: true });
}