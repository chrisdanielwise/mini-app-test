"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { CACHE_PROFILES } from "@/lib/auth/config";

/**
 * 🌊 UPDATE_MERCHANT_SETTINGS_ACTION (v16.16.20 - Hardened)
 * Logic: Multi-tenant metadata synchronization with tagged revalidation.
 * Fix: Replaced revalidatePath with revalidateTag(profile) for 2026 standards.
 */
export async function updateMerchantSettingsAction(data: any) {
  // 🔐 1. IDENTITY_HANDSHAKE
  const session = await getSession();

  if (!session) {
    return { error: "SECURITY_PROTOCOL_FAILURE: NO_ACTIVE_SESSION" };
  }

  // 🛡️ 2. NODE_RESOLUTION
  const targetId = (session.isStaff && data.targetId) ? data.targetId : session.merchantId;

  if (!targetId || !isUUID(targetId)) {
    return { error: "VALIDATION_FAILURE: INVALID_OR_MISSING_NODE_ID" };
  }

  try {
    // 🏁 3. DATABASE_COMMIT
    await prisma.merchantProfile.update({
      where: { id: targetId },
      data: {
        companyName: data.companyName?.trim(),
        contactEmail: data.contactEmail?.toLowerCase().trim(),
        botUsername: data.botUsername?.replace("@", "").trim(),
        supportUrl: data.supportUrl?.trim(),
      }
    });

    // 🔄 4. ATOMIC_CACHE_REVALIDATION
    // Fix: Using CACHE_PROFILES.SYSTEM ("config") to ensure HUD-wide refresh.
    // This resolves the ts(2554) "Expected 2 arguments" error.
    revalidateTag("merchant_node", CACHE_PROFILES.SYSTEM);
    
    return { success: true };
  } catch (error: any) {
    console.error("❌ [Merchant_Settings_Action]: Sync_Failure", error.message);
    return { error: "PERSISTENCE_FAILURE: VERIFY_NODE_CONNECTIVITY" };
  }
}