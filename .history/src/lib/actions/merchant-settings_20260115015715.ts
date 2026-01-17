"use server";

import prisma from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🌊 UPDATE_MERCHANT_SETTINGS_ACTION
 * Logic: Multi-tenant metadata synchronization with Staff-Oversight bypass.
 * Standard: Atomic Persistence with HUD-wide cache invalidation.
 */
export async function updateMerchantSettingsAction(data: any) {
  // 🔐 1. IDENTITY_HANDSHAKE
  const session = await getSession();

  // Security Barrier: Reject non-authenticated ingress
  if (!session) {
    return { error: "SECURITY_PROTOCOL_FAILURE: NO_ACTIVE_SESSION" };
  }

  // 🛡️ 2. NODE_RESOLUTION
  // Staff (Amber) can specify a targetId. Merchants (Emerald) are locked to their session.
  const targetId = (session.isStaff && data.targetId) ? data.targetId : session.merchantId;

  if (!targetId || !isUUID(targetId)) {
    return { error: "VALIDATION_FAILURE: INVALID_OR_MISSING_NODE_ID" };
  }

  try {
    // 🏁 3. DATABASE_COMMIT
    // Note: We use the 'merchantProfile' table to match our refined schema.
    await prisma.merchantProfile.update({
      where: { id: targetId },
      data: {
        companyName: data.companyName?.trim(),
        contactEmail: data.contactEmail?.toLowerCase().trim(),
        botUsername: data.botUsername?.replace("@", "").trim(), // Normalizes TG handle
        supportUrl: data.supportUrl?.trim(),
      }
    });

    // 🔄 4. ATOMIC_CACHE_REVALIDATION
    // Purges the data cache for both the specific settings page and the global dashboard HUD.
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard", "layout"); 
    revalidateTag("merchant_node"); // Invalidate memoized fetch tags
    
    return { success: true };
  } catch (error: any) {
    console.error("❌ [Merchant_Settings_Action]: Sync_Failure", error.message);
    return { error: "PERSISTENCE_FAILURE: VERIFY_NODE_CONNECTIVITY" };
  }
}