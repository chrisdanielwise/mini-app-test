"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";

export async function addTierAction(prevState: any, formData: FormData) {
  const serviceId = formData.get("serviceId") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const interval = formData.get("interval") as IntervalUnit;
  const type = formData.get("type") as SubscriptionType;

  try {
    await prisma.serviceTier.create({
      data: {
        serviceId,
        name,
        price,
        interval,
        type,
        isActive: true,
      },
    });

    revalidatePath(`/dashboard/services/${serviceId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Tier Creation Failed:", error);
    return { error: "Failed to add pricing tier." };
  }
}