"use server";

import prisma from "@/src/lib/db";
import { revalidatePath } from "next/cache";

export async function requestPayoutAction(prevState: any, formData: FormData) {
  const merchantId = formData.get("merchantId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const method = formData.get("method") as string;
  const destination = formData.get("destination") as string;

  try {
    // 🛡️ 1. Fetch current available balance to verify
    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      select: { walletBalance: true }
    });

    if (!merchant || Number(merchant.walletBalance) < amount) {
      return { error: "Insufficient available liquidity for this request." };
    }

    if (amount < 10) {
      return { error: "Minimum payout amount is $10.00." };
    }

    // 🏁 2. Create the Payout Record
    await prisma.payout.create({
      data: {
        merchantId,
        amount,
        method,
        status: "PENDING",
        // Storing payment details in the database for admin processing
        notes: `Method: ${method} | Dest: ${destination}`
      }
    });

    // 🔄 3. Update UI
    revalidatePath("/dashboard/payouts");
    return { success: true };
    
  } catch (error) {
    console.error("❌ Payout Request Failed:", error);
    return { error: "System error during withdrawal request. Please retry." };
  }
}