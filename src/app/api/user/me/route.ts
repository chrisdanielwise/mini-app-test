import { NextRequest } from "next/server";
import {
  withAuth,
  type AuthenticatedRequest,
  type AuthContext,
} from "@/lib/auth/api-wrappers";
// ✅ FIXED: Using named function imports for Turbopack & Consistency
import { getUserById } from "@/lib/services/user.service";
import {
  successResponse,
  notFoundResponse,
  serverError,
} from "@/lib/utils/api-response";

/**
 * 🛰️ PROFILE API (Identity Sync)
 * Retrieves the full verified node for the authenticated user.
 */
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    async (req: AuthenticatedRequest, context: AuthContext) => {
      try {
        const userId = context.user.userId;

        // 🔍 1. DATABASE HANDSHAKE
        // Using refactored getUserById which includes internal sanitization
        const user = await getUserById(userId);

        if (!user) {
          console.warn(`⚠️ [Profile_API] Valid JWT provided but User ID ${userId} is missing from the ledger.`);
          return notFoundResponse("Identity node not found.");
        }

        // 📊 2. SANITIZED EGRESS
        // We return the sanitized user object directly.
        // BigInt (telegramId) and Decimals are already handled by the service layer.
        return successResponse({
          id: user.id,
          telegramId: user.telegramId, // Already a string from service
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
      } catch (error: any) {
        console.error("🔥 [Profile_API_Failure]:", error.message);
        return serverError();
      }
    }
  );
}