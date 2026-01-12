"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUUID } from "@/lib/utils/validators";
import { getSession } from "@/lib/auth/session";
// ✅ ARCHITECTURAL SYNC: Importing from the generated client location
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";

/**
 * 🚀 SYSTEM ACTION: DEPLOY SERVICE
 * Atomically registers a Signal Service node and its pricing tiers.
 */
export async function createServiceAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();

  if (!session || (!session.isStaff && !session.merchantId)) {
    return { error: "Security Alert: Unauthorized identity node." };
  }

  // 🛡️ 2. NODE RESOLUTION
  // If Staff: Use the merchantId from the form.
  // If Merchant: Force use of their own session merchantId.
  const formMerchantId = formData.get("merchantId") as string;
  const targetMerchantId = session.isStaff ? formMerchantId : session.merchantId;

  if (!isUUID(targetMerchantId)) {
    return { error: "Validation Protocol: Target merchant node ID is malformed." };
  }

  // Security Verification for non-staff
  if (!session.isStaff && targetMerchantId !== session.merchantId) {
    return { error: "Security Alert: Unauthorized node targeting." };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryTag = formData.get("categoryTag") as string;
  const rawVipId = formData.get("vipChannelId") as string;

  let vipChannelId: bigint | null = null;
  if (rawVipId) {
    try {
      vipChannelId = BigInt(rawVipId);
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
    // 🏁 3. ATOMIC TRANSACTION
    await prisma.$transaction(
      async (tx) => {
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
      },
      {
        maxWait: 15000,
        timeout: 30000,
      }
    );

    revalidatePath("/dashboard/services");
  } catch (error: any) {
    console.error("❌ Service Deployment Failed:", error);
    if (error.code === "P2028") return { error: "Node Sync Timeout. Try again." };
    return { error: "Critical Deployment Failure." };
  }

  redirect("/dashboard/services");
}

/**
 * 🔒 PROTOCOL: REVOKE SERVICE
 */
export async function revokeServiceAction(serviceId: string) {
  const session = await getSession();

  if (!session) {
    return { error: "Security Alert: Unauthorized identity." };
  }

  try {
    // 🛡️ 2. SECURITY GUARD
    // Staff can revoke anything; Merchants only their own nodes.
    const whereClause: any = { id: serviceId };
    if (!session.isStaff) {
      whereClause.merchantId = session.merchantId;
    }

    const service = await prisma.service.findFirst({
      where: whereClause,
    });

    if (!service) {
      return { error: "Security Alert: Unauthorized revocation attempt." };
    }

    // 🏁 3. ATOMIC DELETION
    await prisma.service.delete({
      where: { id: serviceId },
    });

    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("❌ Revocation Failed:", error);
    return { error: "Node Error: Could not revoke active deployment." };
  }
}