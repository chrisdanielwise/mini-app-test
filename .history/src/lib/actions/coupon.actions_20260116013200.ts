"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session"; 
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: v2.0.0 Alignment
 * Fix: Map 'discountPercent' to 'amount' and add 'discountType'.
 */
const CouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase().trim(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]), 
  amount: z.number().min(1).max(1000000), // Supports both % and Fixed values
  maxUses: z.number().int().positive().nullable().optional(),
  merchantId: z.string().uuid(),
  serviceId: z.string().uuid().optional().nullable(),
}).refine(data => {
  // 🛡️ Financial Boundary: Percentages cannot exceed 100
  if (data.discountType === "PERCENTAGE" && data.amount > 100) return false;
  return true;
}, {
  message: "PERCENTAGE_OVERFLOW",
  path: ["amount"]
});

/**
 * 🌊 CREATE_COUPON_ACTION (Institutional v16.31.28)
 */
export async function createCouponAction(prevState: any, formData: FormData) {
  try {
    const session = await getSession();
    
    if (!session || (!session.isStaff && !session.merchantId)) {
      return { error: "SECURITY_ALERT: Unauthorized_Identity_Node" };
    }

    const rawData = {
      code: formData.get("code"),
      discountType: formData.get("discountType") || "PERCENTAGE", // Ingress check
      amount: Number(formData.get("amount") || formData.get("discountPercent")),
      maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : null,
      merchantId: formData.get("merchantId") || session.merchantId,
      serviceId: formData.get("serviceId"),
    };

    const validated = CouponSchema.safeParse(rawData);
    if (!validated.success) {
      return { error: "VALIDATION_PROTOCOL_FAILED", issues: validated.error.flatten() };
    }

    const { code, discountType, amount, maxUses, merchantId, serviceId } = validated.data;

    // 🛡️ RBAC CONTEXT GUARD
    if (!session.isStaff && merchantId !== session.merchantId) {
      return { error: "SECURITY_ALERT: Unauthorized_Node_Targeting" };
    }

    // 🧪 ATOMIC PERSISTENCE
    await prisma.$transaction(async (tx) => {
      // Uniqueness check scoped to merchant
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
          amount, // Prisma handles conversion to @db.Decimal(20, 8)
          maxUses,
          currentUses: 0, // Ensure initialization
          isActive: true,
        },
      });
    });

    revalidatePath("/dashboard/coupons");
    return { success: true, message: "PROMOTION_NODE_DEPLOYED" };

  } catch (error: any) {
    console.error("COUPON_DEPLOYMENT_ERROR:", error);
    if (error.message === "COLLISION_DETECTED") {
      return { error: "CONFIGURATION_COLLISION: Code_Already_Active" };
    }
    return { error: "CRITICAL_DEPLOYMENT_FAILURE" };
  }
}