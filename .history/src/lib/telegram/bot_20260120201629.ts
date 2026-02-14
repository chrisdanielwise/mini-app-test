import { Bot, webhookCallback } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("🚨 TELEGRAM_BOT_TOKEN is missing in .env");
}

/**
 * 🛰️ GLOBAL BOT INSTANCE (Apex v2026.1.21)
 * Singleton pattern to prevent multiple bot instances during HMR or Vercel Cold Starts.
 */
const globalForBot = global as unknown as { telegramBot: Bot };

export const telegramBot = globalForBot.telegramBot || new Bot(token);

if (process.env.NODE_ENV !== "production") {
  globalForBot.telegramBot = telegramBot;
}

/**
 * 🌊 WEBHOOK_ADAPTER
 * Used as a fallback or for standard GrammY middleware handling.
 */
export const handleUpdate = webhookCallback(telegramBot, "std/http");