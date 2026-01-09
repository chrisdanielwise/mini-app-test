import prisma from "@/lib/db"
import type { TelegramUser } from "@/lib/auth/telegram"
import type { LanguageCode } from "@/generated/prisma"

export interface CreateUserInput {
  telegramId: bigint
  fullName?: string
  username?: string
  firstName?: string
  lastName?: string
  language?: LanguageCode
}

export interface UpdateUserInput {
  fullName?: string
  username?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  email?: string
  displayName?: string
  language?: LanguageCode
}

export class UserService {
  /**
   * Find or create a user from Telegram data
   */
  static async findOrCreateFromTelegram(telegramUser: TelegramUser) {
    const telegramId = BigInt(telegramUser.id)

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
    })

    if (user) {
      // Update user info if changed
      const updates: UpdateUserInput = {}

      if (telegramUser.first_name && telegramUser.first_name !== user.firstName) {
        updates.firstName = telegramUser.first_name
      }
      if (telegramUser.last_name !== user.lastName) {
        updates.lastName = telegramUser.last_name
      }
      if (telegramUser.username !== user.username) {
        updates.username = telegramUser.username
      }

      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates,
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
        })
      }

      return user
    }

    // Create new user
    const fullName = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(" ")

    const languageMap: Record<string, LanguageCode> = {
      en: "EN",
      ru: "RU",
      fr: "FR",
      es: "ES",
    }

    user = await prisma.user.create({
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
          select: {
            id: true,
            companyName: true,
            planStatus: true,
          },
        },
        platformSubscription: true,
      },
    })

    return user
  }

  /**
   * Get user by ID
   */
  static async getById(userId: string) {
    return prisma.user.findUnique({
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
    })
  }

  /**
   * Get user by Telegram ID
   */
  static async getByTelegramId(telegramId: bigint) {
    return prisma.user.findUnique({
      where: { telegramId },
      include: {
        merchantProfile: true,
        platformSubscription: true,
      },
    })
  }

  /**
   * Update user profile
   */
  static async update(userId: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
    })
  }

  /**
   * Get user's active subscriptions
   */
  static async getActiveSubscriptions(userId: string) {
    return prisma.subscription.findMany({
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
    })
  }

  /**
   * Get user's payment history
   */
  static async getPaymentHistory(userId: string, limit = 20) {
    return prisma.payment.findMany({
      where: { userId },
      include: {
        service: {
          select: {
            name: true,
          },
        },
        merchant: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  }

  /**
   * Get user's orders (for marketplace)
   */
  static async getOrders(userId: string, limit = 20) {
    return prisma.order.findMany({
      where: { customerId: userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        merchant: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  }
}
