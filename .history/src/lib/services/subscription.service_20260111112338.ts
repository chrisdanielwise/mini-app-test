import prisma from "@/lib/db";
import type { SubscriptionStatus, IntervalUnit } from "@/generated/prisma";
// import { Decimal } from "@prisma/client-runtime-library";
import { isUUID } from "@/lib/utils/validators";

// =================================================================
// 🚀 INTERFACES & HELPERS
// =================================================================

export interface CreateSubscriptionInput {
  userId: string;
  merchantId: string;
  serviceId: string;
  serviceTierId: string;
  paymentId?: string;
}

/**
 * Converts BigInt and Decimal fields to strings for Next.js hydration safety.
 */
function sanitize(data: any) {
  if (!data) return null;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (value instanceof Decimal) return value.toString();
      return value;
    })
  );
}

// =================================================================
// 🛡️ NAMED EXPORTS (Hardened for Turbopack & RBAC)
// =================================================================

/**
 * 📅 CALCULATE EXPIRES AT
 * Defines the temporal boundaries of a subscription node.
 */
export function calculateExpiresAt(
  interval: IntervalUnit,
  intervalCount: number,
  startDate: Date = new Date()
): Date {
  const expiresAt = new Date(startDate);

  switch (interval) {
    case "DAY":
      expiresAt.setDate(expiresAt.getDate() + intervalCount);
      break;
    case "WEEK":
      expiresAt.setDate(expiresAt.getDate() + intervalCount * 7);
      break;
    case "MONTH":
      expiresAt.setMonth(expiresAt.getMonth() + intervalCount);
      break;
    case "YEAR":
      expiresAt.setFullYear(expiresAt.getFullYear() + intervalCount);
      break;
  }

  return expiresAt;
}

/**
 * 🛰️ CREATE OR EXTEND SUBSCRIPTION
 * Logic: Extends existing active nodes or initializes fresh signal.
 */
export async function createOrExtendSubscription(input: CreateSubscriptionInput) {
  const { userId, merchantId, serviceId, serviceTierId } = input;

  if (!isUUID(userId) || !isUUID(merchantId) || !isUUID(serviceId) || !isUUID(serviceTierId)) {
    throw new Error("Handshake_Error: Malformed UUID detected");
  }

  const tier = await prisma.serviceTier.findUnique({
    where: { id: serviceTierId },
    include: { service: true },
  });

  if (!tier) throw new Error("State_Error: Service tier not found");

  const existing = await prisma.subscription.findUnique({
    where: { userId_serviceId: { userId, serviceId } },
  });

  const now = new Date();
  const startDate = existing && existing.status === "ACTIVE" && existing.expiresAt > now
    ? existing.expiresAt
    : now;

  const expiresAt = calculateExpiresAt(tier.interval, tier.intervalCount, startDate);

  const includeQuery = {
    service: true,
    serviceTier: true,
    merchant: { select: { companyName: true, botUsername: true } },
  };

  if (existing) {
    const updated = await prisma.subscription.update({
      where: { id: existing.id },
      data: {
        serviceTierId,
        status: "ACTIVE",
        expiresAt,
        renewals: { increment: 1 },
        inviteLink: tier.service.vipInviteLink,
      },
      include: includeQuery,
    });
    return sanitize(updated);
  }

  const created = await prisma.subscription.create({
    data: {
      userId,
      merchantId,
      serviceId,
      serviceTierId,
      status: "ACTIVE",
      startsAt: now,
      expiresAt,
      inviteLink: tier.service.vipInviteLink,
    },
    include: includeQuery,
  });

  return sanitize(created);
}

/**
 * 🔍 GET SUBSCRIPTION BY ID
 */
export async function getSubscriptionById(subscriptionId: string) {
  if (!isUUID(subscriptionId)) return null;

  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      user: { select: { id: true, telegramId: true, fullName: true, username: true } },
      service: true,
      serviceTier: true,
      merchant: { select: { id: true, companyName: true, botUsername: true } },
      payments: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  return sanitize(sub);
}

/**
 * 🔄 UPDATE STATUS
 */
export async function updateSubscriptionStatus(subscriptionId: string, status: SubscriptionStatus) {
  if (!isUUID(subscriptionId)) throw new Error("Format_Error: Invalid ID");

  const updated = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status },
  });

  return sanitize(updated);
}

/**
 * 🛰️ GET MERCHANT SUBSCRIPTION STATS (Staff Aware)
 * Logic: If merchantId is missing (Staff), aggregates platform-wide statistics.
 */
export async function getSubscriptionStats(merchantId?: string) {
  if (merchantId && !isUUID(merchantId)) {
    throw new Error("Invalid Merchant ID format");
  }

  const where = merchantId ? { merchantId } : {};

  const [active, expired, total, revenueData] = await Promise.all([
    prisma.subscription.count({ where: { ...where, status: "ACTIVE" } }),
    prisma.subscription.count({ where: { ...where, status: "EXPIRED" } }),
    prisma.subscription.count({ where }),
    prisma.payment.aggregate({
      where: { ...where, status: "SUCCESS" },
      _sum: { amount: true },
    }),
  ]);

  return {
    active,
    expired,
    total,
    totalRevenue: revenueData._sum.amount?.toString() || "0.00",
  };
}

/**
 * 🧹 EXPIRE OVERDUE
 * Bulk protocol to purge expired signal nodes.
 */
export async function expireOverdueSubscriptions() {
  const now = new Date();

  const expired = await prisma.subscription.updateMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: now },
    },
    data: {
      status: "EXPIRED",
    },
  });

  return expired.count;
}