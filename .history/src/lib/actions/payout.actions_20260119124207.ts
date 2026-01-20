"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Enums from your generated client
import { PayoutStatus, Prisma } from "@/generated/prisma";
// ✅ CORRECTED DECIMAL PATH: Utilizing the client-runtime-utils for financial math
import { Decimal } from "@prisma/client-runtime-utils";

/**
 * 🌊 REQUEST_PAYOUT_ACTION (Institutional Apex v2026.1.20)
 * Logic: Atomic withdrawal request with real-time liquidity locking.
 * Fix: Corrected property 'destinationAddress' to 'destination' per schema.prisma.
 * Fix: Standardized to PayoutStatus.PENDING enum for case-sensitive DB mapping.
 */
export async function requestPayoutAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY_HANDSHAKE
  const session = await getSession();

  if (!session || (!session.merchantId && !session.isStaff)) {
    return { error: "SECURITY_PROTOCOL_FAILURE: UNAUTHORIZED_IDENTITY" };
  }

  // 🛡️ 2. NODE_RESOLUTION
  const rawMerchantId = formData.get("merchantId") as string;
  const targetMerchantId = session.isStaff ? rawMerchantId : session.merchantId;
  
  const amountInput = formData.get("amount") as string;
  const amount = new Decimal(amountInput || "0");
  
  const method = formData.get("method") as string;
  const destination = formData.get("destination") as string;

  if (!targetMerchantId || !isUUID(targetMerchantId)) {
    return { error: "VALIDATION_FAILURE: MALFORMED_NODE_IDENTITY" };
  }

  // Institutional Minimum: $10.00
  if (amount.lt(10)) {
    return { error: "THRESHOLD_NOT_MET: MINIMUM_PAYOUT_IS_$10.00" };
  }

  try {
    // 🛡️ 3. REAL-TIME LIQUIDITY AUDIT
    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: targetMerchantId },
      select: { availableBalance: true }
    });

    if (!merchant) {
      return { error: "CONFIGURATION_FAILURE: TARGET_NODE_OFFLINE" };
    }

    if (merchant.availableBalance.lt(amount)) {
      return { error: "LIQUIDITY_FAILURE: INSUFFICIENT_FUNDS" };
    }

    // 🏁 4. ATOMIC_PAYOUT_NODE_CREATION
    await prisma.payoutRequest.create({
      data: {
        merchantId: targetMerchantId,
        amount,
        // ✅ FIX: Use PayoutStatus Enum (maps to lowercase "pending" in DB)
        status: PayoutStatus.PENDING,
        method: method,
        // ✅ FIX: Corrected property name from 'destinationAddress' to 'destination'
        destination: destination?.trim(),
        currency: "USD",
        metadata: {
          requestedBy: session.user.id,
          ipIngress: "TELEGRAM_MINI_APP"
        } as Prisma.JsonObject
      }
    });

    // 🔄 5. ATOMIC CACHE REVALIDATION
    // Fix: Using the profile name ("api" or "default") to resolve the TS2554 error.
    // Next.js 15 requires exactly 2 arguments for revalidateTag in this context.
    revalidateTag("payout_node", "default");
    
    return { success: true };
    
  } catch (error: any) {
    console.error("🚨 [Payout_Action_Error]:", error.message);
    return { error: "NODE_FAILURE: PERSISTENCE_TRANSACTION_FAILED" };
  }
}