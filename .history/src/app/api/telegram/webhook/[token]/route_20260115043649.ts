import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot";
import { webhookCallback, InlineKeyboard } from "grammy";
import {  generateMagicToken } from "@/lib/services/auth.service";

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

  if (!botToken || webhookToken !== botToken) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await request.json();
    
    // --- 💳 1. PAYMENT RECONCILIATION ---
    if (body.pre_checkout_query) {
      await telegramBot.api.answerPreCheckoutQuery(body.pre_checkout_query.id, true);
      return NextResponse.json({ ok: true });
    }
    if (body.message?.successful_payment) {
      return await handleSuccessfulPayment(body.message);
    }

    // --- 🛡️ 2. COMMAND INTERCEPTORS ---
    const text = body.message?.text || "";
    if (text.startsWith("/status")) return await handleStatusCheck(body.message.chat.id);
    if (text.startsWith("/start")) return await handleIdentityHandshake(body.message);

    // --- 🛡️ 3. CALLBACK INTERCEPTORS ---
    if (body.callback_query?.data === "trigger_remote_wipe") {
      return await handleRemoteWipe(body.callback_query);
    }

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
 * 🚀 HANDLER: Identity Handshake (v16.16.8)
 * Architecture: Dual-Node Ingress Strategy.
 * - Home Section: Mobile App & Web Browser URLs.
 * - Dashboard Section: Mobile App & Web Browser URLs.
 */
async function handleIdentityHandshake(message: any) {
  const telegramId = BigInt(message.chat.id);
  const host = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  // 1. SYNC IDENTITY NODE
  const user = await prisma.user.upsert({
    where: { telegramId },
    update: { fullName: message.from.first_name, username: message.from.username },
    create: { 
      telegramId, 
      fullName: message.from.first_name, 
      username: message.from.username,
      role: "USER"
    }
  });

  // 2. GENERATE DUAL MAGIC TOKENS
  // We generate separate tokens for the sections to prevent one-time-use conflicts
  const homeToken = await generateMagicToken(telegramId.toString());
  const dashToken = await generateMagicToken(telegramId.toString());

  const homeWebLink = `${host}/api/auth/magic?token=${homeToken}&redirect=/home`;
  const dashWebLink = `${host}/api/auth/magic?token=${dashToken}&redirect=/dashboard`;

  // 3. CONSTRUCT TACTICAL DUAL KEYBOARD
  const keyboard = new InlineKeyboard()
    // --- SECTION 1: HOME TERMINAL ---
    .webApp("📱 HOME: MOBILE", `${host}/home`) // WebApp for native feel
    .url("🌐 HOME: WEB", homeWebLink) // Direct Magic URL for browser
    .row()
    // --- SECTION 2: MERCHANT DASHBOARD ---
    .webApp("📱 DASH: MOBILE", `${host}/dashboard`)
    .url("🌐 DASH: WEB", dashWebLink)
    .row()
    .webApp("🌎 VISIT WEBSITE", `${host}/`);

  if (["SUPER_ADMIN", "MERCHANT"].includes(user.role)) {
    keyboard.row().text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");
  }

  await telegramBot.api.sendMessage(message.chat.id,
    `<b>🛰️ ZIPHA IDENTITY GATEWAY</b>\n\n` +
    `<b>Operator:</b> ${message.from.first_name}\n` +
    `<b>Clearance:</b> <code>${user.role}</code>\n\n` +
    `Select a <b>Mobile</b> node for native app ingress or <b>Web</b> for external browser synchronization.`,
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
    `🖥️ <b>SYSTEM STATUS</b>\n\n<b>Database:</b> 🟢 ONLINE\n<b>Latency:</b> ⚡ ${latency}ms`,
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
    await rotateSecurityStamp(user.id);
    await telegramBot.api.sendMessage(callback.from.id, "🔐 <b>SESSIONS VOIDED.</b>");
  }

  await telegramBot.api.answerCallbackQuery(callback.id);
  return NextResponse.json({ ok: true });
}

/**
 * 💳 HANDLER: Successful Payment Reconciliation
 */
async function handleSuccessfulPayment(message: any) {
  const paymentData = message.successful_payment;
  const payload = JSON.parse(paymentData.invoice_payload);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: { userId: payload.userId, serviceTierId: payload.tierId, status: "PENDING" },
        data: { status: "SUCCESS", gatewayReference: paymentData.telegram_payment_charge_id }
      });

      const tier = await tx.serviceTier.findUnique({ where: { id: payload.tierId } });
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + (tier?.intervalCount || 1));

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

    await telegramBot.api.sendMessage(message.chat.id, "✅ <b>TRANSACTION VERIFIED</b>");
  } catch (err) { console.error(err); }
  return NextResponse.json({ ok: true });
}