import { NextRequest } from "next/server";
import {
  withAuth,
  type AuthenticatedRequest,
  type AuthContext,
} from "@/lib/auth/api-"; // 🚀 Ensure this path matches your lib location
import { getUserSubscriptions } from "@/lib/services/user.service";
import { successResponse, serverError } from "@/lib/utils/api-response";

/**
 * 🛰️ GET: ACTIVE USER SUBSCRIPTIONS (Institutional v12.17.0)
 * Logic: Polymorphic Identity Ingress (Bearer Support for Safari 2026).
 * Purpose: Retrieves live service nodes associated with the authenticated identity.
 */
export async function GET(request: NextRequest) {
  // 🛡️ TELEMETRY: The wrapper now handles the complex header/cookie extraction.
  // We wrap the entire logic in withAuth to support the Hybrid Recovery Protocol.
  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const userId = context.user.userId;
      
      // 🕵️ AUDIT LOG: Verify identity node recovery
      const authHeader = request.headers.get("authorization");
      console.log(`[Subs_Sync] Protocol: ${authHeader ? 'BEARER' : 'COOKIE'} | Node: ${userId}`);

      // 1. DATABASE HANDSHAKE (Optimized via Phase 2 Indexes)
      // This call will now benefit from the platform_subscriptions_user_id_idx
      const subscriptions = await getUserSubscriptions(userId);

      // 2. SANITIZED EGRESS
      // Architecture: String-safe serialization for BigInt/Decimal resilience.
      const response = successResponse({
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
                price: sub.serviceTier.price, 
              }
            : null,
          merchant: sub.merchant ? {
            id: sub.merchant.id,
            companyName: sub.merchant.companyName,
            botUsername: sub.merchant.botUsername
          } : null,
        })),
      });

      // 🏗️ SECURITY: Allow credentials for cross-origin TMA requests
      response.headers.set("Access-Control-Allow-Credentials", "true");
      
      return response;

    } catch (error: any) {
      console.error("🔥 [Subscriptions_API_Failure]:", error.message);
      return serverError("SUBSCRIPTION_FETCH_FAILED");
    }
  });
}