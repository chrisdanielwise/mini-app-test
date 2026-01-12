import prisma from "@/src/lib/db";
import type { SubscriptionStatus, IntervalUnit } from "@/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { isUUID } from "@/src/lib/utils/validators";

export interface CreateSubscriptionInput {
  userId: string;
  merchantId: string;
  serviceId: string;
  serviceTierId: string;
  paymentId?: string;
}

export class SubscriptionService {
  /**
   * Calculate expiration date based on tier interval
   */
  static calculateExpiresAt(
    interval: IntervalUnit,
    intervalCount: number,
    startDate: Date = new Date()
  ): Date {
    const expiresAt = new Date(startDate);

    switch (interval) {
      case "DAY":
        expiresAt.setDate(expiresAt.getDate() + intervalCount);
        break;
      case "WEEK":
        expiresAt.setDate(expiresAt.getDate() + intervalCount * 7);
        break;
      case "MONTH":
        expiresAt.setMonth(expiresAt.getMonth() + intervalCount);
        break;
      case "YEAR":
        expiresAt.setFullYear(expiresAt.getFullYear() + intervalCount);
        break;
    }

    return expiresAt;
  }

  /**
   * Create or extend a subscription
   * PRISMA 7: Safeguarded against malformed UUIDs
   */
  static async createOrExtend(input: CreateSubscriptionInput) {
    const { userId, merchantId, serviceId, serviceTierId } = input;

    // 1. UUID Format Validation
    if (
      !isUUID(userId) ||
      !isUUID(merchantId) ||
      !isUUID(serviceId) ||
      !isUUID(serviceTierId)
    ) {
      throw new Error("Invalid ID format provided for subscription creation");
    }

    // Get service tier details
    const tier = await prisma.serviceTier.findUnique({
      where: { id: serviceTierId },
      include: { service: true },
    });

    if (!tier) throw new Error("Service tier not found");

    // Check for existing subscription
    const existing = await prisma.subscription.findUnique({
      where: {
        userId_serviceId: { userId, serviceId },
      },
    });

    const now = new Date();

    // Calculate new expiration (logic: extend if active, otherwise start fresh)
    const startDate =
      existing && existing.status === "ACTIVE" && existing.expiresAt > now
        ? existing.expiresAt
        : now;

    const expiresAt = this.calculateExpiresAt(
      tier.interval,
      tier.intervalCount,
      startDate
    );

    // Data for inclusion in the response
    const includeQuery = {
      service: true,
      serviceTier: true,
      merchant: {
        select: {
          companyName: true,
          botUsername: true,
        },
      },
    };

    if (existing) {
      // Update existing record
      return prisma.subscription.update({
        where: { id: existing.id },
        data: {
          serviceTierId,
          status: "ACTIVE",
          expiresAt,
          renewals: { increment: 1 },
          inviteLink: tier.service.vipInviteLink,
        },
        include: includeQuery,
      });
    }

    // Create new record
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
      include: includeQuery,
    });
  }

  /**
   * Get subscription by ID
   * PRISMA 7: Maps BigInt telegramId to string
   */
  static async getById(subscriptionId: string) {
    if (!isUUID(subscriptionId)) return null;

    const sub = await prisma.subscription.findUnique({
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
          select: { id: true, companyName: true, botUsername: true },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!sub) return null;

    // 2. BigInt/Decimal Serialization Fix for Next.js API
    return {
      ...sub,
      user: {
        ...sub.user,
        telegramId: sub.user.telegramId.toString(),
      },
      payments: sub.payments.map((p) => ({
        ...p,
        amount: p.amount.toString(),
      })),
    };
  }

  /**
   * Update subscription status
   */
  static async updateStatus(
    subscriptionId: string,
    status: SubscriptionStatus
  ) {
    if (!isUUID(subscriptionId))
      throw new Error("Invalid Subscription ID format");

    return prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status },
    });
  }

  /**
   * Get expiring subscriptions (for cron job)
   */
  static async getExpiring(hoursAhead = 24) {
    const now = new Date();
    const threshold = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

    const subs = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        expiresAt: { gte: now, lte: threshold },
      },
      include: {
        user: { select: { telegramId: true, fullName: true } },
        service: { select: { name: true, vipChannelId: true } },
        merchant: { select: { botId: true, botToken: true } },
      },
    });

    // Map BigInt values to strings
    return subs.map((s) => ({
      ...s,
      user: { ...s.user, telegramId: s.user.telegramId.toString() },
      service: {
        ...s.service,
        vipChannelId: s.service.vipChannelId?.toString(),
      },
    }));
  }

  /**
   * Expire overdue subscriptions (Bulk operation)
   */
  static async expireOverdue() {
    const now = new Date();

    const expired = await prisma.subscription.updateMany({
      where: {
        status: "ACTIVE",
        expiresAt: { lt: now },
      },
      data: {
        status: "EXPIRED",
      },
    });

    return expired.count;
  }

  /**
   * Get merchant subscription stats
   */
  static async getMerchantStats(merchantId: string) {
    if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID");

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
    ]);

    // 3. Precise Decimal Handling
    const totalRevenue = revenueData._sum.amount || new Decimal(0);

    return {
      active,
      expired,
      total,
      totalRevenue: totalRevenue.toString(),
    };
  }
}
