"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { IntervalUnit, SubscriptionType } from "@prisma/client";

/**
 * 🛰️ SYSTEM ACTION: DEPLOY TIER
 * Securely expands a Service node's pricing architecture.
 * Standardized for Schema V2.0.0 (using CUSTOM instead of STANDARD).
 */
export async function addTierAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  // Ensures the request is coming from a verified merchant session.
  const session = await requireMerchantSession();

  const serviceId = formData.get("serviceId") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);

  // 🏁 ENUM NORMALIZATION: Schema V2 requires exact UPPERCASE matches.
  // Falls back to MONTH and CUSTOM to match your specific DB enums.
  const interval = (
    formData.get("interval") as string
  )?.toUpperCase() as IntervalUnit;
  
  const rawType = formData.get("type") as string;
  const type = (
    rawType?.toUpperCase() === "STANDARD" ? "CUSTOM" : rawType?.toUpperCase()
  ) as SubscriptionType;

  try {
    // 🛡️ 2. OWNERSHIP VERIFICATION
    // Verification protocol: Prevents unauthorized cross-merchant injections.
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        merchantId: session.merchant.id,
      },
    });

    if (!service) {
      return {
        error: "Security Alert: Service node not found or unauthorized.",
      };
    }

    // 🏁 3. ATOMIC DEPLOYMENT
    // Inserts the new pricing node with strict type adherence.
    await prisma.serviceTier.create({
      data: {
        serviceId,
        name: name || "Premium Tier",
        price: price || 0,
        interval: interval || "MONTH",
        type: type || "CUSTOM", // Matches your V2 Schema Identity
        isActive: true,
      },
    });

    // 🚀 4. INTERFACE HYDRATION
    // Instantly refreshes the configuration grid on the service page.
    revalidatePath(`/dashboard/services/${serviceId}`);

    return { success: true };
  } catch (error: any) {
    // 🛡️ NEON COLD-START PROTECTION (P2028)
    // Handles serverless DB wake-up latencies common in development.
    if (error.code === "P2028") {
      return { error: "Node Synchronization Delay. Please try again." };
    }

    console.error("❌ Tier Expansion Failed:", error);
    return { error: "Protocol Failure: Verify pricing fields and try again." };
  }
}