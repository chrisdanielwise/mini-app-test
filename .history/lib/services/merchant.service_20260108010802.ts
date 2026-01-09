import prisma from "@/lib/db"
import type { SubscriptionStatus, ProvisioningStep } from "@/generated/prisma"
import { isUUID } from "@/lib/utils/validators"

export interface CreateMerchantInput {
  adminUserId: bigint
  companyName: string
  botToken?: string
  botId?: bigint
  botUsername?: string
}

export interface UpdateMerchantInput {
  companyName?: string
  botToken?: string
  botId?: bigint
  botUsername?: string
  contactSupportUrl?: string
  googleDriveLink?: string
}

export class MerchantService {
  /**
   * Create a new merchant profile
   * Correctly handles BigInt for telegramId and uses Transaction safety
   */
  static async create(input: CreateMerchantInput) {
    const freePlan = await prisma.platformPlan.findFirst({
      where: { name: "Free" },
    })

    return prisma.$transaction(async (tx) => {
      // 1. Update user role
      await tx.user.update({
        where: { telegramId: input.adminUserId },
        data: { role: "MERCHANT" },
      })

      // 2. Create merchant profile
      const merchant = await tx.merchantProfile.create({
        data: {
          adminUserId: input.adminUserId,
          companyName: input.companyName,
          botToken: input.botToken,
          botId: input.botId,
          botUsername: input.botUsername,
          planId: freePlan?.id,
          planStatus: "ACTIVE",
          provisioningStatus: "IDLE",
        },
        include: {
          plan: true,
        },
      })

      // 3. Initialize config and analytics
      await tx.merchantBotConfig.create({ data: { merchantId: merchant.id } })
      await tx.merchantAnalytics.create({ data: { merchantId: merchant.id } })

      return merchant
    })
  }

  /**
   * Get merchant by ID
   * PRISMA 7 FIX: Prevents P2007 UUID syntax errors
   */
  static async getById(merchantId: string) {
    if (!isUUID(merchantId)) return null

    return prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      include: {
        plan: true,
        botConfig: true,
        analytics: true,
        paymentConfig: true,
        services: {
          where: { isActive: true },
          include: {
            tiers: { where: { isActive: true } },
          },
        },
      },
    })
  }

  /**
   * Get merchant by bot ID (BigInt safe)
   */
  static async getByBotId(botId: bigint) {
    return prisma.merchantProfile.findUnique({
      where: { botId },
      include: {
        botConfig: true,
        services: {
          where: { isActive: true },
          include: {
            tiers: { where: { isActive: true } },
          },
        },
      },
    })
  }

  /**
   * Get merchant by admin user's Telegram ID
   */
  static async getByAdminTelegramId(telegramId: bigint) {
    return prisma.merchantProfile.findUnique({
      where: { adminUserId: telegramId },
      include: {
        plan: true,
        botConfig: true,
        analytics: true,
      },
    })
  }

  /**
   * Update merchant profile
   */
  static async update(merchantId: string, data: UpdateMerchantInput) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant UUID")
    
    return prisma.merchantProfile.update({
      where: { id: merchantId },
      data,
    })
  }

  /**
   * Get dashboard stats
   * Fixes Decimal serialization issues for Next.js APIs
   */
  static async getDashboardStats(merchantId: string) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID")

    const [analytics, recentPayments, activeSubscriptions, pendingTickets] = await Promise.all([
      prisma.merchantAnalytics.findUnique({ where: { merchantId } }),
      prisma.payment.findMany({
        where: { merchantId, status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { fullName: true, username: true } },
          service: { select: { name: true } },
        },
      }),
      prisma.subscription.count({ where: { merchantId, status: "ACTIVE" } }),
      prisma.ticket.count({ where: { merchantId, status: "OPEN" } }),
    ])

    return {
      analytics,
      // Convert Decimal amounts to strings for JSON safety
      recentPayments: recentPayments.map(p => ({
        ...p,
        amount: p.amount.toString()
      })),
      activeSubscriptions,
      pendingTickets,
    }
  }

  /**
   * Get merchant's subscribers
   * Fixes BigInt serialization for telegramId
   */
  static async getSubscribers(
    merchantId: string,
    options: { status?: SubscriptionStatus; limit?: number; offset?: number } = {},
  ) {
    if (!isUUID(merchantId)) return { subscriptions: [], total: 0 }
    
    const { status, limit = 50, offset = 0 } = options
    const where = { merchantId, ...(status && { status }) }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          user: { select: { id: true, telegramId: true, fullName: true, username: true } },
          service: { select: { name: true } },
          serviceTier: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.subscription.count({ where }),
    ])

    return {
      // Maps BigInt to string to avoid "Do not know how to serialize BigInt"
      subscriptions: subscriptions.map(sub => ({
        ...sub,
        user: { 
          ...sub.user, 
          telegramId: sub.user.telegramId.toString() 
        }
      })),
      total 
    }
  }
}