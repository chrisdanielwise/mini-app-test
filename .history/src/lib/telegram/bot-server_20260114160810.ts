// import { Bot, InlineKeyboard } from "grammy";
// import prisma from "@/lib/db";
// import { AuthService } from "@/lib/services/auth.service";

// /**
//  * 🛰️ INSTITUTIONAL START HANDLER (v14.12.0)
//  * Logic: Synchronizes Identity Nodes & Deploys Unified Command Keyboard.
//  * Platform: grammY Framework (2026 Next.js Optimized).
//  */
// export const setupStartHandler = (bot: Bot) => {
//   bot.command("start", async (ctx) => {
//     const telegramId = ctx.from?.id.toString();
//     const firstName = ctx.from?.first_name || "Operator";
//     const username = ctx.from?.username || "anonymous_node";

//     if (!telegramId) return;

//     try {
//       // 1. 🛡️ IDENTITY ANCHOR SYNC
//       const user = await prisma.user.upsert({
//         where: { telegramId: BigInt(telegramId) },
//         update: { fullName: firstName, username: username },
//         create: { 
//           telegramId: BigInt(telegramId), 
//           fullName: firstName, 
//           username: username,
//           role: 'MERCHANT', 
//         },
//         include: { merchantProfile: true }
//       });

//       const role = user.role.toUpperCase();
//       const isPrivileged = ["SUPER_ADMIN", "PLATFORM_MANAGER", "MERCHANT"].includes(role);
//       const baseUrl = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, "");

//       // --- 🏛️ PRIVILEGED ACCESS (Staff & Merchants) ---
//       if (isPrivileged) {
//         const token = await AuthService.generateMagicToken(telegramId);
//         const magicLink = `${baseUrl}/api/auth/magic?token=${token}`;

//         // Unified Institutional Keyboard
//         const keyboard = new InlineKeyboard()
//           .webApp("🛰️ MOBILE DASHBOARD", `${baseUrl}/dashboard/login`)
//           .url("🔑 WEB TERMINAL", magicLink)
//           .row()
//           .url("🌐 LANDING PAGE", `${baseUrl}/`)
//           .row()
//           .text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");

//         return await ctx.reply(
//           `<b>🛰️ PRIVILEGED ACCESS ENABLED</b>\n\n` +
//           `<b>Operator:</b> ${firstName}\n` +
//           `<b>Clearance:</b> <code>${role}</code>\n\n` +
//           `Your identity node is synchronized. Access deployment nodes below:`,
//           {
//             parse_mode: "HTML",
//             reply_markup: keyboard,
//           }
//         );
//       }

//       // --- 📱 STANDARD USER INGRESS ---
//       const userKeyboard = new InlineKeyboard()
//         .webApp("🚀 LAUNCH ZIPHA APP", `${baseUrl}/home`)
//         .row()
//         .url("🌐 WEBSITE", `${baseUrl}/`);

//       return await ctx.reply(
//         `<b>🛰️ NODE SYNCHRONIZED</b>\n\n` +
//         `Welcome, ${firstName}. Your identity node is active.\n\n` +
//         `Launch the application below:`,
//         {
//           parse_mode: "HTML",
//           reply_markup: userKeyboard,
//         }
//       );

//     } catch (error) {
//       console.error("🔥 [Bot_Start_Fault]:", error);
//       await ctx.reply("❌ <b>PROTOCOL ERROR</b>\n\nUnable to anchor identity.", { parse_mode: "HTML" });
//     }
//   });

//   /**
//    * 🚨 CALLBACK: REMOTE WIPE TRIGGER
//    * Logic: Rotates the Security Stamp instantly.
//    */
//   bot.callbackQuery("trigger_remote_wipe", async (ctx) => {
//     try {
//       const telegramId = ctx.from.id.toString();
//       const user = await prisma.user.findUnique({ 
//         where: { telegramId: BigInt(telegramId) } 
//       });

//       if (!user) throw new Error("UNRESOLVED_NODE");

//       // 🚀 Perform the rotation
//       await AuthService.rotateSecurityStamp(user.id);

//       await ctx.answerCallbackQuery({ 
//         text: "🛡️ IDENTITY ANCHOR ROTATED: ALL SESSIONS VOIDED.", 
//         show_alert: true 
//       });

//       await ctx.reply(
//         `🔐 <b>REMOTE DE-PROVISIONING COMPLETE</b>\n\n` +
//         `All active sessions for node <code>${user.id.slice(0, 8)}</code> have been terminated.\n\n` +
//         `<i>Use /start to re-authorize.</i>`, 
//         { parse_mode: "HTML" }
//       );
//     } catch (e) {
//       await ctx.answerCallbackQuery({ text: "Revocation Fault." });
//     }
//   });
// };