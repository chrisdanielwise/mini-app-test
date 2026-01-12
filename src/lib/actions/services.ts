"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";

/**
 * 🚀 SYSTEM ACTION: DEPLOY SERVICE
 * Clearance: Staff (Global) | Merchant (Self-Only)
 * Atomically creates a Service node and its dynamic Pricing Structure.
 */
export async function createServiceAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();

  // Security Barrier: Ensure session exists and a merchant context is available
  if (!session || (!session.isStaff && !session.merchantId)) {
    return { error: "Security Alert: Unauthorized identity node." };
  }

  // 🛡️ 2. NODE RESOLUTION
  // If Staff: They can specify a merchantId. 
  // If Merchant: We force their own merchantId from the secure session.
  const formMerchantId = formData.get("merchantId") as string;
  const targetMerchantId = session.isStaff ? formMerchantId : session.merchantId;

  if (!targetMerchantId || !isUUID(targetMerchantId)) {
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
  const tierNames = formData.getAll("tierNames[]") as string[];
  const tierPrices = formData.getAll("tierPrices[]") as string[];
  const tierIntervals = formData.getAll("tierIntervals[]") as string[];
  const tierTypes = formData.getAll("tierTypes[]") as string[];

  if (tierNames.length === 0) {
    return { error: "Configuration Error: At least one pricing tier is required." };
  }

  try {
    // 🏁 3. ATOMIC TRANSACTION
    await prisma.$transaction(
      async (tx) => {
        // Step A: Create the Parent Service Node
        const service = await tx.service.create({
          data: {
            merchantId: targetMerchantId,
            name,
            description,
            categoryTag: categoryTag?.toUpperCase() || "GENERAL",
            vipChannelId,
            isActive: true,
          },
        });

        // Step B: Map and Create the Pricing Architecture
        const tierData = tierNames.map((tName, index) => {
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
        maxWait: 15000,
        timeout: 30000,
      }
    );

    // 🔄 4. CACHE REVALIDATION
    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard");
  } catch (error: any) {
    if (error.code === "P2028") {
      return { error: "Node Sync Timeout: Database is waking up. Please try again." };
    }
    console.error("❌ Service Deployment Failed:", error);
    return { error: "Critical Deployment Failure." };
  }

  // ✈️ 5. REDIRECT
  redirect("/dashboard/services");
}