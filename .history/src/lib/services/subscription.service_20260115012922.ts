"use server";

import prisma from "@/lib/db";
import type { SubscriptionStatus, IntervalUnit } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client/runtime-library";
import { cache } from "react";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Architecture: Hydration safety for Next.js 15+ & Turbopack.
 * Logic: Recursively handles BigInt (TG_IDs) and Decimals (Capital).
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      // Precise check for Prisma Decimal internal structure
      if (value?.d && value?.s) return value.toString();
      return value;
    })
  );
}

// =================================================================
// 📅 TEMPORAL LOGIC
// =================================================================

export function calculateExpiresAt(
  interval: IntervalUnit,
  intervalCount: number,
  startDate: Date = new Date()
): Date {
  const expiresAt = new Date(startDate);
  const count = intervalCount || 1;

  switch (interval) {
    case "DAY":
      expiresAt.setDate(expiresAt.getDate() + count);
      break;
    case "WEEK":
      expiresAt.setDate(expiresAt.getDate() + count * 7);
      break;
    case "MONTH":
      expiresAt.setMonth(expiresAt.getMonth() + count);
      break;
    case "YEAR":
      expiresAt.setFullYear(expiresAt.getFullYear() + count);
      break;
  }
  return expiresAt;
}

// =================================================================
// 🛡️ SUBSCRIPTION PROTOCOLS (Hardened v16.16.12)
// =================================================================

/**
 * 💎 CREATE OR EXTEND SUBSCRIPTION
 * Logic: Implements "Temporal Stacking." If a user renews early, 
 * time is added to their existing expiration date, not today's date.
 */
export async function createOrExtendSubscription(input: any) {
  const { userId, merchantId, serviceId, serviceTierId } = input;

  if (!isUUID(userId) || !isUUID(merchantId) || !isUUID(serviceId) || !isUUID(serviceTierId)) {
    throw new Error("PROTOCOL_ERROR: Malformed_Identity_Vector");
  }

  // Atomic Fetch: Get tier and service metadata
  const tier = await prisma.serviceTier.findUnique({
    where: { id: serviceTierId },
    select: { 
      interval: true, 
      intervalCount: true, 
      service: { select: { vipInviteLink: true } } 
    },
  });

  if (!tier) throw new Error("NODE_MISSING: Service_Tier_Not_Found");

  const existing = await prisma.subscription.findUnique({
    where: { userId_serviceId: { userId, serviceId } },
    select: { id: true, status: true, expiresAt: true }
  });

  const now = new Date();
  // 🏛️ CONTINUITY LOGIC: Stack time if active, otherwise start fresh
  const startDate = existing && existing.status === "ACTIVE" && existing.expiresAt > now
    ? existing.expiresAt
    : now;

  const expiresAt = calculateExpiresAt(tier.interval, tier.intervalCount, startDate);

  const sharedData = {
    serviceTierId,
    status: "ACTIVE" as SubscriptionStatus,
    expiresAt,
    inviteLink: tier.service.vipInviteLink,
  };

  const includeQuery = {
    service: { select: { name: true } },
    serviceTier: { select: { name: true, price: true } },
    merchant: { select: { companyName: true, botUsername: true } },
  };

  if (existing) {
    const updated = await prisma.subscription.update({
      where: { id: existing.id },
      data: { ...sharedData, renewals: { increment: 1 } },
      include: includeQuery,
    });
    return sanitize(updated);
  }

  const created = await prisma.subscription.create({
    data: {
      userId,
      merchantId,
      serviceId,
      startsAt: now,
      ...sharedData,
    },
    include: includeQuery,
  });

  return sanitize(created);
}

/**
 * 🔍 GET_SUBSCRIPTION_BY_ID
 * Performance: Memoized for Next.js Data Cache.
 */
export const getSubscriptionById = cache(async (subscriptionId: string) => {
  if (!isUUID(subscriptionId)) return null;

  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      user: { select: { id: true, telegramId: true, fullName: true, username: true } },
      service: { select: { name: true, categoryTag: true } },
      serviceTier: { select: { name: true, price: true, interval: true } },
      merchant: { select: { id: true, companyName: true, botUsername: true } },
    },
  });

  return sanitize(sub);
});

/**
 * 📊 GET_SUBSCRIPTION_STATS
 * Logic: Parallelized count and aggregation.
 */
export const getSubscriptionStats = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

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
});

/**
 * 🧹 EXPIRE_OVERDUE_CRON
 * Bulk protocol to transition status for expired nodes.
 */
export async function expireOverdueSubscriptions() {
  const result = await prisma.subscription.updateMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: new Date() },
    },
    data: { status: "EXPIRED" },
  });

  return result.count;
}