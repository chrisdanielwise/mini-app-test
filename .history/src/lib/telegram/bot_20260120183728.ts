import { Bot, webhookCallback } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("🚨 TELEGRAM_BOT_TOKEN is missing in .env");
}

/**
 * 🛰️ GLOBAL BOT INSTANCE (v2026.1.20)
 * Logic: Implements singleton pattern for Dev and Webhook callback for Prod.
 */
const globalForBot = global as unknown as { telegramBot: Bot };

export const telegramBot = globalForBot.telegramBot || new Bot(token);

// Cache the instance in development to prevent hot-reload duplicates
if (process.env.NODE_ENV !== "production") {
  globalForBot.telegramBot = telegramBot;
}

/**
 * 🌊 WEBHOOK_ADAPTER
 * This is what Vercel uses to "wake up" the bot.
 */
export const handleUpdate = webhookCallback(telegramBot, "std/http");