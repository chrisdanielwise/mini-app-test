"use server";

import prisma from "@/lib/db";
import {
  PaymentStatus,
  SubscriptionStatus,
  TicketStatus,
  ProvisioningStep,
  DiscountType,
  CouponScope,
  Prisma,
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
 * Fix: Replaced hardcoded strings with mapped Enum Objects.
 */
export const getDashboardStats = cache(async (merchantId?: string) => {
  if (!merchantId || !isUUID(merchantId)) return null;

  try {
    const [totalRevenue, recentPayments, activeSubscriptions, pendingTickets] =
      await Promise.all([
        prisma.payment.aggregate({
          // ✅ FIX: Using PaymentStatus.SUCCESS (Maps to "success" in DB)
          where: { merchantId, status: PaymentStatus.SUCCESS },
          _sum: { amount: true }
        }),
        prisma.payment.findMany({
          where: { merchantId, status: PaymentStatus.SUCCESS },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true, amount: true, createdAt: true,
            user: { select: { fullName: true, username: true } },
            service: { select: { name: true } },
          },
        }),
        prisma.subscription.count({ 
          // ✅ FIX: Using SubscriptionStatus.ACTIVE (Maps to "active")
          where: { merchantId, status: SubscriptionStatus.ACTIVE } 
        }),
        prisma.ticket.count({ 
          // ✅ FIX: Using TicketStatus.OPEN (Maps to "open")
          where: { merchantId, status: TicketStatus.OPEN } 
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
 * ❓ 10. GET_MERCHANT_FAQS
 * ✅ FIX: Changed prisma.faqItem to prisma.fAQItem (Prisma model naming convention)
 */
export const getMerchantFAQs = cache(async (merchantId: string) => {
  if (!isUUID(merchantId)) return [];
  
  const faqs = await prisma.fAQItem.findMany({
    where: { merchantId, isActive: true },
    orderBy: { orderIndex: 'asc' }
  });
  return sanitize(faqs);
});

/**
 * 🔄 7. UPDATE_MERCHANT
 * Fix: revalidateTag second argument provided.
 */
export async function updateMerchant(merchantId: string, data: UpdateMerchantInput) {
  if (!isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");
  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data,
  });
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