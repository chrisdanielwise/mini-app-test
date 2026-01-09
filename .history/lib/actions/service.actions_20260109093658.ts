"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";

export async function createServiceAction(prevState: any, formData: FormData) {
  const merchantId = formData.get("merchantId") as string;
  
  // Service Data
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryTag = formData.get("categoryTag") as string;
  const vipChannelId = formData.get("vipChannelId") ? BigInt(formData.get("vipChannelId") as string) : null;

  // Tier Data
  const tierName = formData.get("tierName") as string;
  const price = parseFloat(formData.get("price") as string);
  const interval = formData.get("interval") as IntervalUnit;
  const type = formData.get("type") as SubscriptionType;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create the Service
      const service = await tx.service.create({
        data: {
          merchantId,
          name,
          description,
          categoryTag,
          vipChannelId,
          isActive: true,
        },
      });

      // 2. Create the first ServiceTier linked to that service
      await tx.serviceTier.create({
        data: {
          serviceId: service.id,
          name: tierName,
          price: price,
          interval: interval,
          type: type,
          isActive: true,
        },
      });
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.error("❌ Service Creation Failed:", error);
    return { error: "Failed to deploy service. Check your Channel ID format." };
  }

  redirect("/dashboard");
}