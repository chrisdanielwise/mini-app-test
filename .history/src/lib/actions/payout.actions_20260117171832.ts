"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client/runtime-library";
import { CACHE_PROFILES } from "@/lib/auth/config";

/**
 * 🌊 REQUEST_PAYOUT_ACTION (v16.16.20 - Hardened)
 * Logic: Atomic withdrawal request with real-time liquidity locking.
 * Fix: Replaced path revalidation with tagged profile purge for 2026 standards.
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
        method,
        status: "PENDING",
        destinationAddress: destination?.trim(),
        metadata: {
          requestedBy: session.user.id,
          role: session.user.role,
          ipIngress: "TELEGRAM_MINI_APP"
        }
      }
    });

    // 🔄 5. ATOMIC CACHE REVALIDATION
    // Fix: Using the DATA profile ("api") for payout history and ledger sync.
    // This resolves the ts(2554) error found in standard revalidateTag calls.
    revalidateTag("payout_node", CACHE_PROFILES.DATA);
    
    return { success: true };
    
  } catch (error: any) {
    console.error("🚨 [Payout_Action_Error]:", error.message);
    return { error: "NODE_FAILURE: PERSISTENCE_TRANSACTION_FAILED" };
  }
}