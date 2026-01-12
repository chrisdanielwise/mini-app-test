"use server"; // 🚀 Directive must remain at the apex

import { getSession } from "@/lib/auth/session";
import { updateMerchant } from "@/lib/services/merchant.service";
import { revalidatePath } from "next/cache";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ UPDATE MERCHANT ACTION
 * Clearance: Staff (Global) | Merchant (Self-Only)
 */
export async function updateMerchantAction(formData: FormData, merchantId: string) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();

  // Security Barrier: Block unauthenticated ingress
  if (!session) {
    throw new Error("UNAUTHORIZED: No valid identity node found.");
  }

  // 🛡️ 2. ROLE-BASED ACCESS CONTROL (RBAC)
  // If not Staff, the merchantId must match the session's merchantId
  const isStaff = session.isStaff;
  const isOwner = session.merchantId === merchantId;

  if (!isStaff && !isOwner) {
    console.error(`[Security_Alert] Unauthorized update attempt on node: ${merchantId}`);
    throw new Error("FORBIDDEN: You do not have authority over this node.");
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

    // 🔄 4. CACHE SYNCHRONIZATION
    // We revalidate the universal settings path and the merchant-specific HUD
    revalidatePath("/dashboard/settings");
    revalidatePath(`/dashboard/merchants/${merchantId}`); 
    
    return { success: true };
  } catch (error) {
    console.error("❌ Merchant Update Failed:", error);
    return { error: "Database Sync Failure" };
  }
}