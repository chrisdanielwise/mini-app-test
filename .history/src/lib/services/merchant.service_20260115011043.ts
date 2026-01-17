"use server";

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
// 🛡️ TELEMETRY EXPORTS (Hardened v16.16.12)
// =================================================================

/**
 * 📊 GET_DASHBOARD_STATS
 * Logic: Parallelized aggregation with Lean Select.
 * Security: UUID-validated tenant isolation.
 */
export const getDashboardStats = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) {
    throw new Error("SECURITY_ALERT: Invalid_Node_Identity");
  }

  const where = merchantId ? { merchantId } : {};

  // 🏛️ Parallel Execution: Execute 4 isolated telemetry queries simultaneously
  const [totalRevenue, recentPayments, activeSubsCount, openTicketsCount] =
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
          user: { select: { fullName: true, username: true } },
          service: { select: { name: true } },
        },
      }),
      prisma.subscription.count({ where: { ...where, status: "ACTIVE" } }),
      prisma.ticket.count({ where: { ...where, status: "OPEN" } }),
    ]);

  return {
    analytics: {
      totalRevenue: totalRevenue._sum.amount?.toString() || "0.00",
      chartData: [] // To be populated by TimeSeries node
    },
    recentPayments: sanitize(recentPayments),
    activeSubscriptions: activeSubsCount,
    pendingTickets: openTicketsCount,
  };
});

/**
 * 🏧 GET_PAYOUT_TELEMETRY
 * Logic: Cross-references Liquidity Vault with Payout Ledger.
 */
export const getPayoutData = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) return { balance: { available: "0.00", pending: "0.00" }, payouts: [] };

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
        destinationAddress: true,
      }
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
 * Hardened: Atomic update with sanitized return payload.
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