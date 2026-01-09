import type { NextRequest } from "next/server"
import { withAuth, type AuthenticatedRequest, type AuthContext } from "@/lib/auth/middleware"
import { PaymentService } from "@/lib/services/payment.service"
import prisma from "@/lib/db"
import { successResponse, validationError, notFoundResponse, serverError } from "@/lib/utils/api-response"

export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest, context: AuthContext) => {
    try {
      const body = await request.json()
      const { merchantId, serviceId, serviceTierId, couponCode } = body

      if (!merchantId || !serviceId || !serviceTierId) {
        return validationError("merchantId, serviceId, and serviceTierId are required")
      }

      // Get service tier details
      const tier = await prisma.serviceTier.findUnique({
        where: { id: serviceTierId },
        include: {
          service: {
            include: {
              merchant: true,
            },
          },
        },
      })

      if (!tier || tier.service.merchantId !== merchantId) {
        return notFoundResponse("Service tier not found")
      }

      let finalPrice = tier.price
      let couponId: string | undefined

      // Apply coupon if provided
      if (couponCode) {
        const coupon = await prisma.coupon.findFirst({
          where: {
            merchantId,
            code: couponCode,
            isActive: true,
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
        })

        if (coupon) {
          if (coupon.discountType === "PERCENTAGE") {
            finalPrice = finalPrice.mul(100 - Number(coupon.amount)).div(100)
          } else {
            finalPrice = finalPrice.sub(coupon.amount)
          }
          couponId = coupon.id
        }
      }

      // Create payment record
      const payment = await PaymentService.create({
        userId: context.user.userId,
        merchantId,
        serviceId,
        serviceTierId,
        amount: finalPrice,
        currency: tier.service.currency,
        gatewayProvider: "MANUAL", // Will be updated based on actual payment method
        originalPrice: tier.price,
        discountApplied: tier.price.sub(finalPrice),
        couponId,
        couponCode,
      })

      // In a real implementation, you would create a Stripe checkout session here
      // For now, return the payment ID for manual processing
      return successResponse({
        paymentId: payment.id,
        amount: finalPrice.toString(),
        currency: tier.service.currency,
        // paymentUrl: stripeSession.url, // If using Stripe
      })
    } catch (error) {
      console.error("[Payment Create] Error:", error)
      return serverError()
    }
  })
}
