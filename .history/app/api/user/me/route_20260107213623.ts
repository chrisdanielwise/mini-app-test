import type { NextRequest } from "next/server"
import { withAuth, type AuthenticatedRequest, type AuthContext } from "@/lib/auth/middleware"
import { UserService } from "@/lib/services/user.service"
import { successResponse, notFoundResponse, serverError } from "@/lib/utils/api-response"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const user = await UserService.getById(context.user.userId)

      if (!user) {
        return notFoundResponse("User not found")
      }

      return successResponse({
        id: user.id,
        telegramId: user.telegramId.toString(),
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        language: user.language,
        merchant: user.merchantProfile,
        platformSubscription: user.platformSubscription,
        activeSubscriptions: user.subscriptions,
      })
    } catch (error) {
      console.error("[User] Error fetching user:", error)
      return serverError()
    }
  })
}
