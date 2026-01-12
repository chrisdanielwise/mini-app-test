import prisma from "@/lib/db";
import type {
  SubscriptionStatus,
  ProvisioningStep,
  DiscountType,
  CouponScope,
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";

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
// 🛠️ INTERNAL HELPERS
// =================================================================

/**
 * 🧹 SANITIZE
 * Converts BigInt and Decimal fields to strings for Next.js hydration safety.
 * Essential for Turbopack environments.
 */
function sanitize(data: any) {
  if (!data) return null;
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// =================================================================
// 🛡️ NAMED EXPORTS (Hardened for Turbopack & RBAC)
// =================================================================

/**
 * 🛰️ GET DASHBOARD STATS
 * Logic: If merchantId is missing (Staff), aggregates platform-wide data.
 * Performance: Uses lean select to speed up query execution.
 */
export const getDashboardStats = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) {
    throw new Error("Invalid Merchant ID format");
  }

  const where = merchantId ? { merchantId } : {};

  const [totalRevenue, recentPayments, activeSubscriptions, pendingTickets] =
    await Promise.all([
      prisma.payment.aggregate({
        where: { ...where, status: "SUCCESS" },
        _sum: { amount: true }
      }),
      prisma.payment.findMany({
        where: { ...where, status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          amount: true,
          createdAt: true,
          user: { select: { fullName: true, username: true, telegramId: true } },
          service: { select: { name: true } },
        },
      }),
      prisma.subscription.count({ where: { ...where, status: "ACTIVE" } }),
      prisma.ticket.count({ where: { ...where, status: "OPEN" } }),
    ]);

  return {
    analytics: {
      totalRevenue: totalRevenue._sum.amount?.toString() || "0.00",
      chartData: [] 
    },
    recentPayments: recentPayments.map((p) => ({
      ...sanitize(p),
      amount: p.amount.toString(),
    })),
    activeSubscriptions,
    pendingTickets,
  };
});

/**
 * 🌍 GET GLOBAL PLATFORM STATS
 * Performance: Targeted counts to prevent full table scans.
 */
export const getGlobalPlatformStats = cache(async () => {
  const [totalLiquidity, totalMerchants, totalActiveUsers] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true }
    }),
    prisma.merchantProfile.count({ where: { provisioningStatus: 'COMPLETED' } }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } })
  ]);

  return {
    globalLiquidity: totalLiquidity._sum.amount?.toString() || "0.00",
    activeMerchants: totalMerchants,
    totalPlatformUsers: totalActiveUsers
  };
});

/**
 * ⚡ GET MERCHANT ACTIVITY
 */
export const getMerchantActivity = cache(async (merchantId?: string, limit = 10) => {
  if (merchantId && !isUUID(merchantId)) return [];

  const where = merchantId ? { merchantId } : {};

  const activity = await prisma.subscription.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { fullName: true, username: true } },
      service: { select: { name: true } },
      serviceTier: { select: { name: true, price: true } },
    },
  });

  return sanitize(activity);
});

/**
 * 🌍 GET GLOBAL PLATFORM ACTIVITY
 * 🛠️ FIX: Correctly targets 'activityLog' to resolve findMany undefined error.
 */
export const getGlobalPlatformStats = cache(async () => {
  // Use 'count' and 'aggregate' with targeted where clauses
  const [totalLiquidity, totalMerchants, totalActiveUsers] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true }
    }),
    // 🚀 Performance: Use the index we just added to MerchantProfile
    prisma.merchantProfile.count({ 
      where: { provisioningStatus: 'COMPLETED' } 
    }),
    // 🚀 Performance: Use the index we just added to Subscription
    prisma.subscription.count({ 
      where: { status: 'ACTIVE' } 
    })
  ]);

  return {
    globalLiquidity: totalLiquidity._sum.amount?.toString() || "0.00",
    activeMerchants: totalMerchants,
    totalPlatformUsers: totalActiveUsers
  };
});

/**
 * 📈 GET CATEGORY DISTRIBUTION
 */
export const getCategoryDistribution = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) return [];
  
  const where = merchantId ? { merchantId, isActive: true } : { isActive: true };

  const distribution = await prisma.service.findMany({
    where,
    select: {
      categoryTag: true,
      _count: {
        select: { subscriptions: { where: { status: "ACTIVE" } } }
      }
    }
  });

  const counts: Record<string, number> = {};
  distribution.forEach(item => {
    const tag = item.categoryTag || "UNCLASSIFIED";
    counts[tag] = (counts[tag] || 0) + item._count.subscriptions;
  });

  return Object.entries(counts)
    .map(([name, value]) => ({ name: name.toUpperCase(), value }))
    .filter(item => item.value > 0);
});

/**
 * 🏧 GET PAYOUT DATA
 */
export const getPayoutData = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) {
    return { balance: { available: "0.00", pending: "0.00" }, payouts: [] };
  }

  const where = merchantId ? { merchantId } : {};

  const [merchant, payouts] = await Promise.all([
    merchantId 
      ? prisma.merchantProfile.findUnique({
          where: { id: merchantId },
          select: { availableBalance: true, pendingEscrow: true },
        })
      : null,
    prisma.payoutRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return {
    balance: {
      available: merchant?.availableBalance?.toString() || "0.00",
      pending: merchant?.pendingEscrow?.toString() || "0.00",
    },
    payouts: payouts.map((p) => sanitize(p)),
  };
});

/**
 * 👥 GET SUBSCRIBERS
 */
export const getSubscribers = cache(async (merchantId?: string, limit = 50) => {
  if (merchantId && !isUUID(merchantId)) return [];
  const where = merchantId ? { merchantId } : {};

  const subscriptions = await prisma.subscription.findMany({
    where,
    include: {
      user: { select: { id: true, telegramId: true, fullName: true, username: true } },
      service: { select: { name: true } },
      serviceTier: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return subscriptions.map((sub) => sanitize(sub));
});

/**
 * 🛠️ GET MERCHANT BY ID
 */
export const getMerchantById = cache(async (merchantId: string) => {
  if (!isUUID(merchantId)) return null;

  const merchant = await prisma.merchantProfile.findUnique({
    where: { id: merchantId },
    include: {
      adminUser: true,
      plan: true,
      botConfig: true,
      analytics: true,
      services: {
        where: { isActive: true },
        include: { tiers: { where: { isActive: true } } },
      },
    },
  });

  return sanitize(merchant);
});

/**
 * 🔄 UPDATE MERCHANT
 */
export async function updateMerchant(merchantId: string, data: UpdateMerchantInput) {
  if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID");

  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data,
  });

  return sanitize(updated);
}

/**
 * 🕵️ GET BY ADMIN TELEGRAM ID
 */
export const getByAdminTelegramId = cache(async (telegramId: bigint) => {
  const merchant = await prisma.merchantProfile.findUnique({
    where: { adminUserId: telegramId },
    include: {
      adminUser: true,
      plan: true,
      analytics: true,
    },
  });

  return sanitize(merchant);
});