import prisma from "@/lib/db";
import type { PaymentStatus } from "@/generated/prisma";
import { createOrExtendSubscription } from "./subscription.service";
import { v4 as uuidv4 } from "uuid";
import { Decimal } from "@prisma/client-runtime-utils";
import { isUUID } from "../utils/validators";

// =================================================================
// 🚀 INTERFACES
// =================================================================

export interface CreatePaymentInput {
  userId: string;
  merchantId: string;
  serviceId: string;
  serviceTierId?: string;
  amount: Decimal;
  currency: string;
}

// =================================================================
// 🛡️ NAMED EXPORTS (RBAC & Staff Aware)
// =================================================================

/**
 * 🛰️ PENDING INGRESS: Create initial payment node
 */
export async function createPayment(input: CreatePaymentInput) {
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
 * 🔍 GET PAYMENT BY ID
 */
export async function getPaymentById(paymentId: string) {
  if (!isUUID(paymentId)) return null;
  return prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      user: { select: { fullName: true, username: true } },
      merchant: { select: { companyName: true } },
    }
  });
}

/**
 * 🏦 GET MERCHANT PAYMENTS (Staff Aware)
 * Logic: If merchantId is undefined (Staff), it fetches platform-wide transaction history.
 */
export async function getMerchantPayments(
  merchantId?: string, 
  limit = 50, 
  status?: PaymentStatus
) {
  // 🛡️ Ensure staff bypass UUID check to prevent crashes
  if (merchantId && !isUUID(merchantId)) return [];

  const where = {
    ...(merchantId && { merchantId }),
    ...(status && { status })
  };

  return prisma.payment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { fullName: true, username: true } },
      merchant: { select: { companyName: true } }, // Useful for Staff Global View
    },
  });
}

/**
 * 💎 ATOMIC COMPLETION: The Financial Handshake
 * Orchestrates the ledger, subscription, and analytics in a single atomic transaction.
 */
export async function completePayment(paymentId: string, providerTxId?: string, rawResponse?: object) {
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
    // Note: ensure subscription.service exports named functions
    const [updatedPayment, subscription] = await Promise.all([
      tx.payment.update({
        where: { id: paymentId },
        data: { 
          status: "SUCCESS", 
          providerTransactionId: providerTxId, 
          providerResponse: rawResponse as any 
        },
      }),
      createOrExtendSubscription({
        userId: payment.userId,
        merchantId: payment.merchantId,
        serviceId: payment.serviceId,
        serviceTierId: payment.serviceTierId!,
        paymentId: payment.id,
      })
    ]);

    // 4. Ledger & Wallet Integrity (Atomic increment)
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
    timeout: 10000 
  });
}