import { NextRequest } from "next/server";
import {
  withAuth,
  type AuthenticatedRequest,
  type AuthContext,
} from "@/lib/auth/api-wrappers";
// ✅ FIXED: Using named function imports for Turbopack resolution
import { getUserPayments } from "@/lib/services/user.service";
import { successResponse, serverError } from "@/lib/utils/api-response";

/**
 * 🏦 GET: USER PAYMENT HISTORY
 * Logic: Retrieves the authenticated user's financial ledger nodes.
 */
export async function GET(request: NextRequest) {
  // 🛰️ TELEMETRY: Verify authorization ingress
  const authHeader = request.headers.get("authorization");
  console.log("[Payments_Auth] Handshake present:", !!authHeader);

  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const userId = context.user.userId;
      
      // 1. EXTRACTION & LIMITING
      const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20", 10), 100);

      console.log(`[Payments_Sync] Fetching ledger for User Node: ${userId}`);

      // 2. DATABASE HANDSHAKE
      // Using refactored getUserPayments which handles internal sanitization
      const payments = await getUserPayments(userId, limit);

      // 3. SANITIZED EGRESS
      // BigInt and Decimal values are pre-processed by the service layer.
      return successResponse({
        payments: payments.map((p: any) => ({
          id: p.id,
          amount: p.amount, // Already stringified by service
          currency: p.currency,
          status: p.status,
          gatewayProvider: p.gatewayProvider,
          createdAt: p.createdAt,
          service: p.service ? {
            id: p.service.id,
            name: p.service.name
          } : null,
          merchant: p.merchant ? {
            id: p.merchant.id,
            companyName: p.merchant.companyName
          } : null,
        })),
      });
    } catch (error: any) {
      console.error("🔥 [Payments_API_Failure]:", error.message);
      return serverError();
    }
  });
}