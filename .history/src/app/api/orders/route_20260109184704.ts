import type { NextRequest } from "next/server"
import { withAuth, type AuthenticatedRequest, type AuthContext } from "@/src/lib/auth/middleware"
import { OrderService } from "@/src/lib/services/order.service"
import { UserService } from "@/src/lib/services/user.service"
import { successResponse, createdResponse, validationError, serverError, errorResponse } from "@/src/lib/utils/api-response"

// Helper to validate UUID format
const isUUID = (id: string) => 
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// GET: Get user's orders
export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const { searchParams } = new URL(request.url)
      const limit = Number.parseInt(searchParams.get("limit") || "20", 10)

      console.log(`[Orders GET] Fetching orders for user: ${context.user.userId}`);
      const orders = await UserService.getOrders(context.user.userId, limit)

      return successResponse({
        orders: orders.map((order) => ({
          id: order.id,
          status: order.status,
          totalAmount: order.totalAmount.toString(), // Decimal to String
          currency: order.currency,
          merchant: order.merchant,
          items: order.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(), // Decimal to String
            product: item.product,
          })),
          createdAt: order.createdAt,
        })),
      })
    } catch (error) {
      console.error("[Orders GET] Error:", error)
      return serverError()
    }
  })
}

// POST: Create new order
export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const body = await request.json()
      const { merchantId, items, shipping } = body

      // 1. Presence Validation
      if (!merchantId || !items || !Array.isArray(items) || items.length === 0) {
        return validationError("merchantId and items array are required")
      }

      // 2. UUID Validation
      // Prevents Prisma 7 P2007 error when receiving invalid UUID strings
      if (!isUUID(merchantId)) {
        return errorResponse("Invalid Merchant ID format. UUID expected.", 400)
      }

      const order = await OrderService.create({
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
      })

      return createdResponse({
        order: {
          id: order.id,
          status: order.status,
          totalAmount: order.totalAmount.toString(),
          currency: order.currency,
          items: order.items,
        },
      })
    } catch (error: any) {
      console.error("[Orders POST] Error:", error)
      
      // Handle specific business logic errors from the Service
      if (error.message.includes("not found") || error.message.includes("stock")) {
        return validationError(error.message)
      }
      
      return serverError()
    }
  })
}