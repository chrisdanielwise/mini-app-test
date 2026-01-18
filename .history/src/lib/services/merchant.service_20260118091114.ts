"use server";

import prisma from "@/lib/db";
import {
  PaymentStatus,
  SubscriptionStatus,
  TicketStatus,
  ProvisioningStep,
  DiscountType,
  CouponScope,
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";

// =================================================================
// 🚀 INPUT PROTOCOLS (Strictly Exported for Handshake Safety)
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
  aboutText?: string;
  supportEmail?: string;
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
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Logic: Recursively handles BigInt (TG_IDs) and Decimals.
 * Architecture: Vital for preventing JSON crashes in Turbopack/Next.js 16.
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// =================================================================
// 🛡️ TELEMETRY EXPORTS (Apex v2026.1.20)
// =================================================================

/**
 * 📊 GET DASHBOARD STATS
 * Fix: Replaced "success" with PaymentStatus.SUCCESS to stop the crash.
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
 * 👑 GET_GLOBAL_PLATFORM_STATS
 * Access: Amber (Staff) oversight.
 */
export const getGlobalPlatformStats = unstable_cache(
  async () => {
    const [revenue, activeSubs, tickets] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: PaymentStatus.SUCCESS },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.subscription.count({
        where: { status: SubscriptionStatus.ACTIVE },
      }),
      prisma.ticket.count({
        where: { status: TicketStatus.OPEN },
      }),
    ]);

    return {
      totalRevenue: revenue._sum?.amount?.toString() || "0.00",
      transactionCount: revenue._count?._all || 0,
      activeSubscriptions: activeSubs,
      pendingTickets: tickets,
      lastUpdated: new Date().toISOString(),
    };
  },
  ["global-platform-stats"],
  { revalidate: 60, tags: ["telemetry", "global"] }
);

/**
 * ⚡ GET MERCHANT ACTIVITY
 */


/**
 * 🕵️ GET_GLOBAL_PLATFORM_ACTIVITY (RESOLVES BUILD ERROR)
 * Logic: Pulls recent system-wide events for Staff audit.
 */
export const getGlobalPlatformActivity = cache(async (limit = 15) => {
  try {
    const activity = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { 
        actor: { select: { fullName: true, username: true } },
        merchant: { select: { companyName: true } } 
      }
    });

    return sanitize(activity);
  } catch (error) {
    console.error("❌ [GlobalActivity_Sync_Fault]:", error);
    return [];
  }
});

/**
 * 📈 GET_CATEGORY_DISTRIBUTION
 */
export const getCategoryDistribution = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) return [];
  
  const where = merchantId ? { merchantId, isActive: true } : { isActive: true };

  const distribution = await prisma.service.findMany({
    where,
    select: {
      categoryTag: true,
      _count: {
        select: { subscriptions: { where: { status: SubscriptionStatus.ACTIVE } } }
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
 * 🏧 GET_PAYOUT_DATA
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
 * 🔄 UPDATE_MERCHANT
 */
export async function updateMerchant(merchantId: string, data: UpdateMerchantInput) {
  if (!isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data,
  });

  // 🛰️ BUST CACHE: Next.js 16 Profile Handshake
  revalidateTag(`merchant-${merchantId}`, "auth");
  revalidateTag("global", "auth");
  
  return sanitize(updated);
}

/**
 * 🕵️ GET_IDENTITY_BY_TELEGRAM
 */
export const getByAdminTelegramId = cache(async (telegramId: bigint) => {
  const merchant = await prisma.merchantProfile.findUnique({
    where: { adminUserId: telegramId },
    include: {
      adminUser: { select: { fullName: true, username: true } },
      plan: true,
      analytics: true,
    },
  });

  return sanitize(merchant);
});