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
 * 🛰️ TELEGRAM WEBHOOK HANDLER (Institutional v14.11.0)
 * Features: Multi-Environment Ingress, Integrated Remote Wipe, & Landing Page Link.
 */
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
    
    // 🛡️ COMMAND INTERCEPTORS
    if (body.message?.text?.startsWith("/status")) {
      return await handleStatusCheck(body.message.chat.id);
    }

    if (body.message?.text?.startsWith("/start")) {
      return await handleIdentityHandshake(body.message);
    }

    // 🛡️ CALLBACK INTERCEPTORS
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
 * 🛠️ HANDLER: Hardware Diagnostics
 */
async function handleStatusCheck(chatId: number) {
  const startTime = Date.now();
  const dbStatus = await prisma.$queryRaw`SELECT 1`.then(() => "ONLINE").catch(() => "OFFLINE");
  const latency = Date.now() - startTime;

  await telegramBot.api.sendMessage(chatId, 
    `🖥️ <b>SYSTEM ARCHITECTURE STATUS</b>\n\n` +
    `<b>Database:</b> ${dbStatus === "ONLINE" ? "🟢" : "🔴"} ${dbStatus}\n` +
    `<b>Latency:</b> ⚡ ${latency}ms\n` +
    `<b>Handshake Node:</b> ✅ ACTIVE`,
    { parse_mode: "HTML" }
  );
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
      role: "MERCHANT" 
    },
    include: { merchantProfile: true }
  });

  const isPrivileged = ["SUPER_ADMIN", "MERCHANT"].includes(user.role);

  if (isPrivileged) {
    const loginToken = await AuthService.generateMagicToken(telegramId.toString());
    const magicLink = `${host}/api/auth/magic?token=${loginToken}`;

    // 🏛️ ADMIN DEPLOYMENT KEYBOARD
    const keyboard = new InlineKeyboard()
      .webApp("🛰️ MOBILE DASHBOARD", `${host}/dashboard/login`)
      .url("🔑 WEB TERMINAL", magicLink)
      .row()
      .url("🌐 LANDING PAGE", `${host}/`) // ✅ New: Institutional Landing Ingress
      .row()
      .text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");

    await telegramBot.api.sendMessage(message.chat.id,
      `<b>🛰️ PRIVILEGED ACCESS ENABLED</b>\n\n` +
      `<b>Operator:</b> ${message.from.first_name}\n` +
      `<b>Clearance:</b> <code>${user.role}</code>\n\n` +
      `<i>Identity node synchronized. Access deployment nodes:</i>`,
      { parse_mode: "HTML", reply_markup: keyboard }
    );
  } else {
    // STANDARD USER INGRESS
    const keyboard = new InlineKeyboard()
      .webApp("🚀 LAUNCH APP", `${host}/home`)
      .url("🌐 WEBSITE", `${host}/`);

    await telegramBot.api.sendMessage(message.chat.id, 
      `<b>🚀 ZIPHA NETWORK ONLINE</b>\n\nWelcome. Your node is synchronized.`,
      { parse_mode: "HTML", reply_markup: keyboard }
    );
  }

  return NextResponse.json({ ok: true });
}

/**
 * 🧹 HANDLER: Remote Wipe
 */
async function handleRemoteWipe(callback: any) {
  const telegramId = BigInt(callback.from.id);

  try {
    const user = await prisma.user.findUnique({ where: { telegramId } });
    if (!user) throw new Error("UNRESOLVED_NODE");

    // 🚀 ROTATE SECURITY STAMP (The Kill Switch)
    await AuthService.rotateSecurityStamp(user.id);

    await AuditService.log({
      userId: user.id,
      action: "REMOTE_WIPE",
      metadata: { method: "TELEGRAM_UI", platform: "BOT_V14" }
    });

    await telegramBot.api.answerCallbackQuery(callback.id, {
      text: "🛡️ IDENTITY ANCHOR ROTATED: ALL SESSIONS VOIDED.",
      show_alert: true
    });

    await telegramBot.api.sendMessage(callback.from.id,
      `🔐 <b>REMOTE DE-PROVISIONING COMPLETE</b>\n\n` +
      `All active sessions have been terminated. Browser cookies and identity anchors are now void.\n\n` +
      `<i>Use /start to re-authorize this node.</i>`,
      { parse_mode: "HTML" }
    );
  } catch (err) {
    await telegramBot.api.answerCallbackQuery(callback.id, { text: "Protocol Fault." });
  }

  return NextResponse.json({ ok: true });
}