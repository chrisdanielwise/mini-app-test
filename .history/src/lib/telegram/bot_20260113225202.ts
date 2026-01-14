import { Bot } from "grammy";

/**
 * 🛰️ TELEGRAM BOT INSTANCE (Institutional v14.0.0)
 * Logic: Singleton pattern to prevent "Duplicate Update" errors.
 */
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("🚨 [Identity_Node]: TELEGRAM_BOT_TOKEN is missing in environment variables.");
}

// Create the bot instance
export const telegramBot = new Bot(token);

// 🛡️ Note: We don't call bot.start() here because 
// we use this instance primarily for server-side dispatches.