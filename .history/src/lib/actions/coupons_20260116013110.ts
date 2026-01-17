"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: v2.0.0 Alignment
 */
const CouponSchema = z.object({
  code: z.string().min(3).max(16).toUpperCase().trim(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]), // Aligned to Schema Enum
  amount: z.number().positive(), // Aligned to Schema Field
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  targetMerchantId: z.string().uuid(),
  serviceId: z.string().uuid().nullable().optional(), // Added for Schema compatibility
}).refine(data => {
  if (data.discountType === "PERCENTAGE" && data.amount > 100) return false;
  return true;
}, {
  message: "PERCENTAGE_VALUE_OVERFLOW",
  path: ["amount"]
});

export async function createCouponAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "UNAUTHORIZED" };

    // 🚀 TACTICAL FIX: Staff/SuperAdmin Handshake
    // If Staff is creating a coupon, we must ensure targetMerchantId is a valid UUID.
    // If they didn't select a merchant, we need a fallback or an error.
    const rawData = {
      code: formData.get("code"),
      discountType: formData.get("type"), // Mapping "type" from form to "discountType"
      amount: Number(formData.get("value")), // Mapping "value" from form to "amount"
      maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : null,
      expiresAt: formData.get("expiresAt"),
      serviceId: formData.get("serviceId") || null,
      targetMerchantId: formData.get("merchantId") || session.merchantId,
    };

    const validated = CouponSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: "VALIDATION_FAILED", issues: validated.error.flatten() };
    }

    // 🛡️ SECURITY_GUARD
    if (!session.isStaff && validated.data.targetMerchantId !== session.merchantId) {
      return { success: false, error: "SECURITY_VIOLATION" };
    }

    // 3. DATABASE_COMMIT: Using v2.0.0 Field Names
    await prisma.coupon.create({
      data: {
        merchantId: validated.data.targetMerchantId,
        code: validated.data.code,
        discountType: validated.data.discountType,
        amount: validated.data.amount, // Prisma handles Decimal conversion from Number
        maxUses: validated.data.maxUses,
        expiresAt: validated.data.expiresAt ? new Date(validated.data.expiresAt) : null,
        serviceId: validated.data.serviceId,
        isActive: true,
        currentUses: 0 // Explicitly initializing
      }
    });

    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error: any) {
    console.error("COUPON_CREATION_FAILED:", error);
    return { success: false, error: "INTERNAL_NODE_FAILURE" };
  }
}