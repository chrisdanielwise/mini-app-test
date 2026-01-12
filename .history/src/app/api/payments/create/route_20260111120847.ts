import { NextRequest } from "next/server";
import {
  withAuth,
  type AuthenticatedRequest,
  type AuthContext,
} from "@/lib/auth/api-wrappers";
// ✅ FIXED: Using named function imports for Turbopack compatibility
import { createPayment } from "@/lib/services/payment.service";
import prisma from "@/lib/db";
import {
  successResponse,
  validationError,
  notFoundResponse,
  serverError,
  errorResponse,
} from "@/lib/utils/api-response";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client-runtime-library";

/**
 * 🛰️ POST: CREATE PAYMENT
 * Logic: Initializes a payment node with optional coupon/discount logic.
 */
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req: AuthenticatedRequest, context: AuthContext) => {
      try {
        const body = await request.json();
        const { merchantId, serviceId, serviceTierId, couponCode } = body;

        // 1. IDENTITY & PRESENCE VALIDATION
        if (!merchantId || !serviceId || !serviceTierId) {
          return validationError(
            "merchantId, serviceId, and serviceTierId are required"
          );
        }

        // 2. UUID FORMAT VALIDATION
        // Centralized utility to protect PostgreSQL from malformed UUID syntax errors
        if (
          !isUUID(merchantId) ||
          !isUUID(serviceId) ||
          !isUUID(serviceTierId)
        ) {
          return errorResponse(
            "Invalid identity format detected. Institutional UUID required.",
            400
          );
        }

        // 3. SERVICE TIER AUDIT
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

        // Ensure cross-tenant integrity: Tier must belong to the specified Merchant/Service
        if (
          !tier ||
          tier.service.merchantId !== merchantId ||
          tier.serviceId !== serviceId
        ) {
          return notFoundResponse(
            "The requested service node was not found in this merchant's cluster."
          );
        }

        let finalPrice = new Decimal(tier.price.toString());
        let couponId: string | undefined;

        // 4. COUPON LOGIC (High-Precision Math)
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
            const couponAmount = new Decimal(coupon.amount.toString());
            
            if (coupon.discountType === "PERCENTAGE") {
              // Calculation: $$final = price \times \frac{100 - discount}{100}$$
              const multiplier = new Decimal(100).sub(couponAmount).div(100);
              finalPrice = finalPrice.mul(multiplier);
            } else {
              finalPrice = finalPrice.sub(couponAmount);
            }

            // Floor check to prevent negative balances
            if (finalPrice.isNegative()) finalPrice = new Decimal(0);
            couponId = coupon.id;
          }
        }

        // 5. EXECUTION VIA HARDENED SERVICE
        const payment = await createPayment({
          userId: context.user.userId,
          merchantId,
          serviceId,
          serviceTierId,
          amount: finalPrice,
          currency: tier.service.currency || "USD",
        });

        // 6. SANITIZED EGRESS
        return successResponse({
          paymentId: payment.id,
          amount: finalPrice.toString(), // Standardized string for Next.js hydration
          currency: payment.currency,
          status: payment.status,
          gatewayReference: payment.gatewayReference
        });
      } catch (error: any) {
        console.error("🔥 [Payment_Create_Failure]:", error.message);
        return serverError();
      }
    }
  );
}