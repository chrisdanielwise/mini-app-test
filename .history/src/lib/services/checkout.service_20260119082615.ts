"use server";

import prisma from "@/lib/db";
import {
  PaymentStatus,
  OrderStatus,
  SubscriptionStatus,
  CouponScope,
} from "@/generated/prisma";
import { Decimal } from "@prisma/client-runtime-utils";

/**
 * 🌊 CHECKOUT_SERVICE (v16.16.12)
 * Logic: Atomic creation of orders and subscriptions with Coupon logic.
 */
export const CheckoutService = {
  /**
   * 🛍️ INITIALIZE_ORDER (Physical Goods)
   * Logic: Creates a PENDING_PAYMENT order in the marketplace.
   */
  async createOrder(params: {
    userId: string;
    merchantId: string;
    items: { productId: string; variantId?: string; quantity: number }[];
    couponCode?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      let totalAmount = new Decimal(0);
      const orderItemsData = [];

      // 1. Resolve Products & Calculate Totals
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

      // 2. Apply Coupon Protocol
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
          // ✅ FIX: Use DiscountType.PERCENTAGE instead of the string "PERCENTAGE"
          // Prisma knows this maps to the lowercase value "percentage"
          const isPercentage = coupon.discountType === DiscountType.PERCENTAGE;

          const discount = isPercentage
            ? totalAmount.mul(coupon.amount.div(100))
            : coupon.amount;

          totalAmount = Decimal.max(0, totalAmount.sub(discount));
        }
      }

      // 3. Persist Order Node
      return await tx.order.create({
        data: {
          customerId: params.userId,
          merchantId: params.merchantId,
          totalAmount,
          status: OrderStatus.PENDING_PAYMENT,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });
    });
  },

  /**
   * 🛰️ INITIALIZE_SUBSCRIPTION (Digital Signals)
   * Logic: Sets up a subscription node awaiting payment confirmation.
   */
  async createSubscriptionIntent(params: {
    userId: string;
    serviceTierId: string;
    couponCode?: string;
  }) {
    const tier = await prisma.serviceTier.findUnique({
      where: { id: params.serviceTierId },
      include: { service: true },
    });

    if (!tier || !tier.isActive) throw new Error("TIER_NOT_AVAILABLE");

    let finalPrice = tier.price;

    // Coupon Logic for Digital Services
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
        const discount =
          coupon.discountType === "PERCENTAGE"
            ? finalPrice.mul(coupon.amount.div(100))
            : coupon.amount;
        finalPrice = Decimal.max(0, finalPrice.sub(discount));
      }
    }

    // Create Payment Record (Identity Anchor)
    return await prisma.payment.create({
      data: {
        userId: params.userId,
        merchantId: tier.service.merchantId,
        serviceId: tier.service.id,
        serviceTierId: tier.id,
        tierNameSnapshot: tier.name,
        amount: finalPrice,
        currency: tier.service.currency,
        status: PaymentStatus.PENDING,
        gatewayProvider: "TELEGRAM_STARS", // Default for TMA 2026
        gatewayReference: `SUB-${crypto.randomUUID()}`,
      },
    });
  },
};
