"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { isUUID } from "@/lib/utils/validators";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";

/**
 * 🛰️ SYSTEM ACTION: DEPLOY TIER
 * Logic: Synchronized with Universal Identity. 
 * Clearance: Staff (Global Oversight) | Merchant (Self-Only)
 */
export async function addTierAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();

  // Security Barrier: Check for valid session and role/merchant context
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
    // If Staff: They can add tiers to any service.
    // If Merchant: We verify they own the parent Service node.
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

    // 🚀 4. INTERFACE HYDRATION
    revalidatePath(`/dashboard/services`);
    revalidatePath(`/dashboard/services/${serviceId}`);

    return { success: true };
  } catch (error: any) {
    if (error.code === "P2028") {
      return { error: "Node Synchronization Delay: Database waking up. Try again." };
    }

    console.error("❌ Tier Expansion Failed:", error);
    return { error: "Protocol Failure: Verify pricing fields and try again." };
  }
}