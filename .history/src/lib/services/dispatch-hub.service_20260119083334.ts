"use server";

import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot";

/**
 * 🌊 DISPATCH_HUB_SERVICE (Institutional Apex v2026.1.20 - HARDENED)
 * Fix: Updated 'link_preview' to satisfy modern GrammY/Telegram types.
 * Fix: Mapped telemetry to 'activityLog' to resolve Prisma model mismatch.
 */
export const DispatchHub = {
  /**
   * 🛰️ SEND_SIGNAL
   * Logic: The primary egress point for all Telegram notifications.
   */
  async sendSignal(params: {
    telegramId: string | bigint;
    message: string;
    parseMode?: "MarkdownV2" | "HTML";
    replyMarkup?: any;
    priority?: "HIGH" | "NORMAL";
  }) {
    const { telegramId, message, parseMode = "MarkdownV2", replyMarkup, priority = "NORMAL" } = params;

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
          // ✅ FIX: 'disable_web_page_preview' is replaced by 'link_preview'
          link_preview: { is_disabled: true },
        }
      );

      // ✅ FIX: Redirecting to 'activityLog' as 'notificationLog' is missing from schema
      await prisma.activityLog.create({
        data: {
          actorId: await this.getInternalActorId(), // Helper to find system user
          action: "SEND_SIGNAL",
          resource: "TELEGRAM_BOT",
          metadata: {
            telegramId: telegramId.toString(),
            status: "DELIVERED",
            priority,
            messageId: response.message_id
          }
        }
      });

      return { success: true, messageId: response.message_id };
    } catch (err: any) {
      console.error("🔥 [Dispatch_Fail]:", err);

      await prisma.activityLog.create({
        data: {
          actorId: await this.getInternalActorId(),
          action: "SIGNAL_FAILURE",
          resource: "TELEGRAM_BOT",
          metadata: {
            telegramId: telegramId.toString(),
            status: "FAILED",
            error: err.message
          }
        }
      });

      return { success: false, error: err.message };
    }
  },

  /**
   * 🛡️ ESCAPE_MARKDOWN_V2
   * Logic: Character-level character shielding for Telegram V2 protocol.
   */
  escapeMarkdownV2(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  },

  /**
   * 🛠️ INTERNAL_ACTOR_HELPER
   * Logic: Resolves a consistent ID for system-generated logs.
   */
  async getInternalActorId(): Promise<string> {
    const systemUser = await prisma.user.findFirst({
      where: { role: "super_admin" as any }
    });
    return systemUser?.id || "";
  },

  /**
   * 💎 DISPATCH_PAYMENT_CONFIRMATION
   */
  async notifyPaymentSuccess(telegramId: string, amount: string, reference: string) {
    const message = 
      `✅ *PAYMENT CONFIRMED*\n` +
      `----------------------------\n` +
      `Your transaction of *${amount}* has been processed\\.\n\n` +
      `📄 *Ref:* \`${reference}\`\n` +
      `----------------------------\n` +
      `Your service access is now active\\.`;

    return this.sendSignal({ telegramId, message });
  },

  /**
   * 🚀 DISPATCH_ORDER_UPDATE
   */
  async notifyOrderUpdate(telegramId: string, orderId: string, status: string) {
    const message = 
      `📦 *ORDER UPDATE*\n` +
      `----------------------------\n` +
      `Order *#${orderId.slice(0, 8)}* is now: *${status}*\n` +
      `----------------------------\n` +
      `Check your dashboard for tracking\\.`;

    return this.sendSignal({ telegramId, message });
  }
};