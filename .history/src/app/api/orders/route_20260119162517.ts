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
 * 🛰️ POST: CREATE ORDER
 * Strategy: Flattened Schema Handshake.
 * Logic: Maps high-level request body to specific Service-layer parameters.
 * Fix: Synchronized with the service-layer's explicit shipping fields.
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

    // 2. IDENTITY VALIDATION
    if (!isUUID(merchantId)) {
      return errorResponse("Invalid Merchant ID format. Institutional UUID required.", 400);
    }

    // 3. EXECUTION VIA HARDENED SERVICE
    // ✅ SYNC: Mapping flattened body fields to match the refactored 
    // createOrder signature which targets shipping_name, shipping_address, etc.
    const order = await createOrder({
      customerId: userId,
      merchantId,
      items: items.map((item: any) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity
      })),
      // Mapped to match your Service Layer's internal object mapping
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
        // ✅ RELATION SYNC: Accessing items included by the service
        items: (order as any).items || [], 
      },
    });
  } catch (error: any) {
    console.error("🔥 [Orders_POST_Failure]:", error.message);

    // Business Logic Handlers
    if (error.message.includes("INVENTORY") || error.message.includes("NODE_MISSING")) {
      return validationError(error.message);
    }

    return serverError();
  }
}

/**
 * 🛰️ GET: USER ORDER HISTORY
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    
    // Fetch sanitized orders from the service layer
    const orders = await getUserOrders(userId);

    return successResponse({
      orders: orders.map((order: any) => ({
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        currency: order.currency || "USD",
        items: (order.items || []).map((item: any) => ({
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          variantInfo: item.variantInfo
        })),
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("🔥 [Orders_GET_Failure]:", error);
    return serverError();
  }
}