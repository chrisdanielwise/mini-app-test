"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session"; 
import { isUUID } from "@/lib/utils/validators";
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: Coupon_Deployment
 */
const CouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase().transform(s => s.trim()),
  discountPercent: z.number().min(1).max(100),
  maxUses: z.number().nullable().optional(),
  merchantId: z.string().uuid(),
  serviceId: z.string().optional().nullable(),
});

/**
 * 🌊 CREATE_COUPON_ACTION (v16.16.12)
 * Logic: Multi-tenant RBAC validation with Atomic Uniqueness Check.
 * Design: Institutional "Fail-Fast" Security Ingress.
 */
export async function createCouponAction(prevState: any, formData: FormData) {
  try {
    // 🔐 1. IDENTITY HANDSHAKE
    const session = await getSession();
    
    // Barrier: Ensure session exists and user has Merchant or Staff clearance
    if (!session || (!session.isStaff && !session.merchantId)) {
      return { error: "SECURITY_ALERT: Unauthorized_Identity_Node" };
    }

    // 2. DATA EXTRACTION & VALIDATION
    const rawData = {
      code: formData.get("code"),
      discountPercent: Number(formData.get("discountPercent")),
      maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : null,
      merchantId: formData.get("merchantId"),
      serviceId: formData.get("serviceId"),
    };

    const validated = CouponSchema.safeParse(rawData);
    if (!validated.success) {
      return { error: "VALIDATION_PROTOCOL_FAILED", issues: validated.error.flatten() };
    }

    const { code, discountPercent, maxUses, merchantId, serviceId } = validated.data;

    // 🛡️ SECURITY GUARD: RBAC Context Check
    // Prevents "Cross-Node Poisoning" where a merchant creates codes for others.
    if (!session.isStaff && merchantId !== session.merchantId) {
      return { error: "SECURITY_ALERT: Unauthorized_Node_Targeting" };
    }

    // 🧪 3. ATOMIC UNIQUENESS PROTOCOL
    // Handled inside a transaction to prevent race-condition collisions.
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.coupon.findFirst({
        where: { code, merchantId, isActive: true },
      });

      if (existing) throw new Error("COLLISION_DETECTED");

      return await tx.coupon.create({
        data: {
          merchantId,
          serviceId: (serviceId === "global" || !serviceId) ? null : serviceId,
          code,
          discountPercent,
          maxUses,
          isActive: true,
        },
      });
    });

    // 🌊 REVALIDATION HANDSHAKE
    revalidatePath("/dashboard/coupons");
    revalidatePath("/dashboard");
    
    return { success: true, message: "PROMOTION_NODE_DEPLOYED" };

  } catch (error: any) {
    if (error.message === "COLLISION_DETECTED") {
      return { error: "CONFIGURATION_COLLISION: Code_Already_Active" };
    }
    console.error("🚨 [Protocol_Error] Coupon_Deployment_Failed:", error);
    return { error: "CRITICAL_DEPLOYMENT_FAILURE" };
  }
}

/**
 * 🔒 REVOKE_COUPON_ACTION (v16.16.12)
 * Logic: Targeted Node Deletion with RBAC Filtering.
 */
export async function revokeCouponAction(couponId: string) {
  try {
    const session = await getSession();

    if (!session || (!session.isStaff && !session.merchantId)) {
      return { error: "SECURITY_ALERT: Unauthorized_Identity" };
    }

    // 🛡️ SECURITY GUARD: Scoped Deletion
    // Staff can delete globally; Merchants are restricted to their own cluster.
    const deleteResult = await prisma.coupon.deleteMany({
      where: {
        id: couponId,
        ...(session.isStaff ? {} : { merchantId: session.merchantId })
      }
    });

    if (deleteResult.count === 0) {
      return { error: "NODE_ERROR: Target_Not_Found_Or_Access_Denied" };
    }

    revalidatePath("/dashboard/coupons");
    return { success: true, message: "PROMOTION_NODE_TERMINATED" };

  } catch (error) {
    console.error("🚨 [Protocol_Error] Coupon_Revocation_Failed:", error);
    return { error: "NODE_ERROR: Could_Not_Terminate_Promotion" };
  }
}