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