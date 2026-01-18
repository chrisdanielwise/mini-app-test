"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";

/**
 * 📊 GET_DASHBOARD_STATS
 * Strategy: Direct Identifier Injection.
 * Fix: Removed Enum objects; using uppercase strings directly to satisfy Prisma.
 */
export const getDashboardStats = cache(async (merchantId?: string) => {
  // 🔍 TRACE: Entry Audit
  console.log(`📊 [Service_Trace]: Syncing Stats for Node_${merchantId?.slice(0, 8) || 'GLOBAL'}`);

  if (merchantId && !isUUID(merchantId)) return null;

  const where = merchantId ? { merchantId } : {};

  try {
    const [totalRevenue, recentPayments, activeSubscriptions, pendingTickets] =
      await Promise.all([
        prisma.payment.aggregate({
          // ✅ FIX: "SUCCESS" is the required uppercase identifier
          where: { ...where, status: "SUCCESS" },
          _sum: { amount: true }
        }),
        prisma.payment.findMany({
          where: { ...where, status: "SUCCESS" },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            amount: true,
            createdAt: true,
            user: { select: { fullName: true, username: true } },
            service: { select: { name: true } },
          },
        }),
        prisma.subscription.count({ 
          // ✅ FIX: "ACTIVE" is the required uppercase identifier
          where: { ...where, status: "ACTIVE" } 
        }),
        prisma.ticket.count({ 
          // ✅ FIX: "OPEN" is the required uppercase identifier
          where: { ...where, status: "OPEN" } 
        }),
      ]);

    return {
      totalRevenue: totalRevenue._sum.amount?.toString() || "0.00",
      activeSubscriptions,
      pendingTickets,
      recentPayments: recentPayments.map(p => ({
        ...p,
        amount: p.amount.toString()
      }))
    };
  } catch (error: any) {
    console.error("🔥 [Dashboard_Stats_Crash]: Handshake rejected ->", error.message);
    return null; 
  }
});

/**
 * ⚡ GET_MERCHANT_ACTIVITY
 */
export const getMerchantActivity = cache(async (merchantId?: string, limit = 10) => {
  if (!merchantId || !isUUID(merchantId)) return [];

  try {
    const activity = await prisma.subscription.findMany({
      where: { 
        merchantId, 
        // ✅ FIX: Using direct uppercase string
        status: "ACTIVE" 
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { fullName: true, username: true } },
        service: { select: { name: true } },
        serviceTier: { select: { name: true, price: true } },
      },
    });

    return JSON.parse(JSON.stringify(activity, (_, v) => typeof v === 'bigint' ? v.toString() : v));
  } catch (error: any) {
    console.error("🔥 [Activity_Sync_Fault]: Handshake rejected ->", error.message);
    return [];
  }
});