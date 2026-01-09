import type { NextRequest } from "next/server"
import { withAuth, type AuthenticatedRequest, type AuthContext } from "@/lib/auth/middleware"
import { UserService } from "@/lib/services/user.service"
import { successResponse, serverError } from "@/lib/utils/api-response"

export async function GET(request: NextRequest) {
  // Added logging to see what the server is receiving
  const authHeader = request.headers.get("authorization");
  console.log("[Auth Check] Incoming Authorization Header:", authHeader ? "Present" : "Missing");

  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      // If we reach this point, auth was successful
      console.log("[Subscriptions] Auth successful for user:", context.user.userId);
      
      const subscriptions = await UserService.getActiveSubscriptions(context.user.userId)

      return successResponse({
        subscriptions: subscriptions.map((sub) => ({
          id: sub.id,
          status: sub.status,
          startsAt: sub.startsAt,
          expiresAt: sub.expiresAt,
          inviteLink: sub.inviteLink,
          service: {
            id: sub.service.id,
            name: sub.service.name,
            description: sub.service.description,
          },
          tier: sub.serviceTier
            ? {
                id: sub.serviceTier.id,
                name: sub.serviceTier.name,
                price: sub.serviceTier.price.toString(),
              }
            : null,
          merchant: sub.merchant,
        })),
      })
    } catch (error) {
      console.error("[Subscriptions] Service Error:", error)
      return serverError()
    }
  })
}