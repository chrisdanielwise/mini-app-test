import prisma from "@/src/lib/db";
import type { PaymentStatus } from "@/generated/prisma";
import { SubscriptionService } from "./subscription.service";
import { v4 as uuidv4 } from "uuid";
import { isUUID } from "@/src/lib/utils/validators";
import {  } from "@prisma/client-runtime-utils";

export class PaymentService {
  /**
   * 🛰️ PENDING INGRESS: Create initial payment node
   */
  static async create(input: CreatePaymentInput) {
    if (!isUUID(input.userId) || !isUUID(input.merchantId)) {
      throw new Error("Handshake_Error: Malformed UUID detected");
    }

    const gatewayReference = `ZIPHA_${uuidv4().split('-')[0].toUpperCase()}`;

    return prisma.payment.create({
      data: {
        ...input,
        gatewayReference,
        status: "PENDING",
      },
    });
  }

  /**
   * 💎 ATOMIC COMPLETION: The Financial Handshake
   * Orchestrates the ledger, subscription, and analytics in a single transaction.
   */
  static async complete(paymentId: string, providerTxId?: string, rawResponse?: object) {
    if (!isUUID(paymentId)) throw new Error("Format_Error: Invalid Payment ID");

    return prisma.$transaction(async (tx) => {
      // 1. Fetch Node with Locked Merchant Plan
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { merchant: { include: { plan: true } } },
      });

      if (!payment || payment.status !== "PENDING") {
        throw new Error("State_Error: Payment invalid or already processed");
      }

      // 2. Apex Precision Math
      // Calculation: $$platformFee = amount \times \frac{feePercent}{100}$$
      const feePercent = payment.merchant.plan?.transactionFeePercent || new Decimal(5);
      const platformFee = payment.amount.mul(feePercent).div(100);
      const netAmount = payment.amount.sub(platformFee);

      // 3. Parallel Node Synchronization
      const [updatedPayment, subscription] = await Promise.all([
        tx.payment.update({
          where: { id: paymentId },
          data: { 
            status: "SUCCESS", 
            providerTransactionId: providerTxId, 
            providerResponse: rawResponse as any 
          },
        }),
        SubscriptionService.createOrExtend({
          userId: payment.userId,
          merchantId: payment.merchantId,
          serviceId: payment.serviceId,
          serviceTierId: payment.serviceTierId!,
          paymentId: payment.id,
        })
      ]);

      // 4. Ledger & Wallet Integrity
      const merchant = await tx.merchantProfile.update({
        where: { id: payment.merchantId },
        data: { 
          availableBalance: { increment: netAmount } 
        },
      });

      await tx.ledger.create({
        data: {
          merchantId: payment.merchantId,
          paymentId: payment.id,
          amount: netAmount,
          type: "CREDIT",
          description: `Subscription Sync: ${payment.gatewayReference}`,
          balanceAfter: merchant.availableBalance,
        },
      });

      // 5. Analytics Upsert (Real-time Telemetry)
      await tx.merchantAnalytics.upsert({
        where: { merchantId: payment.merchantId },
        create: {
          merchantId: payment.merchantId,
          totalRevenue: payment.amount,
          netRevenue: netAmount,
          totalSubscribers: 1,
          activeSubs: 1,
        },
        update: {
          totalRevenue: { increment: payment.amount },
          netRevenue: { increment: netAmount },
          newSubsToday: { increment: 1 },
        },
      });

      return { payment: updatedPayment, subscription };
    }, {
      maxWait: 5000, 
      timeout: 10000 // 🛡️ Extended for high-latency Ngrok/Mobile tunnels
    });
  }
}