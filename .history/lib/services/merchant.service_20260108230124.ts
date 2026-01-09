import prisma from "@/lib/db";
import type {
  SubscriptionStatus,
  ProvisioningStep,
  DiscountType,
  CouponScope,
} from "@/src/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
// import { SubscriptionStatus } from "@/src/generated/prisma";

// =================================================================
// INTERFACES (Schema-Matched)
// =================================================================

export interface CreateMerchantInput {
  adminUserId: bigint; // Telegram ID
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
  provisioningStatus?: ProvisioningStep;
}

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: DiscountType;
  amount: number;
  maxUses?: number;
  expiresAt?: Date;
  isActive: boolean;
  scope?: CouponScope;
}

// =================================================================
// MERCHANT SERVICE CLASS
// =================================================================

export class MerchantService {
  /**
   * 🚀 CREATE MERCHANT PROFILE
   * Uses a transaction to ensure User, Profile, Config, and Analytics
   * are all initialized in one atomic step.
   */
  static async create(input: CreateMerchantInput) {
    const freePlan = await prisma.platformPlan.findFirst({
      where: { name: "Free" },
    });

    return prisma.$transaction(async (tx) => {
      // 1. Elevate User to Merchant Role
      await tx.user.update({
        where: { telegramId: input.adminUserId },
        data: { role: "MERCHANT" },
      });

      // 2. Initialize MerchantProfile (Matches 'merchants' table)
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
        include: { plan: true },
      });

      // 3. Setup Config Shells
      await tx.merchantBotConfig.create({ data: { merchantId: merchant.id } });
      await tx.merchantAnalytics.create({ data: { merchantId: merchant.id } });

      return merchant;
    });
  }

  /**
   * 📊 FETCH DASHBOARD STATS
   * Root cause fix: Explicitly stringifies Decimal types from your schema.
   */
  static async getDashboardStats(merchantId: string) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID format");

    const [analytics, recentPayments, activeSubscriptions, pendingTickets] =
      await Promise.all([
        prisma.merchantAnalytics.findUnique({ where: { merchantId } }),
        prisma.payment.findMany({
          where: { merchantId },
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
      analytics: analytics
        ? {
            ...analytics,
            totalRevenue: analytics.totalRevenue.toString(),
            netRevenue: analytics.netRevenue.toString(),
            totalDiscounts: analytics.totalDiscounts.toString(),
          }
        : null,
      recentPayments: recentPayments.map((p) => ({
        ...p,
        amount: p.amount.toString(),
      })),
      activeSubscriptions,
      pendingTickets,
    };
  }

  /**
   * 🏦 GET PAYOUT DATA
   * Accesses 'availableBalance' and 'pendingEscrow' from the MerchantProfile.
   */
  static async getPayoutData(merchantId: string) {
    if (!isUUID(merchantId)) throw new Error("Invalid ID");

    const [merchant, payouts] = await Promise.all([
      prisma.merchantProfile.findUnique({
        where: { id: merchantId },
        select: { availableBalance: true, pendingEscrow: true },
      }),
      prisma.payoutRequest.findMany({
        where: { merchantId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return {
      balance: {
        available: merchant?.availableBalance?.toString() || "0.00",
        pending: merchant?.pendingEscrow?.toString() || "0.00",
      },
      payouts: payouts.map((p) => ({
        ...p,
        amount: p.amount.toString(),
      })),
    };
  }

  /**
   * 🎟️ COUPON MANAGEMENT
   */
  static async getCoupons(merchantId: string) {
    if (!isUUID(merchantId)) return [];

    const coupons = await prisma.coupon.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { redemptions: true } },
      },
    });

    return coupons.map((c) => ({
      ...c,
      amount: c.amount.toString(),
      useCount: c._count.redemptions,
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
        scope: input.scope || "GLOBAL",
        maxUses: input.maxUses,
        expiresAt: input.expiresAt,
        isActive: input.isActive,
      },
    });
  }

  /**
   * 👥 SUBSCRIBER MANAGEMENT
   * Fixes BigInt TelegramID precision loss during list rendering.
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
          telegramId: sub.user.telegramId.toString(), // 🏁 BIGINT FIX
        },
      })),
      total,
    };
  }

  /**
   * 🛠️ CORE UPDATE METHODS
   */
  static async update(merchantId: string, data: UpdateMerchantInput) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant UUID format");
    return prisma.merchantProfile.update({
      where: { id: merchantId },
      data,
    });
  }

  static async getById(merchantId: string) {
    if (!isUUID(merchantId)) return null;
    return prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      include: {
        plan: true,
        botConfig: true,
        analytics: true,
        paymentConfig: true,
      },
    });
  }
}
