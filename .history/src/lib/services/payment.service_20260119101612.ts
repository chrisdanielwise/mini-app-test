"use server";

import prisma from "@/lib/db";
import { 
  PaymentStatus, 
  LedgerType, 
  Prisma, 
  Payment 
} from "@/generated/prisma";
import { createOrExtendSubscription } from "./subscription.service";
import { v4 as uuidv4 } from "uuid";
import { isUUID } from "../utils/validators";
import { cache } from "react";
// ✅ FIX: Standard Prisma Decimal Ingress (Resolves module not found)
import { Decimal } from "@prisma/client/runtime/library";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE_PAYMENT
 * Logic: Recursively converts BigInt and Decimals to strings for hydration safety.
 */
function sanitizePayment<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      // Precise Decimal Handling for Finance Serialization
      if (typeof value === 'object' && value !== null && value.constructor.name === 'Decimal') {
        return value.toString();
      }
      return value;
    })
  );
}

// =================================================================
// 🛡️ PAYMENT PROTOCOLS (Hardened v2026.1.20)
// =================================================================

/**
 * 🛰️ INGRESS_PAYMENT_NODE
 * Logic: Registers the intent to pay and generates a unique Gateway Reference.
 */
export async function createPayment(input: {
  userId: string;
  merchantId: string;
  serviceId: string;
  serviceTierId: string;
  amount: Decimal | number;
  currency: string;
  gatewayProvider: string;
}) {
  if (!isUUID(input.userId) || !isUUID(input.merchantId)) {
    throw new Error("PROTOCOL_ERROR: Invalid_Node_Identity");
  }

  // Institutional Reference Standard: ZIPHA_XXXX
  const gatewayReference = `ZIPHA_${uuidv4().split('-')[0].toUpperCase()}`;

  const payment = await prisma.payment.create({
    data: {
      ...input,
      gatewayReference,
      // ✅ FIX: Use PaymentStatus.PENDING (Maps to "pending" in DB)
      status: PaymentStatus.PENDING,
    },
  });

  return sanitizePayment(payment);
}

/**
 * 💎 THE ATOMIC HANDSHAKE
 * Logic: Finalizes capital flow, subscription state, and merchant ledger.
 * Precision: $Net = Total - (Total * (Fee / 100))
 */
export async function completePayment(paymentId: string, providerTxId?: string, rawResponse?: object) {
  if (!isUUID(paymentId)) throw new Error("SECURITY_ALERT: Malformed_Payment_Vector");

  return prisma.$transaction(async (tx) => {
    // 1. Pessimistic Fetch: Lock node to prevent double-processing (idempotency)
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: { merchant: { include: { plan: true } } },
    });

    // ✅ FIX: Use PaymentStatus enum for type-safe comparison
    if (!payment || payment.status !== PaymentStatus.PENDING) {
      throw new Error("STATE_ERROR: Payment_Node_Sealed_Or_Invalid");
    }

    // 2. Apex Precision Math
    const feePercent = payment.merchant.plan?.transactionFeePercent || new Decimal(5);
    const platformFee = payment.amount.mul(feePercent).div(100);
    const netAmount = payment.amount.sub(platformFee);

    // 3. Parallel Subscription & Payment Sync
    const [updatedPayment] = await Promise.all([
      tx.payment.update({
        where: { id: paymentId },
        data: { 
          status: PaymentStatus.SUCCESS, // ✅ Maps to "success"
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
        type: LedgerType.CREDIT, // ✅ Maps to "credit"
        description: `SUBSCRIPTION_SYNC: ${payment.gatewayReference}`,
        balanceAfter: updatedMerchant.availableBalance,
      },
    });

    // 5. Analytics Pulse
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

    return sanitizePayment(updatedPayment);
  }, {
    maxWait: 5000, 
    timeout: 15000 
  });
}

/**
 * 🔍 GET_PAYMENT_BY_ID
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