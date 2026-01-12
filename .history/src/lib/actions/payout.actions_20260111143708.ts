"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ SYSTEM ACTION: REQUEST PAYOUT
 * Logic: Validates liquidity nodes and creates a pending withdrawal record.
 * Security: Locked to verified Merchant/Staff session context.
 */
export async function requestPayoutAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();

  // Security Barrier: Must be a logged-in merchant or staff acting on their behalf
  if (!session || (!session.merchantId && !session.isStaff)) {
    return { error: "Security Alert: Unauthorized identity node." };
  }

  // --- DATA EXTRACTION ---
  // If Staff: They might be requesting for a merchant via an admin panel
  // If Merchant: We ignore the formData ID and use the session ID for safety
  const rawMerchantId = formData.get("merchantId") as string;
  const targetMerchantId = session.isStaff ? rawMerchantId : session.merchantId;
  
  const amount = parseFloat(formData.get("amount") as string);
  const method = formData.get("method") as string;
  const destination = formData.get("destination") as string;

  if (!targetMerchantId || !isUUID(targetMerchantId)) {
    return { error: "Validation Protocol: Malformed node identity." };
  }

  if (isNaN(amount) || amount < 10) {
    return { error: "Minimum payout threshold not met (Min: $10.00)." };
  }

  try {
    // 🛡️ 2. LIQUIDITY VERIFICATION
    // Fetch directly from the database to ensure real-time balance accuracy
    const merchant = await prisma.merchant.findUnique({
      where: { id: targetMerchantId },
      select: { availableBalance: true }
    });

    if (!merchant) {
      return { error: "Configuration Error: Target merchant node not found." };
    }

    // Handle BigInt/Decimal conversion for 2026 financial accuracy
    const balance = Number(merchant.availableBalance);

    if (balance < amount) {
      return { error: "Insufficient available liquidity for this request." };
    }

    // 🏁 3. ATOMIC PAYOUT CREATION
    // We create the payout record. Note: Balance is deducted only after Admin Approval.
    await prisma.payout.create({
      data: {
        merchantId: targetMerchantId,
        amount,
        method,
        status: "PENDING",
        destination: destination?.trim(),
        // Traceability: Log who initiated the request (Staff vs Owner)
        notes: `Initiated by: ${session.user.role} | Method: ${method} | Dest: ${destination}`,
      }
    });

    // 🔄 4. CACHE SYNCHRONIZATION
    revalidatePath("/dashboard/payouts");
    revalidatePath("/dashboard"); // Updates balance display on main HUD
    
    return { success: true };
    
  } catch (error) {
    console.error("❌ Payout Request Failed:", error);
    return { error: "System error during withdrawal request. Please retry." };
  }
}