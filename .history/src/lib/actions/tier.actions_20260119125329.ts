"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { CACHE_PROFILES } from "@/lib/auth/config";
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Enums from your generated client
import { IntervalUnit, SubscriptionType, Prisma } from "@/generated/prisma";

/**
 * 🛰️ SYSTEM ACTION: DEPLOY TIER (Institutional Apex v2026.1.20)
 * Logic: Atomic addition of a pricing tier to an existing service node.
 * Fix: Synchronized Enums with generated Prisma objects to handle lowercase mapping.
 * Fix: Provided mandatory second argument for revalidateTag (Next.js 15).
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

  // 🏁 2. ENUM NORMALIZATION & MAPPING
  // Logic: Map strings to strictly typed Prisma Enums to satisfy mapping logic
  const rawInterval = formData.get("interval") as string;
  const interval = (rawInterval?.toUpperCase() as IntervalUnit) || IntervalUnit.MONTH;
  
  const rawTypeInput = formData.get("type") as string;
  const type = (rawTypeInput?.toUpperCase() === "STANDARD" 
    ? SubscriptionType.CUSTOM 
    : (rawTypeInput?.toUpperCase() as SubscriptionType)) || SubscriptionType.CUSTOM;

  try {
    // 🛡️ 3. OWNERSHIP VERIFICATION
    const whereClause: Prisma.ServiceWhereInput = { id: serviceId };
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

    // 🏁 4. ATOMIC DEPLOYMENT
    await prisma.serviceTier.create({
      data: {
        serviceId,
        name: name || "Premium Tier",
        price: price || 0,
        // ✅ FIX: Use Enum member (e.g. IntervalUnit.MONTH) instead of raw string
        interval: interval,
        type: type,
        isActive: true,
      },
    });

    // 🚀 5. ATOMIC CACHE REVALIDATION
    // Fix: Provided mandatory second argument CACHE_PROFILES.CONTENT ("static")
    // Profile: Ensures the marketplace catalog reflects the new tier immediately.
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