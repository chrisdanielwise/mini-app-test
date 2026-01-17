"use server";

import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot";
import { cache } from "react";

/**
 * 🌊 DISPATCH_HUB_SERVICE (v16.16.12)
 * Logic: Multi-channel signal routing with MarkdownV2 escaping.
 * Standard: v13.0.30 Tactical Messaging.
 */
export const DispatchHub = {
  /**
   * 🛰️ SEND_SIGNAL
   * Logic: The primary egress point for all Telegram notifications.
   * Security: Includes automatic MarkdownV2 character escaping.
   */
  async sendSignal(params: {
    telegramId: string | bigint;
    message: string;
    parseMode?: "MarkdownV2" | "HTML";
    replyMarkup?: any;
    priority?: "HIGH" | "NORMAL";
  }) {
    const { telegramId, message, parseMode = "MarkdownV2", replyMarkup, priority = "NORMAL" } = params;

    // 🛡️ MarkdownV2 Escaping Protocol
    // Telegram is highly sensitive to special characters in V2.
    const escapedMessage = parseMode === "MarkdownV2" 
      ? this.escapeMarkdownV2(message) 
      : message;

    try {
      const response = await telegramBot.api.sendMessage(
        telegramId.toString(), 
        escapedMessage, 
        {
          parse_mode: parseMode,
          reply_markup: replyMarkup,
          disable_web_page_preview: true,
        }
      );

      // 📝 Log successful dispatch in the telemetry node
      await prisma.notificationLog.create({
        data: {
          telegramId: telegramId.toString(),
          content: message,
          status: "DELIVERED",
          priority,
        }
      });

      return { success: true, messageId: response.message_id };
    } catch (err: any) {
      console.error("🔥 [Dispatch_Fail]:", err);

      // 🔄 Fallback: Log failure for the Retry Sentinel to pick up
      await prisma.notificationLog.create({
        data: {
          telegramId: telegramId.toString(),
          content: message,
          status: "FAILED",
          errorMessage: err.message,
          priority,
        }
      });

      return { success: false, error: err.message };
    }
  },

  /**
   * 🛡️ ESCAPE_MARKDOWN_V2
   * Standard: Escapes mandatory reserved characters for Telegram V2.
   */
  escapeMarkdownV2(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  },

  /**
   * 💎 DISPATCH_PAYMENT_CONFIRMATION
   * Template: Institutional Success Signal.
   */
  async notifyPaymentSuccess(telegramId: string, amount: string, reference: string) {
    const message = 
      `✅ *PAYMENT CONFIRMED*\n` +
      `----------------------------\n` +
      `Your transaction of *${amount}* has been successfully processed\\.\n\n` +
      `📄 *Ref:* \`${reference}\`\n` +
      `----------------------------\n` +
      `Your service access has been provisioned\\.`;

    return this.sendSignal({ telegramId, message });
  },

  /**
   * 🚀 DISPATCH_ORDER_UPDATE
   * Template: Operational Logistics Signal.
   */
  async notifyOrderUpdate(telegramId: string, orderId: string, status: string) {
    const message = 
      `📦 *ORDER UPDATE*\n` +
      `----------------------------\n` +
      `Order *#${orderId.slice(0, 8)}* is now: *${status}*\n` +
      `----------------------------\n` +
      `Check your dashboard for real-time tracking\\.`;

    return this.sendSignal({ telegramId, message });
  }
};