import { Telegraf } from "telegraf";
import { generateSecureToken } from "@/lib/crypto";
import prisma from "@/lib/db";

/**
 * 🛰️ UNIVERSAL START HANDLER
 * Trigger: /start terminal_access (Renamed from merchant_login)
 * Logic: Generic Identity Handshake for all Authorized Personnel.
 */
export const setupStartHandler = (bot: Telegraf<any>) => {bot.start(async (ctx) => {
    const startPayload = ctx.startPayload;
    const telegramId = BigInt(ctx.from.id);

    if (startPayload === "terminal_access") {
      const user = await prisma.user.findUnique({
        where: { telegramId },
        include: { merchantProfile: true }
      });

      // 🛡️ Clearance Verification
      const isStaff = ["SUPER_ADMIN", "PLATFORM_MANAGER"].includes(user?.role || "");
      const isMerchant = !!user?.merchantProfile;

      if (!isStaff && !isMerchant) {
        return ctx.reply("🚨 *UNAUTHORIZED*\n\nYour node is not provisioned for Terminal access.");
      }

      // 🔐 Identity Sync
      const loginToken = generateSecureToken();
      const expires = new Date(Date.now() + 5 * 60000);

      await prisma.user.update({
        where: { id: user!.id },
        data: { lastLoginToken: loginToken, tokenExpires: expires },
      });

      // 🚀 Clean Ingress URL
      // Use URL object to prevent double-slash errors
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL!.replace(/\/$/, "");
      const callbackUrl = `${baseUrl}/api/auth/callback?token=${loginToken}`;

      const clearanceType = isStaff ? `STAFF [${user?.role}]` : "MERCHANT_OPERATOR";

      return ctx.reply(
        `🛰️ *IDENTITY SYNCED*\n\n*Operator:* ${user?.firstName}\n*Clearance:* ${clearanceType}\n\nLink valid for 5 minutes.`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: "🚀 ENTER TERMINAL", url: callbackUrl }]],
          },
        }
      );
    }

    // 📱 STANDARD MINI APP INGRESS (Fallback)
    ctx.reply(
      `Welcome to *Zipha V2*.\n\nYour identity node has been synchronized. Use the button below to launch the node.`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🛰️ Launch Node", web_app: { url: process.env.NEXT_PUBLIC_APP_URL! } }],
          ],
        },
      }
    );
  });
};