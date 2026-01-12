import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { startOfDay, endOfDay, eachDayOfInterval, format } from "date-fns";

// =================================================================
// 🚀 INTERFACES
// =================================================================

export interface DateRange {
  from: Date;
  to: Date;
}

// =================================================================
// 🛠️ INTERNAL HELPERS
// =================================================================

/**
 * 🚀 DB RESILIENCE HELPER
 * Optimized for Neon Serverless. Handles platform-wide heavy lifting.
 */
async function withRetry<T>(fn: () => Promise<T>, label: string, maxAttempts = 3): Promise<T> {
  let attempts = 0;
  let delay = 2000; 
  
  while (attempts < maxAttempts) {
    try {
      return await fn();
    } catch (error: any) {
      attempts++;
      const isConnectionError = 
        error.message.includes('timeout') || 
        error.message.includes('terminated') ||
        error.message.includes("Can't reach database");

      if (isConnectionError && attempts < maxAttempts) {
        console.warn(`[Neon Retry] ${label}: Attempt ${attempts}/${maxAttempts}.`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; 
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Max retry attempts reached for ${label}`);
}

/**
 * 🛠️ Time-Series Mapping
 */
function mapToDailyIntervals(range: DateRange, items: any[], type: "amount" | "count") {
  const days = eachDayOfInterval({ start: range.from, end: range.to });
  
  return days.map(day => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    const formattedDate = format(day, "MMM dd");

    const dayItems = items.filter(item => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= dayStart && itemDate <= dayEnd;
    });

    if (type === "amount") {
      const sum = dayItems.reduce((acc, i) => acc + parseFloat(i.amount.toString()), 0);
      return { date: formattedDate, amount: sum.toFixed(2) };
    } else {
      const count = dayItems.filter(i => i.status === "ACTIVE").length;
      const churned = dayItems.filter(i => 
        ["CANCELLED", "EXPIRED", "INACTIVE"].includes(i.status)
      ).length;
      return { date: formattedDate, new: count, churned };
    }
  });
}

// =================================================================
// 🛡️ NAMED EXPORTS (Hardened for Turbopack & RBAC)
// =================================================================

/**
 * 📊 REVENUE ANALYTICS
 * Logic: If merchantId is null/undefined, it fetches Platform-Wide totals.
 */
export async function getRevenueAnalytics(merchantId?: string, range?: DateRange) {
  // 🛡️ ROLE GUARD: Only validate UUID if a merchantId is actually passed.
  if (merchantId && !isUUID(merchantId)) {
    throw new Error("Invalid Merchant ID format");
  }

  // Default range to last 30 days if not provided
  const dateRange = range || {
    from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    to: endOfDay(new Date())
  };

  return withRetry(async () => {
    // Build dynamic where clause
    const where: any = {
      status: "SUCCESS",
      createdAt: { gte: dateRange.from, lte: dateRange.to },
    };

    // 🛰️ CLUSTER ISOLATION: Apply filter only if merchant context exists
    if (merchantId) where.merchantId = merchantId;

    const stats = await prisma.payment.aggregate({
      where,
      _sum: { amount: true },
      _count: { id: true },
    });

    const dailyPayments = await prisma.payment.findMany({
      where,
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const dailyData = mapToDailyIntervals(dateRange, dailyPayments, "amount");

    return {
      total: stats._sum.amount?.toString() || "0.00",
      currency: "USD",
      dailyData,
      transactionCount: stats._count.id || 0,
    };
  }, "getRevenueAnalytics");
}

/**
 * 📈 USER GROWTH ANALYTICS
 */
export async function getSubscriberGrowth(merchantId?: string, range?: DateRange) {
  // 🛡️ Ensure staff bypass UUID check to prevent crashes
  if (merchantId && !isUUID(merchantId)) throw new Error("Invalid Merchant ID format");

  const dateRange = range || {
    from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    to: endOfDay(new Date())
  };

  return withRetry(async () => {
    const where: any = {
      createdAt: { gte: dateRange.from, lte: dateRange.to },
    };
    
    if (merchantId) where.merchantId = merchantId;

    const subscriptions = await prisma.subscription.findMany({
      where,
      select: { status: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Active count is a global/cluster snapshot
    const activeCount = await prisma.subscription.count({
      where: merchantId ? { merchantId, status: "ACTIVE" } : { status: "ACTIVE" },
    });

    return {
      activeSubscribers: activeCount,
      dailyData: mapToDailyIntervals(dateRange, subscriptions, "count"),
    };
  }, "getSubscriberGrowth");
}