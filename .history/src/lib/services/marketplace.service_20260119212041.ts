"use server";

import prisma from "@/lib/db";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { OrderStatus, DispatchType } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ MARKETPLACE_SERVICE (Institutional Apex v2026.1.20)
 * Strategy: Atomic Persistence & Inventory Interlock.
 */
export const MarketplaceService = {
  /**
   * 🌲 CATEGORY_MANAGEMENT
   */
  getCategories: cache(async (merchantId: string) => {
    return await prisma.category.findMany({
      where: { merchantId, isActive: true },
      include: { children: true },
      orderBy: { name: "asc" },
    });
  }),

  /**
   * 📦 PRODUCT_HANDSHAKE
   * Fix: TS2345 - 'attributes' and 'variants' made optional to match Action ingress.
   */
  async createProduct(params: {
    merchantId: string;
    categoryId: string;
    name: string;
    description: string;
    basePrice: number;
    dispatchType: DispatchType;
    variants?: { attributes?: any; price: number; stock: number }[];
  }) {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          merchantId: params.merchantId,
          categoryId: params.categoryId,
          name: params.name,
          slug: params.name.toLowerCase().replace(/ /g, "-"),
          description: params.description,
          basePrice: params.basePrice,
          dispatchType: params.dispatchType,
          variants: {
            create: params.variants?.map((v) => ({
              attributes: v.attributes ?? {},
              price: v.price,
              stock: v.stock,
            })),
          },
        },
      });

      revalidateTag("catalog_node", "page");
      return product;
    });
  },

  /**
   * 🛒 ATOMIC_ORDER_PROVISIONING
   * Fix: TS2339 - Hardened price resolution on variants.
   */
  async placeOrder(params: {
    customerId: string;
    merchantId: string;
    items: { productId: string; variantId?: string; quantity: number }[];
    shipping: any;
  }) {
    return await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of params.items) {
        // 🛡️ 1. Stock & Price Audit
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { 
            variants: item.variantId ? { where: { id: item.variantId } } : false 
          }
        });

        if (!product) throw new Error(`Product ${item.productId} Offline`);

        // ✅ FIX: TS2339 - Type-safe variant price extraction
        let price = Number(product.basePrice);
        if (item.variantId && 'variants' in product && Array.isArray(product.variants)) {
            const variant = product.variants.find(v => v.id === item.variantId);
            if (variant) {
                price = Number(variant.price);
            }
        }
          
        const subtotal = price * item.quantity;
        totalAmount += subtotal;

        // 🛡️ 2. Stock Decrement
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        orderItemsData.push({
          productId: item.productId,
          variantId: item.variantId,
          productName: product.name,
          unitPrice: price,
          quantity: item.quantity,
          totalPrice: subtotal,
        });
      }

      // 🏁 3. Order Creation
      const order = await tx.order.create({
        data: {
          customerId: params.customerId,
          merchantId: params.merchantId,
          status: OrderStatus.PENDING_PAYMENT,
          totalAmount,
          ...params.shipping,
          items: { create: orderItemsData },
        },
      });

      revalidateTag("order_node", "page");
      return order;
    });
  },
};

/**
 * 🛰️ GET_DASHBOARD_STATS
 * logic: Moved outside Marketplace object to prevent circular reference & export drift.
 */
export const getDashboardStats = cache(async (options: { 
  targetId: string 
}) => {
  const { targetId } = options;

  if (!isUUID(targetId)) {
    throw new Error("PROTOCOL_ERROR: Invalid_Target_Node_ID");
  }

  try {
    const [revenue, totalSubscribers, activeTickets] = await Promise.all([
      prisma.payment.aggregate({
        where: { merchantId: targetId, status: "COMPLETED" },
        _sum: { amount: true }
      }),
      prisma.subscription.count({
        where: { merchantId: targetId }
      }),
      prisma.ticket.count({
        where: { merchantId: targetId, status: "OPEN" }
      })
    ]);

    return {
      totalRevenue: revenue._sum.amount || 0,
      subscriberCount: totalSubscribers,
      openTickets: activeTickets,
      lastSync: new Date().toISOString()
    };
  } catch (error: any) {
    console.error("📊 [Stats_Telemetry_Fault]:", error.message);
    throw new Error("TELEMETRY_SYNC_FAILED");
  }
});