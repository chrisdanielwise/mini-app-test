"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { IntervalUnit, SubscriptionType } from "@prisma/client";

/**
 * 🛰️ DEPLOY TIER ACTION
 * Atomically expands a Service node's pricing architecture.
 */
export async function addTierAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await requireMerchantSession();
  
  const serviceId = formData.get("serviceId") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  
  // 🏁 PROTOCOL FIX: Ensure Enums are UPPERCASE for DB Schema
  const interval = (formData.get("interval") as string)?.toUpperCase() as IntervalUnit;
  const type = (formData.get("type") as string)?.toUpperCase() as SubscriptionType;

  try {
    // 🛡️ 2. OWNERSHIP VERIFICATION
    // Verification protocol: Tier deployment is restricted to the legitimate Service owner.
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        merchantId: session.merchant.id
      }
    });

    if (!service) {
      return { error: "Security Alert: Service node not found or unauthorized." };
    }

    // 🏁 3. ATOMIC DEPLOYMENT
    await prisma.serviceTier.create({
      data: {
        serviceId,
        name: name || "Premium Tier",
        price: price || 0,
        interval: interval || "MONTH",
        type: type || "STANDARD",
        isActive: true,
      },
    });

    // 🚀 4. INTERFACE HYDRATION
    // Refreshes the configuration ledger instantly for the merchant.
    revalidatePath(`/dashboard/services/${serviceId}`);
    
    return { success: true };
  } catch (error: any) {
    // 🛡️ NEON COLD-START PROTECTION
    if (error.code === "P2028") {
      return { error: "Database Synchronization Delay. Please try again." };
    }

    console.error("❌ Tier Expansion Failed:", error);
    return { error: "Protocol Failure: Verify price and interval settings." };
  }
}