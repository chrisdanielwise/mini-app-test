import type { NextRequest } from "next/server"
import { validateTelegramInitData, createJWT } from "@/src/lib/auth/telegram"
import { UserService } from "@/src/lib/services/user.service"
import { successResponse, errorResponse, validationError } from "@/src/lib/utils/api-response"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { initData } = body

    if (!initData) {
      return validationError("initData is required")
    }

    // Validate Telegram initData
    const validated = validateTelegramInitData(initData)

    if (!validated || !validated.user) {
      return errorResponse("Invalid Telegram authentication", 401)
    }

    // Find or create user
    const user = await UserService.findOrCreateFromTelegram(validated.user)

    // Create JWT
    const token = await createJWT({
      telegramId: Number(user.telegramId),
      userId: user.id,
      role: user.role,
      merchantId: user.merchantProfile?.id,
    })

    return successResponse({
      token,
      user: {
        id: user.id,
        telegramId: user.telegramId.toString(),
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
    console.error("[Auth] Error:", error)
    return errorResponse("Authentication failed", 500)
  }
}
