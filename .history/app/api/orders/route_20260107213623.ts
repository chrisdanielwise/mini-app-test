import type { NextRequest } from "next/server"
import { withAuth, type AuthenticatedRequest, type AuthContext } from "@/lib/auth/middleware"
import { OrderService } from "@/lib/services/order.service"
import { UserService } from "@/lib/services/user.service"
import { successResponse, createdResponse, validationError, serverError } from "@/lib/utils/api-response"

// GET: Get user's orders
export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const { searchParams } = new URL(request.url)
      const limit = Number.parseInt(searchParams.get("limit") || "20", 10)

      const orders = await UserService.getOrders(context.user.userId, limit)

      return successResponse({
        orders: orders.map((order) => ({
          id: order.id,
          status: order.status,
          totalAmount: order.totalAmount.toString(),
          currency: order.currency,
          merchant: order.merchant,
          items: order.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
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

      if (!merchantId || !items || !Array.isArray(items) || items.length === 0) {
        return validationError("merchantId and items array are required")
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
      if (error.message.includes("not found") || error.message.includes("stock")) {
        return validationError(error.message)
      }
      return serverError()
    }
  })
}
