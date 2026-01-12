import prisma from "@/lib/db";
import type {
  SubscriptionStatus,
  ProvisioningStep,
  DiscountType,
  CouponScope,
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

// =================================================================
// 🚀 INTERFACES & HELPERS
// =================================================================

export interface CreateMerchantInput {
  adminUserId: bigint;
  companyName: string;
  botToken?: string;
  botId?: bigint;
  botUsername?: string;
}

/**
 * Converts BigInt and Decimal fields to strings for Next.js hydration.
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
// 🛡️ ROLE-AWARE EXPORT FUNCTIONS
// =================================================================

/**
 * 🛰️ GET DASHBOARD STATS (Staff & Merchant Aware)
 * Logic: Performs global aggregation for Staff nodes or isolated cluster fetch for Merchants.
 */
export async function getDashboardStats(merchantId?: string) {
  // 🛡️ Only validate UUID if an ID is provided. Staff bypass this to prevent crashes.
  if (merchantId && !isUUID(merchantId)) {
    throw new Error("Invalid Merchant ID format");
  }

  // 🏁 Dynamic Filter: If no ID, Prisma fetches from the entire table
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
        include: {
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
}

/**
 * 📈 GET CATEGORY DISTRIBUTION
 */
export async function getCategoryDistribution(merchantId?: string) {
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
}

/**
 * ⚡ GET MERCHANT ACTIVITY (Activity Feed)
 */
export async function getMerchantActivity(merchantId?: string, limit = 10) {
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
}

/**
 * 🏧 GET PAYOUT DATA
 */
export async function getPayoutData(merchantId?: string) {
  if (merchantId && !isUUID(merchantId)) return { balance: { available: "0.00", pending: "0.00" }, payouts: [] };

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
}

/**
 * 📑 GET LEDGER
 */
export async function getLedger(merchantId?: string, limit = 50) {
  if (merchantId && !isUUID(merchantId)) return [];

  const where = merchantId ? { merchantId } : {};

  const ledgerEntries = await prisma.ledger.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      payment: { select: { id: true, amount: true, currency: true } },
    },
  });

  return ledgerEntries.map((entry) => ({
    ...sanitize(entry),
    amount: entry.amount.toString(),
    balanceAfter: entry.balanceAfter.toString(),
  }));
}

/**
 * 👥 GET SUBSCRIBERS
 */
export async function getSubscribers(merchantId?: string, limit = 50) {
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
}