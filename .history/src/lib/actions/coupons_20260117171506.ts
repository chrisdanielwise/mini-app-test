"use server";

import prisma from "@/lib/db";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: v2.0.0 Alignment
 */
const CouponSchema = z.object({
  code: z.string().min(3).max(16).toUpperCase().trim(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  amount: z.number().positive(),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  targetMerchantId: z.string().uuid(),
  serviceId: z.string().uuid().nullable().optional(),
}).refine(data => {
  if (data.discountType === "PERCENTAGE" && data.amount > 100) return false;
  return true;
}, {
  message: "PERCENTAGE_VALUE_OVERFLOW",
  path: ["amount"]
});

/**
 * 🌊 CREATE_COUPON_ACTION (v16.16.20 - Hardened)
 * Fix: Replaced revalidatePath with tagged purge for instant cross-node sync.
 */
export async function createCouponAction(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "UNAUTHORIZED_IDENTITY" };

    // ⚙️ DATA INGRESS & MAPPING
    const rawData = {
      code: formData.get("code"),
      discountType: formData.get("type"), 
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
        discountType: validated.data.discountType,
        amount: validated.data.amount,
        maxUses: validated.data.maxUses,
        expiresAt: validated.data.expiresAt ? new Date(validated.data.expiresAt) : null,
        serviceId: validated.data.serviceId,
        isActive: true,
        currentUses: 0
      }
    });

    // 🏛️ ATOMIC CACHE REVALIDATION
    // Profile: CACHE_PROFILES.CONTENT ("static")
    // Requirement: Ensures the promotional node is visible in the Mini App 0ms after creation.
    revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);

    return { success: true };
  } catch (error: any) {
    console.error("🔥 [Coupon_Protocol_Failure]:", error);
    return { success: false, error: "INTERNAL_NODE_FAILURE" };
  }
}