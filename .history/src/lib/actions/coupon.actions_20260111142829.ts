"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session"; // Use getSession for granular checks
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ SYSTEM ACTION: DEPLOY PROMOTION
 * Registers a new discount node with specific service or global targeting.
 */
export async function createCouponAction(prevState: any, formData: FormData) {
  // 🔐 1. IDENTITY HANDSHAKE
  const session = await getSession();
  
  // Security Barrier: Check for session and either Staff or Merchant role
  if (!session || (!session.isStaff && !session.merchantId)) {
    return { error: "Security Alert: Unauthorized identity node." };
  }

  const merchantId = formData.get("merchantId") as string;

  // 🛡️ SECURITY GUARD
  // If the user is a Merchant, they can only create coupons for THEIR merchantId.
  // If the user is Staff, they can create coupons for ANY merchantId (Admin Oversight).
  if (!isUUID(merchantId)) {
    return { error: "Validation Protocol: Invalid node identity." };
  }

  if (!session.isStaff && merchantId !== session.merchantId) {
    return { error: "Security Alert: Unauthorized node targeting." };
  }

  // --- DATA EXTRACTION & NORMALIZATION ---
  const serviceId = formData.get("serviceId") as string;
  const code = (formData.get("code") as string)?.trim().toUpperCase();
  const discountPercent = parseInt(formData.get("discountPercent") as string);
  const maxUses = formData.get("maxUses")
    ? parseInt(formData.get("maxUses") as string)
    : null;

  if (!code || isNaN(discountPercent)) {
    return { error: "Validation Protocol: Missing required value nodes." };
  }

  try {
    // 🛡️ 2. ATOMIC UNIQUENESS CHECK
    const existing = await prisma.coupon.findFirst({
      where: { code, merchantId, isActive: true },
    });

    if (existing) {
      return { error: "Configuration Collision: Code already active in cluster." };
    }

    // 🏁 3. DATABASE COMMIT
    await prisma.coupon.create({
      data: {
        merchantId,
        serviceId: serviceId === "global" || !serviceId ? null : serviceId,
        code,
        discountPercent,
        maxUses,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/coupons");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Coupon Deployment Failed:", error);
    return { error: "Critical Deployment Failure." };
  }
}

/**
 * 🔒 PROTOCOL: REVOKE PROMOTION
 */
export async function revokeCouponAction(couponId: string) {
  const session = await getSession();

  if (!session || (!session.isStaff && !session.merchantId)) {
    return { error: "Security Alert: Unauthorized identity." };
  }

  try {
    // 🛡️ 2. SECURITY GUARD
    // Staff can delete anything; Merchants can only delete their own.
    const whereClause: any = { id: couponId };
    if (!session.isStaff) {
      whereClause.merchantId = session.merchantId;
    }

    const coupon = await prisma.coupon.findFirst({ where: whereClause });

    if (!coupon) {
      return { error: "Security Alert: Node not found or unauthorized." };
    }

    await prisma.coupon.delete({ where: { id: couponId } });

    revalidatePath("/dashboard/coupons");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("❌ Coupon Revocation Failed:", error);
    return { error: "Node Error: Could not terminate promotion protocol." };
  }
}