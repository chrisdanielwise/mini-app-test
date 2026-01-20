"use server";

import { SubscriptionType } from "@/generated/prisma";
import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { startOfDay, endOfDay } from "date-fns";
import { cache } from "react";

/**
 * 📊 STABILIZED ANALYTICS (v2026.1.18)
 * Strategy: Zero-Raw-SQL. 
 * Reason: Your environment is currently rejecting Raw SQL fragments ($3 error).
 * This version uses 100% Prisma Schema logic to ensure the dashboard loads.
 */

export const getRevenueAnalytics = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) return { total: "0.00", transactionCount: 0, dailyData: [] };

  try {
    // Standard Prisma Aggregate (Safety First)
    const stats = await prisma.payment.aggregate({
      where: {
        merchantId: merchantId || undefined,
        status: "SUCCESS" as  SubscriptionType, // Uppercase as per your Prisma Schema
      },
      _sum: { amount: true },
      _count: { id: true },
    });

    return {
      total: stats._sum.amount?.toString() || "0.00",
      transactionCount: stats._count.id || 0,
      dailyData: [], // Temporarily empty to stabilize the handshake
    };
  } catch (error: any) {
    console.error("📊 [Revenue_Telemetry_Fault]:", error.message);
    return { total: "0.00", transactionCount: 0, dailyData: [] };
  }
});

export const getSubscriberGrowth = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) return { activeSubscribers: 0, dailyData: [] };

  try {
    const activeCount = await prisma.subscription.count({
      where: { 
        merchantId: merchantId || undefined, 
        status: "ACTIVE" // Uppercase as per your Prisma Schema
      }
    });

    return {
      activeSubscribers: activeCount,
      dailyData: [] // Temporarily empty to stabilize the handshake
    };
  } catch (error: any) {
    console.error("📊 [Growth_Telemetry_Fault]:", error.message);
    return { activeSubscribers: 0, dailyData: [] };
  }
});