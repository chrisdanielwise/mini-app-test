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
 * 🚀 HANDLER: Identity Handshake (v14.45.0)
 * Logic: Generates Magic Link with the requested redirect target.
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
      role: "USER"
    }
  });

  const loginToken = await AuthService.generateMagicToken(telegramId.toString());
  
  // 🚀 ALIGNMENT: Add &redirect=/ to ensure the "One-Tab" callback works
  // If they are a Merchant, our API logic will still push them to /dashboard 
  // unless we explicitly want them to stay on root.
  const magicLink = `${host}/api/auth/magic?token=${loginToken}&redirect=/`;

  const keyboard = new InlineKeyboard()
    // Open the Mini App directly (session-less or existing session)
    .webApp("🛰️ ACCESS APP", `${host}/home`)
    // 🔑 THE HANDSHAKE: Opens in browser, sets cookie, signals Tab A, closes.
    .url("🔑 ONE-TAP LOGIN", magicLink) 
    .row()
    .url("🌐 WEBSITE", `${host}/`);

  // 🛡️ ROLE-BASED EMERGENCY TOOLS
  if (["SUPER_ADMIN", "MERCHANT"].includes(user.role)) {
    keyboard.row().callback("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");
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

// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import { telegramBot } from "@/lib/telegram/bot";
// import { webhookCallback, InlineKeyboard } from "grammy";
// import { AuthService } from "@/lib/services/auth.service";
// import { AuditService } from "@/lib/services/audit.service";

// (BigInt.prototype as any).toJSON = function () {
//   return this.toString();
// };

// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ token: string }> }
// ) {
//   const { token: webhookToken } = await params;
//   const botToken = process.env.TELEGRAM_BOT_TOKEN;

//   if (!botToken || webhookToken !== botToken) {
//     return NextResponse.json({ ok: true });
//   }

//   try {
//     const body = await request.json();
    
//     // --- 💳 1. PAYMENT RECONCILIATION ---
//     if (body.pre_checkout_query) {
//       await telegramBot.api.answerPreCheckoutQuery(body.pre_checkout_query.id, true);
//       return NextResponse.json({ ok: true });
//     }
//     if (body.message?.successful_payment) {
//       return await handleSuccessfulPayment(body.message);
//     }

//     // --- 🛡️ 2. COMMAND INTERCEPTORS ---
//     const text = body.message?.text || "";
//     if (text.startsWith("/status")) return await handleStatusCheck(body.message.chat.id);
//     if (text.startsWith("/start")) return await handleIdentityHandshake(body.message);

//     // --- 🛡️ 3. CALLBACK INTERCEPTORS (GHOST LINK & WIPE) ---
//     if (body.callback_query) {
//       const data = body.callback_query.data;
      
//       // 🚀 GHOST LINK: Generates and pushes Magic Link without showing URL in chat
//       if (data === "request_magic_link") {
//         return await handleGhostLinkRequest(body.callback_query);
//       }
      
//       // 🚨 REMOTE WIPE: Trigger global session revocation
//       if (data === "trigger_remote_wipe") {
//         return await handleRemoteWipe(body.callback_query);
//       }
//     }

//     const handleUpdate = webhookCallback(telegramBot, "std/http");
//     return await handleUpdate(new Request(request.url, {
//       method: 'POST',
//       headers: request.headers,
//       body: JSON.stringify(body),
//     }));

//   } catch (error: any) {
//     console.error("🔥 [Webhook_Fault]:", error.message);
//     return NextResponse.json({ ok: true });
//   }
// }

// /**
//  * 🚀 HANDLER: Identity Handshake
//  * Logic: Provides a clean UI. The login URL is hidden behind a callback.
//  */
// async function handleIdentityHandshake(message: any) {
//   const telegramId = BigInt(message.chat.id);
//   const host = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

//   const user = await prisma.user.upsert({
//     where: { telegramId },
//     update: { fullName: message.from.first_name, username: message.from.username },
//     create: { telegramId, fullName: message.from.first_name, username: message.from.username, role: "USER" }
//   });

//   const keyboard = new InlineKeyboard()
//     .webApp("🛰️ ACCESS APP", `${host}/home`)
//     // 🔑 Ghost Link trigger
//     .text("🔑 SECURE LOGIN", "request_magic_link") 
//     .row()
//     .url("🌐 WEBSITE", `${host}/`);

//   if (["SUPER_ADMIN", "MERCHANT"].includes(user.role)) {
//     keyboard.row().text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");
//   }

//   await telegramBot.api.sendMessage(message.chat.id,
//     `<b>🛰️ IDENTITY NODE SYNCED</b>\n\n` +
//     `<b>Operator:</b> ${message.from.first_name}\n` +
//     `<b>Role:</b> <code>${user.role}</code>\n\n` +
//     `Identity verified. Click below to anchor your browser session.`,
//     { parse_mode: "HTML", reply_markup: keyboard }
//   );

//   return NextResponse.json({ ok: true });
// }

// /**
//  * 👻 HANDLER: Ghost Link Generation (v15.0.1)
//  * Optimized for Cloudflare Tunnels and Strict Telegram API Validation.
//  */
// async function handleGhostLinkRequest(callback: any) {
//   const telegramId = callback.from.id.toString();
  
//   // 1. CLEAN HOST RESOLUTION
//   const rawHost = process.env.NEXT_PUBLIC_APP_URL || "";
//   const host = rawHost.replace(/\/$/, ""); // Remove any trailing slashes

//   try {
//     // 2. TOKEN GENERATION
//     const loginToken = await AuthService.generateMagicToken(telegramId);
    
//     /**
//      * 🚀 THE FIX: URI ENCODING
//      * We must encode the token and the redirect path. 
//      * 'redirect=/' becomes 'redirect=%2F' which Telegram accepts much better.
//      */
//     const params = new URLSearchParams({
//       token: loginToken,
//       redirect: "/"
//     });

//     const magicLink = `${host}/api/auth/magic?${params.toString()}`;

//     console.log(`🛰️ [Ghost_Link]: Dispatching validated URL: ${magicLink}`);

//     // 3. ATTEMPT PUSH
//     await telegramBot.api.answerCallbackQuery(callback.id, {
//       url: magicLink,
//     });

//   } catch (err: any) {
//     console.error("🔥 [Ghost_Link_Critical]:", err.message);
    
//     // 🛡️ FALLBACK: If answerCallbackQuery (url) fails, send a clickable message instead.
//     // This ensures the user is NEVER stuck on a "Handshake Failed" screen.
//     const loginTokenFallback = await AuthService.generateMagicToken(telegramId);
//     const fallbackLink = `${host}/api/auth/magic?token=${loginTokenFallback}&redirect=/`;

//     await telegramBot.api.answerCallbackQuery(callback.id, {
//       text: "🔐 Security Redirect Protocol Engaged.",
//       show_alert: false
//     });

//     await telegramBot.api.sendMessage(callback.from.id, 
//       "<b>⚠️ SECURE REDIRECT</b>\n\nYour browser prevented an automatic handshake. Please use the manual entry node below:",
//       { 
//         parse_mode: "HTML",
//         reply_markup: new InlineKeyboard().url("🔑 MANUAL LOGIN", fallbackLink)
//       }
//     );
//   }

//   return NextResponse.json({ ok: true });
// }
// /**
//  * 🧹 HANDLER: Remote Wipe
//  */
// async function handleRemoteWipe(callback: any) {
//   const telegramId = BigInt(callback.from.id);
//   const user = await prisma.user.findUnique({ where: { telegramId } });
  
//   if (user) {
//     // 1. Rotate DB Stamp
//     await AuthService.rotateSecurityStamp(user.id);
    
//     // 2. Log the Wipe
//     await AuditService.log({
//       userId: user.id,
//       action: "REMOTE_WIPE",
//       ip: "TELEGRAM_GATEWAY",
//       metadata: { method: "BOT_CALLBACK_REVOCATION" }
//     });

//     await telegramBot.api.sendMessage(callback.from.id, "🔐 <b>GLOBAL REVOCATION COMPLETE.</b> All active nodes have been voided.");
//   }

//   await telegramBot.api.answerCallbackQuery(callback.id);
//   return NextResponse.json({ ok: true });
// }

// /**
//  * 💳 HANDLER: Successful Payment Reconciliation
//  */
// async function handleSuccessfulPayment(message: any) {
//   const paymentData = message.successful_payment;
//   const payload = JSON.parse(paymentData.invoice_payload);

//   try {
//     await prisma.$transaction(async (tx) => {
//       await tx.payment.updateMany({
//         where: { userId: payload.userId, serviceTierId: payload.tierId, status: "PENDING" },
//         data: { status: "SUCCESS", gatewayReference: paymentData.telegram_payment_charge_id }
//       });

//       const tier = await tx.serviceTier.findUnique({ where: { id: payload.tierId } });
//       const expirationDate = new Date();
//       expirationDate.setMonth(expirationDate.getMonth() + (tier?.intervalCount || 1));

//       await tx.subscription.upsert({
//         where: { userId_serviceId: { userId: payload.userId, serviceId: payload.serviceId } },
//         update: { status: "ACTIVE", expiresAt: expirationDate, renewals: { increment: 1 } },
//         create: {
//           userId: payload.userId,
//           serviceId: payload.serviceId,
//           merchantId: payload.merchantId,
//           serviceTierId: payload.tierId,
//           status: "ACTIVE",
//           expiresAt: expirationDate
//         }
//       });
//     });

//     await telegramBot.api.sendMessage(message.chat.id, "✅ <b>TRANSACTION VERIFIED</b>");
//   } catch (err) { console.error(err); }
//   return NextResponse.json({ ok: true });
// }

// /**
//  * 🛠️ HANDLER: Hardware Diagnostics
//  */
// async function handleStatusCheck(chatId: number) {
//   const startTime = Date.now();
//   await prisma.$queryRaw`SELECT 1`;
//   const latency = Date.now() - startTime;

//   await telegramBot.api.sendMessage(chatId, 
//     `🖥️ <b>SYSTEM STATUS</b>\n\n<b>Database:</b> 🟢 ONLINE\n<b>Latency:</b> ⚡ ${latency}ms`,
//     { parse_mode: "HTML" }
//   );
//   return NextResponse.json({ ok: true });
// }