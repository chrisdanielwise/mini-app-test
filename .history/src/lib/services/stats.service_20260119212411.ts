import { cache } from "react";
import { isUUID } from "../utils/validators";
import prisma from "../db";
import { Decimal } from "@prisma/client/runtime-library";

/**
 * 🏛️ INSTITUTIONAL_TYPES
 * Defining the shape of the telemetry egress for HUD synchronization.
 */
export interface DashboardStats {
  totalRevenue: number | Decimal;
  subscriberCount: number;
  openTickets: number;
  lastSync: string;
}

export interface DashboardStatsOptions {
  targetId: string;
}

/**
 * 🛰️ GET_DASHBOARD_STATS (Institutional v2026.1.20)
 * Logic: Concurrent aggregation for high-density HUD telemetry.
 */
export const getDashboardStats = cache(
  async (options: DashboardStatsOptions): Promise<DashboardStats> => {
    const { targetId } = options;

    // 🛡️ IDENTITY VALIDATION
    if (!isUUID(targetId)) {
      throw new Error("PROTOCOL_ERROR: Invalid_Target_Node_ID");
    }

    try {
      // Concurrent execution: Minimizing latency on database handshake
      const [revenue, totalSubscribers, activeTickets] = await Promise.all([
        prisma.payment.aggregate({
          where: { 
            merchantId: targetId, 
            status: "COMPLETED" 
          },
          _sum: { amount: true }
        }),
        prisma.subscription.count({
          where: { merchantId: targetId }
        }),
        prisma.ticket.count({
          where: { 
            merchantId: targetId, 
            status: "OPEN" 
          }
        })
      ]);

      return {
        totalRevenue: revenue._sum.amount || 0,
        subscriberCount: totalSubscribers,
        openTickets: activeTickets,
        lastSync: new Date().toISOString()
      };
    } catch (error: any) {
      console.error("📊 [Stats_Telemetry_Fault]:", error.message);
      throw new Error("TELEMETRY_SYNC_FAILED");
    }
  }
);