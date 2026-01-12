import { NextRequest } from "next/server"
import { validateTelegramInitData, createJWT } from "@/lib/auth/telegram"
// ✅ FIXED: Using named function import for Turbopack compatibility
import { findOrCreateFromTelegram } from "@/lib/services/user.service"
import { successResponse, errorResponse, validationError } from "@/lib/utils/api-response"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { initData } = body

    if (!initData) {
      return validationError("initData is required")
    }

    // 🛡️ 1. TELEGRAM HANDSHAKE
    const validated = validateTelegramInitData(initData)

    if (!validated || !validated.user) {
      return errorResponse("Invalid Telegram authentication", 401)
    }

    // 👤 2. IDENTITY SYNC
    // Using the named function refactored for role-awareness
    const user = await findOrCreateFromTelegram(validated.user)

    /**
     * 🔐 3. JWT GENERATION
     * FIXED: Removed Number() cast for telegramId. 
     * We keep it as a string to support 64-bit Telegram IDs.
     */
    const token = await createJWT({
      telegramId: user.telegramId, // String-safe
      userId: user.id,
      role: user.role,
      merchantId: user.merchantProfile?.id || null, // Standardized fallback
    })

    // 🚀 4. REFINED RESPONSE
    return successResponse({
      token,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        merchant: user.merchantProfile
          ? {
              id: user.merchantProfile.id,
              companyName: user.merchantProfile.companyName,
              planStatus: user.merchantProfile.planStatus,
            }
          : null,
      },
    })
  } catch (error) {
    console.error("[Auth_Gate_Crash]:", error)
    return errorResponse("Identity synchronization failed", 500)
  }
}