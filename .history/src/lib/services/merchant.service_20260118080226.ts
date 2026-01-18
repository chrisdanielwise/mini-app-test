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
 * Logic: Recursively handles BigInt (TG_IDs) and Decimals (Capital).
 * Architecture: Essential for Turbopack/Next.js 16 hydration stability.
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
// 🛡️ TELEMETRY EXPORTS (Merged Legacy + Hardened Apex)
// =================================================================

/**
 * 📊 GET_DASHBOARD_STATS
 * Logic: Tenant-isolated telemetry with legacy support.
 * Fix: Re-integrated legacy 'recentPayments' map with BigInt conversion.
 */
export const getDashboardStats = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) {
    throw new Error("SECURITY_ALERT: Invalid_Node_Identity");
  }

  const where = merchantId ? { merchantId } : {};
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const [totalRevenue, recentPayments, activeSubscriptions, pendingTickets] =
      await Promise.all([
        prisma.payment.aggregate({
          where: { ...where, status: PaymentStatus.SUCCESS },
          _sum: { amount: true },
        }),
        prisma.payment.findMany({
          where: { ...where, status: PaymentStatus.SUCCESS },
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
        prisma.subscription.count({ 
          where: { ...where, status: SubscriptionStatus.ACTIVE } 
        }),
        prisma.ticket.count({ 
          where: { ...where, status: TicketStatus.OPEN } 
        }),
      ]);

    return {
      analytics: {
        totalRevenue: totalRevenue._sum.amount?.toString() || "0.00",
        chartData: [],
      },
      recentPayments: recentPayments.map((p) => ({
        ...sanitize(p),
        amount: p.amount.toString(),
      })),
      activeSubscriptions,
      pendingTickets,
      lastSync: new Date().toISOString()
    };
  } catch (error) {
    console.error("🔥 [Dashboard_Sync_Fault]:", error);
    return null;
  }
});

/**
 * 👑 GET_GLOBAL_PLATFORM_STATS
 * Logic: Aggregated oversight for Staff roles using Next.js Cache Profiles.
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
 * 🛰️ GET_MERCHANT_ACTIVITY
 * Strategy: Re-integrated legacy subscription-based activity tracking.
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
 * 🏧 GET_PAYOUT_TELEMETRY
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
 * Fix: Next.js 16 Profile Handshake (2 arguments required for revalidateTag).
 */
export async function updateMerchant(merchantId: string, data: UpdateMerchantInput) {
  if (!isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data,
  });

  // 🛰️ BUST CACHE: Updated for Next.js 16 Dynamic IO Requirement
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