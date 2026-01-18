"use server";

import prisma from "@/lib/db";
import {
  PaymentStatus,
  SubscriptionStatus,
  TicketStatus,
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Architecture: Pure functional normalization for Next.js 15+ & Turbopack.
 * Logic: Recursively handles BigInt (TG_IDs) and Decimals (Capital).
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
// 🕵️ TELEMETRY EXPORTS (Hardened v16.16.35)
// =================================================================

/**
 * 👑 GET_GLOBAL_PLATFORM_STATS
 * Logic: System-wide aggregation for Staff (Amber) Oversight.
 * Access: Unfiltered global telemetry from across all merchant nodes.
 */
export const getGlobalPlatformStats = cache(async () => {
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
});

/**
 * 📊 GET_DASHBOARD_STATS
 * Logic: Tenant-isolated telemetry. Optimized for Merchant (Emerald) dashboards.
 */
export const getDashboardStats = cache(async (merchantId: string) => {
  if (!isUUID(merchantId)) {
    throw new Error("SECURITY_ALERT: Invalid_Node_Identity");
  }

  const [revenue, activeSubs, tickets] = await Promise.all([
    prisma.payment.aggregate({
      where: { merchantId, status: PaymentStatus.SUCCESS },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.subscription.count({
      where: { merchantId, status: SubscriptionStatus.ACTIVE },
    }),
    prisma.ticket.count({
      where: { merchantId, status: TicketStatus.OPEN },
    }),
  ]);

  return {
    totalRevenue: revenue._sum?.amount?.toString() || "0.00",
    transactionCount: revenue._count?._all || 0,
    activeSubscriptions: activeSubs,
    pendingTickets: tickets,
  };
});

/**
 * 🛰️ GET_MERCHANT_ACTIVITY
 * Logic: Recent successful payments and subscriptions for a specific tenant.
 * Fix: Uses 'tier' relation name to resolve ts(2353).
 */
export const getMerchantActivity = cache(async (merchantId: string) => {
  if (!isUUID(merchantId)) return [];

  const activity = await prisma.payment.findMany({
    where: { merchantId, status: PaymentStatus.SUCCESS },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          fullName: true,
          username: true,
        },
      },
      service: { select: { name: true } },
      tier: { select: { price: true, name: true } }, // 🛡️ Relation Map Fix
    },
  });

  return sanitize(activity);
});

/**
 * 🕵️ GET_GLOBAL_PLATFORM_ACTIVITY
 * Logic: Real-time telemetry from across the entire network.
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
      tier: { select: { price: true } }, // 🛡️ Relation Map Fix
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
 */
export async function updateMerchant(merchantId: string, data: any) {
  if (!isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data,
  });

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
