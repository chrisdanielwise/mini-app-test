"use server";

import prisma from "@/lib/db"; // Direct DB ingress for speed
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: Coupon_Provisioning
 * Logic: Financial integrity constraints for percentage vs fixed types.
 */
const CouponSchema = z.object({
  code: z.string().min(3).max(16).toUpperCase().trim(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  targetMerchantId: z.string().uuid(),
}).refine(data => {
  // 🛡️ Financial Guard: Percentages cannot exceed 100%
  if (data.type === "PERCENTAGE" && data.value > 100) return false;
  return true;
}, {
  message: "PERCENTAGE_VALUE_OVERFLOW",
  path: ["value"]
});

/**
 * 🌊 CREATE_COUPON_ACTION
 * Architecture: Fail-Fast RBAC with Atomic Persistence.
 */
export async function createCouponAction(formData: FormData) {
  try {
    // 1. IDENTITY_HANDSHAKE
    const session = await getSession();
    if (!session) return { success: false, error: "UNAUTHORIZED" };

    // 2. DATA_CALIBRATION
    const rawData = {
      code: formData.get("code"),
      type: formData.get("type"),
      value: Number(formData.get("value")),
      maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : null,
      expiresAt: formData.get("expiresAt"),
      targetMerchantId: session.isStaff 
        ? (formData.get("merchantId") as string) || session.merchantId 
        : session.merchantId,
    };

    const validated = CouponSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: "VALIDATION_FAILED", issues: validated.error.flatten() };
    }

    const { targetMerchantId, ...couponData } = validated.data;

    // 🛡️ SECURITY_GUARD: Cross-Merchant Protection
    if (!session.isStaff && targetMerchantId !== session.merchantId) {
      return { success: false, error: "SECURITY_VIOLATION" };
    }

    // 3. DATABASE_COMMIT
    // Logic: Atomic creation using Prisma directly to match your updated services.
    await prisma.coupon.create({
      data: {
        merchantId: targetMerchantId,
        code: couponData.code,
        type: couponData.type,
        value: couponData.value,
        maxUses: couponData.maxUses,
        expiresAt: couponData.expiresAt ? new Date(couponData.expiresAt) : null,
        isActive: true
      }
    });

    // 4. CACHE_REVALIDATION
    revalidatePath("/dashboard/coupons");
    revalidatePath("/dashboard", "layout"); // Update HUD counters
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "INTERNAL_NODE_FAILURE" };
  }
}