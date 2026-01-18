"use server"; // 🚀 Directive must remain at the apex

import { getSession } from "@/lib/auth/session";
import { updateMerchant } from "@/lib/services/merchant.service";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ UPDATE MERCHANT ACTION (v16.16.20 - Hardened)
 * Clearance: Staff (Global Override) | Merchant (Self-Targeting)
 * Fix: Replaced path-revalidation with Tagged Profile purge.
 */
export async function updateMerchantAction(formData: FormData, merchantId: string) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHORIZED: No valid identity node found.");
  }

  // 🛡️ 2. ROLE-BASED ACCESS CONTROL (RBAC)
  const isStaff = session.isStaff;
  const isOwner = session.merchantId === merchantId;

  if (!isStaff && !isOwner) {
    console.error(`[Security_Alert] Unauthorized update attempt on node: ${merchantId}`);
    throw new Error("FORBIDDEN: Access Authority Denied.");
  }

  if (!isUUID(merchantId)) {
    throw new Error("VALIDATION_ERROR: Target node ID is malformed.");
  }

  // --- DATA EXTRACTION ---
  const companyName = formData.get("companyName") as string;
  const contactSupportUrl = formData.get("contactSupportUrl") as string;

  try {
    // 🏁 3. DATABASE COMMIT
    await updateMerchant(merchantId, {
      companyName: companyName?.trim(),
      contactSupportUrl: contactSupportUrl?.trim(),
    });

    // 🔄 4. ATOMIC CACHE SYNCHRONIZATION
    // Fix: Using SYSTEM ("config") profile to ensure the 0ms perception of load.
    // This resolves the ts(2554) error found in standard revalidateTag calls.
    revalidateTag("merchant_node", CACHE_PROFILES.SYSTEM);
    
    return { success: true };
  } catch (error) {
    console.error("❌ Merchant Update Failed:", error);
    return { error: "Database Sync Failure" };
  }
}