"use server";

import prisma from "@/lib/db";
import { 
  PaymentStatus, 
  OrderStatus, 
  DiscountType, // ✅ Added for Comparison Logic
  SenderType    // ✅ Added for Consistency
} from "@/generated/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { isUUID } from "@/lib/utils/validators";
import { revalidateTag } from "next/cache";

/**
 * 🌊 CHECKOUT_SERVICE (Institutional Apex v2026.1.20)
 * Logic: Atomic creation of orders and subscriptions with hardened Enum Mapping.
 * Fix: Uses Enum Objects to resolve TS2367 "No Overlap" comparison errors.
 */
export const CheckoutService = {
  /**
   * 🛍️ INITIALIZE_ORDER (Physical Goods)
   */
  async createOrder(params: {
    userId: string;
    merchantId: string;
    items: { productId: string; variantId?: string; quantity: number }[];
    couponCode?: string;
  }) {
    if (!isUUID(params.userId) || !isUUID(params.merchantId)) {
      throw new Error("PROTOCOL_ERROR: Invalid_Node_Identity");
    }

    return prisma.$transaction(async (tx) => {
      let totalAmount = new Decimal(0);
      const orderItemsData = [];

      for (const item of params.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (!product || !product.isActive) throw new Error("ITEM_OFFLINE");

        let unitPrice = product.basePrice;
        let variantInfo = null;

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (!variant) throw new Error("VARIANT_NOT_FOUND");
          unitPrice = variant.price;
          variantInfo = variant.attributes;
        }

        const itemTotal = unitPrice.mul(item.quantity);
        totalAmount = totalAmount.add(itemTotal);

        orderItemsData.push({
          productId: product.id,
          variantId: item.variantId,
          productName: product.name,
          variantInfo: variantInfo || {},
          unitPrice: unitPrice,
          quantity: item.quantity,
          totalPrice: itemTotal,
        });
      }

      // 🛡️ Coupon Protocol
      if (params.couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: {
            merchantId_code: {
              merchantId: params.merchantId,
              code: params.couponCode,
            },
          },
        });

        if (coupon && coupon.isActive) {
          // ✅ FIX: Use Enum Object to match mapped lowercase value
          const isPercentage = coupon.discountType === DiscountType.PERCENTAGE;

          const discount = isPercentage
            ? totalAmount.mul(coupon.amount.div(100))
            : coupon.amount;

          totalAmount = Decimal.max(0, totalAmount.sub(discount));
        }
      }

      const order = await tx.order.create({
        data: {
          customerId: params.userId,
          merchantId: params.merchantId,
          totalAmount,
          status: OrderStatus.PENDING_PAYMENT, // ✅ Maps to "pending_payment"
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      // ✅ FIX: Required 2nd argument for revalidateTag
      revalidateTag(`orders-${params.userId}`, "default");

      return JSON.parse(JSON.stringify(order));
    });
  },

  /**
   * 🛰️ INITIALIZE_SUBSCRIPTION (Digital Signals)
   */
  async createSubscriptionIntent(params: {
    userId: string;
    serviceTierId: string;
    couponCode?: string;
  }) {
    if (!isUUID(params.userId) || !isUUID(params.serviceTierId)) {
      throw new Error("PROTOCOL_ERROR: Invalid_Node_Identity");
    }

    const tier = await prisma.serviceTier.findUnique({
      where: { id: params.serviceTierId },
      include: { service: true },
    });

    if (!tier || !tier.isActive) throw new Error("TIER_NOT_AVAILABLE");

    let finalPrice = tier.price;

    if (params.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: {
          merchantId_code: {
            merchantId: tier.service.merchantId,
            code: params.couponCode,
          },
        },
      });

      if (coupon?.isActive) {
        // ✅ FIX: Use Enum Object to match mapped lowercase value
        const discount =
          coupon.discountType === DiscountType.PERCENTAGE
            ? finalPrice.mul(coupon.amount.div(100))
            : coupon.amount;
            
        finalPrice = Decimal.max(0, finalPrice.sub(discount));
      }
    }

    const payment = await prisma.payment.create({
      data: {
        userId: params.userId,
        merchantId: tier.service.merchantId,
        serviceId: tier.service.id,
        serviceTierId: tier.id,
        tierNameSnapshot: tier.name,
        amount: finalPrice,
        currency: tier.service.currency,
        status: PaymentStatus.PENDING, // ✅ Maps to "pending"
        gatewayProvider: "TELEGRAM_STARS",
        gatewayReference: `SUB-${crypto.randomUUID()}`,
      },
    });

    return JSON.parse(JSON.stringify(payment));
  },
};