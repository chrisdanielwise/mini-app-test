"use server";

import prisma from "@/lib/db";
import type { SubscriptionStatus, IntervalUnit } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (value?.d && value?.s) return value.toString();
      return value;
    })
  );
}

// =================================================================
// 📅 TEMPORAL LOGIC
// =================================================================

export async function calculateExpiresAt(
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
      // Standard: Institutional Month Rollover (prevents 31st to 1st skip)
      const currentMonth = expiresAt.getMonth();
      expiresAt.setMonth(currentMonth + count);
      if (expiresAt.getMonth() !== (currentMonth + count) % 12) {
        expiresAt.setDate(0); // Snap to last day of previous month
      }
      break;
    case "YEAR":
      expiresAt.setFullYear(expiresAt.getFullYear() + count);
      break;
  }
  return expiresAt;
}

// =================================================================
// 🛡️ SUBSCRIPTION PROTOCOLS (Hardened v16.16.20)
// =================================================================

export async function createOrExtendSubscription(input: any) {
  const { userId, merchantId, serviceId, serviceTierId } = input;

  if (!isUUID(userId) || !isUUID(merchantId) || !isUUID(serviceId) || !isUUID(serviceTierId)) {
    throw new Error("PROTOCOL_ERROR: Malformed_Identity_Vector");
  }

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

  let result;
  if (existing) {
    result = await prisma.subscription.update({
      where: { id: existing.id },
      data: { ...sharedData, renewals: { increment: 1 } },
      include: includeQuery,
    });
  } else {
    result = await prisma.subscription.create({
      data: { userId, merchantId, serviceId, startsAt: now, ...sharedData },
      include: includeQuery,
    });
  }

  // 🏛️ ATOMIC CACHE PURGE
  // Fix: Added CACHE_PROFILES.IDENTITY ("auth") to match Next.js 15 signature.
  revalidateTag("auth", CACHE_PROFILES.IDENTITY);

  return sanitize(result);
}

/**
 * 🧹 EXPIRE_OVERDUE_CRON
 */
export async function expireOverdueSubscriptions() {
  const result = await prisma.subscription.updateMany({
    where: { status: "ACTIVE", expiresAt: { lt: new Date() } },
    data: { status: "EXPIRED" },
  });

  if (result.count > 0) {
    revalidateTag("auth", CACHE_PROFILES.IDENTITY);
  }

  return result.count;
}