"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { startOfDay, endOfDay } from "date-fns";
import { cache } from "react";
// 🛰️ CRITICAL: Import Prisma namespace for the .raw helper
import { Prisma } from "@/generated/prisma"; 

export interface DateRange { from: Date; to: Date; }

function sanitize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, v) => 
    typeof v === "bigint" ? v.toString() : v
  ));
}

/**
 * 📊 REVENUE_ANALYTICS
 * Strategy: Structural SQL Injection.
 * Fix: Uses Prisma.raw for fragments to prevent the $3 syntax error.
 */
export const getRevenueAnalytics = cache(async (merchantId?: string, range?: DateRange) => {
  if (merchantId && !isUUID(merchantId)) return { total: "0.00", transactionCount: 0, dailyData: [] };

  const from = range?.from || startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const to = range?.to || endOfDay(new Date());

  try {
    // 1. Static Aggregates (Standard Prisma)
    const stats = await prisma.payment.aggregate({
      where: {
        merchantId: merchantId || undefined,
        status: "SUCCESS",
        createdAt: { gte: from, lte: to },
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    // 2. Dynamic Time-Series (Raw SQL)
    // ✅ FIX: Use Prisma.raw() for the conditional fragment
    const merchantClause = merchantId 
      ? Prisma.raw(`AND merchant_id = '${merchantId}'::uuid`) 
      : Prisma.empty;

    const dailyData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', created_at) as date, 
        SUM(amount) as amount 
      FROM payments
      WHERE status = 'success' 
        AND created_at BETWEEN ${from} AND ${to}
        ${merchantClause}
      GROUP BY 1 
      ORDER BY 1 ASC
    `;

    return {
      total: stats._sum.amount?.toString() || "0.00",
      transactionCount: stats._count.id || 0,
      dailyData: sanitize(dailyData),
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

  const from = range?.from || startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const to = range?.to || endOfDay(new Date());

  try {
    const merchantClause = merchantId 
      ? Prisma.raw(`AND merchant_id = '${merchantId}'::uuid`) 
      : Prisma.empty;

    const dailyData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as new,
        COUNT(CASE WHEN status IN ('cancelled', 'expired') THEN 1 END) as churned
      FROM subscriptions
      WHERE created_at BETWEEN ${from} AND ${to}
        ${merchantClause}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const activeCount = await prisma.subscription.count({
      where: { merchantId: merchantId || undefined, status: "ACTIVE" }
    });

    return { activeSubscribers: activeCount, dailyData: sanitize(dailyData) };
  } catch (error: any) {
    console.error("🔥 [Analytics_Growth_Fault]:", error.message);
    return { activeSubscribers: 0, dailyData: [] };
  }
});