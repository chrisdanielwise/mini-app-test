import { NextRequest } from "next/server";
// ✅ FIX: Ensure this path matches your actual session utility (e.g., @/lib/auth/session or middleware)
import { requireAuth } from "@/lib/auth/session";
// ✅ FIX: Import BOTH from order.service to resolve "Export not found" and "Module not found"
import { createOrder, getUserOrders } from "@/lib/services/order.service";
import {
  successResponse,
  createdResponse,
  validationError,
  serverError,
  errorResponse,
} from "@/lib/utils/api-response";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ GET: USER ORDER HISTORY
 * Logic: Fetches authenticated user's order nodes from the hardened service.
 */
export async function GET(request: NextRequest) {
  try {
    // 🛡️ IDENTITY HANDSHAKE
    const session = await requireAuth();
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    // Limit parsing
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10),
      100
    );

    // Using the new exported function from order.service
    const orders = await getUserOrders(userId);

    return successResponse({
      orders: orders.map((order: any) => ({
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        currency: order.currency,
        items: order.items.map((item: any) => ({
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("🔥 [Orders_GET_Failure]:", error);
    return serverError();
  }
}

/**
 * 🛰️ POST: CREATE ORDER
 * Logic: Atomic transaction for purchasing goods/services via the order service.
 */
export async function POST(request: NextRequest) {
  try {
    // 🛡️ IDENTITY HANDSHAKE
    const session = await requireAuth();
    const userId = session.user.id;

    const body = await request.json();
    const { merchantId, items, shipping } = body;

    // 1. PRESENCE VALIDATION
    if (!merchantId || !items || !Array.isArray(items) || items.length === 0) {
      return validationError("merchantId and items array are required");
    }

    // 2. UUID VALIDATION
    if (!isUUID(merchantId)) {
      return errorResponse(
        "Invalid Merchant ID format. Institutional UUID required.",
        400
      );
    }

    // 3. EXECUTION VIA HARDENED SERVICE
    const order = await createOrder({
      customerId: userId,
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
    if (
      error.message.includes("NODE_MISSING") ||
      error.message.includes("INVENTORY")
    ) {
      return validationError(error.message);
    }

    if (error.message.includes("PROTOCOL_ERROR")) {
      return errorResponse(error.message, 400);
    }

    return serverError();
  }
}
