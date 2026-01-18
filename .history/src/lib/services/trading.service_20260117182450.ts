"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { ExecutionStatus } from "@/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export const TradingService = {
  /**
   * 📡 BROADCAST_SIGNAL
   * Logic: Deploys a new signal and prepares execution nodes for all active copiers.
   */
  async broadcastSignal(params: {
    merchantId: string;
    symbol: string;
    action: "BUY" | "SELL";
    entryPrice: number;
    stopLoss?: number;
    takeProfit?: number;
  }) {
    return await prisma.$transaction(async (tx) => {
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
      // Fetch all users who have enabled copying for this merchant
      // Note: In your schema, CopierSettings is linked to User.
      // We filter for active subscriptions to this merchant's services.
      const activeCopiers = await tx.subscription.findMany({
        where: {
          merchantId: params.merchantId,
          status: "ACTIVE",
          user: { copierSettings: { isEnabled: true } }
        },
        select: { userId: true }
      });

      // 3. Queue Executions
      if (activeCopiers.length > 0) {
        await tx.copierExecution.createMany({
          data: activeCopiers.map((copier) => ({
            signalId: signal.id,
            userId: copier.userId,
            status: ExecutionStatus.PENDING,
          })),
        });
      }

      revalidateTag("trading_node", CACHE_PROFILES.DATA);
      return { signalId: signal.id, queuedCount: activeCopiers.length };
    });
  },

  /**
   * 🛡️ UPDATE_COPIER_SETTINGS
   * Logic: Hardens MT4 credentials and risk parameters.
   */
  async updateCopierSettings(userId: string, data: {
    mt4AccountId: string;
    mt4Password: string; // Ensure encryption at the application layer
    brokerServer: string;
    riskType: string;
    riskValue: number;
  }) {
    if (!isUUID(userId)) throw new Error("TRADING_ERROR: INVALID_USER_ID");

    const settings = await prisma.copierSetting.upsert({
      where: { userId },
      update: { ...data, updatedAt: new Date() },
      create: { 
        userId, 
        ...data,
        isEnabled: false // Default to off for safety
      },
    });

    revalidateTag("trading_node", CACHE_PROFILES.DATA);
    return settings;
  },

  /**
   * 📊 GET_SIGNAL_PERFORMANCE
   * Logic: Aggregates success/failure metrics for a specific signal cluster.
   */
  getSignalStats: cache(async (signalId: string) => {
    const stats = await prisma.copierExecution.groupBy({
      by: ['status'],
      where: { signalId },
      _count: true,
    });

    return stats.reduce((acc: any, curr) => {
      acc[curr.status] = curr._count;
      return acc;
    }, {});
  }),
};