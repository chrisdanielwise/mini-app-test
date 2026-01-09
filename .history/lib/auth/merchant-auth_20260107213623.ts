import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyJWT } from "@/lib/auth/telegram"
import { MerchantService } from "@/lib/services/merchant.service"

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
    if (!payload || !payload.merchantId) {
      return null
    }

    const merchant = await MerchantService.getById(payload.merchantId)
    if (!merchant) {
      return null
    }

    return {
      user: {
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
  } catch {
    return null
  }
}

export async function requireMerchantSession(): Promise<MerchantSession> {
  const session = await getMerchantSession()
  if (!session) {
    redirect("/dashboard/login")
  }
  return session
}
