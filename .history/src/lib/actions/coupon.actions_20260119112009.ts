"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session"; 
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Enums
import { DiscountType, Prisma } from "@/generated/prisma";
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: v2026.1.19 Alignment
 * Fix: Synchronized Zod enum to match Prisma's mapped lowercase values.
 */
const CouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase().trim(),
  // ✅ FIX: Zod now expects the values exactly as Prisma defines them
  discountType: z.nativeEnum(DiscountType), 
  amount: z.number().min(0.01).max(1000000), 
  maxUses: z.number().int().positive().nullable().optional(),
  merchantId: z.string().uuid(),
  serviceId: z.string().uuid().optional().nullable(),
}).refine(data => {
  if (data.discountType === DiscountType.PERCENTAGE && data.amount > 100) return false;
  return true;
}, {
  message: "PERCENTAGE_OVERFLOW",
  path: ["amount"]
});

/**
 * 🌊 CREATE_COUPON_ACTION (Institutional Apex v2026.1.20)
 * Logic: Atomic persistence with strict Enum synchronization.
 */
export async function createCouponAction(prevState: any, formData: FormData) {
  try {
    const session = await getSession();
    
    // 🛡️ IDENTITY HANDSHAKE
    if (!session || (!session.isStaff && !session.merchantId)) {
      return { error: "SECURITY_ALERT: Unauthorized_Identity_Node" };
    }

    // ⚙️ DATA INGRESS
    // Map the form string to the proper Enum member
    const rawDiscountType = formData.get("discountType") as string;
    const discountType = rawDiscountType === "FIXED" ? DiscountType.FIXED : DiscountType.PERCENTAGE;

    const rawData = {
      code: formData.get("code"),
      discountType: discountType,
      amount: Number(formData.get("amount")),
      maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : null,
      merchantId: formData.get("merchantId") || session.merchantId,
      serviceId: formData.get("serviceId"),
    };

    const validated = CouponSchema.safeParse(rawData);
    if (!validated.success) {
      return { error: "VALIDATION_PROTOCOL_FAILED", issues: validated.error.flatten() };
    }

    const { code, amount, maxUses, merchantId, serviceId } = validated.data;

    // 🛡️ RBAC CONTEXT GUARD
    if (!session.isStaff && merchantId !== session.merchantId) {
      return { error: "SECURITY_ALERT: Unauthorized_Node_Targeting" };
    }

    // 🧪 ATOMIC PERSISTENCE
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
          // ✅ FIX: Using the validated Enum member (maps to lowercase in DB)
          discountType: validated.data.discountType,
          amount,
          maxUses,
          currentUses: 0,
          isActive: true,
        },
      });
    });

    // 🏛️ ATOMIC CACHE REVALIDATION
    // Fix: Provided mandatory second argument "default" for Next.js 15
    revalidateTag("catalog_node", "default");
    
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

    revalidateTag("catalog_node", "default");
    
    return { success: true, message: "PROMOTION_NODE_TERMINATED" };

  } catch (error) {
    return { error: "NODE_ERROR: Could_Not_Terminate_Promotion" };
  }
}