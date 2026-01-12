"use server"

import { requireMerchantSession } from "@/lib/auth/merchant-session"
import { MerchantService } from "@/lib/services/merchant.service"
import { revalidatePath } from "next/cache"

export async function updateBotConfigAction(formData: FormData) {
  const session = await requireMerchantSession()
  
  const botToken = formData.get("botToken") as string
  const botUsername = formData.get("botUsername") as string

  // Update in database
  await MerchantService.update(session.merchant.id, {
    botToken,
    botUsername: botUsername.replace("@", ""), // Strip @ if added by user
  })

  // Note: In a production environment, you would call your 
  // telegram bot service here to set the webhook URL.

  revalidatePath("/dashboard/bot")
}