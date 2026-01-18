"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";

/**
 * 🛰️ SYSTEM ACTION: DEPLOY TIER (v16.16.20 - Hardened)
 * Logic: Synchronized with Universal Identity. 
 * Fix: Replaced path-revalidation with CACHE_PROFILES.CONTENT ("static") purge.
 */
export async function addTierAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();

  if (!session || (!session.isStaff && !session.merchantId)) {
    return { error: "Security Alert: Unauthorized identity node." };
  }

  const serviceId = formData.get("serviceId") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);

  if (!isUUID(serviceId)) {
    return { error: "Validation Protocol: Malformed Service ID node." };
  }

  // 🏁 ENUM NORMALIZATION
  const interval = (
    formData.get("interval") as string
  )?.toUpperCase() as IntervalUnit;
  
  const rawType = formData.get("type") as string;
  const type = (
    rawType?.toUpperCase() === "STANDARD" ? "CUSTOM" : rawType?.toUpperCase()
  ) as SubscriptionType;

  try {
    // 🛡️ 2. OWNERSHIP VERIFICATION
    const whereClause: any = { id: serviceId };
    if (!session.isStaff) {
      whereClause.merchantId = session.merchantId;
    }

    const service = await prisma.service.findFirst({
      where: whereClause,
    });

    if (!service) {
      return {
        error: "Security Alert: Service node not found or unauthorized.",
      };
    }

    // 🏁 3. ATOMIC DEPLOYMENT
    await prisma.serviceTier.create({
      data: {
        serviceId,
        name: name || "Premium Tier",
        price: price || 0,
        interval: interval || "MONTH",
        type: type || "CUSTOM",
        isActive: true,
      },
    });

    // 🚀 4. ATOMIC CACHE REVALIDATION
    // Fix: Using CONTENT profile to update the marketplace catalog instantly.
    // This resolves the ts(2554) "Expected 2 arguments" error.
    revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);

    return { success: true };
  } catch (error: any) {
    if (error.code === "P2028") {
      return { error: "Node Synchronization Delay: Database waking up. Try again." };
    }

    console.error("❌ Tier Expansion Failed:", error);
    return { error: "Protocol Failure: Verify pricing fields and try again." };
  }
}