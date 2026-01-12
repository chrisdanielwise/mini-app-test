import { NextRequest } from "next/server";
import { withAuth, type AuthenticatedRequest, type AuthContext } from "@/lib/auth/middleware";
// ✅ FIXED: Using named function imports to resolve Turbopack build errors
import { createOrder } from "@/lib/services/order.service";
import { getUserOrders } from "@/lib/services/user.service";
import { 
  successResponse, 
  createdResponse, 
  validationError, 
  serverError, 
  errorResponse 
} from "@/lib/utils/api-response";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ GET: USER ORDER HISTORY
 * Logic: Fetches authenticated user's order nodes.
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const { searchParams } = new URL(request.url);
      const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20", 10), 100);

      // 🛡️ IDENTITY HANDSHAKE
      // Using refactored getUserOrders which handles Decimal/BigInt sanitization
      const orders = await getUserOrders(context.user.userId, limit);

      return successResponse({
        orders: orders.map((order: any) => ({
          id: order.id,
          status: order.status,
          totalAmount: order.totalAmount, // Already stringified by getUserOrders
          currency: order.currency,
          merchant: order.merchant,
          items: order.items.map((item: any) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice, 
            product: item.product,
          })),
          createdAt: order.createdAt,
        })),
      });
    } catch (error) {
      console.error("🔥 [Orders_GET_Failure]:", error);
      return serverError();
    }
  });
}

/**
 * 🛰️ POST: CREATE ORDER
 * Logic: Atomic transaction for purchasing goods/services.
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const body = await request.json();
      const { merchantId, items, shipping } = body;

      // 1. PRESENCE VALIDATION
      if (!merchantId || !items || !Array.isArray(items) || items.length === 0) {
        return validationError("merchantId and items array are required");
      }

      // 2. UUID VALIDATION
      // Standardized across all backend nodes to protect Prisma from syntax errors
      if (!isUUID(merchantId)) {
        return errorResponse("Invalid Merchant ID format. Institutional UUID required.", 400);
      }

      // 3. EXECUTION VIA HARDENED SERVICE
      const order = await createOrder({
        customerId: context.user.userId,
        merchantId,
        items,
        shippingName: shipping?.name,
        shippingPhone: shipping?.phone,
        shippingAddress: shipping?.address,
        shippingCity: shipping?.city,
        shippingState: shipping?.state,
        shippingZip: shipping?.zip,
        shippingCountry: shipping?.country,
        customerNote: body.note,
      });

      return createdResponse({
        order: {
          id: order.id,
          status: order.status,
          totalAmount: order.totalAmount,
          currency: order.currency,
          items: order.items,
        },
      });
    } catch (error: any) {
      console.error("🔥 [Orders_POST_Failure]:", error.message);
      
      // 🛡️ BUSINESS LOGIC GUARDS
      if (error.message.includes("not found") || error.message.includes("stock")) {
        return validationError(error.message);
      }
      
      if (error.message.includes("format")) {
        return errorResponse(error.message, 400);
      }
      
      return serverError();
    }
  });
}