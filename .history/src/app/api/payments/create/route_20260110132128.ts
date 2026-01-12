import type { NextRequest } from "next/server";
import {
  withAuth,
  type AuthenticatedRequest,
  type AuthContext,
} from "@/lib/auth/api-wrappers";
import { PaymentService } from "@/lib/services/payment.service";
import prisma from "@/lib/db";
import {
  successResponse,
  validationError,
  notFoundResponse,
  serverError,
  errorResponse,
} from "@/lib/utils/api-response";

// Helper to validate UUID format
const isUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req: AuthenticatedRequest, context: AuthContext) => {
      try {
        const body = await request.json();
        const { merchantId, serviceId, serviceTierId, couponCode } = body;

        // 1. Basic Presence Validation
        if (!merchantId || !serviceId || !serviceTierId) {
          return validationError(
            "merchantId, serviceId, and serviceTierId are required"
          );
        }

        // 2. UUID Format Validation
        // This prevents the P2007 "invalid input syntax for type uuid" error in Prisma 7
        if (
          !isUUID(merchantId) ||
          !isUUID(serviceId) ||
          !isUUID(serviceTierId)
        ) {
          return errorResponse(
            "One or more provided IDs have an invalid format (UUID expected).",
            400
          );
        }

        // 3. Get service tier details
        const tier = await prisma.serviceTier.findUnique({
          where: { id: serviceTierId },
          include: {
            service: {
              include: {
                merchant: true,
              },
            },
          },
        });

        // Ensure tier exists and belongs to the correct merchant
        if (
          !tier ||
          tier.service.merchantId !== merchantId ||
          tier.serviceId !== serviceId
        ) {
          return notFoundResponse(
            "Service tier not found for this merchant/service"
          );
        }

        let finalPrice = tier.price;
        let couponId: string | undefined;

        // 4. Apply coupon if provided
        if (couponCode) {
          const coupon = await prisma.coupon.findFirst({
            where: {
              merchantId,
              code: couponCode,
              isActive: true,
              OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
          });

          if (coupon) {
            if (coupon.discountType === "PERCENTAGE") {
              // Decimal arithmetic helper: mul and div
              finalPrice = finalPrice.mul(100 - Number(coupon.amount)).div(100);
            } else {
              finalPrice = finalPrice.sub(coupon.amount);
            }
            // Ensure final price doesn't go below zero
            if (finalPrice.toNumber() < 0) finalPrice = tier.price.mul(0);

            couponId = coupon.id;
          }
        }

        // 5. Create payment record
        const payment = await PaymentService.create({
          userId: context.user.userId,
          merchantId,
          serviceId,
          serviceTierId,
          amount: finalPrice,
          currency: tier.service.currency,
          gatewayProvider: "MANUAL",
          originalPrice: tier.price,
          discountApplied: tier.price.sub(finalPrice),
          couponId,
          couponCode,
        });

        return successResponse({
          paymentId: payment.id,
          amount: finalPrice.toString(), // Convert Decimal to string for JSON
          currency: tier.service.currency,
          status: payment.status,
        });
      } catch (error) {
        console.error("[Payment Create] Server Error:", error);
        return serverError();
      }
    }
  );
}
