"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🌊 UPDATE_MERCHANT_SETTINGS_ACTION (Institutional Apex v2026.1.20)
 * Logic: Multi-tenant metadata synchronization with tagged revalidation.
 * Fix: Resolved TS2353 by mapping to correct Prisma schema properties.
 * Fix: Resolved TS2554 by standardizing Next.js 15 revalidation.
 */
export async function updateMerchantSettingsAction(data: {
  targetId?: string;
  companyName?: string;
  supportEmail?: string;
  botUsername?: string;
  supportUrl?: string;
}) {
  // 🔐 1. IDENTITY_HANDSHAKE
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: "SECURITY_PROTOCOL_FAILURE: NO_ACTIVE_SESSION" };
  }

  // 🛡️ 2. NODE_RESOLUTION
  // Staff can target any ID; Merchants are locked to their own node.
  const targetId =
    session.isStaff && data.targetId ? data.targetId : session.merchantId;

  if (!targetId || !isUUID(targetId)) {
    return { error: "VALIDATION_FAILURE: INVALID_OR_MISSING_NODE_ID" };
  }

  try {
    // 🏁 3. DATABASE_COMMIT
    // Logic: Only update fields that are provided in the data payload.
    await prisma.merchantProfile.update({
      where: { id: targetId },
      data: {
        ...(data.companyName && { companyName: data.companyName.trim() }),

        // ✅ FIX: Mapping to correct property 'supportEmail' from schema
        ...(data.supportEmail && {
          supportEmail: data.supportEmail.toLowerCase().trim(),
        }),

        ...(data.botUsername && {
          botUsername: data.botUsername.replace("@", "").trim(),
        }),

        // ✅ FIX: Mapping to the institutional property 'contactSupportUrl'
        ...(data.supportUrl && { contactSupportUrl: data.supportUrl.trim() }),
      },
    });

    // 🔄 4. ATOMIC_CACHE_REVALIDATION
    // Fix: In Next.js 15, revalidateTag is a single-argument async standard.
    // We use a specific tag to purge the merchant's public cache across the cluster.
    revalidateTag(`merchant_node_${targetId}`);

    return { success: true };
  } catch (error: any) {
    console.error("❌ [Merchant_Settings_Action]: Sync_Failure", error.message);
    return { error: "PERSISTENCE_FAILURE: VERIFY_NODE_CONNECTIVITY" };
  }
}
