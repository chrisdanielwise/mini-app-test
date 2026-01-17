"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ UPDATE MERCHANT SETTINGS
 * Logic: Synchronized with Universal Identity. 
 * Security: Validates node ownership before persisting metadata.
 */
export async function updateMerchantSettingsAction(data: any) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();

  // Security Barrier: Ensure session exists and a merchant context is active
  if (!session || !session.merchantId) {
    return { error: "Security Alert: No active merchant node detected." };
  }

  // 🛡️ 2. DATA AUDIT
  // For Staff, we might allow passing a target merchantId in 'data' 
  // to update settings for any merchant. For regular merchants, we lock to session.
  const targetId = session.isStaff && data.targetId ? data.targetId : session.merchantId;

  if (!isUUID(targetId)) {
    return { error: "Validation Protocol: Invalid merchant node identity." };
  }

  try {
    // 🏁 3. DATABASE COMMIT
    await prisma.merchant.update({
      where: { id: targetId },
      data: {
        companyName: data.companyName?.trim(),
        supportEmail: data.supportEmail?.toLowerCase().trim(),
        // Protocol: Add secondary configuration nodes here
      }
    });

    // 🔄 4. CACHE REVALIDATION
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard"); // Sync company name on HUD
    
    return { success: true };
  } catch (error) {
    console.error("❌ Merchant Settings Sync Failure:", error);
    return { error: "Database Sync Failure: Verify node connectivity." };
  }
}