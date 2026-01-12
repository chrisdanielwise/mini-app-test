import prisma from "@/lib/db";
import type { TelegramUser } from "@/lib/auth/telegram";
import type { LanguageCode } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

export interface CreateUserInput {
  telegramId: bigint;
  fullName?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  language?: LanguageCode;
}

export interface UpdateUserInput {
  fullName?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  displayName?: string;
  language?: LanguageCode;
}

/**
 * 🚀 DB RESILIENCE HELPER
 * Hardened for Neon Serverless: Specifically catches P1001 connectivity errors.
 * Implements incremental backoff to allow the database node to wake up.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxAttempts = 5 // Increased attempts for better cold-start coverage
): Promise<T> {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      return await fn();
    } catch (error: any) {
      attempts++;
      
      // ✅ Hardened Detection: Checks for timeout strings and specific Prisma codes
      const isRetryable =
        error.message.includes("timeout") ||
        error.message.includes("terminated") ||
        error.code === 'P1001' || // Can't reach database server
        error.code === 'P2024' || // Connection timed out
        error.code === 'P2028';   // Transaction API error

      if (isRetryable && attempts < maxAttempts) {
        // ⏳ Incremental Backoff: Wait time increases per attempt (2s, 4s, 6s...)
        const waitTime = attempts * 2000;
        console.warn(
          `[Database_Sync] ${label}: Connectivity issue (Code: ${error.code || 'TIMEOUT'}). Attempt ${attempts}/${maxAttempts}. Retrying in ${waitTime/1000}s...`
        );
        await new Promise((res) => setTimeout(res, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Critical: Database node unreachable for ${label} after ${maxAttempts} attempts.`);
}

export class UserService {
  /**
   * Find or create a user from Telegram data
   */
  static async findOrCreateFromTelegram(telegramUser: TelegramUser) {
    const telegramId = BigInt(telegramUser.id);

    return withRetry(async () => {
      // Try to find existing user
      let user = await prisma.user.findUnique({
        where: { telegramId },
        include: {
          merchantProfile: {
            select: { id: true, companyName: true, planStatus: true },
          },
          platformSubscription: true,
        },
      });

      if (user) {
        const updates: UpdateUserInput = {};
        if (telegramUser.first_name && telegramUser.first_name !== user.firstName) {
          updates.firstName = telegramUser.first_name;
        }
        if (telegramUser.last_name !== user.lastName) {
          updates.lastName = telegramUser.last_name;
        }
        if (telegramUser.username !== user.username) {
          updates.username = telegramUser.username;
        }

        if (Object.keys(updates).length > 0) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: updates,
            include: {
              merchantProfile: {
                select: { id: true, companyName: true, planStatus: true },
              },
              platformSubscription: true,
            },
          });
        }

        return { ...user, telegramId: user.telegramId.toString() };
      }

      // Create new user logic
      const fullName = [telegramUser.first_name, telegramUser.last_name]
        .filter(Boolean)
        .join(" ");
      const languageMap: Record<string, LanguageCode> = {
        en: "EN", ru: "RU", fr: "FR", es: "ES",
      };

      const newUser = await prisma.user.create({
        data: {
          telegramId,
          fullName: fullName || undefined,
          username: telegramUser.username,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          language: languageMap[telegramUser.language_code || "en"] || "EN",
          role: "USER",
        },
        include: {
          merchantProfile: {
            select: { id: true, companyName: true, planStatus: true },
          },
          platformSubscription: true,
        },
      });

      return { ...newUser, telegramId: newUser.telegramId.toString() };
    }, "findOrCreateFromTelegram");
  }

  /**
   * Get user by ID (Resilient)
   */
  static async getById(userId: string) {
    if (!isUUID(userId)) return null;

    return withRetry(async () => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          merchantProfile: true,
          platformSubscription: true,
          subscriptions: {
            where: { status: "ACTIVE" },
            include: { service: true, serviceTier: true },
          },
        },
      });

      if (!user) return null;
      return { ...user, telegramId: user.telegramId.toString() };
    }, "getById");
  }

  /**
   * Get user's active subscriptions
   */
  static async getActiveSubscriptions(userId: string) {
    if (!isUUID(userId)) return [];

    return withRetry(async () => {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId,
          status: "ACTIVE",
          expiresAt: { gt: new Date() },
        },
        include: {
          service: true,
          serviceTier: true,
          merchant: {
            select: { id: true, companyName: true, botUsername: true },
          },
        },
        orderBy: { expiresAt: "asc" },
      });

      return subscriptions.map((sub) => ({
        ...sub,
        serviceTier: sub.serviceTier
          ? { ...sub.serviceTier, price: sub.serviceTier.price.toString() }
          : null,
      }));
    }, "getActiveSubscriptions");
  }

  /**
   * Get user's payment history (Resilient)
   */
  static async getPaymentHistory(userId: string, limit = 20) {
    if (!isUUID(userId)) return [];

    return withRetry(async () => {
      const payments = await prisma.payment.findMany({
        where: { userId },
        include: {
          service: { select: { name: true } },
          merchant: { select: { companyName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });

      return payments.map((p) => ({
        ...p,
        amount: p.amount.toString(),
      }));
    }, "getPaymentHistory");
  }

  /**
   * Update user profile (Resilient)
   */
  static async update(userId: string, data: UpdateUserInput) {
    if (!isUUID(userId)) throw new Error("Invalid User ID format");

    return withRetry(async () => {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
      });
      return { ...updatedUser, telegramId: updatedUser.telegramId.toString() };
    }, "updateUser");
  }

  /**
   * Helper Methods for IDs
   */
  static async getByTelegramId(telegramId: bigint) {
    return withRetry(async () => {
      const user = await prisma.user.findUnique({
        where: { telegramId },
        include: { merchantProfile: true, platformSubscription: true },
      });
      if (!user) return null;
      return { ...user, telegramId: user.telegramId.toString() };
    }, "getByTelegramId");
  }

  static async getOrders(userId: string, limit = 20) {
    if (!isUUID(userId)) return [];
    return withRetry(async () => {
      const orders = await prisma.order.findMany({
        where: { customerId: userId },
        include: {
          items: {
            include: { product: { select: { name: true, imageUrl: true } } },
          },
          merchant: { select: { companyName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return orders.map((o) => ({
        ...o,
        totalAmount: o.totalAmount.toString(),
      }));
    }, "getOrders");
  }
}