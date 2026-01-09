import prisma from "@/lib/db";
import type { 
  SubscriptionStatus, 
  ProvisioningStep, 
  DiscountType, 
  CouponScope 
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

// =================================================================
// INTERFACES
// =================================================================

export interface CreateMerchantInput {
  adminUserId: bigint;
  companyName: string;
  botToken?: string;
  botId?: bigint;
  botUsername?: string;
}

export interface UpdateMerchantInput {
  companyName?: string;
  botToken?: string;
  botId?: bigint;
  botUsername?: string;
  contactSupportUrl?: string;
  googleDriveLink?: string;
  lastLoginToken?: string;
  tokenExpires?: Date;
  availableBalance?: number;
  pendingEscrow?: number;
}

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED";
  amount: number;
  maxUses?: number;
  expiresAt?: Date;
  isActive: boolean;
}

// =================================================================
// MERCHANT SERVICE CLASS
// =================================================================

export class MerchantService {
  /**
   * Create a new merchant profile
   * Uses a database transaction to ensure all related configs are created
   */
  static async create(input: CreateMerchantInput) {
    const freePlan = await prisma.platformPlan.findFirst({
      where: { name: "Free" },
    });

    return prisma.$transaction(async (tx) => {
      // 1. Update user role to MERCHANT
      await tx.user.update({
        where: { telegramId: input.adminUserId },
        data: { role: "MERCHANT" },
      });

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
      });

      // 3. Initialize bot configuration and analytics shell
      await tx.merchantBotConfig.create({ data: { merchantId: merchant.id } });
      await tx.merchantAnalytics.create({ data: { merchantId: merchant.id } });

      return merchant;
    });
  }

  /**
   * Get merchant by ID
   * Includes all relations required for the dashboard
   */
  static async getById(merchantId: string) {
    if (!isUUID(merchantId)) return null;

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
    });
  }

  /**
   * Get merchant by bot ID
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
    });
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
    });
  }

  /**
   * Update merchant profile data
   */
  static async update(merchantId: string, data: UpdateMerchantInput) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant UUID format");

    return prisma.merchantProfile.update({
      where: { id: merchantId },
      data,
    });
  }

  /**
   * Update internal provisioning status
   */
  static async updateProvisioningStatus(
    merchantId: string,
    status: ProvisioningStep,
    error?: string
  ) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant UUID format");

    return prisma.merchantProfile.update({
      where: { id: merchantId },
      data: {
        provisioningStatus: status,
        provisioningError: error,
      },
    });
  }

  /**
   * Fetches core stats for the Merchant Overview page
   * Handles Decimal to String conversion for frontend safety
   */
  static async getDashboardStats(merchantId: string) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID format");

    const [analytics, recentPayments, activeSubscriptions, pendingTickets] =
      await Promise.all([
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
      ]);

    return {
      analytics: analytics ? {
        ...analytics,
        totalRevenue: analytics.totalRevenue.toString(),
        netRevenue: analytics.netRevenue.toString()
      } : null,
      recentPayments: recentPayments.map((p) => ({
        ...p,
        amount: p.amount.toString(),
      })),
      activeSubscriptions,
      pendingTickets,
    };
  }

  /**
   * Get Payout Balances and Request History
   */
  static async getPayoutData(merchantId: string) {
    if (!isUUID(merchantId)) throw new Error("Invalid ID");

    const [merchant, payouts] = await Promise.all([
      prisma.merchantProfile.findUnique({
        where: { id: merchantId },
        select: { availableBalance: true, pendingEscrow: true }
      }),
      prisma.payoutRequest.findMany({
        where: { merchantId },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ]);

    return {
      balance: {
        available: merchant?.availableBalance?.toString() || "0.00",
        pending: merchant?.pendingEscrow?.toString() || "0.00"
      },
      payouts: payouts.map(p => ({
        ...p,
        amount: p.amount.toString()
      }))
    };
  }

  /**
   * Manage Coupons & Discounts
   */
  static async getCoupons(merchantId: string) {
    if (!isUUID(merchantId)) return [];

    const coupons = await prisma.coupon.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { redemptions: true } }
      }
    });

    return coupons.map(c => ({
      ...c,
      amount: c.amount.toString(),
      useCount: c._count.redemptions
    }));
  }

  static async createCoupon(merchantId: string, input: CreateCouponInput) {
    if (!isUUID(merchantId)) throw new Error("Invalid ID");

    return prisma.coupon.create({
      data: {
        merchantId,
        code: input.code.toUpperCase(),
        description: input.description,
        discountType: input.discountType,
        amount: input.amount,
        maxUses: input.maxUses,
        expiresAt: input.expiresAt,
        isActive: input.isActive
      }
    });
  }

  /**
   * Get financial ledger for the merchant
   */
  static async getLedger(merchantId: string, limit = 50) {
    if (!isUUID(merchantId)) return [];

    const ledgerEntries = await prisma.ledger.findMany({
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
    });

    return ledgerEntries.map((entry) => ({
      ...entry,
      amount: entry.amount.toString(),
      balanceAfter: entry.balanceAfter.toString(),
      payment: entry.payment
        ? {
            ...entry.payment,
            amount: entry.payment.amount.toString(),
          }
        : null,
    }));
  }

  /**
   * Subscriber Management with BigInt/Decimal fixes
   */
  static async getSubscribers(
    merchantId: string,
    options: {
      status?: SubscriptionStatus;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    if (!isUUID(merchantId)) return { subscriptions: [], total: 0 };

    const { status, limit = 50, offset = 0 } = options;
    const where = { merchantId, ...(status && { status }) };

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
          service: { select: { name: true } },
          serviceTier: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.subscription.count({ where }),
    ]);

    return {
      subscriptions: subscriptions.map((sub) => ({
        ...sub,
        user: {
          ...sub.user,
          telegramId: sub.user.telegramId.toString(),
        },
      })),
      total,
    };
  }

  /**
   * Validates if the merchant is within their plan's limits
   */
  static async checkPlanLimits(merchantId: string) {
    if (!isUUID(merchantId))
      return { allowed: false, reason: "Invalid Merchant ID" };

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
    });

    if (!merchant || !merchant.plan) {
      return { allowed: false, reason: "No plan found" };
    }

    const { plan, _count } = merchant;

    return {
      allowed: true,
      limits: {
        subscribers: {
          current: _count.subscriptions,
          max: plan.maxSubscribers,
          exceeded:
            plan.maxSubscribers !== -1 &&
            _count.subscriptions >= plan.maxSubscribers,
        },
        teamMembers: {
          current: _count.teamMembers,
          max: plan.maxTeamMembers,
          exceeded:
            plan.maxTeamMembers !== -1 &&
            _count.teamMembers >= plan.maxTeamMembers,
        },
        services: {
          current: _count.services,
          max: plan.maxServices,
          exceeded:
            plan.maxServices !== -1 && _count.services >= plan.maxServices,
        },
      },
      features: {
        coupons: plan.allowCoupons,
        whitelabel: plan.allowWhitelabel,
        broadcasts: plan.allowBroadcasts,
      },
    };
  }
} 