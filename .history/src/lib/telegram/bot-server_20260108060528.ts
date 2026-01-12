import { Telegraf } from "telegraf";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.BOT_TOKEN!);

// Helper to create a secure random token
const generateSecureToken = () => crypto.randomBytes(32).toString("hex");

// --- THIS IS THE BLOCK YOU ASKED ABOUT ---
bot.start(async (ctx) => {
  const startPayload = ctx.startPayload;

  if (startPayload === "merchant_login") {
    const telegramId = ctx.from.id;

    const merchant = await prisma.merchant.findUnique({
      where: { telegramId: telegramId.toString() },
    });

    if (!merchant) {
      return ctx.reply(
        "❌ Merchant account not found. Please register on the website first."
      );
    }

    const loginToken = generateSecureToken();

    // Save to DB so the Callback Route can verify it later
    await prisma.merchant.update({
      where: { id: merchant.id },
      data: {
        lastLoginToken: loginToken,
        tokenExpires: new Date(Date.now() + 5 * 60000), // 5 min expiry
      },
    });

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?token=${loginToken}&merchantId=${merchant.id}`;

    return ctx.reply("🔑 Access Granted!", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 Open Merchant Dashboard", url: callbackUrl }],
        ],
      },
    });
  }

  // Standard bot welcome for users
  ctx.reply("Welcome to Zipha Signals! Use the Mini App to get started.");
});

bot.launch();
console.log("🤖 Telegram Bot is running and listening for logins...");
