"use server"

import { getSession } from "@/lib/auth/session"
import { MerchantService } from "@/lib/services/merchant.service"
import { revalidatePath } from "next/cache"

/**
 * 🛰️ CREATE COUPON ACTION
 * Logic: Synchronized with Universal Identity. Supports Staff & Merchant nodes.
 * Validation: Ensures cryptographic code uniqueness within the merchant cluster.
 */
export async function createCouponAction(formData: FormData) {
  // 1. IDENTITY HANDSHAKE
  const session = await getSession();

  // Security Barrier: Check for valid session and role clearance
  if (!session || (!session.isStaff && !session.merchantId)) {
    throw new Error("UNAUTHORIZED: Identity node signature missing or invalid.");
  }

  // 2. DATA EXTRACTION & NORMALIZATION
  const code = formData.get("code") as string
  const type = formData.get("type") as "PERCENTAGE" | "FIXED"
  const value = parseFloat(formData.get("value") as string)
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null
  const expiresAt = formData.get("expiresAt") as string
  
  // Resolve Target Merchant: Prioritize merchantId from session, fall back to form (for Staff)
  const targetMerchantId = session.isStaff 
    ? (formData.get("merchantId") as string) || session.merchantId 
    : session.merchantId;

  if (!targetMerchantId) {
    throw new Error("VALIDATION_ERROR: Target merchant node not identified.");
  }

  // 3. DATABASE COMMIT
  await MerchantService.createCoupon(targetMerchantId, {
    code: code.toUpperCase().trim(),
    type,
    value,
    maxUses,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    isActive: true
  })

  // 4. CACHE REVALIDATION
  revalidatePath("/dashboard/coupons")
  revalidatePath("/dashboard")
  
  return { success: true }
}