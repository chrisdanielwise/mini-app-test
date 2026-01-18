"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { startOfDay, endOfDay } from "date-fns";
import { cache } from "react";
// 🛰️ CRITICAL: Import the Prisma namespace to resolve "default.sql" crashes
import { Prisma } from "@/generated/prisma";

// =================================================================
// 🚀 INTERFACES & PROTOCOL SCHEMAS
// =================================================================

export interface DateRange {
  from: Date;
  to: Date;
}

/**
 * 🧹 ATOMIC_SANITIZE
 * Architecture: Hydration safety for Decimal and BigInt values.
 * Prevents "Cannot serialize a BigInt" crashes during Server-to-Client handover.
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data, (_, v) => 
    typeof v === "bigint" ? v.toString() : v
  ));
}

// =================================================================
// 🛠️ INTERNAL RESILIENCE NODE
// =================================================================

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  let attempts = 0;
  while (attempts < 3) {
    try {
      return await fn();
    } catch (error: any) {
      attempts++;
      if (attempts >= 3) throw error;
      // Exponential backoff to handle database connection spikes
      await new Promise(res => setTimeout(res, Math.pow(2, attempts) * 1000));
    }
  }
  throw new Error(`Max retries for ${label}`);
}

// =================================================================
// 🛡️ ANALYTICS EXPORTS (Institutional Apex v2026.1.18)
// =================================================================

/**
 * 📊 REVENUE_ANALYTICS
 * Logic: Group-By Aggregation at the Database Edge.
 * Fix: Replaced 'prisma.sql' with 'Prisma.sql' to resolve Turbopack import errors.
 * Fix: Aligned table names to physical schema ('payments').
 */
export const getRevenueAnalytics = cache(async (merchantId?: string, range?: DateRange) => {
  if (merchantId && !isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

  const dateRange = range || {
    from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    to: endOfDay(new Date())
  };

  return withRetry(async () => {
    try {
      // 🏗️ 1. BASELINE TOTALS
      const stats = await prisma.payment.aggregate({
        where: {
          merchantId: merchantId || undefined,
          status: "SUCCESS", // Institutional Uppercase Identifier
          createdAt: { gte: dateRange.from, lte: dateRange.to },
        },
        _sum: { amount: true },
        _count: { id: true },
      });

      // 🏗️ 2. CHART TELEMETRY
      // Note: We use Prisma.raw for conditional logic to prevent $3 syntax errors
      const merchantFilter = merchantId 
        ? Prisma.raw(`AND merchant_id = '${merchantId}'::uuid`) 
        : Prisma.empty;

      const dailyData = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('day', created_at) as date, 
          SUM(amount) as amount 
        FROM payments
        WHERE status = 'success' 
          AND created_at BETWEEN ${dateRange.from} AND ${dateRange.to}
          ${merchantFilter}
        GROUP BY 1 
        ORDER BY 1 ASC
      `;

      return {
        total: stats._sum.amount?.toString() || "0.00",
        transactionCount: stats._count.id || 0,
        dailyData: sanitize(dailyData),
        currency: "USD"
      };
    } catch (error: any) {
      console.error("🔥 [Revenue_Telemetry_Fault]:", error.message);
      return { total: "0.00", transactionCount: 0, dailyData: [], currency: "USD" };
    }
  }, "getRevenueAnalytics");
});

/**
 * 📈 SUBSCRIBER_GROWTH_ANALYTICS
 * Logic: Multi-state count grouping for New vs Churned telemetry.
 * Fix: Uses 'subscriptions' table name and 'created_at' column mapping.
 */
export const getSubscriberGrowth = cache(async (merchantId?: string, range?: DateRange) => {
  if (merchantId && !isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

  const dateRange = range || {
    from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    to: endOfDay(new Date())
  };

  return withRetry(async () => {
    try {
      
      // ✅ Use Prisma.raw for structural fragments, NOT standard ${}
const merchantFilter = merchantId 
  ? Prisma.raw(`AND merchant_id = '${merchantId}'::uuid`) 
  : Prisma.empty;

const dailyData = await prisma.$queryRaw`
  SELECT 
    DATE_TRUNC('day', created_at) as date, 
    SUM(amount) as amount 
  FROM payments
  WHERE status = 'success' 
    AND created_at BETWEEN ${dateRange.from} AND ${dateRange.to}
    ${merchantFilter}
  GROUP BY 1 
  ORDER BY 1 ASC
`;
      const activeCount = await prisma.subscription.count({
        where: { 
          merchantId: merchantId || undefined, 
          status: "ACTIVE" 
        }
      });

      return {
        activeSubscribers: activeCount,
        dailyData: sanitize(dailyData)
      };
    } catch (error: any) {
      console.error("🔥 [Growth_Telemetry_Fault]:", error.message);
      return { activeSubscribers: 0, dailyData: [] };
    }
  }, "getSubscriberGrowth");
});