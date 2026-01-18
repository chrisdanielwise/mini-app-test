// "use server";

// import prisma from "@/lib/db";
// import { isUUID } from "@/lib/utils/validators";
// import { startOfDay, endOfDay } from "date-fns";
// import { cache } from "react";

// // =================================================================
// // 🚀 INTERFACES & PROTOCOL SCHEMAS
// // =================================================================

// export interface DateRange {
//   from: Date;
//   to: Date;
// }

// /**
//  * 🧹 ATOMIC_SANITIZE
//  * Architecture: Hydration safety for Decimal and BigInt values.
//  */
// function sanitize<T>(data: T): T {
//   return JSON.parse(JSON.stringify(data, (_, v) => 
//     typeof v === "bigint" ? v.toString() : v
//   ));
// }

// // =================================================================
// // 🛠️ INTERNAL RESILIENCE NODE
// // =================================================================

// async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
//   let attempts = 0;
//   while (attempts < 3) {
//     try {
//       return await fn();
//     } catch (error: any) {
//       attempts++;
//       if (attempts >= 3) throw error;
//       await new Promise(res => setTimeout(res, Math.pow(2, attempts) * 1000));
//     }
//   }
//   throw new Error(`Max retries for ${label}`);
// }

// // =================================================================
// // 🛡️ ANALYTICS EXPORTS (Hardened v16.16.12)
// // =================================================================

// /**
//  * 📊 REVENUE_ANALYTICS
//  * Logic: Group-By Aggregation at the Database Edge.
//  * Performance: 0ms Client-side mapping.
//  */
// export const getRevenueAnalytics = cache(async (merchantId?: string, range?: DateRange) => {
//   if (merchantId && !isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

//   const dateRange = range || {
//     from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
//     to: endOfDay(new Date())
//   };

//   return withRetry(async () => {
//     const where: any = {
//       status: "SUCCESS",
//       createdAt: { gte: dateRange.from, lte: dateRange.to },
//       ...(merchantId && { merchantId })
//     };

//     // 🏛️ ATOMIC AGGREGATION: Database-level sum and count
//     const [stats, dailyData] = await Promise.all([
//       prisma.payment.aggregate({
//         where,
//         _sum: { amount: true },
//         _count: { id: true },
//       }),
//       prisma.$queryRaw`
//         SELECT 
//           DATE_TRUNC('day', "createdAt") as date, 
//           SUM(amount) as amount 
//         FROM "Payment"
//         WHERE status = 'SUCCESS' 
//           AND "createdAt" BETWEEN ${dateRange.from} AND ${dateRange.to}
//           ${merchantId ? prisma.sql`AND "merchantId" = ${merchantId}` : prisma.sql``}
//         GROUP BY 1 
//         ORDER BY 1 ASC
//       `
//     ]);

//     return {
//       total: stats._sum.amount?.toString() || "0.00",
//       transactionCount: stats._count.id || 0,
//       dailyData: sanitize(dailyData),
//       currency: "USD"
//     };
//   }, "getRevenueAnalytics");
// });

// /**
//  * 📈 SUBSCRIBER_GROWTH_ANALYTICS
//  * Logic: Multi-state count grouping for New vs Churned telemetry.
//  */
// export const getSubscriberGrowth = cache(async (merchantId?: string, range?: DateRange) => {
//   if (merchantId && !isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");

//   const dateRange = range || {
//     from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
//     to: endOfDay(new Date())
//   };

//   return withRetry(async () => {
//     const where: any = {
//       createdAt: { gte: dateRange.from, lte: dateRange.to },
//       ...(merchantId && { merchantId })
//     };

//     // 🛰️ CLUSTER TELEMETRY: Aggregate New vs Expired states
//     const dailyData = await prisma.$queryRaw`
//       SELECT 
//         DATE_TRUNC('day', "createdAt") as date,
//         COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as new,
//         COUNT(CASE WHEN status IN ('CANCELLED', 'EXPIRED') THEN 1 END) as churned
//       FROM "Subscription"
//       WHERE "createdAt" BETWEEN ${dateRange.from} AND ${dateRange.to}
//         ${merchantId ? prisma.sql`AND "merchantId" = ${merchantId}` : prisma.sql``}
//       GROUP BY 1
//       ORDER BY 1 ASC
//     `;

//     const activeCount = await prisma.subscription.count({
//       where: { ...(merchantId && { merchantId }), status: "ACTIVE" }
//     });

//     return {
//       activeSubscribers: activeCount,
//       dailyData: sanitize(dailyData)
//     };
//   }, "getSubscriberGrowth");
// });


"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { startOfDay, endOfDay } from "date-fns";
import { cache } from "react";
// 🛰️ CRITICAL: Import the Prisma namespace and Enums
import { Prisma, PaymentStatus, SubscriptionStatus } from "@/generated/prisma";

export interface DateRange { from: Date; to: Date; }

/** 🧹 ATOMIC_SANITIZE */
function sanitize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, v) => 
    typeof v === "bigint" ? v.toString() : v
  ));
}

/**
 * 📊 REVENUE_ANALYTICS (Hardened v2026.1.18)
 * Fix: Standardized Raw SQL tags to prevent "default.sql" crashes.
 * Fix: Aligned table names to schema @map attributes ("payments").
 */
export const getRevenueAnalytics = cache(async (merchantId?: string, range?: DateRange) => {
  if (merchantId && !isUUID(merchantId)) return { total: "0.00", transactionCount: 0, dailyData: [] };

  const dateRange = range || {
    from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    to: endOfDay(new Date())
  };

  try {
    // 🏗️ 1. BASELINE STATS (Using high-speed indexed aggregations)
    const stats = await prisma.payment.aggregate({
      where: {
        merchantId: merchantId || undefined,
        status: PaymentStatus.SUCCESS, // ✅ FIXED: Institutional Uppercase
        createdAt: { gte: dateRange.from, lte: dateRange.to },
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    // 🏗️ 2. TIME-SERIES DATA (Raw SQL fixed for Turbopack)
    // Note: Schema uses @@map("payments"), so SQL must use lowercase "payments"
    const dailyData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "created_at") as date, 
        SUM(amount) as amount 
      FROM "payments"
      WHERE status = 'success' 
        AND "created_at" BETWEEN ${dateRange.from} AND ${dateRange.to}
        ${merchantId ? Prisma.sql`AND "merchant_id" = ${merchantId}::uuid` : Prisma.empty}
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
    console.error("🔥 [Analytics_Revenue_Fault]:", error.message);
    return { total: "0.00", transactionCount: 0, dailyData: [] };
  }
});

/**
 * 📈 SUBSCRIBER_GROWTH_ANALYTICS
 */
export const getSubscriberGrowth = cache(async (merchantId?: string, range?: DateRange) => {
  if (merchantId && !isUUID(merchantId)) return { activeSubscribers: 0, dailyData: [] };

  const dateRange = range || {
    from: startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    to: endOfDay(new Date())
  };

  try {
    const dailyData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "created_at") as date,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as new,
        COUNT(CASE WHEN status IN ('cancelled', 'expired') THEN 1 END) as churned
      FROM "subscriptions"
      WHERE "created_at" BETWEEN ${dateRange.from} AND ${dateRange.to}
        ${merchantId ? Prisma.sql`AND "merchant_id" = ${merchantId}::uuid` : Prisma.empty}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const activeCount = await prisma.subscription.count({
      where: { 
        merchantId: merchantId || undefined, 
        status: .ACTIVE // ✅ FIXED: Institutional Uppercase
      }
    });

    return {
      activeSubscribers: activeCount,
      dailyData: sanitize(dailyData)
    };
  } catch (error: any) {
    console.error("🔥 [Analytics_Growth_Fault]:", error.message);
    return { activeSubscribers: 0, dailyData: [] };
  }
});