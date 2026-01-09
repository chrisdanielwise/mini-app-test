"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IntervalUnit, SubscriptionType } from "@prisma/client";
import { isUUID } from "@/lib/utils/validators";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";

/**
 * 🛰️ SYSTEM ACTION: DEPLOY SERVICE
 * Atomically creates a Signal Service and its full Pricing Architecture.
 */
export async function createServiceAction(prevState: any, formData: FormData) {
  // 🔐 1. Identity & Session Verification
  const session = await requireMerchantSession();
  const merchantId = formData.get("merchantId") as string;

  if (!isUUID(merchantId) || merchantId !== session.merchant.id) {
    return { error: "Security Alert: Unauthorized node identity." };
  }

  // --- SERVICE DATA EXTRACTION ---
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryTag = formData.get("categoryTag") as string;

  // Telegram ID handling: Atomic BigInt conversion for -100 prefixes
  const rawVipId = formData.get("vipChannelId") as string;
  let vipChannelId: bigint | null = null;
  if (rawVipId) {
    try {
      vipChannelId = BigInt(rawVipId);
    } catch {
      return { error: "Invalid Protocol: Target Channel ID must be numeric." };
    }
  }

  // --- MULTI-TIER DATA EXTRACTION ---
  // Using .getAll() to capture the dynamic array from the Create Modal
  const tierNames = formData.getAll("tierNames[]") as string[];
  const tierPrices = formData.getAll("tierPrices[]") as string[];
  const tierIntervals = formData.getAll("tierIntervals[]") as string[];
  const tierTypes = formData.getAll("tierTypes[]") as string[];

  if (tierNames.length === 0) {
    return { error: "Configuration Error: At least one pricing tier is required." };
  }

  try {
    // 🏁 2. ATOMIC TRANSACTION
    const newService = await prisma.$transaction(
      async (tx) => {
        // Create the Parent Service Node
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

        // Map and Create the Pricing Architecture
        // Normalizes Enums to UPPERCASE to prevent Prisma validation failures.
        const tierData = tierNames.map((tName, index) => ({
          serviceId: service.id,
          name: tName || "Premium Access",
          price: parseFloat(tierPrices[index]) || 0,
          interval: (tierIntervals[index]?.toUpperCase() as IntervalUnit) || "MONTH",
          type: (tierTypes[index]?.toUpperCase() as SubscriptionType) || "STANDARD",
          isActive: true,
        }));

        await tx.serviceTier.createMany({
          data: tierData,
        });

        return service;
      },
      {
        // 🚀 NEON COLD-START PROTECTION: Extended timeouts for high-latency starts
        maxWait: 15000, 
        timeout: 25000, 
      }
    );

    // 🔄 3. INTERFACE REVALIDATION
    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard");
    
  } catch (error: any) {
    // 🛡️ PROTOCOL ERROR HANDLING
    if (error.code === "P2028") {
      return { error: "Node Synchronization Timeout. The database is waking up—please try again." };
    }

    console.error("❌ Service Deployment Failed:", error);
    return {
      error: "Critical Deployment Failure. Verify your Channel ID and Pricing nodes.",
    };
  }

  // ✈️ 4. REDIRECT (Must happen outside try/catch in Next.js 15+)
  redirect("/dashboard/services");
}