import type { NextRequest } from "next/server"
import { withAuth, type AuthenticatedRequest, type AuthContext } from "@/lib/auth/middleware"
import { UserService } from "@/lib/services/user.service"
import { successResponse, serverError } from "@/lib/utils/api-response"

export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const { searchParams } = new URL(request.url)
      const limit = Number.parseInt(searchParams.get("limit") || "20", 10)

      const payments = await UserService.getPaymentHistory(context.user.userId, limit)

      return successResponse({
        payments: payments.map((p) => ({
          id: p.id,
          amount: p.amount.toString(),
          currency: p.currency,
          status: p.status,
          gatewayProvider: p.gatewayProvider,
          createdAt: p.createdAt,
          service: p.service,
          merchant: p.merchant,
        })),
      })
    } catch (error) {
      console.error("[Payments] Error:", error)
      return serverError()
    }
  })
}
