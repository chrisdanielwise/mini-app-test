"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session"; 
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: v2.0.0 Alignment
 * Enforces strict financial boundaries and UUID validation.
 */
const CouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase().trim(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]), 
  amount: z.number().min(0.01).max(1000000), 
  maxUses: z.number().int().positive().nullable().optional(),
  merchantId: z.string().uuid(),
  serviceId: z.string().uuid().optional().nullable(),
}).refine(data => {
  // 🛡️ Financial Guard: Percentages cannot exceed 100
  if (data.discountType === "PERCENTAGE" && data.amount > 100) return false;
  return true;
}, {
  message: "PERCENTAGE_OVERFLOW",
  path: ["amount"]
});

/**
 * 🌊 CREATE_COUPON_ACTION (Institutional Apex v2026.1.16)
 * Strategy: Atomic Persistence with RBAC Context Enforcement.
 */
export async function createCouponAction(prevState: any, formData: FormData) {
  try {
    const session = await getSession();
    
    // 🛡️ IDENTITY HANDSHAKE
    if (!session || (!session.isStaff && !session.merchantId)) {
      return { error: "SECURITY_ALERT: Unauthorized_Identity_Node" };
    }

    // ⚙️ DATA INGRESS
    const rawData = {
      code: formData.get("code"),
      discountType: formData.get("discountType") || "PERCENTAGE",
      amount: Number(formData.get("amount")),
      maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : null,
      merchantId: formData.get("merchantId") || session.merchantId,
      serviceId: formData.get("serviceId"),
    };

    const validated = CouponSchema.safeParse(rawData);
    if (!validated.success) {
      return { error: "VALIDATION_PROTOCOL_FAILED", issues: validated.error.flatten() };
    }

    const { code, discountType, amount, maxUses, merchantId, serviceId } = validated.data;

    // 🛡️ RBAC CONTEXT GUARD: Cross-merchant targeting prevention
    if (!session.isStaff && merchantId !== session.merchantId) {
      return { error: "SECURITY_ALERT: Unauthorized_Node_Targeting" };
    }

    // 🧪 ATOMIC PERSISTENCE: Transactional Uniqueness check
    await prisma.$transaction(async (tx) => {
      const existing = await tx.coupon.findFirst({
        where: { code, merchantId, isActive: true },
      });

      if (existing) throw new Error("COLLISION_DETECTED");

      await tx.coupon.create({
        data: {
          merchantId,
          serviceId: (serviceId === "global" || !serviceId) ? null : serviceId,
          code,
          discountType,
          amount, // Automatic Decimal(20,8) conversion
          maxUses,
          currentUses: 0,
          isActive: true,
        },
      });
    });

    revalidatePath("/dashboard/coupons");
    return { success: true, message: "PROMOTION_NODE_DEPLOYED" };

  } catch (error: any) {
    console.error("COUPON_ACTION_ERROR:", error);
    if (error.message === "COLLISION_DETECTED") {
      return { error: "CONFIGURATION_COLLISION: Code_Already_Active" };
    }
    return { error: "CRITICAL_DEPLOYMENT_FAILURE" };
  }
}

/**
 * 🔒 REVOKE_COUPON_ACTION
 * Strategy: Targeted Terminal Revocation.
 */
export async function revokeCouponAction(couponId: string) {
  try {
    const session = await getSession();
    if (!session) return { error: "SECURITY_ALERT: Unauthorized" };

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
    return { error: "NODE_ERROR: Could_Not_Terminate_Promotion" };
  }
}