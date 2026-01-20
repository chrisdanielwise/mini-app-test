import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/session";
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
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10),
      100
    );

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
 * Fix: Resolved TS2353 by nesting shipping metadata to match OrderService expected type.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const body = await request.json();
    const { merchantId, items, shipping, note } = body;

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
    // ✅ FIX: Mapping flattened body fields into the structured 'shipping' object 
    // expected by the createOrder service signature.
    const order = await createOrder({
      customerId: userId,
      merchantId,
      items,
      shipping: {
        name: shipping?.name,
        phone: shipping?.phone,
        address: shipping?.address,
        city: shipping?.city,
        state: shipping?.state,
        zip: shipping?.zip,
        country: shipping?.country,
      },
      customerNote: note,
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