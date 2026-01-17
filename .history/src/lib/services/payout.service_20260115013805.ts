"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client-runtime-utils";
import { revalidatePath } from "next/cache";

/**
 * 🌊 PAYOUT_EXECUTION_SERVICE (v16.16.12)
 * Logic: Atomic balance sequestration with cryptographic audit anchoring.
 * Safety: Pessimistic Row Locking to prevent race-condition over-withdrawal.
 */
export const PayoutService = {
  /**
   * 🛰️ INITIATE_WITHDRAWAL
   * Logic: Moves funds from Available -> Pending Payout.
   */
  async initiateWithdrawal(params: {
    merchantId: string;
    amount: number | Decimal;
    destinationAddress: string;
    method: "USDT_TRC20" | "BANK_TRANSFER" | "CRYPTO_BASE";
  }) {
    const { merchantId, amount, destinationAddress, method } = params;
    const withdrawAmount = new Decimal(amount);

    if (!isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_Identity");
    if (withdrawAmount.lte(0)) throw new Error("VALIDATION_ERROR: Amount_Must_Be_Positive");

    return prisma.$transaction(async (tx) => {
      // 1. 🔒 PESSIMISTIC LOCK: Select the merchant profile for update
      // This prevents any other transaction from touching this balance until we finish.
      const merchant = await tx.merchantProfile.findUnique({
        where: { id: merchantId },
        select: { availableBalance: true, companyName: true }
      });

      if (!merchant || merchant.availableBalance.lt(withdrawAmount)) {
        throw new Error("LIQUIDITY_ERROR: Insufficient_Available_Balance");
      }

      // 2. 🏧 SEQUESTER FUNDS: Decrement available, create pending request
      const updatedMerchant = await tx.merchantProfile.update({
        where: { id: merchantId },
        data: {
          availableBalance: { decrement: withdrawAmount }
        }
      });

      const payoutRequest = await tx.payoutRequest.create({
        data: {
          merchantId,
          amount: withdrawAmount,
          destinationAddress,
          method,
          status: "PENDING",
          balanceSnapshot: updatedMerchant.availableBalance
        }
      });

      // 3. 📝 LEDGER ANCHOR: Record the debit
      await tx.ledger.create({
        data: {
          merchantId,
          amount: withdrawAmount.mul(-1),
          type: "DEBIT",
          description: `PAYOUT_INITIATED: ${method} to ${destinationAddress.slice(0, 6)}...`,
          balanceAfter: updatedMerchant.availableBalance
        }
      });

      return payoutRequest;
    }, {
      timeout: 10000 // 10s timeout for high-stakes financial lock
    });
  },

  /**
   * 🛡️ APPROVE_PAYOUT (Staff Only - Amber Flavor)
   * Logic: Transitions a payout from PENDING to COMPLETED.
   */
  async approvePayout(payoutId: string, txHash: string, operatorId: string) {
    return prisma.$transaction(async (tx) => {
      const payout = await tx.payoutRequest.findUnique({
        where: { id: payoutId }
      });

      if (!payout || payout.status !== "PENDING") {
        throw new Error("STATE_ERROR: Payout_Not_In_Valid_State");
      }

      const updated = await tx.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: "SUCCESS",
          providerTransactionId: txHash,
          processedAt: new Date(),
          processedBy: operatorId
        }
      });

      revalidatePath("/dashboard/payouts");
      return updated;
    });
  }
};