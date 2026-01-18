"use server";

import prisma from "@/lib/db";
import {
  PaymentStatus,
  SubscriptionStatus,
  TicketStatus,
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Logic: Recursively handles BigInt (TG_IDs) and Decimals (Capital).
 * Architecture: Prevents JSON serialization crashes during Server-to-Client handover.
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
// 🕵️ TELEMETRY EXPORTS (Hardened v2026.1.18)
// =================================================================

/**
 * 👑 GET_GLOBAL_PLATFORM_STATS
 * Strategy: High-performance aggregated oversight.
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
 * 📊 GET_DASHBOARD_STATS
 * Logic: Tenant-isolated telemetry with 30-Day Growth Delta.
 * Fix: Uses indexed time-windows to prevent 9000ms query timeouts.
 */
export const getDashboardStats = cache(async (merchantId: string) => {
  if (!isUUID(merchantId)) throw new Error("IDENTITY_BREACH");

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    const [currentPeriod, globalTotals] = await Promise.all([
      // Current 30-Day Revenue
      prisma.payment.aggregate({
        where: { 
          merchantId, 
          status: PaymentStatus.SUCCESS,
          createdAt: { gte: thirtyDaysAgo }
        },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      // Total Active Node Count
      prisma.subscription.count({
        where: { merchantId, status: SubscriptionStatus.ACTIVE },
      }),
    ]);

    return {
      monthlyRevenue: currentPeriod._sum?.amount?.toString() || "0.00",
      monthlySales: currentPeriod._count?._all || 0,
      activeSubscribers: globalTotals,
      lastSync: now.toISOString(),
    };
  } catch (error) {
    console.error("🔥 [Telemetry_Sync_Timeout]:", error);
    return null;
  }
});

/**
 * 🛰️ GET_MERCHANT_ACTIVITY
 * Strategy: Cursor-based stream ingress.
 */
export const getMerchantActivity = cache(async (merchantId: string) => {
  if (!isUUID(merchantId)) return [];

  const activity = await prisma.payment.findMany({
    where: { merchantId, status: PaymentStatus.SUCCESS },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: {
        select: { firstName: true, lastName: true, fullName: true, username: true },
      },
      service: { select: { name: true } },
      serviceTier: { select: { price: true, name: true } },
    },
  });

  return sanitize(activity);
});

/**
 * 🕵️ GET_GLOBAL_PLATFORM_ACTIVITY
 */
export const getGlobalPlatformActivity = cache(async () => {
  const activity = await prisma.payment.findMany({
    where: { status: PaymentStatus.SUCCESS },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { fullName: true, username: true } },
      merchant: { select: { companyName: true, botUsername: true } },
      service: { select: { name: true } },
      serviceTier: { select: { price: true } },
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

  const [merchant, payouts] = await Promise.all([
    merchantId
      ? prisma.merchantProfile.findUnique({
          where: { id: merchantId },
          select: { availableBalance: true, pendingEscrow: true },
        })
      : null,
    prisma.payoutRequest.findMany({
      where: merchantId ? { merchantId } : {},
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        transactionRef: true,
      },
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
 * 🔄 UPDATE_MERCHANT_IDENTITY
 * Security: Uses an Explicit Picker to prevent field injection attacks.
 */
export async function updateMerchant(merchantId: string, data: any) {
  if (!isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

  // 🚩 SECURITY LOCK: Do not allow direct 'data' spread to prevent balance overwrites
  const safePayload = {
    companyName: data.companyName,
    botUsername: data.botUsername,
    supportEmail: data.supportEmail,
    aboutText: data.aboutText,
  };

  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data: safePayload,
  });

  // 🛰️ BUST CACHE: Ensure identity changes propagate immediately
  revalidateTag(`merchant-${merchantId}`);
  revalidateTag("global");
  
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
    },
  });

  return sanitize(merchant);
});