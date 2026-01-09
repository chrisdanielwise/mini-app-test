import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyJWT } from "@/lib/auth/telegram"
import { MerchantService } from "@/lib/services/merchant.service"
import { isUUID } from "@/lib/utils/validators" // Assuming you created the validator utility

export interface MerchantSession {
  user: {
    telegramId: bigint
    fullName: string
    username?: string
  }
  merchant: {
    id: string
    companyName: string
    planId?: string
  }
}

export async function getMerchantSession(): Promise<MerchantSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("merchant_token")?.value

  if (!token) {
    return null
  }

  try {
    const payload = verifyJWT(token)
    
    // 1. Validate payload presence and UUID format
    // This prevents MerchantService.getById from crashing on invalid JWT data
    if (!payload || !payload.merchantId || !isUUID(payload.merchantId)) {
      return null
    }

    const merchant = await MerchantService.getById(payload.merchantId)
    if (!merchant) {
      return null
    }

    return {
      user: {
        // 2. Explicit BigInt conversion for Telegram IDs
        telegramId: BigInt(payload.telegramId),
        fullName: payload.fullName,
        username: payload.username,
      },
      merchant: {
        id: merchant.id,
        companyName: merchant.companyName,
        planId: merchant.planId || undefined,
      },
    }
  } catch (error) {
    // 3. Log the error internally for debugging while returning null to the UI
    console.error("[Session] Verification failed:", error)
    return null
  }
}

export async function requireMerchantSession(): Promise<MerchantSession> {
  const session = await getMerchantSession()
  if (!session) {
    // Standard Next.js server-side redirect
    redirect("/dashboard/login")
  }
  return session
}