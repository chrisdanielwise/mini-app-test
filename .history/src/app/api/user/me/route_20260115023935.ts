import { NextRequest } from "next/server";
// import {
//   withAuth,
//   type AuthenticatedRequest,
//   type AuthContext,
// } from "@/lib/auth/wrappers"; // 🛰️ Updated: Using Institutional Wrapper
import { getUserById } from "@/lib/services/user.service";
import {
  successResponse,
  notFoundResponse,
  serverError,
} from "@/lib/utils/api-response";

/**
 * 🛰️ PROFILE API (Identity Sync v12.18.0)
 * Logic: Polymorphic Ingress (Bearer Support for Safari 2026).
 * Purpose: Retrieves the full verified node for the authenticated user identity.
 */
export async function GET(request: NextRequest) {
  // 🛡️ AUTHENTICATION WRAPPER
  // Handles the Cookie-to-Bearer fallback logic automatically.
  return withAuth(
    request,
    async (req: AuthenticatedRequest, context: AuthContext) => {
      try {
        const userId = context.user.userId;

        // 🕵️ TELEMETRY: Trace recovery mode ingress
        const authHeader = request.headers.get("authorization");
        console.log(`[Profile_Sync] Node Ingress: ${authHeader ? 'BEARER' : 'COOKIE'} | User: ${userId}`);

        // 🔍 1. DATABASE HANDSHAKE
        // Optimized: Now hits the indexed 'users_pkey' for near-instant resolution.
        const user = await getUserById(userId);

        if (!user) {
          console.warn(`⚠️ [Profile_API] Valid JWT provided but Node ${userId} is missing from the ledger.`);
          return notFoundResponse("Identity node not found.");
        }

        // 📊 2. SANITIZED EGRESS
        // Architecture: BigInt/Decimal safe serialization via service layer.
        const response = successResponse({
          id: user.id,
          telegramId: user.telegramId, // Stringified BigInt
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          language: user.language,
          merchant: user.merchantProfile ? {
            id: user.merchantProfile.id,
            companyName: user.merchantProfile.companyName,
            status: user.merchantProfile.provisioningStatus
          } : null,
          platformSubscription: user.platformSubscription,
          activeSubscriptions: user.subscriptions || [],
        });

        // 🏗️ SECURITY: Mandatory for TMA/Safari iframe session persistence
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
        response.headers.set("ngrok-skip-browser-warning", "true");

        return response;
      } catch (error: any) {
        console.error("🔥 [Profile_API_Failure]:", error.message);
        return serverError("IDENTITY_FETCH_FAILED");
      }
    }
  );
}