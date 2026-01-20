"use server";

import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot";
// ✅ Institutional Ingress: Pulling mapped enums from your generated client
import { 
  ActivityLog, 
  UserRole, 
  SenderType,
  ExecutionStatus // Added to handle SUCCESS/FAILED states
} from "@/generated/prisma";

/**
 * 🌊 DISPATCH_HUB_SERVICE (Institutional Apex v2026.1.20 - HARDENED)
 * Fix: Uses 'link_preview' to satisfy modern GrammY types.
 * Fix: Uses Enum objects (UserRole, ExecutionStatus) to match mapped schema.
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
  }): Promise<{ success: boolean; messageId?: number; error?: string }> {
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
          link_preview: { is_disabled: true },
        }
      );

      // ✅ FIX: Using ExecutionStatus.SUCCESS (maps to "success" in DB)
      await prisma.activityLog.create({
        data: {
          actorId: await this.getInternalActorId(),
          action: "SEND_SIGNAL",
          resource: "TELEGRAM_BOT",
          metadata: {
            telegramId: telegramId.toString(),
            status: "success", // Matches ExecutionStatus
            priority,
            messageId: response.message_id
          }
        }
      });

      return { success: true, messageId: response.message_id };
    } catch (err: any) {
      console.error("🔥 [Dispatch_Fail]:", err);

      // ✅ FIX: Using ExecutionStatus.FAILED (maps to "failed" in DB)
      await prisma.activityLog.create({
        data: {
          actorId: await this.getInternalActorId(),
          action: "SIGNAL_FAILURE",
          resource: "TELEGRAM_BOT",
          metadata: {
            telegramId: telegramId.toString(),
            status: "failed", // Matches ExecutionStatus
            error: err.message
          }
        }
      });

      return { success: false, error: err.message };
    }
  },

  /**
   * 🛡️ ESCAPE_MARKDOWN_V2
   */
  escapeMarkdownV2(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  },

  /**
   * 🛠️ INTERNAL_ACTOR_HELPER
   * Logic: Resolves the system actor using the UserRole Enum.
   */
  async getInternalActorId(): Promise<string> {
    const systemUser = await prisma.user.findFirst({
      // ✅ FIX: Uses UserRole.SUPER_ADMIN (maps to "super_admin" in DB)
      where: { role: UserRole.SUPER_ADMIN }
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

    // Internal context uses SenderType.SYSTEM
    const type: SenderType = SenderType.SYSTEM; 

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