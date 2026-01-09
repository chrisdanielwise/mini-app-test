import prisma from "@/lib/db"
import type { SubscriptionStatus, ProvisioningStep } from "@/generated/prisma"

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
   */
  static async create(input: CreateMerchantInput) {
    // Get the free plan
    const freePlan = await prisma.platformPlan.findFirst({
      where: { name: "Free" },
    })

    return prisma.$transaction(async (tx) => {
      // Update user role to MERCHANT
      await tx.user.update({
        where: { telegramId: input.adminUserId },
        data: { role: "MERCHANT" },
      })

      // Create merchant profile
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

      // Create default bot config
      await tx.merchantBotConfig.create({
        data: {
          merchantId: merchant.id,
        },
      })

      // Create analytics record
      await tx.merchantAnalytics.create({
        data: {
          merchantId: merchant.id,
        },
      })

      return merchant
    })
  }

  /**
   * Get merchant by ID
   */
  static async getById(merchantId: string) {
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
            tiers: {
              where: { isActive: true },
            },
          },
        },
      },
    })
  }

  /**
   * Get merchant by bot ID (for routing bot messages)
   */
  static async getByBotId(botId: bigint) {
    return prisma.merchantProfile.findUnique({
      where: { botId },
      include: {
        botConfig: true,
        services: {
          where: { isActive: true },
          include: {
            tiers: {
              where: { isActive: true },
            },
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
    return prisma.merchantProfile.update({
      where: { id: merchantId },
      data,
    })
  }

  /**
   * Update provisioning status
   */
  static async updateProvisioningStatus(merchantId: string, status: ProvisioningStep, error?: string) {
    return prisma.merchantProfile.update({
      where: { id: merchantId },
      data: {
        provisioningStatus: status,
        provisioningError: error,
      },
    })
  }

  /**
   * Get merchant dashboard stats
   */
  static async getDashboardStats(merchantId: string) {
    const [analytics, recentPayments, activeSubscriptions, pendingTickets] = await Promise.all([
      prisma.merchantAnalytics.findUnique({
        where: { merchantId },
      }),
      prisma.payment.findMany({
        where: { merchantId, status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: {
            select: {
              fullName: true,
              username: true,
            },
          },
          service: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.subscription.count({
        where: { merchantId, status: "ACTIVE" },
      }),
      prisma.ticket.count({
        where: { merchantId, status: "OPEN" },
      }),
    ])

    return {
      analytics,
      recentPayments,
      activeSubscriptions,
      pendingTickets,
    }
  }

  /**
   * Get merchant's ledger entries
   */
  static async getLedger(merchantId: string, limit = 50) {
    return prisma.ledger.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        payment: {
          select: {
            id: true,
            amount: true,
            currency: true,
          },
        },
      },
    })
  }

  /**
   * Get merchant's subscribers
   */
  static async getSubscribers(
    merchantId: string,
    options: {
      status?: SubscriptionStatus
      limit?: number
      offset?: number
    } = {},
  ) {
    const { status, limit = 50, offset = 0 } = options

    const where = {
      merchantId,
      ...(status && { status }),
    }

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              telegramId: true,
              fullName: true,
              username: true,
            },
          },
          service: {
            select: {
              name: true,
            },
          },
          serviceTier: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.subscription.count({ where }),
    ])

    return { subscriptions, total }
  }

  /**
   * Check if merchant has reached plan limits
   */
  static async checkPlanLimits(merchantId: string) {
    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      include: {
        plan: true,
        _count: {
          select: {
            subscriptions: { where: { status: "ACTIVE" } },
            teamMembers: true,
            services: { where: { isActive: true } },
          },
        },
      },
    })

    if (!merchant || !merchant.plan) {
      return { allowed: false, reason: "No plan found" }
    }

    const { plan, _count } = merchant

    return {
      allowed: true,
      limits: {
        subscribers: {
          current: _count.subscriptions,
          max: plan.maxSubscribers,
          exceeded: plan.maxSubscribers !== -1 && _count.subscriptions >= plan.maxSubscribers,
        },
        teamMembers: {
          current: _count.teamMembers,
          max: plan.maxTeamMembers,
          exceeded: plan.maxTeamMembers !== -1 && _count.teamMembers >= plan.maxTeamMembers,
        },
        services: {
          current: _count.services,
          max: plan.maxServices,
          exceeded: plan.maxServices !== -1 && _count.services >= plan.maxServices,
        },
      },
      features: {
        coupons: plan.allowCoupons,
        whitelabel: plan.allowWhitelabel,
        broadcasts: plan.allowBroadcasts,
      },
    }
  }
}
