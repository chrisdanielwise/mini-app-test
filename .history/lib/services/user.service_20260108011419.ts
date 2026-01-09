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

export class UserService {
  /**
   * Find or create a user from Telegram data
   * PRISMA 7: Correctly handles BigInt and nested merchant profiles
   */
  static async findOrCreateFromTelegram(telegramUser: TelegramUser) {
    const telegramId = BigInt(telegramUser.id);

    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { telegramId },
      include: {
        merchantProfile: {
          select: {
            id: true,
            companyName: true,
            planStatus: true,
          },
        },
        platformSubscription: true,
      },
    });

    if (user) {
      // Update user info if changed
      const updates: UpdateUserInput = {};

      if (
        telegramUser.first_name &&
        telegramUser.first_name !== user.firstName
      ) {
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

      // Map BigInt to String for API safety
      return {
        ...user,
        telegramId: user.telegramId.toString(),
      };
    }

    // Create new user logic
    const fullName = [telegramUser.first_name, telegramUser.last_name]
      .filter(Boolean)
      .join(" ");
    const languageMap: Record<string, LanguageCode> = {
      en: "EN",
      ru: "RU",
      fr: "FR",
      es: "ES",
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

    return {
      ...newUser,
      telegramId: newUser.telegramId.toString(),
    };
  }

  /**
   * Get user by ID
   * Safeguarded against malformed UUIDs
   */
  static async getById(userId: string) {
    if (!isUUID(userId)) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        merchantProfile: true,
        platformSubscription: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          include: {
            service: true,
            serviceTier: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      ...user,
      telegramId: user.telegramId.toString(),
    };
  }

  /**
   * Get user by Telegram ID
   */
  static async getByTelegramId(telegramId: bigint) {
    const user = await prisma.user.findUnique({
      where: { telegramId },
      include: {
        merchantProfile: true,
        platformSubscription: true,
      },
    });

    if (!user) return null;

    return {
      ...user,
      telegramId: user.telegramId.toString(),
    };
  }

  /**
   * Update user profile
   */
  static async update(userId: string, data: UpdateUserInput) {
    if (!isUUID(userId)) throw new Error("Invalid User ID format");

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return {
      ...updatedUser,
      telegramId: updatedUser.telegramId.toString(),
    };
  }

  /**
   * Get user's active subscriptions
   */
  static async getActiveSubscriptions(userId: string) {
    if (!isUUID(userId)) return [];

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
          select: {
            id: true,
            companyName: true,
            botUsername: true,
          },
        },
      },
      orderBy: { expiresAt: "asc" },
    });

    return subscriptions.map((sub) => ({
      ...sub,
      serviceTier: sub.serviceTier
        ? {
            ...sub.serviceTier,
            price: sub.serviceTier.price.toString(), // Decimal safety
          }
        : null,
    }));
  }

  /**
   * Get user's payment history
   */
  static async getPaymentHistory(userId: string, limit = 20) {
    if (!isUUID(userId)) return [];

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
      amount: p.amount.toString(), // Decimal safety
    }));
  }

  /**
   * Get user's orders
   */
  static async getOrders(userId: string, limit = 20) {
    if (!isUUID(userId)) return [];

    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        items: {
          include: {
            product: { select: { name: true, imageUrl: true } },
          },
        },
        merchant: { select: { companyName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return orders.map((o) => ({
      ...o,
      totalAmount: o.totalAmount.toString(), // Decimal safety
    }));
  }
}
