import { Bot, InlineKeyboard } from "grammy";
import prisma from "@/lib/db";
import { AuthService } from "@/lib/services/auth.service";

/**
 * 🛰️ INSTITUTIONAL START HANDLER (v14.9.0)
 * Logic: Handles Identity Synchronization & Multi-Environment Ingress.
 * Platform: grammY Framework (2026 Next.js Optimized).
 */
export const setupStartHandler = (bot: Bot) => {
  bot.command("start", async (ctx) => {
    const telegramId = ctx.from?.id.toString();
    const firstName = ctx.from?.first_name || "Operator";
    const username = ctx.from?.username || "anonymous_node";

    if (!telegramId) return;

    try {
      // 1. 🛡️ IDENTITY ANCHOR SYNC
      // Logic: Syncs the Telegram user with the Zipha DB and ensures a Security Stamp exists.
      const user = await prisma.user.upsert({
        where: { telegramId: BigInt(telegramId) },
        update: { fullName: firstName, username: username },
        create: { 
          telegramId: BigInt(telegramId), 
          fullName: firstName, 
          username: username,
          role: 'MERCHANT', // Defaulting to MERCHANT for TMA testers
          // securityStamp is handled by Prisma @default(uuid)
        },
        include: { merchantProfile: true }
      });

      const role = user.role.toUpperCase();
      const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT", "STAFF"].includes(role);
      const isMerchant = !!user.merchantProfile || role === "MERCHANT";
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, "");

      // --- 🏛️ PRIVILEGED ACCESS (Staff & Merchants) ---
      if (isStaff || isMerchant) {
        const token = await AuthService.generateMagicToken(telegramId);
        const magicLink = `${baseUrl}/api/auth/magic?token=${token}`;
        const clearance = isStaff ? `STAFF_${role}` : "MERCHANT_OPERATOR";

        const keyboard = new InlineKeyboard()
          .webApp("🛰️ OPEN MOBILE DASHBOARD", `${baseUrl}/dashboard/login`)
          .row()
          .url("🔑 LOGIN TO WEB (LAPTOP)", magicLink)
          .row()
          .webApp("👤 SWITCH TO USER VIEW", `${baseUrl}/home`);

        return await ctx.reply(
          `<b>🛰️ PRIVILEGED ACCESS ENABLED</b>\n\n` +
          `<b>Operator:</b> ${firstName}\n` +
          `<b>Clearance:</b> <code>${clearance}</code>\n\n` +
          `Your identity node has been synchronized with the Zipha Protocol. Choose your deployment environment:`,
          {
            parse_mode: "HTML",
            reply_markup: keyboard,
          }
        );
      }

      // --- 📱 STANDARD USER INGRESS ---
      const userKeyboard = new InlineKeyboard()
        .webApp("🚀 LAUNCH ZIPHA APP", `${baseUrl}/home`)
        .row()
        .url("🌐 VISIT LANDING PAGE", baseUrl);

      return await ctx.reply(
        `<b>🛰️ NODE SYNCHRONIZED</b>\n\n` +
        `Welcome, ${firstName}. Your identity node is active.\n\n` +
        `Launch the protocol application below:`,
        {
          parse_mode: "HTML",
          reply_markup: userKeyboard,
        }
      );

    } catch (error) {
      console.error("🔥 [Bot_Start_Fault]:", error);
      await ctx.reply("❌ <b>PROTOCOL ERROR</b>\n\nIdentity synchronization failed. Please try again.", { parse_mode: "HTML" });
    }
  });

  // --- 🛰️ MAGIC LINK RE-GENERATOR ---
  bot.callbackQuery("generate_magic_link", async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      const token = await AuthService.generateMagicToken(telegramId);
      
      if (!token) {
        return await ctx.answerCallbackQuery({ text: "Unauthorized Access.", show_alert: true });
      }
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, "");
      const magicLink = `${baseUrl}/api/auth/magic?token=${token}`;

      await ctx.reply(`<b>🔑 NEW BROWSER KEY</b>\n\nValid for 10 minutes:\n<code>${magicLink}</code>`, {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().url("🚀 OPEN WEB TERMINAL", magicLink)
      });
      
      await ctx.answerCallbackQuery();
    } catch (e) {
      await ctx.answerCallbackQuery({ text: "Sync Fault.", show_alert: true });
    }
  });
};