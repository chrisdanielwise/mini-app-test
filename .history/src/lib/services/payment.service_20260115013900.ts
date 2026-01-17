"use server";

import prisma from "@/lib/db";
import type { PaymentStatus } from "@/generated/prisma";
import { createOrExtendSubscription } from "./subscription.service";
import { v4 as uuidv4 } from "uuid";
import { isUUID } from "../utils/validators";
import { cache } from "react";
import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

function sanitizePayment<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      // Precise Decimal Handling for Finance
      if (value?.d && value?.s) return value.toString();
      return value;
    })
  );
}

// =================================================================
// 🛡️ PAYMENT PROTOCOLS (Hardened v16.16.12)
// =================================================================

/**
 * 🛰️ INGRESS_PAYMENT_NODE
 * Logic: Registers the intent to pay and generates a unique Gateway Reference.
 */
export async function createPayment(input: any) {
  if (!isUUID(input.userId) || !isUUID(input.merchantId)) {
    throw new Error("PROTOCOL_ERROR: Invalid_Node_Identity");
  }

  // Institutional Reference Standard: PREFIX_SHORT-HASH
  const gatewayReference = `ZIPHA_${uuidv4().split('-')[0].toUpperCase()}`;

  const payment = await prisma.payment.create({
    data: {
      ...input,
      gatewayReference,
      status: "PENDING",
    },
  });

  return sanitizePayment(payment);
}

/**
 * 💎 THE ATOMIC HANDSHAKE
 * Logic: Finalizes capital flow, subscription state, and merchant ledger.
 * Math: $Net = Total - (Total \times \frac{Fee}{100})$
 */
export async function completePayment(paymentId: string, providerTxId?: string, rawResponse?: object) {
  if (!isUUID(paymentId)) throw new Error("SECURITY_ALERT: Malformed_Payment_Vector");

  return prisma.$transaction(async (tx) => {
    // 1. Pessimistic Fetch: Lock the payment node to prevent double-processing
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: { merchant: { include: { plan: true } } },
    });

    if (!payment || payment.status !== "PENDING") {
      throw new Error("STATE_ERROR: Payment_Node_Sealed_Or_Invalid");
    }

    // 2. Apex Precision Math (Institutional Rounding)
    const feePercent = payment.merchant.plan?.transactionFeePercent || new Decimal(5);
    const platformFee = payment.amount.mul(feePercent).div(100);
    const netAmount = payment.amount.sub(platformFee);

    // 3. Parallel Subscription & Payment Sync
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

    // 4. Ledger & Balance Integrity
    // Note: We use the returned merchant object to ensure Balance-After accuracy
    const updatedMerchant = await tx.merchantProfile.update({
      where: { id: payment.merchantId },
      data: { availableBalance: { increment: netAmount } },
      select: { availableBalance: true }
    });

    await tx.ledger.create({
      data: {
        merchantId: payment.merchantId,
        paymentId: payment.id,
        amount: netAmount,
        type: "CREDIT",
        description: `SUBSCRIPTION_SYNC: ${payment.gatewayReference}`,
        balanceAfter: updatedMerchant.availableBalance,
      },
    });

    // 5. Analytics Pulse (Real-time Upsert)
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

    return sanitizePayment({ payment: updatedPayment, subscription });
  }, {
    maxWait: 5000, 
    timeout: 15000 // Extended for high-latency Gateway callbacks
  });
}

/**
 * 🔍 GET_PAYMENT_BY_ID
 * Logic: Memoized fetch for Terminal Viewports.
 */
export const getPaymentById = cache(async (paymentId: string) => {
  if (!isUUID(paymentId)) return null;
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      user: { select: { fullName: true, username: true } },
      merchant: { select: { companyName: true } },
    }
  });
  return sanitizePayment(payment);
});