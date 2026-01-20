"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { CACHE_PROFILES } from "@/lib/auth/config";
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Enums and Types
import { DiscountType, Prisma } from "@/generated/prisma";
// ✅ CORRECTED DECIMAL PATH
import { Decimal } from "@prisma/client-runtime-utils";
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: v2026.1.19 Alignment
 * Fix: Synchronized Zod enum to match Prisma's mapped lowercase values.
 */
const CouponSchema = z.object({
  code: z.string().min(3).max(16).toUpperCase().trim(),
  // ✅ FIX: Use the native enum to match @map("percentage") and @map("fixed")
  discountType: z.nativeEnum(DiscountType),
  amount: z.number().positive(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  targetMerchantId: z.string().uuid(),
  serviceId: z.string().uuid().nullable().optional(),
}).refine(data => {
  if (data.discountType === DiscountType.PERCENTAGE && data.amount > 100) return false;
  return true;
}, {
  message: "PERCENTAGE_VALUE_OVERFLOW",
  path: ["amount"]
});

/**
 * 🌊 CREATE_COUPON_ACTION (Institutional Apex v2026.1.20)
 * Logic: Atomic persistence with strict Enum synchronization.
 */
export async function createCouponAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "UNAUTHORIZED_IDENTITY" };

    // ⚙️ DATA INGRESS & MAPPING
    // Logic: Standardizes form strings to proper Enum members
    const rawType = formData.get("type") as string;
    const discountType = rawType === "FIXED" ? DiscountType.FIXED : DiscountType.PERCENTAGE;

    const rawData = {
      code: formData.get("code"),
      discountType: discountType, 
      amount: Number(formData.get("value")),
      maxUses: formData.get("maxUses") ? Number(formData.get("maxUses")) : null,
      expiresAt: formData.get("expiresAt"),
      serviceId: formData.get("serviceId") || null,
      targetMerchantId: formData.get("merchantId") || session.merchantId,
    };

    const validated = CouponSchema.safeParse(rawData);
    if (!validated.success) {
      return { 
        success: false, 
        error: "VALIDATION_FAILED", 
        issues: validated.error.flatten().fieldErrors 
      };
    }

    // 🛡️ SECURITY_GUARD: Role-Based Access Enforcement
    if (!session.isStaff && validated.data.targetMerchantId !== session.merchantId) {
      return { success: false, error: "SECURITY_VIOLATION: UNAUTHORIZED_TARGET" };
    }

    // 🏛️ DATABASE_COMMIT
    await prisma.coupon.create({
      data: {
        merchantId: validated.data.targetMerchantId,
        code: validated.data.code,
        // ✅ FIX: Enum member satisfies the "percentage" | "fixed" string type
        discountType: validated.data.discountType,
        amount: validated.data.amount,
        maxUses: validated.data.maxUses,
        expiresAt: validated.data.expiresAt ? new Date(validated.data.expiresAt) : null,
        serviceId: (validated.data.serviceId === "global" || !validated.data.serviceId) ? null : validated.data.serviceId,
        isActive: true,
        currentUses: 0
      }
    });

    // 🏛️ ATOMIC CACHE REVALIDATION
    // Fix: Provided mandatory second argument "default" for Next.js 15 compliance
    revalidateTag("catalog_node", "default");

    return { success: true };
  } catch (error: any) {
    console.error("🔥 [Coupon_Protocol_Failure]:", error);
    return { success: false, error: "INTERNAL_NODE_FAILURE" };
  }
}