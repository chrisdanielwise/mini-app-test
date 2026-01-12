"use server"

import { requireMerchantSession } from "@/src/lib/auth/merchant-auth"
import { MerchantService } from "@/src/lib/services/merchant.service"
import { revalidatePath } from "next/cache"

export async function createCouponAction(formData: FormData) {
  const session = await requireMerchantSession()
  
  const code = formData.get("code") as string
  const type = formData.get("type") as "PERCENTAGE" | "FIXED"
  const value = parseFloat(formData.get("value") as string)
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null
  const expiresAt = formData.get("expiresAt") as string

  await MerchantService.createCoupon(session.merchant.id, {
    code: code.toUpperCase(),
    type,
    value,
    maxUses,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    isActive: true
  })

  revalidatePath("/dashboard/coupons")
}