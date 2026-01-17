"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session"; 
import { isUUID } from "@/lib/utils/validators";
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: Coupon_Deployment
 * Logic: Enforces strict character constraints and financial boundaries.
 */
const CouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase().trim(),
  discountPercent: z.number().min(1).max(100),
  maxUses: z.number().int().positive().nullable().optional(),
  merchantId: z.string().uuid(),
  serviceId: z.string().optional().nullable(),
});

/**
 * 🌊 CREATE_COUPON_ACTION
 * Architecture: Fail-Fast RBAC with Atomic Uniqueness Protocol.
 */
export async function createCouponAction(prevState: any, formData: FormData) {
  try {
    const session = await getSession();
    
    // 🛡️ SECURITY BARRIER
    if (!session || (!session.isStaff && !session.merchantId)) {
      return { error: "SECURITY_ALERT: Unauthorized_Identity_Node" };
    }

    const rawData = {
      code: formData.get("code"),
      discountPercent: Number(formData.get("discountPercent")),
      maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : null,
      merchantId: formData.get("merchantId") || session.merchantId,
      serviceId: formData.get("serviceId"),
    };

    const validated = CouponSchema.safeParse(rawData);
    if (!validated.success) {
      return { error: "VALIDATION_PROTOCOL_FAILED", issues: validated.error.flatten() };
    }

    const { code, discountPercent, maxUses, merchantId, serviceId } = validated.data;

    // 🛡️ RBAC CONTEXT GUARD
    if (!session.isStaff && merchantId !== session.merchantId) {
      return { error: "SECURITY_ALERT: Unauthorized_Node_Targeting" };
    }

    // 🧪 ATOMIC UNIQUENESS PROTOCOL
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
          discountPercent,
          maxUses,
          isActive: true,
        },
      });
    });

    revalidatePath("/dashboard/coupons");
    return { success: true, message: "PROMOTION_NODE_DEPLOYED" };

  } catch (error: any) {
    if (error.message === "COLLISION_DETECTED") {
      return { error: "CONFIGURATION_COLLISION: Code_Already_Active" };
    }
    return { error: "CRITICAL_DEPLOYMENT_FAILURE" };
  }
}

/**
 * 🔒 REVOKE_COUPON_ACTION
 * Logic: Targeted Terminal Revocation.
 */
export async function revokeCouponAction(couponId: string) {
  try {
    const session = await getSession();
    if (!session) return { error: "SECURITY_ALERT: Unauthorized" };

    // 🛡️ SCOPED TERMINATION
    // Logic: Ensures merchants can only terminate codes within their own cluster.
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