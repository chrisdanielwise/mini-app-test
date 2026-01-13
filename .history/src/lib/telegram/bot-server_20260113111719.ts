import { Telegraf, Markup } from "telegraf";
import prisma from "@/lib/db";
import { AuthService } from "@/lib/services/auth.service";

/**
 * 🛰️ INSTITUTIONAL START HANDLER (v13.0.5)
 * Logic: Role-Based Routing for Mini App & Browser Ingress.
 * Features: Magic Link Tokenization + Mini App WebApp Buttons.
 */
export const setupStartHandler = (bot: Telegraf<any>) => {
  bot.start(async (ctx: any) => {
    const telegramId = ctx.from.id.toString();
    const firstName = ctx.from.first_name || "Operator";

    try {
      // 1. Sync & Identify User
      const user = await prisma.user.upsert({
        where: { telegramId },
        update: { firstName, username: ctx.from.username },
        create: { 
          telegramId, 
          firstName, 
          username: ctx.from.username,
          role: 'USER' 
        },
        include: { merchantProfile: true }
      });

      const role = user.role.toUpperCase();
      const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER", "PLATFORM_SUPPORT"].includes(role);
      const isMerchant = !!user.merchantProfile! || role === "MERCHANT";
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, "");

      // --- 🏛️ STAFF & MERCHANT TERMINAL (Privileged Access) ---
      if (isStaff || isMerchant) {
        // Generate Magic Token for Browser Access
        const token = await AuthService.generateMagicToken(telegramId);
        const magicLink = `${baseUrl}/api/auth/magic?token=${token}`;
        
        const clearance = isStaff ? `STAFF_${role}` : "MERCHANT_OPERATOR";

        return ctx.reply(
          `🛰️ *PRIVILEGED ACCESS ENABLED*\n\n` +
          `*Operator:* ${firstName}\n` +
          `*Clearance:* ${clearance}\n\n` +
          `Choose your deployment environment:`,
          {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                // 📱 Mini App Button (Mobile Interface)
               [{ text: "🛰️ OPEN MOBILE DASHBOARD", web_app: { url: `${baseUrl}/dashboard/login` } }],
                // 🌐 Magic Link Button (Browser Interface)
                [{ text: "🔑 LOGIN TO WEB (LAPTOP)", url: magicLink }],
                // 👤 User View (For testing/UX)
                [{ text: "👤 SWITCH TO USER VIEW", web_app: { url: `${baseUrl}/home` } }]
              ],
            },
          }
        );
      }

      // --- 📱 STANDARD USER INGRESS (Customer Access) ---
      return ctx.reply(
        `🛰️ *NODE SYNCHRONIZED*\n\n` +
        `Welcome, ${firstName}. Your identity node is active on the Zipha Protocol.\n\n` +
        `Launch the application below:`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🚀 LAUNCH ZIPHA APP", web_app: { url: `${baseUrl}/home` } }],
              [{ text: "🌐 VISIT LANDING PAGE", url: baseUrl }]
            ],
          },
        }
      );

    } catch (error) {
      console.error("🔥 [Bot_Start_Fault]:", error);
      ctx.reply("❌ *PROTOCOL ERROR*\n\nUnable to synchronize identity with the cluster.");
    }
  });

  // 🛡️ CALLBACK LISTENER: Handle Manual Magic Link Requests
  bot.action("generate_magic_link", async (ctx: any) => {
    try {
      const token = await AuthService.generateMagicToken(ctx.from.id.toString());
      if (!token) return ctx.answerCbQuery("Unauthorized Access.");
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, "");
      const magicLink = `${baseUrl}/api/auth/magic?token=${token}`;

      await ctx.reply(`🔑 *NEW BROWSER KEY*\n\nValid for 10 minutes:\n${magicLink}`, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "🚀 OPEN WEB TERMINAL", url: magicLink }]]
        }
      });
      await ctx.answerCbQuery();
    } catch (e) {
      ctx.answerCbQuery("Sync Fault.");
    }
  });
};