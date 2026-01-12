import type { NextRequest } from "next/server";
import {
  withAuth,
  type AuthenticatedRequest,
  type AuthContext,
} from "@/src/lib/auth/middleware";
import { UserService } from "@/src/lib/services/user.service";
import {
  successResponse,
  notFoundResponse,
  serverError,
} from "@/src/lib/utils/api-response";

export async function GET(request: NextRequest) {
  // Debug log: verify if the request is even sending an auth header
  const hasAuth = !!request.headers.get("authorization");
  console.log("[Profile API] Authorization header present:", hasAuth);

  return withAuth(
    request,
    async (req: AuthenticatedRequest, context: AuthContext) => {
      try {
        // If we are here, context.user.userId exists and is verified
        const user = await UserService.getById(context.user.userId);

        if (!user) {
          console.warn(
            "[Profile API] Auth passed but user ID not found in database:",
            context.user.userId
          );
          return notFoundResponse("User not found");
        }

        return successResponse({
          id: user.id,
          // Using .toString() here is correct because BigInt/Decimals
          // cause JSON serialization errors in Next.js
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
        });
      } catch (error) {
        console.error("[Profile API] Error fetching user:", error);
        return serverError();
      }
    }
  );
}
