"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isUUID } from "@/lib/utils/validators";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { IntervalUnit, SubscriptionType } from "@/src/generated/prisma";
// ✅ ARCHITECTURAL SYNC: Importing from the generated client location
// import { IntervalUnit, SubscriptionType } from "@prisma/client";

/**
 * 🚀 SYSTEM ACTION: DEPLOY SERVICE
 * Atomically registers a Signal Service node and its pricing tiers.
 * Optimized for Schema V2.0.0 and Neon serverless wake-up latency.
 */
export async function createServiceAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await requireMerchantSession();
  const merchantId = formData.get("merchantId") as string;

  if (!isUUID(merchantId) || merchantId !== session.merchant.id) {
    return { error: "Security Alert: Unauthorized node identity." };
  }

  // --- SERVICE DATA EXTRACTION ---
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryTag = formData.get("categoryTag") as string;
  const rawVipId = formData.get("vipChannelId") as string;

  let vipChannelId: bigint | null = null;
  if (rawVipId) {
    try {
      // BigInt conversion for large Telegram numeric IDs
      vipChannelId = BigInt(rawVipId);
    } catch {
      return { error: "Invalid Protocol: Target Channel ID must be numeric." };
    }
  }

  // --- MULTI-TIER DATA EXTRACTION ---
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
    // 🏁 2. ATOMIC TRANSACTION
    await prisma.$transaction(
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
        const tierData = tierNames.map((tName, index) => {
          // 🛡️ ENUM RECONCILIATION: Map STANDARD -> CUSTOM to match V2 Schema
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
        // 🚀 NEON RESILIENCY: High wait times for serverless database cold-starts
        maxWait: 15000,
        timeout: 30000,
      }
    );

    // 🔄 3. INTERFACE REVALIDATION
    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard");
    
  } catch (error: any) {
    // 🛡️ PROTOCOL ERROR HANDLING
    if (error.code === "P2028") {
      return { error: "Node Sync Timeout: Database is waking up. Please try again." };
    }

    console.error("❌ Service Deployment Failed:", error);
    return { error: "Critical Deployment Failure. Verify pricing formats." };
  }

  // ✈️ 4. NAVIGATION REDIRECT (Outside try/catch for Next.js 15+ safety)
  redirect("/dashboard/services");
}