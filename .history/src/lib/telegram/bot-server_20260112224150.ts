import { Telegraf } from "telegraf";
import { generateSecureToken } from "@/lib/crypto";
import prisma from "@/lib/db";

/**
 * 🛰️ UNIVERSAL START HANDLER
 * Trigger: /start terminal_access (Renamed from merchant_login)
 * Logic: Generic Identity Handshake for all Authorized Personnel.
 */
export const setupStartHandler = (bot: Telegraf<any>) => {

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