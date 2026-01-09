import prisma from "@/lib/db";
import type { SubscriptionStatus, ProvisioningStep } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

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
}

export class MerchantService {
  /**
   * Create a new merchant profile
   * Uses a transaction to ensure database integrity
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
        include: {
          plan: true,
        },
      });

      // 3. Initialize config and analytics
      await tx.merchantBotConfig.create({ data: { merchantId: merchant.id } });
      await tx.merchantAnalytics.create({ data: { merchantId: merchant.id } });

      return merchant;
    });
  }

  /**
   * Get merchant by ID
   * Safeguarded against malformed UUIDs
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
   * Update merchant profile
   */
  static async update(merchantId: string, data: UpdateMerchantInput) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant UUID format");

    return prisma.merchantProfile.update({
      where: { id: merchantId },
      data,
    });
  }

  /**
   * Update provisioning status
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
   * Get dashboard stats with Decimal serialization fix
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
      analytics,
      recentPayments: recentPayments.map((p) => ({
        ...p,
        amount: p.amount.toString(), // Convert Decimal to string
      })),
      activeSubscriptions,
      pendingTickets,
    };
  }

  /**
   * Get merchant's ledger entries
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
      payment: entry.payment
        ? {
            ...entry.payment,
            amount: entry.payment.amount.toString(), // Decimal safety
          }
        : null,
    }));
  }

  /**
   * Get merchant's subscribers with BigInt serialization fix
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
          telegramId: sub.user.telegramId.toString(), // BigInt safety
        },
      })),
      total,
    };
  }

  /**
   * Check if merchant has reached plan limits
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
