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
// 🚀 INPUT PROTOCOLS
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
 * Architecture: Hydration safety for Decimal and BigInt values.
 * Vital for preventing "Do not know how to serialize a BigInt" in Turbopack.
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
 * 📊 1. GET DASHBOARD STATS
 * Fix: Replaced lowercase strings with Uppercase Enums ('SUCCESS', 'ACTIVE', 'OPEN').
 */
export const getDashboardStats = cache(async (merchantId?: string) => {
  if (!merchantId || !isUUID(merchantId)) return null;

  try {
    const [totalRevenue, recentPayments, activeSubscriptions, pendingTickets] =
      await Promise.all([
        prisma.payment.aggregate({
          where: { merchantId, status: 'SUCCESS' },
          _sum: { amount: true }
        }),
        prisma.payment.findMany({
          where: { merchantId, status: 'SUCCESS' },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true, amount: true, createdAt: true,
            user: { select: { fullName: true, username: true } },
            service: { select: { name: true } },
          },
        }),
        prisma.subscription.count({ 
          where: { merchantId, status: 'ACTIVE' } 
        }),
        prisma.ticket.count({ 
          where: { merchantId, status: 'OPEN' } 
        }),
      ]);

    return {
      totalRevenue: totalRevenue._sum.amount?.toString() || "0.00",
      activeSubscriptions,
      pendingTickets,
      recentPayments: sanitize(recentPayments)
    };
  } catch (error: any) {
    console.error("🔥 [Dashboard_Stats_Crash]:", error.message);
    return null;
  }
});

/**
 * 👑 2. GET_GLOBAL_PLATFORM_STATS
 */
export const getGlobalPlatformStats = unstable_cache(
  async () => {
    try {
      const [revenue, activeSubs, tickets] = await Promise.all([
        prisma.payment.aggregate({
          where: { status: 'SUCCESS' },
          _sum: { amount: true },
          _count: { _all: true },
        }),
        prisma.subscription.count({
          where: { status: 'ACTIVE' },
        }),
        prisma.ticket.count({
          where: { status: 'OPEN' },
        }),
      ]);

      return {
        totalRevenue: revenue._sum?.amount?.toString() || "0.00",
        transactionCount: revenue._count?._all || 0,
        activeSubscriptions: activeSubs,
        pendingTickets: tickets,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      return { totalRevenue: "0.00", transactionCount: 0, activeSubscriptions: 0, pendingTickets: 0 };
    }
  },
  ["global-platform-stats"],
  { revalidate: 60, tags: ["telemetry", "global"] }
);

/**
 * ⚡ 3. GET_MERCHANT_ACTIVITY
 */
export const getMerchantActivity = cache(async (merchantId?: string, limit = 10) => {
  if (!merchantId || !isUUID(merchantId)) return [];

  try {
    const activity = await prisma.subscription.findMany({
      where: { merchantId, status: 'ACTIVE' },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { fullName: true, username: true } },
        service: { select: { name: true } },
        serviceTier: { select: { name: true, price: true } },
      },
    });

    return sanitize(activity);
  } catch (error: any) {
    console.error("🔥 [Activity_Sync_Fault]:", error.message);
    return [];
  }
});

/**
 * 🕵️ 4. GET_GLOBAL_PLATFORM_ACTIVITY
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
 * 📈 5. GET_CATEGORY_DISTRIBUTION
 */
export const getCategoryDistribution = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) return [];
  
  try {
    const distribution = await prisma.service.findMany({
      where: { merchantId: merchantId || undefined, isActive: true },
      select: {
        categoryTag: true,
        _count: {
          select: { subscriptions: { where: { status: 'ACTIVE' } } }
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
  } catch (error) {
    return [];
  }
});

/**
 * 🏧 6. GET_PAYOUT_DATA
 */
export const getPayoutData = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) return { balance: { available: "0.00", pending: "0.00" }, payouts: [] };

  const [merchant, payouts] = await Promise.all([
    merchantId ? prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      select: { availableBalance: true, pendingEscrow: true },
    }) : null,
    prisma.payoutRequest.findMany({
      where: merchantId ? { merchantId } : {},
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return {
    balance: {
      available: merchant?.availableBalance?.toString() || "0.00",
      pending: merchant?.pendingEscrow?.toString() || "0.00",
    },
    payouts: sanitize(payouts),
  };
});

/**
 * 🔄 7. UPDATE_MERCHANT
 */
export async function updateMerchant(merchantId: string, data: UpdateMerchantInput) {
  if (!isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");
  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data,
  });
  revalidateTag(`merchant-${merchantId}`);
  revalidateTag("global");
  return sanitize(updated);
}

/**
 * 🕵️ 8. GET_IDENTITY_BY_TELEGRAM
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

/**
 * 🎫 9. CREATE_COUPON
 */
export async function createCoupon(merchantId: string, data: CreateCouponInput) {
  const coupon = await prisma.coupon.create({
    data: { ...data, merchantId }
  });
  revalidateTag(`coupons-${merchantId}`);
  return sanitize(coupon);
}

/**
 * ❓ 10. GET_MERCHANT_FAQS
 */
export const getMerchantFAQs = cache(async (merchantId: string) => {
  const faqs = await prisma.faqItem.findMany({
    where: { merchantId, isActive: true },
    orderBy: { orderIndex: 'asc' }
  });
  return sanitize(faqs);
});