"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { isUUID } from "@/lib/utils/validators";
import { IntervalUnit, SubscriptionType } from "@/src/generated/prisma";

/**
 * 🛰️ SYSTEM ACTION: DEPLOY SERVICE
 * Atomically creates a Service node and its dynamic Pricing Structure.
 */
export async function createServiceAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await requireMerchantSession();
  const merchantId = formData.get("merchantId") as string;

  // Security Verification: Ensure UUID integrity and session match
  if (!isUUID(merchantId) || merchantId !== session.merchant.id) {
    return { error: "Security Alert: Unauthorized or invalid node identity." };
  }

  // --- SERVICE DATA EXTRACTION ---
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryTag = formData.get("categoryTag") as string;
  
  // Telegram ID Resilience: handles numeric IDs with -100 prefixes
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
  // Captures arrays from the dynamic modal inputs
  const tierNames = formData.getAll("tierNames[]") as string[];
  const tierPrices = formData.getAll("tierPrices[]") as string[];
  const tierIntervals = formData.getAll("tierIntervals[]") as string[];
  const tierTypes = formData.getAll("tierTypes[]") as string[];

  if (tierNames.length === 0) {
    return { error: "Configuration Error: At least one pricing tier is required." };
  }

  try {
    // 🏁 2. ATOMIC TRANSACTION
    await prisma.$transaction(async (tx) => {
      // Step A: Create the Parent Service Node
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

      // Step B: Map and Create the Pricing Architecture
      // Logic: Normalizes strings to Enum-compatible UPPERCASE.
      const tierData = tierNames.map((tName, index) => {
        const rawType = tierTypes[index]?.toUpperCase();
        // Schema Sync: Maps UI 'STANDARD' to DB 'CUSTOM'
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
    }, {
      // 🚀 NEON RESILIENCY: High wait times for serverless database cold-starts
      maxWait: 15000, 
      timeout: 30000, 
    });

    // 🔄 3. CACHE REVALIDATION
    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard");
    
  } catch (error: any) {
    // Protocol Error Handling for P2028 (Transaction Timeouts)
    if (error.code === "P2028") {
      return { error: "Node Sync Timeout: Database is waking up. Please try again." };
    }
    console.error("❌ Service Deployment Failed:", error);
    return { error: "Critical Deployment Failure. Check input protocol." };
  }

  // ✈️ 4. REDIRECT (Outside try/catch for Next.js 15 safety)
  redirect("/dashboard/services");
}