import prisma from "@/lib/db";
import type {
  SubscriptionStatus,
  ProvisioningStep,
  DiscountType,
  CouponScope,
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

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
// 🛡️ NAMED EXPORT FUNCTIONS (Fixed for Turbopack & Next.js 15)
// =================================================================

/**
 * 🔥 FIXED: getMerchantActivity 
 * Required by async-activity-feed.tsx
 */
export async function getMerchantActivity(merchantId: string, limit = 10) {
  if (!isUUID(merchantId)) return [];

  const activity = await prisma.subscription.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { fullName: true, username: true } },
      service: { select: { name: true } },
      serviceTier: { select: { name: true, price: true } }
    },
  });

  return sanitize(activity);
}

export async function createMerchant(input: CreateMerchantInput) {
  const freePlan = await prisma.platformPlan.findFirst({
    where: { name: "Free" },
  });

  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { telegramId: input.adminUserId },
      data: { role: "MERCHANT" },
    });

    const merchant = await tx.merchantProfile.create({
      data: {
        adminUserId: input.adminUserId,
        companyName: input.companyName,
        botToken: input.botToken,
        botId: input.botId,
        botUsername: input.botUsername,
        planId: freePlan?.id,
        planStatus: "ACTIVE",
        provisioningStatus: "IDLE",
      },
      include: { plan: true },
    });

    await tx.merchantBotConfig.create({ data: { merchantId: merchant.id } });
    await tx.merchantAnalytics.create({ data: { merchantId: merchant.id } });

    return sanitize(merchant);
  });
}

export async function getMerchantById(merchantId: string) {
  if (!isUUID(merchantId)) return null;

  const merchant = await prisma.merchantProfile.findUnique({
    where: { id: merchantId },
    include: {
      adminUser: true,
      plan: true,
      botConfig: true,
      analytics: true,
      paymentConfig: true,
      services: {
        where: { isActive: true },
        include: { tiers: { where: { isActive: true } } },
      },
    },
  });

  return sanitize(merchant);
}

export async function getByAdminTelegramId(telegramId: bigint) {
  const merchant = await prisma.merchantProfile.findUnique({
    where: { adminUserId: telegramId },
    include: {
      adminUser: true,
      plan: true,
      analytics: true,
    },
  });

  return sanitize(merchant);
}

export async function getDashboardStats(merchantId: string) {
  if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID format");

  const [analytics, recentPayments, activeSubscriptions, pendingTickets] =
    await Promise.all([
      prisma.merchantAnalytics.findUnique({ where: { merchantId } }),
      prisma.payment.findMany({
        where: { merchantId, status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: {
            select: { fullName: true, username: true, telegramId: true },
          },
          service: { select: { name: true } },
        },
      }),
      prisma.subscription.count({ where: { merchantId, status: "ACTIVE" } }),
      prisma.ticket.count({ where: { merchantId, status: "OPEN" } }),
    ]);

  return {
    analytics: analytics
      ? {
          ...sanitize(analytics),
          totalRevenue: analytics.totalRevenue.toString(),
          netRevenue: analytics.netRevenue.toString(),
        }
      : null,
    recentPayments: recentPayments.map((p) => ({
      ...sanitize(p),
      amount: p.amount.toString(),
    })),
    activeSubscriptions,
    pendingTickets,
  };
}

export async function getPayoutData(merchantId: string) {
  if (!isUUID(merchantId)) throw new Error("Invalid ID");

  const [merchant, payouts] = await Promise.all([
    prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      select: { availableBalance: true, pendingEscrow: true },
    }),
    prisma.payoutRequest.findMany({
      where: { merchantId },
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

export async function getCoupons(merchantId: string) {
  if (!isUUID(merchantId)) return [];

  const coupons = await prisma.coupon.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { redemptions: true } } },
  });

  return coupons.map((c) => ({
    ...sanitize(c),
    amount: c.amount.toString(),
    useCount: c._count.redemptions,
  }));
}

export async function createCoupon(
  merchantId: string,
  input: CreateCouponInput
) {
  if (!isUUID(merchantId)) throw new Error("Invalid ID");

  return prisma.coupon.create({
    data: {
      merchantId,
      code: input.code.toUpperCase(),
      description: input.description,
      discountType: input.discountType,
      amount: input.amount,
      maxUses: input.maxUses,
      expiresAt: input.expiresAt,
      isActive: input.isActive,
      scope: input.scope || "GLOBAL",
    },
  });
}

export async function getLedger(merchantId: string, limit = 50) {
  if (!isUUID(merchantId)) return [];

  const ledgerEntries = await prisma.ledger.findMany({
    where: { merchantId },
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

export async function getSubscribers(merchantId: string, limit = 50) {
  const subscriptions = await prisma.subscription.findMany({
    where: { merchantId },
    include: {
      user: {
        select: { id: true, telegramId: true, fullName: true, username: true },
      },
      service: { select: { name: true } },
      serviceTier: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return subscriptions.map((sub) => sanitize(sub));
}

export async function updateMerchant(
  merchantId: string,
  data: UpdateMerchantInput
) {
  if (!isUUID(merchantId)) throw new Error("Invalid Merchant ID");

  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data,
  });

  return sanitize(updated);
}

export async function updateProvisioningStatus(
  merchantId: string,
  status: ProvisioningStep,
  error?: string
) {
  const updated = await prisma.merchantProfile.update({
    where: { id: merchantId },
    data: { provisioningStatus: status, provisioningError: error },
  });
  return sanitize(updated);
}