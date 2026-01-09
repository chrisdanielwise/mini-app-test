"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛠️ CREATE SERVICE ACTION
 * Atomic transaction to create a Service and its initial ServiceTier.
 * FIXED: 
 * 1. Added extended timeouts for Neon cold-starts (P2028).
 * 2. Case-normalization for Enums (SubscriptionType).
 * 3. Atomic BigInt conversion for Telegram IDs.
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
  
  // 🔥 FIX: Ensure Enum values match Prisma's UPPERCASE requirement
  const rawInterval = formData.get("interval") as string;
  const interval = (rawInterval?.toUpperCase() as IntervalUnit) || "MONTH";
  
  const rawType = formData.get("type") as string;
  const type = (rawType?.toUpperCase() as SubscriptionType) || "CUSTOM";

  try {
    // 🏁 2. ATOMIC TRANSACTION
    await prisma.$transaction(
      async (tx) => {
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
            type: type, // Now correctly formatted as "CUSTOM" or "LIFETIME"
            isActive: true,
          },
        });
      },
      {
        // 🔥 THE P2028 FIX: Increase wait times for Neon Cold Starts
        maxWait: 15000, 
        timeout: 20000, 
      }
    );

    // 🔄 3. Revalidate the cache so the new service appears immediately
    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard");
    
  } catch (error: any) {
    // 🛡️ Error Handling
    if (error.code === "P2028") {
      return { error: "Database is waking up. Please try one more time." };
    }

    if (error.message?.includes("SubscriptionType")) {
      return { error: `System Error: Invalid subscription type '${type}'.` };
    }

    if (error.message?.includes("BigInt")) {
      return { error: "Invalid Telegram Channel ID format. Check the numbers." };
    }

    console.error("❌ Service Creation Failed:", error);
    return {
      error: "Deployment failed. Verify your Channel ID and try again.",
    };
  }

  // ✈️ 4. Redirect happens OUTSIDE the try/catch
  redirect("/dashboard/services");
}