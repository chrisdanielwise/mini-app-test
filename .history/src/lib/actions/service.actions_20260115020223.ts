"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUUID } from "@/lib/utils/validators";
import { getSession } from "@/lib/auth/session";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";

/**
 * 🌊 CREATE_SERVICE_ACTION
 * Architecture: Atomic Multi-Node Provisioning.
 * Logic: Deploys a Signal Service and its associated Pricing Tiers in one handshake.
 */
export async function createServiceAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY_HANDSHAKE
  const session = await getSession();
  if (!session || (!session.isStaff && !session.merchantId)) {
    return { error: "SECURITY_PROTOCOL_FAILURE: UNAUTHORIZED" };
  }

  // 🛡️ 2. NODE_RESOLUTION
  const formMerchantId = formData.get("merchantId") as string;
  const targetMerchantId = session.isStaff ? formMerchantId : session.merchantId;

  if (!targetMerchantId || !isUUID(targetMerchantId)) {
    return { error: "VALIDATION_FAILURE: MALFORMED_MERCHANT_ID" };
  }

  // RBAC Cross-Check
  if (!session.isStaff && targetMerchantId !== session.merchantId) {
    return { error: "SECURITY_ALERT: UNAUTHORIZED_TARGETING" };
  }

  // Data Extraction
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryTag = formData.get("categoryTag") as string;
  const rawVipId = formData.get("vipChannelId") as string;

  // 🔢 BigInt Normalization (Telegram Identity)
  let vipChannelId: bigint | null = null;
  if (rawVipId) {
    try {
      // Logic: Strip common formatting and handle large integers
      vipChannelId = BigInt(rawVipId.replace(/[^0-9-]/g, ""));
    } catch {
      return { error: "VALIDATION_FAILURE: INVALID_TELEGRAM_CHANNEL_ID" };
    }
  }

  // Tier Extraction Logic
  const tierNames = formData.getAll("tierNames[]") as string[];
  const tierPrices = formData.getAll("tierPrices[]") as string[];
  const tierIntervals = formData.getAll("tierIntervals[]") as string[];
  
  if (tierNames.length === 0) {
    return { error: "CONFIG_FAILURE: AT_LEAST_ONE_TIER_REQUIRED" };
  }

  try {
    // 🏁 3. ATOMIC_TRANSACTION
    await prisma.$transaction(async (tx) => {
      const service = await tx.service.create({
        data: {
          merchantId: targetMerchantId,
          name,
          description,
          categoryTag: categoryTag?.toUpperCase() || "GENERAL",
          vipChannelId,
          isActive: true,
        },
      });

      const tierData = tierNames.map((tName, index) => ({
        serviceId: service.id,
        name: tName || "Premium Access",
        price: parseFloat(tierPrices[index]) || 0,
        interval: (tierIntervals[index]?.toUpperCase() as IntervalUnit) || "MONTH",
        type: "CUSTOM" as SubscriptionType,
        isActive: true,
      }));

      await tx.serviceTier.createMany({ data: tierData });
    }, {
      maxWait: 5000,
      timeout: 15000 // Tightened for institutional performance
    });

    revalidatePath("/dashboard/services");
  } catch (error: any) {
    console.error("🚨 [Service_Action_Error]:", error.message);
    return { error: "DEPLOYMENT_FAILURE: PERSISTENCE_TRANSACTION_FAILED" };
  }

  redirect("/dashboard/services");
}

/**
 * 🔒 REVOKE_SERVICE_ACTION
 * Logic: Terminal deletion with scope isolation.
 */
export async function revokeServiceAction(serviceId: string) {
  const session = await getSession();
  if (!session) return { error: "SECURITY_ALERT: UNAUTHORIZED" };

  try {
    // 🛡️ SECURITY_GUARD: Scope validation
    const target = await prisma.service.findFirst({
      where: { 
        id: serviceId,
        ...(session.isStaff ? {} : { merchantId: session.merchantId })
      },
    });

    if (!target) return { error: "NODE_ERROR: TARGET_NOT_FOUND_OR_ACCESS_DENIED" };

    // 🏁 3. ATOMIC_DELETION
    await prisma.service.delete({ where: { id: serviceId } });

    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    return { error: "NODE_ERROR: REVOCATION_FAILED" };
  }
}