import prisma from "@/lib/db"
import type { SubscriptionStatus, IntervalUnit } from "@/generated/prisma"
import { Decimal } from "@prisma/client/runtime/library"

export interface CreateSubscriptionInput {
  userId: string
  merchantId: string
  serviceId: string
  serviceTierId: string
  paymentId?: string
}

export class SubscriptionService {
  /**
   * Calculate expiration date based on tier interval
   */
  static calculateExpiresAt(interval: IntervalUnit, intervalCount: number, startDate: Date = new Date()): Date {
    const expiresAt = new Date(startDate)

    switch (interval) {
      case "DAY":
        expiresAt.setDate(expiresAt.getDate() + intervalCount)
        break
      case "WEEK":
        expiresAt.setDate(expiresAt.getDate() + intervalCount * 7)
        break
      case "MONTH":
        expiresAt.setMonth(expiresAt.getMonth() + intervalCount)
        break
      case "YEAR":
        expiresAt.setFullYear(expiresAt.getFullYear() + intervalCount)
        break
    }

    return expiresAt
  }

  /**
   * Create or extend a subscription
   */
  static async createOrExtend(input: CreateSubscriptionInput) {
    const { userId, merchantId, serviceId, serviceTierId, paymentId } = input

    // Get service tier details
    const tier = await prisma.serviceTier.findUnique({
      where: { id: serviceTierId },
      include: { service: true },
    })

    if (!tier) {
      throw new Error("Service tier not found")
    }

    // Check for existing subscription
    const existing = await prisma.subscription.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    })

    const now = new Date()

    // Calculate new expiration
    const startDate =
      existing && existing.status === "ACTIVE" && existing.expiresAt > now
        ? existing.expiresAt // Extend from current expiration
        : now // Start fresh

    const expiresAt = this.calculateExpiresAt(tier.interval, tier.intervalCount, startDate)

    if (existing) {
      // Extend existing subscription
      return prisma.subscription.update({
        where: { id: existing.id },
        data: {
          serviceTierId,
          status: "ACTIVE",
          expiresAt,
          renewals: { increment: 1 },
          inviteLink: tier.service.vipInviteLink,
        },
        include: {
          service: true,
          serviceTier: true,
          merchant: {
            select: {
              companyName: true,
              botUsername: true,
            },
          },
        },
      })
    }

    // Create new subscription
    return prisma.subscription.create({
      data: {
        userId,
        merchantId,
        serviceId,
        serviceTierId,
        status: "ACTIVE",
        startsAt: now,
        expiresAt,
        inviteLink: tier.service.vipInviteLink,
      },
      include: {
        service: true,
        serviceTier: true,
        merchant: {
          select: {
            companyName: true,
            botUsername: true,
          },
        },
      },
    })
  }

  /**
   * Get subscription by ID
   */
  static async getById(subscriptionId: string) {
    return prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        user: {
          select: {
            id: true,
            telegramId: true,
            fullName: true,
            username: true,
          },
        },
        service: true,
        serviceTier: true,
        merchant: {
          select: {
            id: true,
            companyName: true,
            botUsername: true,
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    })
  }

  /**
   * Update subscription status
   */
  static async updateStatus(subscriptionId: string, status: SubscriptionStatus) {
    return prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status },
    })
  }

  /**
   * Get expiring subscriptions (for cron job)
   */
  static async getExpiring(hoursAhead = 24) {
    const now = new Date()
    const threshold = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)

    return prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        expiresAt: {
          gte: now,
          lte: threshold,
        },
      },
      include: {
        user: {
          select: {
            telegramId: true,
            fullName: true,
          },
        },
        service: {
          select: {
            name: true,
            vipChannelId: true,
          },
        },
        merchant: {
          select: {
            botId: true,
            botToken: true,
          },
        },
      },
    })
  }

  /**
   * Expire subscriptions (for cron job)
   */
  static async expireOverdue() {
    const now = new Date()

    const expired = await prisma.subscription.updateMany({
      where: {
        status: "ACTIVE",
        expiresAt: { lt: now },
      },
      data: {
        status: "EXPIRED",
      },
    })

    return expired.count
  }

  /**
   * Get subscription stats for a merchant
   */
  static async getMerchantStats(merchantId: string) {
    const [active, expired, total, revenueData] = await Promise.all([
      prisma.subscription.count({
        where: { merchantId, status: "ACTIVE" },
      }),
      prisma.subscription.count({
        where: { merchantId, status: "EXPIRED" },
      }),
      prisma.subscription.count({
        where: { merchantId },
      }),
      prisma.payment.aggregate({
        where: { merchantId, status: "SUCCESS" },
        _sum: { amount: true },
      }),
    ])

    return {
      active,
      expired,
      total,
      totalRevenue: revenueData._sum.amount || new Decimal(0),
    }
  }
}
