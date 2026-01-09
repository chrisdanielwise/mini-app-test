"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { IntervalUnit, SubscriptionType } from "@prisma/client";
import { isUUID } from "@/lib/utils/validators";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";

/**
 * 🛰️ SYSTEM ACTION: DEPLOY SERVICE
 */
export async function createServiceAction(prevState: any, formData: FormData) {
  const session = await requireMerchantSession();
  const merchantId = formData.get("merchantId") as string;

  if (!isUUID(merchantId) || merchantId !== session.merchant.id) {
    return { error: "Security Alert: Unauthorized node identity." };
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
    return {
      error: "Configuration Error: At least one pricing tier is required.",
    };
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        const service = await tx.service.create({
          data: {
            merchantId,
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
          interval:
            (tierIntervals[index]?.toUpperCase() as IntervalUnit) || "MONTH",
          type:
            (tierTypes[index]?.toUpperCase() as SubscriptionType) || "STANDARD",
          isActive: true,
        }));

        await tx.serviceTier.createMany({ data: tierData });
      },
      {
        maxWait: 15000,
        timeout: 25000,
      }
    );

    revalidatePath("/dashboard/services");
  } catch (error: any) {
    if (error.code === "P2028")
      return { error: "Node Sync Timeout. Try again." };
    return { error: "Critical Deployment Failure." };
  }

  redirect("/dashboard/services");
}
