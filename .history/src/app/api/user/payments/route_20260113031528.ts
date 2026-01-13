import { NextRequest } from "next/server";
import {
  withAuth,
  type AuthenticatedRequest,
  type AuthContext,
} from "@/lib/auth/auth"; // 🚀 Unified Institutional Wrapper
import { getUserPayments } from "@/lib/services/user.service";
import { successResponse, serverError } from "@/lib/utils/api-response";

/**
 * 🏦 GET: USER PAYMENT HISTORY (Institutional v12.19.0)
 * Logic: Polymorphic Ingress (Bearer Recovery Support).
 * Purpose: Retrieves the authenticated user's financial ledger nodes.
 */
export async function GET(request: NextRequest) {
  // 🛡️ AUTHENTICATION WRAPPER
  // Logic: Prioritizes Bearer (Recovery) > Cookie (Standard).
  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const userId = context.user.userId;
      
      // 🕵️ TELEMETRY: Trace session node ingress
      const authHeader = request.headers.get("authorization");
      console.log(`[Payments_Sync] Ingress: ${authHeader ? 'BEARER' : 'COOKIE'} | Node: ${userId}`);

      // 1. EXTRACTION & LIMITING
      const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20", 10), 100);

      // 2. DATABASE HANDSHAKE
      // Optimized: Benefiting from indexed user_id lookups for financial records.
      const payments = await getUserPayments(userId, limit);

      // 3. SANITIZED EGRESS
      // Architecture: Decimal and BigInt safe serialization via service layer.
      const response = successResponse({
        payments: payments.map((p: any) => ({
          id: p.id,
          amount: p.amount, 
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

      // 🏗️ SECURITY & TUNNEL HEADERS
      // Mandatory for cross-origin TMA persistence and Ngrok/Cloudflare stability.
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
      response.headers.set("ngrok-skip-browser-warning", "true");

      return response;

    } catch (error: any) {
      console.error("🔥 [Payments_API_Failure]:", error.message);
      return serverError("PAYMENT_LEDGER_SYNC_FAILED");
    }
  });
}