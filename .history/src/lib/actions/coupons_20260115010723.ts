"use server";

import { getSession } from "@/lib/auth/session";
import { MerchantService } from "@/lib/services/merchant.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/**
 * 🛡️ PROTOCOL SCHEMA: Coupon_Provisioning
 * Enforces strict casing and value constraints for financial integrity.
 */
const CouponSchema = z.object({
  code: z.string().min(3).max(16).toUpperCase().transform(s => s.trim()),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  maxUses: z.number().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  targetMerchantId: z.string().uuid(),
});

/**
 * 🌊 CREATE_COUPON_ACTION (v16.16.12)
 * Logic: Multi-tenant RBAC validation with Synchronized Cache Invalidation.
 * Security: Staff-Oversight bypass logic for cross-merchant provisioning.
 */
export async function createCouponAction(formData: FormData) {
  try {
    // 1. IDENTITY HANDSHAKE
    const session = await getSession();

    if (!session || (!session.isStaff && !session.merchantId)) {
      return { success: false, error: "UNAUTHORIZED_IDENTITY_NODE" };
    }

    // 2. DATA CALIBRATION
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
      return { 
        success: false, 
        error: "VALIDATION_PROTOCOL_FAILED", 
        issues: validated.error.flatten() 
      };
    }

    const data = validated.data;

    // 🛡️ SECURITY GUARD: RBAC Context Enforcement
    // Prevents non-staff merchants from targeting other node IDs.
    if (!session.isStaff && data.targetMerchantId !== session.merchantId) {
      return { success: false, error: "SECURITY_VIOLATION: UNAUTHORIZED_TARGET" };
    }

    // 3. DATABASE COMMIT (Atomic Handshake)
    await createCoupon(data.targetMerchantId, {
      code: data.code,
      type: data.type,
      value: data.value,
      maxUses: data.maxUses,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: true
    });

    // 4. CACHE REVALIDATION (Water Design Flow)
    // Revalidating the entire layout ensures the sidebar/counters update immediately.
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/coupons");

    return { 
      success: true, 
      message: "PROMOTION_NODE_DEPLOYED_SUCCESSFULLY" 
    };

  } catch (error: any) {
    console.error("🚨 [Protocol_Error] Coupon_Creation_Failed:", error);
    return { 
      success: false, 
      error: "INTERNAL_NODE_FAILURE", 
      message: error.message 
    };
  }
}