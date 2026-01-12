import { NextRequest } from "next/server";
import {
  withAuth,
  type AuthenticatedRequest,
  type AuthContext,
} from "@/lib/auth/api-wrappers";
// ✅ FIXED: Using named function imports for Turbopack & Service Layer consistency
import { getUserSubscriptions } from "@/lib/services/user.service";
import { successResponse, serverError } from "@/lib/utils/api-response";

/**
 * 🛰️ GET: ACTIVE USER SUBSCRIPTIONS
 * Retrieves the live service nodes associated with the authenticated user identity.
 */
export async function GET(request: NextRequest) {
  // 🛰️ TELEMETRY: Monitor authorization ingress
  const authHeader = request.headers.get("authorization");
  console.log("[Subs_Auth] Protocol Header:", authHeader ? "DETECTED" : "MISSING");

  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const userId = context.user.userId;
      console.log(`[Subs_Sync] Fetching active nodes for User: ${userId}`);

      // 1. DATABASE HANDSHAKE
      // Using the refactored named export which performs internal sanitization
      const subscriptions = await getUserSubscriptions(userId);

      // 2. SANITIZED EGRESS
      // Data is pre-sanitized by the service (Decimals and BigInts converted to strings)
      return successResponse({
        subscriptions: subscriptions.map((sub: any) => ({
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
                price: sub.serviceTier.price, // Already stringified in service layer
              }
            : null,
          merchant: sub.merchant ? {
            id: sub.merchant.id,
            companyName: sub.merchant.companyName,
            botUsername: sub.merchant.botUsername
          } : null,
        })),
      });
    } catch (error: any) {
      console.error("🔥 [Subscriptions_API_Failure]:", error.message);
      return serverError();
    }
  });
}