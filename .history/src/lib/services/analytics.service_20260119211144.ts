"use server";

import { PaymentStatus, SubscriptionStatus, SubscriptionType } from "@/generated/prisma";
import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";


/**
 * 🛰️ GET_REVENUE_ANALYTICS (Institutional v2026.1.20)
 * Strategy: Object-Based Configuration Ingress.
 * Fix: Resolved TS2345 by transitioning from string param to Options object.
 */
export const getRevenueAnalytics = cache(async (options: {
  targetId?: string | null;
  from?: Date;
  to?: Date;
}) => {
  // Extract configuration from the institutional handshake
  const { targetId, from, to } = options;

  // 🛡️ IDENTITY VALIDATION
  if (targetId && !isUUID(targetId)) {
    return { total: "0.00", transactionCount: 0, dailyData: [] };
  }

  try {
    // Standard Prisma Aggregate (Safety First)
    const stats = await prisma.payment.aggregate({
      where: {
        // Map targetId to merchantId; if null, it queries global telemetry (Staff mode)
        merchantId: targetId || undefined,
        status: PaymentStatus.SUCCESS,
        // Optional temporal filtering
        createdAt: from || to ? {
          gte: from || undefined,
          lte: to || undefined,
        } : undefined,
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    return {
      total: stats._sum.amount?.toString() || "0.00",
      transactionCount: stats._count.id || 0,
      dailyData: [], // 🚧 Note: Implement time-series grouping here for chart mode
    };
  } catch (error: any) {
    console.error("📊 [Revenue_Telemetry_Fault]:", error.message);
    return { total: "0.00", transactionCount: 0, dailyData: [] };
  }
});

/**
 * 🛰️ GET_SUBSCRIBER_GROWTH (v2026.1.20)
 * Logic: Daily Aggregation + Zero-Fill Gap Logic.
 */
export const getSubscriberGrowth = cache(async (options: { 
  targetId?: string | null;
  from?: Date;
  to?: Date;
}) => {
  const { 
    targetId, 
    from = subDays(new Date(), 30), 
    to = new Date() 
  } = options;

  if (targetId && !isUUID(targetId)) {
    return { activeSubscribers: 0, dailyData: [] };
  }

  try {
    // 1. Concurrent Execution: Get Total Count & Historical Data
    const [activeCount, historicalData] = await Promise.all([
      prisma.subscription.count({
        where: { 
          merchantId: targetId || undefined, 
          status: SubscriptionStatus.ACTIVE 
        }
      }),
      prisma.subscription.groupBy({
        by: ['createdAt'],
        where: {
          merchantId: targetId || undefined,
          createdAt: { gte: startOfDay(from), lte: to },
        },
        _count: { id: true },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    // 2. Chronological Mapping (The Heartbeat Logic)
    // Generate an array for every day in the interval
    const allDays = eachDayOfInterval({ start: from, end: to });
    
    // Create a lookup map for faster processing
    const dataMap = new Map(
      historicalData.map(d => [format(d.createdAt, 'yyyy-MM-dd'), d._count.id])
    );

    // 3. Normalized Egress
    const dailyData = allDays.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      return {
        date: dateKey,
        // Fallback to 0 if no subscriptions were recorded on this node
        subscribers: dataMap.get(dateKey) || 0,
        // Label for the frontend chart tooltips
        label: format(day, 'MMM dd')
      };
    });

    return {
      activeSubscribers: activeCount,
      dailyData
    };

  } catch (error: any) {
    console.error("📊 [Growth_Telemetry_Fault]:", error.message);
    return { activeSubscribers: 0, dailyData: [] };
  }
});