"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Enums from your generated client
import { IntervalUnit, SubscriptionType, Prisma } from "@/generated/prisma";

/**
 * 🚀 SYSTEM ACTION: DEPLOY SERVICE (Institutional Apex v2026.1.20)
 * Logic: Atomic creation of a Service and its associated Pricing Tiers.
 * Fix: Synchronized Enums with generated Prisma objects to handle lowercase mapping.
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
        // ✅ FIX: Map string inputs to strictly typed Prisma Enums
        const rawType = tierTypes[index]?.toUpperCase();
        const validatedType = (rawType === "STANDARD" ? SubscriptionType.CUSTOM : (rawType as SubscriptionType)) || SubscriptionType.CUSTOM;

        // ✅ FIX: Match interval strings to IntervalUnit Enum members
        const intervalInput = tierIntervals[index]?.toUpperCase();
        const validatedInterval = (intervalInput as IntervalUnit) || IntervalUnit.MONTH;

        return {
          serviceId: service.id,
          name: tName || "Premium Access",
          price: parseFloat(tierPrices[index]) || 0,
          interval: validatedInterval,
          type: validatedType,
          isActive: true,
        };
      });

      await tx.serviceTier.createMany({ data: tierData });
    }, { maxWait: 15000, timeout: 30000 });

    // ✅ FIX: Provided mandatory "default" profile for Next.js 15
    revalidateTag("catalog_node", "default");
  } catch (error: any) {
    console.error("🔥 [Service_Deployment_Failure]:", error.message);
    return { error: "Critical Deployment Failure." };
  }

  redirect("/dashboard/services");
}

/**
 * 🛡️ SYSTEM ACTION: REVOKE SERVICE (v2026.1.21 - Hardened)
 */
export async function revokeServiceAction(serviceId: string) {
  const session = await getSession();
  if (!session || (!session.isStaff && !session.merchantId)) {
    return { success: false, error: "SECURITY_PROTOCOL_FAILURE: UNAUTHORIZED" };
  }

  if (!serviceId || !isUUID(serviceId)) {
    return { success: false, error: "VALIDATION_FAILURE: MALFORMED_SERVICE_ID" };
  }

  try {
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { merchantId: true },
    });

    if (!existingService) return { success: false, error: "NODE_NOT_FOUND" };

    if (!session.isStaff && existingService.merchantId !== session.merchantId) {
      return { success: false, error: "SECURITY_ALERT: UNAUTHORIZED_OVERRIDE" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.service.update({
        where: { id: serviceId },
        data: { isActive: false },
      });

      await tx.serviceTier.updateMany({
        where: { serviceId },
        data: { isActive: false },
      });
    });

    // ✅ FIX: Provided mandatory profile argument
    revalidateTag("catalog_node", "default");
    
    return { success: true };
  } catch (error: any) {
    console.error("❌ [Service_Revocation_Failed]:", error);
    return { success: false, error: "Critical Decoupling Failure." };
  }
}