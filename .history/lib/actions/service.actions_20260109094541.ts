"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛠️ CREATE SERVICE ACTION
 * Atomic transaction to create a Service and its initial ServiceTier.
 */
export async function createServiceAction(prevState: any, formData: FormData) {
  const merchantId = formData.get("merchantId") as string;
  
  // 🛡️ 1. Basic Validation
  if (!isUUID(merchantId)) {
    return { error: "Session expired. Please log in again." };
  }

  // Service Data extraction
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryTag = formData.get("categoryTag") as string;
  
  // Telegram ID handling: Ensuring we handle the -100 prefix for BigInt
  const rawVipId = formData.get("vipChannelId") as string;
  const vipChannelId = rawVipId ? BigInt(rawVipId) : null;

  // Tier Data extraction
  const tierName = formData.get("tierName") as string;
  const price = parseFloat(formData.get("price") as string);
  const interval = (formData.get("interval") as IntervalUnit) || "MONTH";
  const type = (formData.get("type") as SubscriptionType) || "custom";

  try {
    // 🏁 2. ATOMIC TRANSACTION
    // Ensures we don't have a service without a tier or vice versa.
    await prisma.$transaction(async (tx) => {
      // Create the Service
      const service = await tx.service.create({
        data: {
          merchantId,
          name,
          description,
          categoryTag: categoryTag || "GENERAL",
          vipChannelId,
          isActive: true,
        },
      });

      // Create the mandatory first ServiceTier
      await tx.serviceTier.create({
        data: {
          serviceId: service.id,
          name: tierName || "Premium Access",
          price: price || 0,
          interval: interval,
          type: type,
          isActive: true,
        },
      });
    });

    // 🔄 3. Revalidate the cache so the new service appears immediately
    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard");
    
  } catch (error) {
    console.error("❌ Service Creation Failed:", error);
    
    // Check for unique constraint errors or BigInt overflow
    if (error instanceof Error && error.message.includes("BigInt")) {
      return { error: "Invalid Telegram Channel ID format." };
    }
    
    return { error: "Database error. Please verify your inputs and try again." };
  }

  // ✈️ 4. Redirect must happen OUTSIDE the try/catch block in Next.js
  redirect("/dashboard/services");
}