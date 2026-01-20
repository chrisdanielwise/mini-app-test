"use server";

import prisma from "@/lib/db";
import { 
  SubscriptionStatus, 
  IntervalUnit, // ✅ FIX: Correct exported member from your schema
  Subscription
} from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { revalidateTag } from "next/cache";
// ✅ CORRECTED DECIMAL PATH

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (typeof value === 'object' && value !== null && value.constructor.name === 'Decimal') {
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
 * Logic: Uses the 'IntervalUnit' enum for cross-module temporal alignment.
 */
export async function calculateExpiresAt(
  interval: IntervalUnit,
  intervalCount: number,
  startDate: Date = new Date()
): Promise<Date>{
  const expiresAt = new Date(startDate);
  const count = intervalCount || 1;

  switch (interval) {
    case IntervalUnit.DAY:
      expiresAt.setDate(expiresAt.getDate() + count);
      break;
    case IntervalUnit.WEEK:
      expiresAt.setDate(expiresAt.getDate() + count * 7);
      break;
    case IntervalUnit.MONTH:
      const currentMonth = expiresAt.getMonth();
      expiresAt.setMonth(currentMonth + count);
      // Snap to last day of month if rollover exceeds target month length
      if (expiresAt.getMonth() !== (currentMonth + count) % 12) {
        expiresAt.setDate(0); 
      }
      break;
    case IntervalUnit.YEAR:
      expiresAt.setFullYear(expiresAt.getFullYear() + count);
      break;
  }
  return expiresAt;
}

// =================================================================
// 🛡️ SUBSCRIPTION PROTOCOLS (Hardened v2026.1.19)
// =================================================================




/**
 * 🧹 EXPIRE_OVERDUE_CRON
 */
export async function expireOverdueSubscriptions(): Promise<number> {
  const result = await prisma.subscription.updateMany({
    where: { 
      status: SubscriptionStatus.ACTIVE, 
      expiresAt: { lt: new Date() } 
    },
    data: { status: SubscriptionStatus.EXPIRED },
  });

  if (result.count > 0) {
    revalidateTag("auth", "default");
  }

  return result.count;
}