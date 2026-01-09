import prisma from "@/lib/db";
import type {
  SubscriptionStatus,
  ProvisioningStep,
  DiscountType,
  CouponScope,
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

// =================================================================
// 🚀 INTERFACES
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
// 🛡️ MERCHANT SERVICE CLASS
// =================================================================

export class MerchantService {
  /**
   * 🛠️ SERIALIZATION HELPER
   * Converts BigInt and Decimal fields to strings.
   * This prevents the "Still Loading" hang in Next.js Server Components.
   */
  private static sanitize(data: any) {
    if (!data) return null;
    return JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  }

  /**
   * Create a new merchant profile
   */
  static async create(input: CreateMerchantInput) {
    const freePlan = await prisma.platformPlan.findFirst({
      where: { name: "Free" },
    });

    return prisma.$transaction(async (tx) => {
      // 1. Update user role
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
        include: { plan: true },
      });

      // 3. Initialize associated records
      await tx.merchantBotConfig.create({ data: { merchantId: merchant.id } });
      await tx.merchantAnalytics.create({ data: { merchantId: merchant.id } });

      return this.sanitize(merchant);
    });
  }

  /**
   * Get merchant by ID
   */
  static async getById(merchantId: string) {
    if (!isUUID(merchantId)) return null;

    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      include: {
        adminUser: true, // Relation name in schema
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

    return this.sanitize(merchant);
  }

  /**
   * Get core dashboard overview statistics
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
            user: {
              select: { fullName: true, username: true, telegramId: true },
            },
            service: { select: { name: true } },
          },
        }),
        prisma.subscription.count({ where: { merchantId, status: "ACTIVE" } }),
        prisma.ticket.count({ where: { merchantId, status: "OPEN" } }),
      ]);

    return {
      analytics: analytics
        ? {
            ...this.sanitize(analytics),
            totalRevenue: analytics.totalRevenue.toString(),
            netRevenue: analytics.netRevenue.toString(),
          }
        : null,
      recentPayments: recentPayments.map((p) => ({
        ...this.sanitize(p),
        amount: p.amount.toString(),
      })),
      activeSubscriptions,
      pendingTickets,
    };
  }

  /**
   * Payout balance data
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
      payouts: payouts.map((p) => this.sanitize(p)),
    };
  }

  /**
   * Coupon Management
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
      ...this.sanitize(c),
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
        maxUses: input.maxUses,
        expiresAt: input.expiresAt,
        isActive: input.isActive,
        scope: input.scope || "GLOBAL",
      },
    });
  }

  /**
   * Ledger History
   */
  static async getLedger(merchantId: string, limit = 50) {
    if (!isUUID(merchantId)) return [];

    const ledgerEntries = await prisma.ledger.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        payment: { select: { id: true, amount: true, currency: true } },
      },
    });

    return ledgerEntries.map((entry) => ({
      ...this.sanitize(entry),
      amount: entry.amount.toString(),
      balanceAfter: entry.balanceAfter.toString(),
    }));
  }

  /**
   * Subscriber Management
   */
  static async getSubscribers(merchantId: string, limit = 50) {
    const subscriptions = await prisma.subscription.findMany({
      where: { merchantId },
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
    });

    return subscriptions.map((sub) => this.sanitize(sub));
  }

  /**
   * Update Profile
   */
  static async update(merchantId: string, data: UpdateMerchantInput) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID");

    const updated = await prisma.merchantProfile.update({
      where: { id: merchantId },
      data,
    });

    return this.sanitize(updated);
  }

  /**
   * Internal status updates
   */
  static async updateProvisioningStatus(
    merchantId: string,
    status: ProvisioningStep,
    error?: string
  ) {
    const updated = await prisma.merchantProfile.update({
      where: { id: merchantId },
      data: { provisioningStatus: status, provisioningError: error },
    });
    return this.sanitize(updated);
  }
}
