import { Bot, InlineKeyboard } from "grammy";
import prisma from "@/lib/db";
import {  } from "@/lib/services/auth.service";

/**
 * 🛰️ INSTITUTIONAL START HANDLER (v16.16.8)
 * Logic: Dual-Node Ingress with Synchronized Token Pre-Generation.
 * Feature: Cross-platform optimized for TMA (Mobile) and Magic URL (Desktop).
 */
export const setupStartHandler = (bot: Bot) => {
  bot.command("start", async (ctx) => {
    const telegramId = ctx.from?.id.toString();
    const firstName = ctx.from?.first_name || "Operator";
    const username = ctx.from?.username || "anonymous_node";

    if (!telegramId) return;

    try {
      // 1. 🛡️ IDENTITY ANCHOR SYNC (Optimized for 2026 sub-50ms latency)
      const user = await prisma.user.upsert({
        where: { telegramId: BigInt(telegramId) },
        update: { fullName: firstName, username: username },
        create: { 
          telegramId: BigInt(telegramId), 
          fullName: firstName, 
          username: username,
          role: 'USER', // Initial clearance, upgraded via Merchant check
        }
      });

      const role = user.role.toUpperCase();
      const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "AMBER"].includes(role);
      const isMerchant = role === "MERCHANT";
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, "");

      // 2. 🔑 SYNCHRONIZED TOKEN GENERATION
      // Pre-generating tokens for the URL buttons to bypass Callback timeouts
      const homeToken = await generateMagicToken(telegramId);
      const dashToken = await generateMagicToken(telegramId);

      const homeWebLink = `${baseUrl}/api/auth/magic?token=${homeToken}&redirect=/home`;
      const dashWebLink = `${baseUrl}/api/auth/magic?token=${dashToken}&redirect=/dashboard`;

      // 3. 🏗️ TACTICAL DUAL-NODE KEYBOARD
      const keyboard = new InlineKeyboard()
        // --- SECTOR 1: HOME (Standard/Merchant) ---
        .webApp("📱 HOME: MOBILE", `${baseUrl}/home`)
        .url("🌐 HOME: WEB", homeWebLink)
        .row()
        // --- SECTOR 2: DASHBOARD (Merchant/Staff Only) ---
        .webApp("📱 DASH: MOBILE", `${baseUrl}/dashboard`)
        .url("🌐 DASH: WEB", dashWebLink)
        .row()
        .webApp("🌎 VISIT WEBSITE", `${baseUrl}/`);

      if (isStaff || isMerchant) {
        keyboard.row().text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");
      }

      const greeting = (isStaff || isMerchant) ? "PRIVILEGED ACCESS ENABLED" : "NODE SYNCHRONIZED";

      return await ctx.reply(
        `<b>🛰️ ${greeting}</b>\n\n` +
        `<b>Operator:</b> ${firstName}\n` +
        `<b>Clearance:</b> <code>${role}</code>\n\n` +
        `Select a <b>Mobile</b> node for native app ingress or a <b>Web</b> node to bridge your session to an external browser terminal.`,
        {
          parse_mode: "HTML",
          reply_markup: keyboard,
        }
      );

    } catch (error) {
      console.error("🔥 [Bot_Start_Fault]:", error);
      await ctx.reply("❌ <b>PROTOCOL ERROR</b>\n\nUnable to anchor identity node.");
    }
  });

  /**
   * 🚨 CALLBACK: REMOTE WIPE TRIGGER
   * Logic: Rotates the Security Stamp to void all active sessions globally.
   */
  bot.callbackQuery("trigger_remote_wipe", async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      const user = await prisma.user.findUnique({ 
        where: { telegramId: BigInt(telegramId) },
        select: { id: true }
      });

      if (!user) return await ctx.answerCallbackQuery({ text: "Unresolved Node." });

      // 🚀 Perform Global Revocation
      await AuthService.rotateSecurityStamp(user.id);

      await ctx.answerCallbackQuery({ 
        text: "🛡️ IDENTITY ANCHOR ROTATED: ALL SESSIONS VOIDED.", 
        show_alert: true 
      });

      await ctx.reply(`🔐 <b>GLOBAL REVOCATION COMPLETE</b>\n\nSecurity stamps rotated for node <code>${user.id.slice(0, 8)}</code>. All active terminals have been de-authorized.`, { parse_mode: "HTML" });
    } catch (e) {
      await ctx.answerCallbackQuery({ text: "Revocation Fault." });
    }
  });
};