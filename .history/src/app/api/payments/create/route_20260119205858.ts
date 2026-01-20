import { NextRequest } from "next/server";
import {
  withAuth,
  type AuthenticatedRequest,
  type AuthContext,
} from "@/lib/auth/middleware-utils"; // ✅ PATH SYNC: Using standardized middleware
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
// ✅ INSTITUTIONAL INGRESS: Using strictly defined Prisma Enums
import { DiscountType } from "@/generated/prisma";
import { Decimal } from "@prisma/client-runtime-utils";

/**
 * 🛰️ POST: CREATE PAYMENT
 * Logic: Initializes a payment node with high-precision coupon/discount logic.
 * Standard: v2026.1.20 - Hardened for Institutional Ledgering.
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
        if (
          !isUUID(merchantId) ||
          !isUUID(serviceId) ||
          !isUUID(serviceTierId)
        ) {
          return errorResponse(
            "Invalid identity format. Institutional UUID required.",
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

        // Ensure cross-tenant integrity
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

        // 4. COUPON LOGIC (High-Precision Decimal Math)
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
            
            // ✅ FIX: Using DiscountType.PERCENTAGE Enum to resolve ts(2367)
            if (coupon.discountType === DiscountType.PERCENTAGE) {
              // Calculation: $$final = price \times \frac{100 - discount}{100}$$
              const multiplier = new Decimal(100).sub(couponAmount).div(100);
              finalPrice = finalPrice.mul(multiplier);
            } else {
              finalPrice = finalPrice.sub(couponAmount);
            }

            if (finalPrice.isNegative()) finalPrice = new Decimal(0);
          }
        }

        // 5. EXECUTION VIA HARDENED SERVICE
        // ✅ FIX: Added missing 'gatewayProvider' and resolved userId path for ts(2345)
        const payment = await createPayment({
          userId: context.user.id, // Accessing .id from AuthUser interface
          merchantId,
          serviceId,
          serviceTierId,
          amount: finalPrice,
          currency: tier.service.currency || "USD",
          gatewayProvider: "TELEGRAM_STARS", // Mandatory field for ledgering
        });

        // 6. SANITIZED EGRESS
        return successResponse({
          paymentId: payment.id,
          amount: finalPrice.toFixed(2), // Standardized string for hydration
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