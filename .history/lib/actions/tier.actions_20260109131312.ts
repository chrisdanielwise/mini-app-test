"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { IntervalUnit, SubscriptionType } from "@prisma/client";

/**
 * 🛰️ DEPLOY TIER ACTION
 * Securely creates a new pricing tier linked to a verified merchant node.
 */
export async function addTierAction(prevState: any, formData: FormData) {
  // 🔐 1. Identity Verification
  // Fetches the real Merchant UUID from the secure session.
  const session = await requireMerchantSession();
  
  const serviceId = formData.get("serviceId") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const interval = formData.get("interval") as IntervalUnit;
  const type = formData.get("type") as SubscriptionType;

  try {
    // 🛡️ 2. Ownership Verification
    // Ensures the service actually belongs to the authenticated merchant.
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        merchantId: session.merchant.id
      }
    });

    if (!service) {
      return { error: "Security Alert: Service node not found or unauthorized." };
    }

    // 🏁 3. Atomic Deployment
    // Inserts the new tier into the database with UUID consistency.
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

    // 🚀 4. Interface Revalidation
    // Instantly refreshes the configuration grid for the merchant.
    revalidatePath(`/dashboard/services/${serviceId}`);
    
    return { success: true };
  } catch (error) {
    console.error("❌ Tier Creation Failed:", error);
    return { error: "Deployment Failed: Ensure all fields follow protocol." };
  }
}