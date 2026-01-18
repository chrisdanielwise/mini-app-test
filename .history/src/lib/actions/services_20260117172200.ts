"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";

/**
 * 🚀 SYSTEM ACTION: DEPLOY SERVICE (v16.16.20 - Hardened)
 * Clearance: Staff (Global) | Merchant (Self-Only)
 * Fix: Replaced path-revalidation with Tagged Profile purge for 2026 standards.
 */
export async function createServiceAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();

  if (!session || (!session.isStaff && !session.merchantId)) {
    return { error: "Security Alert: Unauthorized identity node." };
  }

  // 🛡️ 2. NODE RESOLUTION
  const formMerchantId = formData.get("merchantId") as string;
  const targetMerchantId = session.isStaff ? formMerchantId : session.merchantId;

  if (!targetMerchantId || !isUUID(targetMerchantId)) {
    return { error: "Security Alert: Unauthorized or invalid node identity." };
  }

  // --- DATA EXTRACTION ---
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryTag = formData.get("categoryTag") as string;
  const rawVipId = formData.get("vipChannelId") as string;
  
  let vipChannelId: bigint | null = null;
  if (rawVipId) {
    try {
      vipChannelId = BigInt(rawVipId.replace(/[^0-9-]/g, ""));
    } catch {
      return { error: "Invalid Protocol: Target Channel ID must be numeric." };
    }
  }

  // --- PRICING ARCHITECTURE EXTRACTION ---
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
      { maxWait: 15000, timeout: 30000 }
    );

    // 🔄 4. ATOMIC CACHE REVALIDATION
    // Fix: Using CONTENT ("static") profile to ensure the Marketplace HUD updates instantly.
    // This resolves the ts(2554) error.
    revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);

  } catch (error: any) {
    console.error("❌ Deployment Failed:", error);
    return { error: "Critical Deployment Failure." };
  }

  // ✈️ 5. REDIRECT
  redirect("/dashboard/services");
}