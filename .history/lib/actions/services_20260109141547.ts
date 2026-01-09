"use server"

import { requireMerchantSession } from "@/lib/auth/merchant-auth"
// import { MerchantService } from "@/lib/services/merchant.service"
import { revalidatePath } from "next/cache"

export async function createServiceAction(formData: FormData) {
  const session = await requireMerchantSession()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = formData.get("price") as string
  const interval = formData.get("interval") as "MONTHLY" | "YEARLY" | "ONCE"

  await MerchantService.createService(session.merchant.id, {
    name,
    description,
    price, // Prisma handles the Decimal conversion
    interval,
    isActive: true
  })

  revalidatePath("/dashboard/services")
}