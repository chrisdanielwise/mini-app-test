import { Bot, InlineKeyboard } from "grammy";
import prisma from "@/lib/db";
import { generateMagicToken, rotateSecurityStamp } from "@/lib/services/auth.service";
// ✅ FIX: Corrected import path and synchronized with generated client members
import { UserRole } from "@/generated/prisma";
// ✅ CORRECTED DECIMAL PATH: Maintaining consistency for potential math logic

/**
 * 🛰️ INSTITUTIONAL START HANDLER (v2026.1.20 - HARDENED)
 * Logic: Dual-Node Ingress with Synchronized Token Pre-Generation.
 * Standard: Mapping logic ensures 'USER' becomes lowercase 'user' in Postgres.
 */
export const setupStartHandler = (bot: Bot) => {
  bot.command("start", async (ctx) => {
    const telegramIdRaw = ctx.from?.id;
    const firstName = ctx.from?.first_name || "Operator";
    const username = ctx.from?.username || "anonymous_node";

    if (!telegramIdRaw) return;
    const telegramId = telegramIdRaw.toString();
    const bigIntId = BigInt(telegramId);

    try {
      // 1. 🛡️ IDENTITY ANCHOR SYNC
      // Logic: upsert handles the initial user entry or profile update.
      const user = await prisma.user.upsert({
        where: { telegramId: bigIntId },
        update: { 
          fullName: firstName, 
          username: username,
          updatedAt: new Date() 
        },
        create: { 
          telegramId: bigIntId, 
          fullName: firstName, 
          username: username,
          // ✅ FIX: Using Enum member UserRole.USER (Maps to "user" in DB)
          role: UserRole.USER, 
        }
      });

      // Standardizing role for logic checks (Case-insensitive)
      const roleStr = user.role.toUpperCase();
      const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "AMBER"].includes(roleStr);
      const isMerchant = roleStr === "MERCHANT";
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, "");

      // 2. 🔑 SYNCHRONIZED TOKEN GENERATION
      // Generating unique tokens for different entry points to prevent session collision
      const homeToken = await generateMagicToken(telegramId);
      const dashToken = await generateMagicToken(telegramId);

      const homeWebLink = `${baseUrl}/api/auth/magic?token=${homeToken}&redirect=/home`;
      const dashWebLink = `${baseUrl}/api/auth/magic?token=${dashToken}&redirect=/dashboard`;

      // 3. 🏗️ TACTICAL DUAL-NODE KEYBOARD
      const keyboard = new InlineKeyboard()
        // --- SECTOR 1: HOME (Standard Ingress) ---
        .webApp("📱 HOME: MOBILE", `${baseUrl}/home`)
        .url("🌐 HOME: WEB", homeWebLink)
        .row()
        // --- SECTOR 2: DASHBOARD (Privileged Ingress) ---
        .webApp("📱 DASH: MOBILE", `${baseUrl}/dashboard`)
        .url("🌐 DASH: WEB", dashWebLink)
        .row()
        .webApp("🌎 VISIT WEBSITE", `${baseUrl}/`);

      // Staff/Merchant specific remote wipe logic
      if (isStaff || isMerchant) {
        keyboard.row().text("🚨 EMERGENCY REMOTE WIPE", "trigger_remote_wipe");
      }

      const greeting = (isStaff || isMerchant) ? "PRIVILEGED ACCESS ENABLED" : "NODE SYNCHRONIZED";

      return await ctx.reply(
        `<b>🛰️ ${greeting}</b>\n\n` +
        `<b>Operator:</b> ${firstName}\n` +
        `<b>Clearance:</b> <code>${roleStr}</code>\n\n` +
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
   * Logic: Rotates the Security Stamp to void all active JWTs/Sessions.
   */
  bot.callbackQuery("trigger_remote_wipe", async (ctx) => {
    try {
      const telegramId = BigInt(ctx.from.id);
      const user = await prisma.user.findUnique({ 
        where: { telegramId },
        select: { id: true }
      });

      if (!user) return await ctx.answerCallbackQuery({ text: "Unresolved Node." });

      // 🚀 Perform Global Revocation via auth service
      await rotateSecurityStamp(user.id);

      await ctx.answerCallbackQuery({ 
        text: "🛡️ IDENTITY ANCHOR ROTATED: ALL SESSIONS VOIDED.", 
        show_alert: true 
      });

      await ctx.reply(
        `🔐 <b>GLOBAL REVOCATION COMPLETE</b>\n\n` +
        `Security stamps rotated for node <code>${user.id.slice(0, 8)}</code>. All active terminals de-authorized.`, 
        { parse_mode: "HTML" }
      );
    } catch (e) {
      console.error("❌ [Remote_Wipe_Fault]:", e);
      await ctx.answerCallbackQuery({ text: "Revocation Fault." });
    }
  });
};