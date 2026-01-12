import { Telegraf } from "telegraf";
import { generateSecureToken } from "@/src/lib/crypto"; // Use a shared utility
import prisma from "@/src/lib/db"; // Use your singleton

export const setupStartHandler = (bot: Telegraf<any>) => {
  bot.start(async (ctx) => {
    const startPayload = ctx.startPayload;
    const telegramId = ctx.from.id;

    if (startPayload === "merchant_login") {
      // 🛰️ IDENTITY HANDSHAKE
      // Using BigInt conversion to match the 2026 Schema Standard
      const merchant = await prisma.merchantProfile.findUnique({
        where: { adminUserId: BigInt(telegramId) },
        include: { adminUser: true }
      });

      if (!merchant) {
        return ctx.reply(
          "🚨 *ACCESS DENIED*\n\nYour Telegram ID is not linked to a Merchant Node. Please register at the main terminal.",
          { parse_mode: "Markdown" }
        );
      }

      const loginToken = generateSecureToken();

      // 🔐 SECURE TOKEN COMMIT
      await prisma.merchantProfile.update({
        where: { id: merchant.id },
        data: {
          lastLoginToken: loginToken,
          tokenExpires: new Date(Date.now() + 5 * 60000), 
        },
      });

      const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?token=${loginToken}&merchantId=${merchant.id}`;

      // 💎 INSTITUTIONAL UI
      return ctx.reply(
        `🛰️ *GATEWAY OPEN*\n\nWelcome back, ${merchant.adminUser.firstName || 'Merchant'}.\n\nThis login link will expire in 5 minutes. Do not share this message with anyone.`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🚀 ENTER COMMAND CENTER", url: callbackUrl }],
            ],
          },
        }
      );
    }

    // 📱 STANDARD MINI APP INGRESS
    ctx.reply(
      `Welcome to *Zipha V2*.\n\nYour identity node has been synchronized. Use the button below to launch the terminal.`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🛰️ Launch Mini App", web_app: { url: process.env.NEXT_PUBLIC_APP_URL! } }],
          ],
        },
      }
    );
  });
};