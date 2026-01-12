"use server"

// 🛡️ Updated to the Universal Session Helper
import { requireAuth } from "@/lib/auth/session" 
import { MerchantService, updateMerchant } from "@/lib/services/merchant.service"
import { revalidatePath } from "next/cache"

/**
 * 🛰️ UPDATE BOT CONFIGURATION
 * Logic: Synchronized with Multi-Bot Authentication.
 * Security: Validates session and persists the cryptographic Bot Token.
 */
export async function updateBotConfigAction(formData: FormData) {
  // 1. IDENTITY HANDSHAKE
  // We use requireAuth() because it returns the current merchantId context
  const session = await requireAuth()
  
  if (!session.merchantId) {
    throw new Error("UNAUTHORIZED: No active merchant context detected.");
  }

  const botToken = formData.get("botToken") as string
  const botUsername = formData.get("botUsername") as string

  if (!botToken || !botUsername) {
    throw new Error("VALIDATION_ERROR: All fields are required.");
  }

  // 2. DATABASE PERSISTENCE
  // We use the merchantId resolved from the verified session
  await updateMerchant(session.merchantId, {
    botToken,
    botUsername: botUsername.replace("@", ""), // Strip @ if added by user
  })

  // 3. CACHE INVALIDATION
  // Ensures the dashboard UI reflects the new configuration immediately
  revalidatePath("/dashboard/settings")
  revalidatePath("/dashboard")
  
  return { success: true }
}