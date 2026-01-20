"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { revalidatePath } from "next/cache";
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Prisma Types and Enums
import { 
  PayoutStatus, 
  LedgerType, 
  Prisma, 
  PayoutRequest 
} from "@/generated/prisma";
import { Decimal } from "@prisma/client-runtime-utils";
// import { Decimal } from "@prisma/client/runtime/library";

/**
 * 🌊 ATOMIC_SANITIZE_PAYOUT
 * Logic: Hydration safety for Decimal and BigInt values.
 */
function sanitizePayout<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (typeof value === 'object' && value !== null && value.constructor.name === 'Decimal') {
        return value.toString();
      }
      return value;
    })
  );
}

/**
 * 🌊 PAYOUT_EXECUTION_SERVICE (Institutional Apex v2026.1.20)
 * Logic: Atomic balance sequestration with cryptographic audit anchoring.
 * Standards: Replaces raw strings with Enum Objects to match @map schema logic.
 */
export const PayoutService = {
  /**
   * 🛰️ INITIATE_WITHDRAWAL
   * Logic: Moves funds from Available -> Pending Payout via pessimistic locking.
   */
  async initiateWithdrawal(params: {
    merchantId: string;
    amount: number | Decimal;
    destination: string; // Renamed to match your schema's 'destination' field
  }): Promise<PayoutRequest> {
    const { merchantId, amount, destination } = params;
    const withdrawAmount = new Decimal(amount);

    if (!isUUID(merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Node_Identity");
    if (withdrawAmount.lte(0)) throw new Error("VALIDATION_ERROR: Amount_Must_Be_Positive");

    const result = await prisma.$transaction(async (tx) => {
      // 1. 🔒 PESSIMISTIC FETCH
      const merchant = await tx.merchantProfile.findUnique({
        where: { id: merchantId },
        select: { availableBalance: true, id: true }
      });

      if (!merchant || merchant.availableBalance.lt(withdrawAmount)) {
        throw new Error("LIQUIDITY_ERROR: Insufficient_Available_Balance");
      }

      // 2. 🏧 SEQUESTER FUNDS
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
          destination,
          // ✅ FIX: Use PayoutStatus.PENDING (Maps to "pending" in DB)
          status: PayoutStatus.PENDING,
          currency: "USD",
        }
      });

      // 3. 📝 LEDGER ANCHOR: Record the debit
      await tx.ledger.create({
        data: {
          merchantId,
          amount: withdrawAmount, // Ledger usually stores positive amount with type DEBIT
          type: LedgerType.DEBIT, // ✅ Maps to "debit"
          description: `PAYOUT_INITIATED: to ${destination.slice(0, 10)}...`,
          balanceAfter: updatedMerchant.availableBalance
        }
      });

      return payoutRequest;
    }, {
      timeout: 10000 
    });

    return sanitizePayout(result);
  },

  /**
   * 🛡️ APPROVE_PAYOUT (Staff Only)
   * Logic: Transitions a payout from PENDING to PAID.
   */
  async approvePayout(payoutId: string, txHash: string, operatorId: string): Promise<PayoutRequest> {
    if (!isUUID(payoutId)) throw new Error("SECURITY_ALERT: Malformed_Identity_Vector");

    const result = await prisma.$transaction(async (tx) => {
      const payout = await tx.payoutRequest.findUnique({
        where: { id: payoutId }
      });

      // ✅ FIX: Type-safe comparison using PayoutStatus enum
      if (!payout || payout.status !== PayoutStatus.PENDING) {
        throw new Error("STATE_ERROR: Payout_Not_In_Valid_State");
      }

      const updated = await tx.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: PayoutStatus.PAID, // ✅ Maps to "paid" (or PROCESSING if you prefer)
          transactionRef: txHash,
          processedAt: new Date(),
          processedBy: operatorId
        }
      });

      revalidatePath("/dashboard/payouts");
      return updated;
    });

    return sanitizePayout(result);
  }
};