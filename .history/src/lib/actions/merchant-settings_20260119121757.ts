"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🌊 UPDATE_MERCHANT_SETTINGS_ACTION (Institutional Apex v2026.1.20)
 * Logic: Multi-tenant metadata synchronization with tagged revalidation.
 * Fix: Corrected 'contactEmail' to 'supportEmail' to match schema.prisma.
 * Fix: Standardized revalidateTag for Next.js 15 compliance.
 */
export async function updateMerchantSettingsAction(data: {
  targetId?: string;
  companyName?: string;
  supportEmail?: string; // ✅ FIX: Renamed from contactEmail
  botUsername?: string;
  supportUrl?: string;
}) {
  // 🔐 1. IDENTITY_HANDSHAKE
  const session = await getSession();

  if (!session) {
    return { error: "SECURITY_PROTOCOL_FAILURE: NO_ACTIVE_SESSION" };
  }

  // 🛡️ 2. NODE_RESOLUTION
  // Staff can target any ID; Merchants are locked to their own node.
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
        // ✅ FIX: Mapping to the correct schema property 'supportEmail'
        supportEmail: data.supportEmail?.toLowerCase().trim(),
        botUsername: data.botUsername?.replace("@", "").trim(),
        contactSupportUrl: data.supportUrl?.trim(), // ✅ FIX: Mapping to 'contactSupportUrl'
      }
    });

    // 🔄 4. ATOMIC_CACHE_REVALIDATION
    // Fix: Provided mandatory "default" profile for Next.js 15 to resolve TS2554.
    revalidateTag("merchant_node", "default");
    
    return { success: true };
  } catch (error: any) {
    console.error("❌ [Merchant_Settings_Action]: Sync_Failure", error.message);
    return { error: "PERSISTENCE_FAILURE: VERIFY_NODE_CONNECTIVITY" };
  }
}