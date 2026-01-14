import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("🚨 TELEGRAM_BOT_TOKEN is missing in .env");
}

/**
 * 🛰️ GLOBAL BOT INSTANCE
 */
const globalForBot = global as unknown as { telegramBot: Bot };

export const telegramBot = globalForBot.telegramBot || new Bot(token);

if (process.env.NODE_ENV !== "production") {
  globalForBot.telegramBot = telegramBot;
}