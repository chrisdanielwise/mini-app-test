import { Telegraf } from "telegraf";
import { generateSecureToken } from "@/lib/crypto";
import prisma from "@/lib/db";

/**
 * 🛰️ UNIVERSAL START HANDLER
 * Trigger: /start terminal_access (Renamed from merchant_login)
 * Logic: Generic Identity Handshake for all Authorized Personnel.
 */
export const setupStartHandler = (bot: Telegraf<any>) => {
  bot.start(async (ctx) => {
    const startPayload = ctx.startPayload;
    const telegramId = BigInt(ctx.from.id);

    // 1. GENERIC COMMAND CENTER INGRESS
    // Handles all privileged dashboard access requests
    if (startPayload === "terminal_access") {
      
      // 🕵️ GLOBAL IDENTITY LOOKUP
      const user = await prisma.user.findUnique({
        where: { telegramId },
        include: { merchantProfile: true }
      });

      // 🛡️ AUTHORIZATION GATE
      // User is authorized if they are Staff OR have a Merchant Profile
      const isPrivileged = user && (
        user.role !== "USER" || user.merchantProfile
      );

      if (!isPrivileged) {
        return ctx.reply(
          "🚨 *ACCESS DENIED*\n\nYour identity node lacks the necessary clearance for Terminal access.",
          { parse_mode: "Markdown" }
        );
      }

      // 🔐 GENERATE HANDSHAKE TOKEN
      const loginToken = generateSecureToken();
      const expires = new Date(Date.now() + 5 * 60000); // 5-minute window

      // 💾 UNIVERSAL TOKEN STORAGE
      // We commit the token to the 'User' record to keep it role-agnostic.
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginToken: loginToken,
          tokenExpires: expires,
        },
      });

      // 🔗 CLEAN CALLBACK PROTOCOL
      // We pass zero identifiers in the URL, only the secret token.
      const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?token=${loginToken}`;

      return ctx.reply(
        `🛰️ *IDENTITY SYNCED*\n\nWelcome back, ${user.firstName || 'Operator'}.\n\nHandshake successful. Link valid for 5 minutes.`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🚀 ENTER TERMINAL", url: callbackUrl }],
            ],
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