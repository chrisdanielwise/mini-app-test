"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";

/**
 * 🚀 SYSTEM ACTION: DEPLOY SERVICE (v16.16.20 - Hardened)
 */
export async function createServiceAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || (!session.isStaff && !session.merchantId)) {
    return { error: "Security Alert: Unauthorized identity node." };
  }

  const formMerchantId = formData.get("merchantId") as string;
  const targetMerchantId = session.isStaff ? formMerchantId : session.merchantId;

  if (!targetMerchantId || !isUUID(targetMerchantId)) {
    return { error: "Security Alert: Unauthorized or invalid node identity." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryTag = formData.get("categoryTag") as string;
  const rawVipId = formData.get("vipChannelId") as string;
  
  let vipChannelId: bigint | null = null;
  if (rawVipId) {
    try {
      vipChannelId = BigInt(rawVipId.replace(/[^0-9-]/g, ""));
    } catch {
      return { error: "Invalid Protocol: Target Channel ID must be numeric." };
    }
  }

  const tierNames = formData.getAll("tierNames[]") as string[];
  const tierPrices = formData.getAll("tierPrices[]") as string[];
  const tierIntervals = formData.getAll("tierIntervals[]") as string[];
  const tierTypes = formData.getAll("tierTypes[]") as string[];

  if (tierNames.length === 0) {
    return { error: "Configuration Error: At least one pricing tier is required." };
  }

  try {
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

      const tierData = tierNames.map((tName, index) => {
        const rawType = tierTypes[index]?.toUpperCase();
        const validatedType = (rawType === "STANDARD" ? "CUSTOM" : rawType) as SubscriptionType;

        return {
          serviceId: service.id,
          name: tName || "Premium Access",
          price: parseFloat(tierPrices[index]) || 0,
          interval: (tierIntervals[index]?.toUpperCase() as IntervalUnit) || "MONTH",
          type: validatedType,
          isActive: true,
        };
      });

      await tx.serviceTier.createMany({ data: tierData });
    }, { maxWait: 15000, timeout: 30000 });

    revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);
  } catch (error: any) {
    return { error: "Critical Deployment Failure." };
  }

  redirect("/dashboard/services");
}

/**
 * 🛡️ SYSTEM ACTION: REVOKE SERVICE (v16.16.21 - Hardened)
 * Logic: Atomic Node Decoupling & Tier Liquidation.
 * Clearance: Staff (Override) | Merchant (Self-Only)
 */
export async function revokeServiceAction(serviceId: string) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();
  if (!session || (!session.isStaff && !session.merchantId)) {
    return { success: false, error: "SECURITY_PROTOCOL_FAILURE: UNAUTHORIZED" };
  }

  // 🛡️ 2. NODE VALIDATION
  if (!serviceId || !isUUID(serviceId)) {
    return { success: false, error: "VALIDATION_FAILURE: MALFORMED_SERVICE_ID" };
  }

  try {
    // 🔍 3. CLEARANCE CHECK
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { merchantId: true },
    });

    if (!existingService) return { success: false, error: "NODE_NOT_FOUND" };

    // RBAC: Merchants only control their own nodes; Staff can override all.
    if (!session.isStaff && existingService.merchantId !== session.merchantId) {
      return { success: false, error: "SECURITY_ALERT: UNAUTHORIZED_OVERRIDE" };
    }

    // 🏁 4. ATOMIC DECOUPLING
    await prisma.$transaction(async (tx) => {
      // Soft-delete the service
      await tx.service.update({
        where: { id: serviceId },
        data: { isActive: false },
      });

      // Liquidate associated pricing tiers
      await tx.serviceTier.updateMany({
        where: { serviceId },
        data: { isActive: false },
      });

      console.log(`📡 [DECOUPLING_COMPLETE]: Node ${serviceId} revoked.`);
    });

    // 🔄 5. CACHE PURGE
    revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);
    
    return { success: true };
  } catch (error: any) {
    console.error("❌ Revocation Failed:", error);
    return { success: false, error: "Critical Decoupling Failure." };
  }
}