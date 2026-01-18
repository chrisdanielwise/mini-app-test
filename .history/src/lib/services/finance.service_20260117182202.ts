"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { PaymentStatus, LedgerType, PayoutStatus } from "@/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export const FinanceService = {
  /**
   * 🏦 GET_MERCHANT_BALANCE
   * Precision: Fetches the available and escrow balances for a merchant.
   */
  getMerchantBalance: cache(async (merchantId: string) => {
    if (!isUUID(merchantId)) return { available: 0, escrow: 0 };
    
    const profile = await prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      select: { availableBalance: true, pendingEscrow: true }
    });
    
    return {
      available: profile?.availableBalance || new Decimal(0),
      escrow: profile?.pendingEscrow || new Decimal(0)
    };
  }),

  /**
   * 💸 PROCESS_PAYMENT_SUCCESS
   * Logic: Atomic Transaction. 
   * 1. Updates Payment Status.
   * 2. Credits Merchant Balance.
   * 3. Creates an immutable Ledger Entry for audit.
   */
  async recordPaymentSuccess(params: {
    paymentId: string;
    gatewayRef: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch Payment and Lock for Update
      const payment = await tx.payment.findUnique({
        where: { id: params.paymentId },
        include: { merchant: true }
      });

      if (!payment || payment.status === PaymentStatus.SUCCESS) {
        throw new Error("FINANCE_ERROR: PAYMENT_ALREADY_PROCESSED_OR_NOT_FOUND");
      }

      // 2. Update Payment
      const updatedPayment = await tx.payment.update({
        where: { id: params.paymentId },
        data: { 
          status: PaymentStatus.SUCCESS,
          gatewayReference: params.gatewayRef 
        }
      });

      // 3. Update Merchant Balance (CREDIT)
      const newBalance = Decimal.add(payment.merchant.availableBalance, payment.amount);
      await tx.merchantProfile.update({
        where: { id: payment.merchantId },
        data: { availableBalance: newBalance }
      });

      // 4. Create Ledger Node (Audit Trail)
      await tx.ledger.create({
        data: {
          merchantId: payment.merchantId,
          paymentId: payment.id,
          amount: payment.amount,
          type: LedgerType.CREDIT,
          description: `Payment for Service: ${payment.serviceId}`,
          balanceAfter: newBalance
        }
      });

      revalidateTag("finance_node", CACHE_PROFILES.DATA);
      return updatedPayment;
    });
  },

  /**
   * 🏧 REQUEST_PAYOUT
   * Logic: Deducts from balance and creates a PENDING request.
   */
  async requestPayout(params: {
    merchantId: string;
    amount: number;
    destination: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      const merchant = await tx.merchantProfile.findUnique({
        where: { id: params.merchantId }
      });

      if (!merchant || merchant.availableBalance.lessThan(params.amount)) {
        throw new Error("FINANCE_ERROR: INSUFFICIENT_FUNDS");
      }

      // 1. Create Payout Request
      const payout = await tx.payoutRequest.create({
        data: {
          merchantId: params.merchantId,
          amount: params.amount,
          destination: params.destination,
          status: PayoutStatus.PENDING
        }
      });

      // 2. Debit Balance & Ledger
      const newBalance = Decimal.sub(merchant.availableBalance, params.amount);
      await tx.merchantProfile.update({
        where: { id: params.merchantId },
        data: { availableBalance: newBalance }
      });

      await tx.ledger.create({
        data: {
          merchantId: params.merchantId,
          amount: params.amount,
          type: LedgerType.DEBIT,
          description: `Payout Request ID: ${payout.id}`,
          balanceAfter: newBalance
        }
      });

      revalidateTag("finance_node", CACHE_PROFILES.DATA);
      return payout;
    });
  }
};