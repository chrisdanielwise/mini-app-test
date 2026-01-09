import prisma from "@/lib/db";
import type { 
  SubscriptionStatus, 
  ProvisioningStep, 
  DiscountType, 
  CouponScope 
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

// =================================================================
// 🚀 UPDATED INTERFACES
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
  provisioningStatus?: ProvisioningStep; // Added this
}

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: DiscountType; // Use the actual Enum type
  amount: number;
  maxUses?: number;
  expiresAt?: Date;
  isActive: boolean;
  scope?: CouponScope; // Match schema V2
}

// =================================================================
// 🛡️ MERCHANT SERVICE CLASS
// =================================================================

export class MerchantService {
  /**
   * 🛠️ SERIALIZATION HELPER
   * Converts BigInt and Decimal fields to strings.
   * This is the "Magic Fix" for the infinite loading issue.
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
      await tx.user.update({
        where: { telegramId: input.adminUserId },
        data: { role: "MERCHANT" },
      });

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

      await tx.merchantBotConfig.create({ data: { merchantId: merchant.id } });
      await tx.merchantAnalytics.create({ data: { merchantId: merchant.id } });

      return this.sanitize(merchant);
    });
  }

  /**
   * Get merchant by ID
   * Includes all relations required for the dashboard
   */
  static async getById(merchantId: string) {
    if (!isUUID(merchantId)) return null;

    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      include: {
        adminUser: true, // 🏁 Correct property: Matches your User model relation
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
   * Fetches core stats for the Merchant Overview page
   */
  static async getDashboardStats(merchantId: string) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID format");

    const [analytics, recentPayments, activeSubs, pendingTickets] =
      await Promise.all([
        prisma.merchantAnalytics.findUnique({ where: { merchantId } }),
        prisma.payment.findMany({
          where: { merchantId, status: "SUCCESS" },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            user: { select: { fullName: true, username: true, telegramId: true } },
            service: { select: { name: true } },
          },
        }),
        prisma.subscription.count({ where: { merchantId, status: "ACTIVE" } }),
        prisma.ticket.count({ where: { merchantId, status: "OPEN" } }),
      ]);

    return {
      analytics: analytics ? {
        ...this.sanitize(analytics),
        totalRevenue: analytics.totalRevenue.toString(),
        netRevenue: analytics.netRevenue.toString()
      } : null,
      recentPayments: recentPayments.map((p) => ({
        ...this.sanitize(p),
        amount: p.amount.toString(),
      })),
      activeSubscriptions: activeSubs,
      pendingTickets: pendingTickets,
    };
  }

  /**
   * Get Payout Balances
   */
  static async getPayoutData(merchantId: string) {
    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      select: { availableBalance: true, pendingEscrow: true }
    });

    return {
      available: merchant?.availableBalance.toString() || "0.00",
      pending: merchant?.pendingEscrow.toString() || "0.00"
    };
  }

  /**
   * Subscriber Management with BigInt fixes
   */
  static async getSubscribers(merchantId: string, limit = 50) {
    const subscriptions = await prisma.subscription.findMany({
      where: { merchantId },
      include: {
        user: { select: { id: true, telegramId: true, fullName: true, username: true } },
        service: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return subscriptions.map((sub) => this.sanitize(sub));
  }
}