"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ SYSTEM ACTION: DEPLOY PROMOTION
 * Registers a new discount node with specific service or global targeting.
 */
export async function createCouponAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await requireMerchantSession();
  const merchantId = formData.get("merchantId") as string;

  // Security Verification: Ensure the provided ID matches the authenticated session
  if (!isUUID(merchantId) || merchantId !== session.merchant.id) {
    return { error: "Security Alert: Unauthorized or invalid node identity." };
  }

  // --- DATA EXTRACTION & NORMALIZATION ---
  const serviceId = formData.get("serviceId") as string;
  const code = (formData.get("code") as string)?.trim().toUpperCase();
  const discountPercent = parseInt(formData.get("discountPercent") as string);
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null;

  // Input Validation
  if (!code || isNaN(discountPercent)) {
    return { error: "Validation Protocol: Missing required identity or value nodes." };
  }

  try {
    // 🛡️ 2. ATOMIC UNIQUENESS CHECK
    // Logic: Ensures this merchant doesn't have a collision on this specific code.
    const existing = await prisma.coupon.findFirst({
      where: { 
        code, 
        merchantId,
        isActive: true 
      }
    });

    if (existing) {
      return { error: "Configuration Collision: This code is already active in your cluster." };
    }

    // 🏁 3. DATABASE COMMIT
    await prisma.coupon.create({
      data: {
        merchantId,
        // Protocol: If 'global' is selected, link to null to target all merchant services.
        serviceId: (serviceId === "global" || !serviceId) ? null : serviceId,
        code,
        discountPercent,
        maxUses,
        isActive: true,
      },
    });

    // 🔄 4. CACHE REVALIDATION
    revalidatePath("/dashboard/coupons");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error: any) {
    // Protocol Error Handling for Neon Database cold-starts or timeouts
    console.error("❌ Coupon Deployment Failed:", error);
    return { error: "Critical Deployment Failure. Check database connectivity." };
  }
}