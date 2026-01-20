"use server";

import prisma from "@/lib/db";
import { telegramBot } from "@/lib/telegram/bot";
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Prisma Types
import { 
  UserRole, 
  ExecutionStatus,
  NotificationType
} from "@/generated/prisma";

/**
 * 🌊 DISPATCH_HUB_SERVICE (Institutional Apex v2026.1.20 - HARDENED)
 * Fix: Updated 'link_preview' to satisfy specific grammY version constraints.
 * Fix: Replaced raw strings with Prisma Enum objects to match @map logic.
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
    // ✅ Using Prisma NotificationType for priority/level logic
    type?: NotificationType;
  }): Promise<{ success: boolean; messageId?: number; error?: string }> {
    const { 
      telegramId, 
      message, 
      parseMode = "MarkdownV2", 
      replyMarkup, 
      type = NotificationType.INFO 
    } = params;

    const escapedMessage = parseMode === "MarkdownV2" 
      ? this.escapeMarkdownV2(message) 
      : message;

    try {
      // 🛡️ API HANDSHAKE: Logic for modern grammY link preview
      const response = await telegramBot.api.sendMessage(
        telegramId.toString(), 
        escapedMessage, 
        {
          parse_mode: parseMode,
          reply_markup: replyMarkup,
          // ✅ FIX: If 'link_preview' fails TS, your version uses 'disable_web_page_preview'
          // OR requires the object to be passed inside 'link_preview'
          link_preview_options: { is_disabled: true } 
        }
      );

      // ✅ FIX: Using ExecutionStatus.SUCCESS enum
      await prisma.activityLog.create({
        data: {
          actorId: await this.getInternalActorId(),
          action: "SEND_SIGNAL",
          resource: "TELEGRAM_BOT",
          metadata: {
            telegramId: telegramId.toString(),
            status: ExecutionStatus.SUCCESS, // Maps to "success"
            type: type,
            messageId: response.message_id
          }
        }
      });

      return { success: true, messageId: response.message_id };
    } catch (err: any) {
      console.error("🔥 [Dispatch_Fail]:", err);

      // ✅ FIX: Using ExecutionStatus.FAILED enum
      await prisma.activityLog.create({
        data: {
          actorId: await this.getInternalActorId(),
          action: "SIGNAL_FAILURE",
          resource: "TELEGRAM_BOT",
          metadata: {
            telegramId: telegramId.toString(),
            status: ExecutionStatus.FAILED, // Maps to "failed"
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
      // ✅ FIX: Uses UserRole.SUPER_ADMIN (Maps to "super_admin")
      where: { role: UserRole.SUPER_ADMIN }
    });
    return systemUser?.id || "";
  },

  /**
   * 💎 DISPATCH_PAYMENT_SUCCESS
   */
  async notifyPaymentSuccess(telegramId: string, amount: string, reference: string) {
    const message = 
      `✅ *PAYMENT CONFIRMED*\n` +
      `----------------------------\n` +
      `Your transaction of *${amount}* has been processed\\.\n\n` +
      `📄 *Ref:* \`${reference}\`\n` +
      `----------------------------\n` +
      `Your service access is now active\\.`;

    return this.sendSignal({ 
      telegramId, 
      message, 
      type: NotificationType.SUCCESS 
    });
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

    return this.sendSignal({ 
      telegramId, 
      message, 
      type: NotificationType.INFO 
    });
  }
};