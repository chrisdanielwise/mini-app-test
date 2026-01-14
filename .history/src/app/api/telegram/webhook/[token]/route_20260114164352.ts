// import { NextResponse } from "next/server";
// import prisma from "@/lib/db";
// import { telegramBot } from "@/lib/telegram/bot";
// import { webhookCallback, InlineKeyboard } from "grammy";
// import { AuthService } from "@/lib/services/auth.service";
// import { AuditService } from "@/lib/services/audit.service";

// /**
//  * 🚀 GLOBAL BIGINT SERIALIZATION PATCH
//  */
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

//     // --- 🛡️ 3. CALLBACK INTERCEPTORS ---
//     if (body.callback_query?.data === "trigger_remote_wipe") {
//       return await handleRemoteWipe(body.callback_query);
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
//  * 🚀 HANDLER: Identity Handshake (v16.5.0)
//  * Architecture: WebApp-First Mobile Strategy.
//  * - Website & App: Forced into Telegram WebApp.
//  * - Desktop Dashboard: Standard Browser URL.
//  */
// async function handleIdentityHandshake(message: any) {
//   const telegramId = BigInt(message.chat.id);
//   const host = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

//   const user = await prisma.user.upsert({
//     where: { telegramId },
//     update: { fullName: message.from.first_name, username: message.from.username },
//     create: { 
//       telegramId, 
//       fullName: message.from.first_name, 
//       username: message.from.username,
//       role: "USER"
//     }
//   });

//   // 🔑 GENERATE SESSION TOKEN
//   const loginToken = await AuthService.generateMagicToken(telegramId.toString());
  
//   /**
//    * 🏗️ ROUTING NODES
//    * 1. WebApp Dashboard: Dashboard view optimized for the mobile container.
//    * 2. Desktop Login: Standard browser entry for high-density displays.
//    * 3. Website: Public content forced into WebApp view.
//    */
//   const dashboardMagicLink = `${host}/api/auth/magic?token=${loginToken}&redirect=/dashboard`;

//   const keyboard = new InlineKeyboard()
//     // 📱 MOBILE WEBAPP NODES (Forced internal view)
//     .webApp("🌐 WEBSITE", `${host}/`)
//     .webApp("🛰️ ACCESS APP", `${host}/home`)
//     .webApp("🛰️ MOBILE DASHBOARD", dashboardMagicLink)
//     .row()
//     // 💻 DESKTOP/BROWSER NODE (Opens in external browser)
//     .url("🖥️ DESKTOP TERMINAL", dashboardMagicLink);

//   if (["SUPER_ADMIN", "MERCHANT"].includes(user.role)) {
//     keyboard.row().text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");
//   }

//   await telegramBot.api.sendMessage(message.chat.id,
//     `<b>🛰️ IDENTITY NODE SYNCED</b>\n\n` +
//     `<b>Operator:</b> ${message.from.first_name}\n` +
//     `<b>Role:</b> <code>${user.role}</code>\n\n` +
//     `Access your node below. Use <b>Mobile Dashboard</b> for native interaction or <b>Desktop Terminal</b> for administrative auditing.`,
//     { parse_mode: "HTML", reply_markup: keyboard }
//   );

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

// /**
//  * 🧹 HANDLER: Remote Wipe
//  */
// async function handleRemoteWipe(callback: any) {
//   const telegramId = BigInt(callback.from.id);
//   const user = await prisma.user.findUnique({ where: { telegramId } });
  
//   if (user) {
//     await AuthService.rotateSecurityStamp(user.id);
//     await telegramBot.api.sendMessage(callback.from.id, "🔐 <b>SESSIONS VOIDED.</b>");
//   }

//   await telegramBot.api.answerCallbackQuery(callback.id);
//   return NextResponse.json({ ok: true });
// }

// /**
//  * 💳 HANDLER: Successful Payment Reconciliation
//  * Logic: Updates PENDING ledger nodes to SUCCESS and activates subscriptions.
//  */
// async function handleSuccessfulPayment(message: any) {
//   const paymentData = message.successful_payment;
//   const payload = JSON.parse(paymentData.invoice_payload);

//   try {
//     await prisma.$transaction(async (tx) => {
//       // 1. Update Payment Record
//       const payment = await tx.payment.updateMany({
//         where: { 
//           userId: payload.userId, 
//           serviceTierId: payload.tierId, 
//           status: "PENDING" 
//         },
//         data: { 
//           status: "SUCCESS",
//           gatewayReference: paymentData.telegram_payment_charge_id
//         }
//       });

//       // 2. Activate/Extend Subscription
//       // Fetch tier for duration logic
//       const tier = await tx.serviceTier.findUnique({ where: { id: payload.tierId } });
//       if (!tier) throw new Error("TIER_NOT_FOUND");

//       const expirationDate = new Date();
//       expirationDate.setMonth(expirationDate.getMonth() + (tier.intervalCount || 1));

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

//     await telegramBot.api.sendMessage(message.chat.id, 
//       "✅ <b>TRANSACTION VERIFIED</b>\n\nYour subscription node is now ACTIVE. Access the service terminal to begin.",
//       { parse_mode: "HTML" }
//     );
//   } catch (err) {
//     console.error("🔥 [Payment_Sync_Error]:", err);
//   }

//   return NextResponse.json({ ok: true });
// }


// // import { NextResponse } from "next/server";
// // import prisma from "@/lib/db";
// // import { telegramBot } from "@/lib/telegram/bot";
// // import { webhookCallback, InlineKeyboard } from "grammy";
// // import { AuthService } from "@/lib/services/auth.service";
// // import { AuditService } from "@/lib/services/audit.service";

// // (BigInt.prototype as any).toJSON = function () {
// //   return this.toString();
// // };

// // export async function POST(
// //   request: Request,
// //   { params }: { params: Promise<{ token: string }> }
// // ) {
// //   const { token: webhookToken } = await params;
// //   const botToken = process.env.TELEGRAM_BOT_TOKEN;

// //   if (!botToken || webhookToken !== botToken) {
// //     return NextResponse.json({ ok: true });
// //   }

// //   try {
// //     const body = await request.json();
    
// //     // --- 💳 1. PAYMENT RECONCILIATION ---
// //     if (body.pre_checkout_query) {
// //       await telegramBot.api.answerPreCheckoutQuery(body.pre_checkout_query.id, true);
// //       return NextResponse.json({ ok: true });
// //     }
// //     if (body.message?.successful_payment) {
// //       return await handleSuccessfulPayment(body.message);
// //     }

// //     // --- 🛡️ 2. COMMAND INTERCEPTORS ---
// //     const text = body.message?.text || "";
// //     if (text.startsWith("/status")) return await handleStatusCheck(body.message.chat.id);
// //     if (text.startsWith("/start")) return await handleIdentityHandshake(body.message);

// //     // --- 🛡️ 3. CALLBACK INTERCEPTORS (GHOST LINK & WIPE) ---
// //     if (body.callback_query) {
// //       const data = body.callback_query.data;
      
// //       // 🚀 GHOST LINK: Generates and pushes Magic Link without showing URL in chat
// //       if (data === "request_magic_link") {
// //         return await handleGhostLinkRequest(body.callback_query);
// //       }
      
// //       // 🚨 REMOTE WIPE: Trigger global session revocation
// //       if (data === "trigger_remote_wipe") {
// //         return await handleRemoteWipe(body.callback_query);
// //       }
// //     }

// //     const handleUpdate = webhookCallback(telegramBot, "std/http");
// //     return await handleUpdate(new Request(request.url, {
// //       method: 'POST',
// //       headers: request.headers,
// //       body: JSON.stringify(body),
// //     }));

// //   } catch (error: any) {
// //     console.error("🔥 [Webhook_Fault]:", error.message);
// //     return NextResponse.json({ ok: true });
// //   }
// // }

// // /**
// //  * 🚀 HANDLER: Identity Handshake
// //  * Logic: Provides a clean UI. The login URL is hidden behind a callback.
// //  */
// // async function handleIdentityHandshake(message: any) {
// //   const telegramId = BigInt(message.chat.id);
// //   const host = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

// //   const user = await prisma.user.upsert({
// //     where: { telegramId },
// //     update: { fullName: message.from.first_name, username: message.from.username },
// //     create: { telegramId, fullName: message.from.first_name, username: message.from.username, role: "USER" }
// //   });

// //   const keyboard = new InlineKeyboard()
// //     .webApp("🛰️ ACCESS APP", `${host}/home`)
// //     // 🔑 Ghost Link trigger
// //     .text("🔑 SECURE LOGIN", "request_magic_link") 
// //     .row()
// //     .url("🌐 WEBSITE", `${host}/`);

// //   if (["SUPER_ADMIN", "MERCHANT"].includes(user.role)) {
// //     keyboard.row().text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");
// //   }

// //   await telegramBot.api.sendMessage(message.chat.id,
// //     `<b>🛰️ IDENTITY NODE SYNCED</b>\n\n` +
// //     `<b>Operator:</b> ${message.from.first_name}\n` +
// //     `<b>Role:</b> <code>${user.role}</code>\n\n` +
// //     `Identity verified. Click below to anchor your browser session.`,
// //     { parse_mode: "HTML", reply_markup: keyboard }
// //   );

// //   return NextResponse.json({ ok: true });
// // }

// // /**
// //  * 👻 HANDLER: Ghost Link Generation (v15.0.1)
// //  * Optimized for Cloudflare Tunnels and Strict Telegram API Validation.
// //  */
// // async function handleGhostLinkRequest(callback: any) {
// //   const telegramId = callback.from.id.toString();
  
// //   // 1. CLEAN HOST RESOLUTION
// //   const rawHost = process.env.NEXT_PUBLIC_APP_URL || "";
// //   const host = rawHost.replace(/\/$/, ""); // Remove any trailing slashes

// //   try {
// //     // 2. TOKEN GENERATION
// //     const loginToken = await AuthService.generateMagicToken(telegramId);
    
// //     /**
// //      * 🚀 THE FIX: URI ENCODING
// //      * We must encode the token and the redirect path. 
// //      * 'redirect=/' becomes 'redirect=%2F' which Telegram accepts much better.
// //      */
// //     const params = new URLSearchParams({
// //       token: loginToken,
// //       redirect: "/"
// //     });

// //     const magicLink = `${host}/api/auth/magic?${params.toString()}`;

// //     console.log(`🛰️ [Ghost_Link]: Dispatching validated URL: ${magicLink}`);

// //     // 3. ATTEMPT PUSH
// //     await telegramBot.api.answerCallbackQuery(callback.id, {
// //       url: magicLink,
// //     });

// //   } catch (err: any) {
// //     console.error("🔥 [Ghost_Link_Critical]:", err.message);
    
// //     // 🛡️ FALLBACK: If answerCallbackQuery (url) fails, send a clickable message instead.
// //     // This ensures the user is NEVER stuck on a "Handshake Failed" screen.
// //     const loginTokenFallback = await AuthService.generateMagicToken(telegramId);
// //     const fallbackLink = `${host}/api/auth/magic?token=${loginTokenFallback}&redirect=/`;

// //     await telegramBot.api.answerCallbackQuery(callback.id, {
// //       text: "🔐 Security Redirect Protocol Engaged.",
// //       show_alert: false
// //     });

// //     await telegramBot.api.sendMessage(callback.from.id, 
// //       "<b>⚠️ SECURE REDIRECT</b>\n\nYour browser prevented an automatic handshake. Please use the manual entry node below:",
// //       { 
// //         parse_mode: "HTML",
// //         reply_markup: new InlineKeyboard().url("🔑 MANUAL LOGIN", fallbackLink)
// //       }
// //     );
// //   }

// //   return NextResponse.json({ ok: true });
// // }
// // /**
// //  * 🧹 HANDLER: Remote Wipe
// //  */
// // async function handleRemoteWipe(callback: any) {
// //   const telegramId = BigInt(callback.from.id);
// //   const user = await prisma.user.findUnique({ where: { telegramId } });
  
// //   if (user) {
// //     // 1. Rotate DB Stamp
// //     await AuthService.rotateSecurityStamp(user.id);
    
// //     // 2. Log the Wipe
// //     await AuditService.log({
// //       userId: user.id,
// //       action: "REMOTE_WIPE",
// //       ip: "TELEGRAM_GATEWAY",
// //       metadata: { method: "BOT_CALLBACK_REVOCATION" }
// //     });

// //     await telegramBot.api.sendMessage(callback.from.id, "🔐 <b>GLOBAL REVOCATION COMPLETE.</b> All active nodes have been voided.");
// //   }

// //   await telegramBot.api.answerCallbackQuery(callback.id);
// //   return NextResponse.json({ ok: true });
// // }

// // /**
// //  * 💳 HANDLER: Successful Payment Reconciliation
// //  */
// // async function handleSuccessfulPayment(message: any) {
// //   const paymentData = message.successful_payment;
// //   const payload = JSON.parse(paymentData.invoice_payload);

// //   try {
// //     await prisma.$transaction(async (tx) => {
// //       await tx.payment.updateMany({
// //         where: { userId: payload.userId, serviceTierId: payload.tierId, status: "PENDING" },
// //         data: { status: "SUCCESS", gatewayReference: paymentData.telegram_payment_charge_id }
// //       });

// //       const tier = await tx.serviceTier.findUnique({ where: { id: payload.tierId } });
// //       const expirationDate = new Date();
// //       expirationDate.setMonth(expirationDate.getMonth() + (tier?.intervalCount || 1));

// //       await tx.subscription.upsert({
// //         where: { userId_serviceId: { userId: payload.userId, serviceId: payload.serviceId } },
// //         update: { status: "ACTIVE", expiresAt: expirationDate, renewals: { increment: 1 } },
// //         create: {
// //           userId: payload.userId,
// //           serviceId: payload.serviceId,
// //           merchantId: payload.merchantId,
// //           serviceTierId: payload.tierId,
// //           status: "ACTIVE",
// //           expiresAt: expirationDate
// //         }
// //       });
// //     });

// //     await telegramBot.api.sendMessage(message.chat.id, "✅ <b>TRANSACTION VERIFIED</b>");
// //   } catch (err) { console.error(err); }
// //   return NextResponse.json({ ok: true });
// // }

// // /**
// //  * 🛠️ HANDLER: Hardware Diagnostics
// //  */
// // async function handleStatusCheck(chatId: number) {
// //   const startTime = Date.now();
// //   await prisma.$queryRaw`SELECT 1`;
// //   const latency = Date.now() - startTime;

// //   await telegramBot.api.sendMessage(chatId, 
// //     `🖥️ <b>SYSTEM STATUS</b>\n\n<b>Database:</b> 🟢 ONLINE\n<b>Latency:</b> ⚡ ${latency}ms`,
// //     { parse_mode: "HTML" }
// //   );
// //   return NextResponse.json({ ok: true });
// // }


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
    if (body.callback_query) {
      const data = body.callback_query.data;
      if (data === "request_magic_link") return await handleGhostLinkRequest(body.callback_query);
      if (data === "trigger_remote_wipe") return await handleRemoteWipe(body.callback_query);
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
 * 🚀 HANDLER: Identity Handshake (v16.15.0)
 * Architecture: Platform-Aware Ingress.
 * - WebApp: Native-style terminal for iOS/Android/Tablets.
 * - URL: Standard browser hand-off for Windows/MacOS.
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

  const keyboard = new InlineKeyboard()
    // 📱 MOBILE/TABLET NODES: Forced internal WebApp view
    .webApp("🛰️ ACCESS TERMINAL", `${host}/home`)
    .row()
    // 🔑 SECURE LOGIN: Triggers the Ghost Link callback for browser entry
    .text("🔑 DESKTOP SYNC", "request_magic_link") 
    .row()
    .webApp("🌐 WEBSITE", `${host}/`);

  if (["SUPER_ADMIN", "MERCHANT"].includes(user.role)) {
    keyboard.row().text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");
  }

  await telegramBot.api.sendMessage(message.chat.id,
    `<b>🛰️ IDENTITY NODE SYNCED</b>\n\n` +
    `<b>Operator:</b> ${message.from.first_name}\n` +
    `<b>Role:</b> <code>${user.role}</code>\n\n` +
    `Select <b>Access Terminal</b> to open the native mobile interface, or <b>Desktop Sync</b> to bridge your session to a computer.`,
    { parse_mode: "HTML", reply_markup: keyboard }
  );

  return NextResponse.json({ ok: true });
}

/**
 * 👻 HANDLER: Ghost Link Generation
 * Optimized for seamless Browser-to-Terminal transitions.
 */
async function handleGhostLinkRequest(callback: any) {
  const telegramId = callback.from.id.toString();
  const host = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  try {
    // 1. Generate token (This is where the slow query happens)
    const loginToken = await AuthService.generateMagicToken(telegramId);
    const magicLink = `${host}/api/auth/magic?token=${loginToken}&redirect=/home`;

    // 2. 🚀 PUSH strategy: Send a fresh message with the link
    // This is safer than answering the query with a URL when the DB is slow
    await telegramBot.api.sendMessage(callback.from.id, 
      "<b>🔐 IDENTITY ANCHOR READY</b>\n\nYour secure browser session is prepared. Click below to synchronize your device terminal:",
      { 
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().url("🔗 AUTHORIZE TERMINAL", magicLink)
      }
    );

  } catch (err: any) {
    console.error("🔥 [Ghost_Link_Critical]:", err.message);
    await telegramBot.api.sendMessage(callback.from.id, "❌ <b>Handshake Node Timeout.</b> Please use /start and try again.");
  }
}

/**
 * 🧹 HANDLER: Remote Wipe
 */
async function handleRemoteWipe(callback: any) {
  const telegramId = BigInt(callback.from.id);
  const user = await prisma.user.findUnique({ where: { telegramId } });
  
  if (user) {
    await AuthService.rotateSecurityStamp(user.id);
    await telegramBot.api.sendMessage(callback.from.id, "🔐 <b>SESSIONS VOIDED.</b>");
  }

  await telegramBot.api.answerCallbackQuery(callback.id);
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