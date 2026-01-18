"use server";

import { z } from "zod";
import { requireAuth, requireStaff } from "@/lib/auth/session";
import { FinanceService } from "@/lib/services/finance.service";
import { ActivityService } from "@/lib/services/activity.service";
import { isUUID } from "@/lib/utils/validators";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
import prisma from "@/lib/db";
import { PayoutStatus } from "@/generated/prisma";

/**
 * 🛰️ FINANCE_ACTION_SCHEMAS
 */
const PayoutRequestSchema = z.object({
  merchantId: z.string().uuid(),
  amount: z.number().positive().min(10, "Minimum withdrawal is $10"),
  destination: z.string().min(5, "Invalid payout destination"),
});

/**
 * 🏧 ACTION: REQUEST_MERCHANT_PAYOUT
 * Level: Merchant Owner
 */
export async function requestPayoutAction(formData: FormData) {
  // 🔐 1. Identity & Permission Gate
  const session = await requireAuth();
  
  // 🛡️ 2. Validation Handshake
  const rawData = {
    merchantId: formData.get("merchantId"),
    amount: Number(formData.get("amount")),
    destination: formData.get("destination"),
  };

  const validated = PayoutRequestSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    // 🏁 3. Service Execution
    const payout = await FinanceService.requestPayout({
      merchantId: validated.data.merchantId,
      amount: validated.data.amount,
      destination: validated.data.destination,
    });

    // 🕵️ 4. Audit Logging
    await ActivityService.log({
      actorId: session.user.id,
      merchantId: validated.data.merchantId,
      action: "PAYOUT_REQUEST_CREATED",
      resource: `PayoutRequest:${payout.id}`,
      metadata: { amount: validated.data.amount, destination: validated.data.destination },
    });

    return { success: true, payoutId: payout.id };
  } catch (error: any) {
    return { error: error.message || "Financial Protocol Error" };
  }
}

/**
 * 👑 ACTION: APPROVE_PAYOUT (Amber Staff Only)
 * Logic: Transitions a PENDING payout to PAID.
 */
export async function approvePayoutAction(payoutId: string, txRef: string) {
  // 🔐 1. Staff Clearance Check
  const session = await requireStaff();

  if (!isUUID(payoutId)) return { error: "Invalid Payout Node ID" };

  try {
    const updatedPayout = await prisma.payoutRequest.update({
      where: { id: payoutId },
      data: {
        status: PayoutStatus.PAID,
        processedAt: new Date(),
        processedBy: session.user.id,
        transactionRef: txRef
      }
    });

    // 🕵️ 2. Forensic Log
    await ActivityService.log({
      actorId: session.user.id,
      action: "PAYOUT_APPROVED",
      resource: `PayoutRequest:${payoutId}`,
      metadata: { txRef },
    });

    revalidateTag("finance_node", CACHE_PROFILES.DATA);
    return { success: true };
  } catch (error) {
    return { error: "Failed to process payout approval." };
  }
}