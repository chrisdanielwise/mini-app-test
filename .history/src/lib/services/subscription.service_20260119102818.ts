"use server";

import prisma from "@/lib/db";
import {
  SubscriptionStatus,
  ServiceTierInterval, // Matches your IntervalUnit requirement
  Prisma,
  Subscription,
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
// ✅ CORRECTED DECIMAL PATH
import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Logic: Hydration safety for BigInt (TG_IDs) and Decimals.
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      // Handle Decimal.js instances from @prisma/client-runtime-utils
      if (
        typeof value === "object" &&
        value !== null &&
        value.constructor.name === "Decimal"
      ) {
        return value.toString();
      }
      return value;
    })
  );
}

// =================================================================
// 📅 TEMPORAL LOGIC
// =================================================================

/**
 * 🛰️ CALCULATE_EXPIRES_AT
 * Logic: Institutional date rollover logic for tiered billing.
 */
export function calculateExpiresAt(
  interval: ServiceTierInterval,
  intervalCount: number,
  startDate: Date = new Date()
): Date {
  const expiresAt = new Date(startDate);
  const count = intervalCount || 1;

  switch (interval) {
    case ServiceTierInterval.DAY:
      expiresAt.setDate(expiresAt.getDate() + count);
      break;
    case ServiceTierInterval.WEEK:
      expiresAt.setDate(expiresAt.getDate() + count * 7);
      break;
    case ServiceTierInterval.MONTH:
      const currentMonth = expiresAt.getMonth();
      expiresAt.setMonth(currentMonth + count);
      // Safety: Handle months with differing lengths (e.g., Jan 31 -> Feb 28)
      if (expiresAt.getMonth() !== (currentMonth + count) % 12) {
        expiresAt.setDate(0);
      }
      break;
    case ServiceTierInterval.YEAR:
      expiresAt.setFullYear(expiresAt.getFullYear() + count);
      break;
  }
  return expiresAt;
}

// =================================================================
// 🛡️ SUBSCRIPTION PROTOCOLS (Hardened v2026.1.20)
// =================================================================

export async function createOrExtendSubscription(input: {
  userId: string;
  merchantId: string;
  serviceId: string;
  serviceTierId: string;
  paymentId?: string;
}): Promise<Subscription> {
  const { userId, merchantId, serviceId, serviceTierId } = input;

  if (
    !isUUID(userId) ||
    !isUUID(merchantId) ||
    !isUUID(serviceId) ||
    !isUUID(serviceTierId)
  ) {
    throw new Error("PROTOCOL_ERROR: Malformed_Identity_Vector");
  }

  const tier = await prisma.serviceTier.findUnique({
    where: { id: serviceTierId },
    select: {
      interval: true,
      // Assuming your schema uses 'intervalCount' or default to 1
      service: { select: { vipInviteLink: true } },
    },
  });

  if (!tier) throw new Error("NODE_MISSING: Service_Tier_Not_Found");

  const existing = await prisma.subscription.findUnique({
    where: { userId_serviceId: { userId, serviceId } },
    select: { id: true, status: true, expiresAt: true },
  });

  const now = new Date();
  // ✅ FIX: Use SubscriptionStatus.ACTIVE (maps to "active" in DB)
  const startDate =
    existing &&
    existing.status === SubscriptionStatus.ACTIVE &&
    existing.expiresAt > now
      ? existing.expiresAt
      : now;

  // Logic: IntervalCount defaults to 1 if not present in schema
  const expiresAt = calculateExpiresAt(tier.interval, 1, startDate);

  const sharedData = {
    serviceTierId,
    status: SubscriptionStatus.ACTIVE,
    expiresAt,
    inviteLink: tier.service.vipInviteLink,
  };

  const includeQuery = {
    service: { select: { name: true } },
    serviceTier: { select: { name: true, price: true } },
    merchant: { select: { companyName: true, botUsername: true } },
  };

  let result;
  if (existing) {
    result = await prisma.subscription.update({
      where: { id: existing.id },
      data: { ...sharedData, renewals: { increment: 1 } },
      include: includeQuery,
    });
  } else {
    result = await prisma.subscription.create({
      data: {
        userId,
        merchantId,
        serviceId,
        startsAt: now,
        ...sharedData,
      },
      include: includeQuery,
    });
  }

  // ✅ FIX: Mandatory profile argument for revalidateTag in Next.js 15
  revalidateTag("auth", "default");

  return sanitize(result);
}

/**
 * 🧹 EXPIRE_OVERDUE_CRON
 * Logic: Batch update for cron-job processing of stale signals.
 */
export async function expireOverdueSubscriptions(): Promise<number> {
  const result = await prisma.subscription.updateMany({
    where: {
      status: SubscriptionStatus.ACTIVE,
      expiresAt: { lt: new Date() },
    },
    data: { status: SubscriptionStatus.EXPIRED }, // ✅ Maps to "expired"
  });

  if (result.count > 0) {
    revalidateTag("auth", "default");
  }

  return result.count;
}
