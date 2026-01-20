"use server";

import prisma from "@/lib/db";
import {
  PaymentStatus,
  SubscriptionStatus,
  TicketStatus,
  ProvisioningStep,
  DiscountType,
  CouponScope,
  MerchantProfile,
  Coupon,
  Subscription,
  ActivityLog,
  FAQItem
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";
import { Decimal } from "@prisma/client-runtime-utils";

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

/**
 * 🏛️ INSTITUTIONAL_TYPES
 * Defining the shape of the telemetry egress for HUD synchronization.
 */
export interface DashboardStats {
  totalRevenue: number | Decimal;
  subscriberCount: number;
  openTickets: number;
  lastSync: string;
}

export interface DashboardStatsOptions {
  targetId: string;
}

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Architecture: Hydration safety for Decimal and BigInt values.
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
 * 🛰️ GET_DASHBOARD_STATS (Institutional v2026.1.20)
 * Logic: Concurrent aggregation for high-density HUD telemetry.
 */

export const getDashboardStats = cache(async (options: { targetId: string }): Promise<DashboardStats> => {
  const { targetId } = options;

  if (!isUUID(targetId)) throw new Error("INVALID_ID");

  try {
    const [revenue, totalSubscribers, activeTickets] = await Promise.all([
      prisma.payment.aggregate({
        // ✅ FIX: Use Enum member instead of raw string
        where: { merchantId: targetId, status: PaymentStatus.SUCCESS },
        _sum: { amount: true }
      }),
      prisma.subscription.count({
        where: { merchantId: targetId }
      }),
      prisma.ticket.count({
        // ✅ FIX: Use Enum member instead of raw string
        where: { merchantId: targetId, status: TicketStatus.OPEN }
      })
    ]);

    return {
      // ✅ FIX: TS18048 - Optional chaining to handle undefined _sum
      totalRevenue: revenue._sum?.amount || 0,
      subscriberCount: totalSubscribers,
      openTickets: activeTickets,
      lastSync: new Date().toISOString()
    };
  } catch (error: any) {
    throw new Error("TELEMETRY_SYNC_FAILED");
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
export const getMerchantActivity = cache(async (merchantId?: string, limit = 10): Promise<Subscription[]> => {
  if (!merchantId || !isUUID(merchantId)) return [];

  try {
    const activity = await prisma.subscription.findMany({
      where: { merchantId, status: SubscriptionStatus.ACTIVE },
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
export const getGlobalPlatformActivity = cache(async (limit = 15): Promise<ActivityLog[]> => {
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
export async function updateMerchant(merchantId: string, data: UpdateMerchantInput): Promise<MerchantProfile> {
  if (!isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");
  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data,
  });
  // ✅ FIX: Provided mandatory second argument for Next.js 15+
  revalidateTag(`merchant-${merchantId}`, "default");
  revalidateTag("global", "default");
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
export async function createCoupon(merchantId: string, data: CreateCouponInput): Promise<Coupon> {
  const coupon = await prisma.coupon.create({
    data: { ...data, merchantId }
  });
  revalidateTag(`coupons-${merchantId}`, "default");
  return sanitize(coupon);
}

/**
 * ❓ 10. GET_MERCHANT_FAQS
 */
export const getMerchantFAQs = cache(async (merchantId: string): Promise<FAQItem[]> => {
  if (!isUUID(merchantId)) return [];
  
  // ✅ FIX: TS2551 - Prisma generates accessor as fAQItem for FAQItem model
  const faqs = await prisma.fAQItem.findMany({
    where: { merchantId, isActive: true },
    orderBy: { orderIndex: 'asc' }
  });
  return sanitize(faqs);
});