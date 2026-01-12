import type { NextRequest } from "next/server"
import { withAuth, type AuthenticatedRequest, type AuthContext } from "@/lib/auth/middleware"
import { UserService } from "@/lib/services/user.service"
import { successResponse, serverError } from "@/lib/utils/api-response"

export async function GET(request: NextRequest) {
  // 1. Debug log to verify if the client is sending ANY headers
  const authHeader = request.headers.get("authorization");
  console.log("[Payments Auth] Header present:", !!authHeader);

  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      // 2. Log user context to ensure the middleware passed the correct user
      console.log("[Payments] Fetching history for User:", context.user.userId);

      const { searchParams } = new URL(request.url)
      const limit = Number.parseInt(searchParams.get("limit") || "20", 10)

      const payments = await UserService.getPaymentHistory(context.user.userId, limit)

      return successResponse({
        payments: payments.map((p) => ({
          id: p.id,
          // Prisma Decimals must be converted to strings for JSON
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
      console.error("[Payments] Service Error:", error)
      return serverError()
    }
  })
}