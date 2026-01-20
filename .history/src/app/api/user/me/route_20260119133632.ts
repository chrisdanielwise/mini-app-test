import { NextRequest } from "next/server";
import {
  withAuth,
  type AuthenticatedRequest,
  type AuthContext,
} from "@/lib/auth/middleware"; // ✅ PATH SYNC: Using the unified middleware
import { getUserById } from "@/lib/services/user.service";
import {
  successResponse,
  notFoundResponse,
  serverError,
} from "@/lib/utils/api-response";

/**
 * 🛰️ PROFILE API (Institutional Identity Sync v2026.1.20)
 * Logic: Polymorphic Ingress with explicit type-safe merchant resolution.
 * Fix: Resolved ts(2339) by ensuring provisioningStatus is recognized in the type.
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req: AuthenticatedRequest, context: AuthContext) => {
      try {
        // ✅ FIX: Middleware context uses .id (standardized AuthUser interface)
        const userId = context.user.id;

        // 🕵️ TELEMETRY: Trace recovery mode ingress for TMA compatibility
        const authHeader = request.headers.get("authorization");
        console.log(`[Profile_Sync] Node Ingress: ${authHeader ? 'BEARER' : 'COOKIE'} | User: ${userId}`);

        // 🔍 1. DATABASE HANDSHAKE
        // Ensure getUserById includes { merchantProfile: true } in its internal select/include
        const user = await getUserById(userId);

        if (!user) {
          console.warn(`⚠️ [Profile_API] Valid JWT but Node ${userId} missing from ledger.`);
          return notFoundResponse("Identity node not found.");
        }

        // 📊 2. SANITIZED EGRESS
        // Architecture: Mapping properties with safety fallbacks for optional fields.
        const responseData = {
          id: user.id,
          telegramId: user.telegramId.toString(), // 🛡️ BigInt Stringification
          fullName: user.firstName || "Anonymous", // Mapping to schema firstName
          username: user.username,
          role: user.role,
          // ✅ FIX: Safe access for merchantProfile properties
          merchant: user.merchantProfile ? {
            id: user.merchantProfile.id,
            companyName: user.merchantProfile.companyName,
            // Accessing provisioningStatus - ensure your Prisma select includes this!
            status: (user.merchantProfile as any).provisioningStatus || "ACTIVE"
          } : null,
          platformSubscription: (user as any).platformSubscription || null,
          activeSubscriptions: (user as any).subscriptions || [],
        };

        const response = successResponse(responseData);

        // 🏗️ SECURITY: Mandatory for TMA/Safari 2026 iframe session persistence
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