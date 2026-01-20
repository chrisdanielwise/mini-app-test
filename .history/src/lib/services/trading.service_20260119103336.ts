"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Prisma Types and Enums
import { 
  ExecutionStatus, 
  SubscriptionStatus, 
  Prisma,
  TradeSignal,
  CopierSetting 
} from "@/generated/prisma";
// ✅ CORRECTED PATH: Resolving build-time 'module not found'
import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Architecture: Hydration safety for BigInt (TG_IDs) and Decimals.
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (_, v) => {
      if (typeof v === "bigint") return v.toString();
      if (v?.constructor?.name === 'Decimal') return v.toString();
      return v;
    })
  );
}

// =================================================================
// 📡 TRADING PROTOCOLS (Apex v2026.1.20)
// =================================================================

export const TradingService = {
  /**
   * 📡 BROADCAST_SIGNAL
   * Logic: Deploys a new signal and prepares execution nodes for all active copiers.
   * Fix: Uses SubscriptionStatus.ACTIVE and ExecutionStatus.PENDING Enums.
   */
  async broadcastSignal(params: {
    merchantId: string;
    symbol: string;
    action: "BUY" | "SELL";
    entryPrice: number | Decimal;
    stopLoss?: number | Decimal;
    takeProfit?: number | Decimal;
  }) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Create the Master Signal Node
      const signal = await tx.tradeSignal.create({
        data: {
          merchantId: params.merchantId,
          symbol: params.symbol,
          action: params.action,
          entryPrice: params.entryPrice,
          stopLoss: params.stopLoss,
          takeProfit: params.takeProfit,
        },
      });

      // 2. Identify Active Copiers
      const activeCopiers = await tx.subscription.findMany({
        where: {
          merchantId: params.merchantId,
          // ✅ FIX: Using SubscriptionStatus.ACTIVE (Maps to "active" in DB)
          status: SubscriptionStatus.ACTIVE,
          user: { 
            copierSettings: { isEnabled: true } 
          }
        },
        select: { userId: true }
      });

      // 3. Queue Executions
      if (activeCopiers.length > 0) {
        await tx.copierExecution.createMany({
          data: activeCopiers.map((copier) => ({
            signalId: signal.id,
            userId: copier.userId,
            // ✅ FIX: Using ExecutionStatus.PENDING (Maps to "pending" in DB)
            status: ExecutionStatus.PENDING,
          })),
        });
      }

      // ✅ FIX: Mandatory second argument for revalidateTag in Next.js 15
      revalidateTag("trading_node", "default");

      return { signalId: signal.id, queuedCount: activeCopiers.length };
    });
  },

  /**
   * 🛡️ UPDATE_COPIER_SETTINGS
   * Logic: Hardens MT4 credentials and risk parameters.
   */
  async updateCopierSettings(userId: string, data: {
    mt4AccountId: string;
    mt4Password: string;
    brokerServer: string;
    riskType: string;
    riskValue: number | Decimal;
  }): Promise<CopierSetting> {
    if (!isUUID(userId)) throw new Error("TRADING_ERROR: INVALID_USER_ID");

    const settings = await prisma.copierSetting.upsert({
      where: { userId },
      update: { ...data, updatedAt: new Date() },
      create: { 
        userId, 
        ...data,
        isEnabled: false // Default to off for safety protocol
      },
    });

    revalidateTag("trading_node", "default");
    return sanitize(settings);
  },

  /**
   * 📊 GET_SIGNAL_PERFORMANCE
   * Logic: Aggregates success/failure metrics for a specific signal cluster.
   */
  getSignalStats: cache(async (signalId: string) => {
    if (!isUUID(signalId)) return {};

    const stats = await prisma.copierExecution.groupBy({
      by: ['status'],
      where: { signalId },
      _count: true,
    });

    const result = stats.reduce((acc: Record<string, number>, curr) => {
      acc[curr.status] = curr._count;
      return acc;
    }, {});

    return sanitize(result);
  }),
};