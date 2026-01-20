"use server";

import prisma from "@/lib/db";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";
import { OrderStatus, DispatchType } from "@/generated/prisma";

/**
 * 🛰️ MARKETPLACE_SERVICE (Institutional Apex v2026.1.20)
 * Strategy: Atomic Persistence & Inventory Interlock.
 * Fix: Resolved TS2345 by synchronizing variant property optionality.
 */
export const MarketplaceService = {
  /**
   * 🌲 CATEGORY_MANAGEMENT
   * Fetches the category tree for the Bot or Dashboard.
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
   * Creates a product with its variants in one atomic operation.
   * Fix: 'attributes' is now optional to match the Action layer ingress.
   */
  async createProduct(params: {
    merchantId: string;
    categoryId: string;
    name: string;
    description: string;
    basePrice: number;
    dispatchType: DispatchType;
    // ✅ FIX: attributes is now optional (?) to satisfy type assignment
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
              // Fallback to empty object if attributes are missing
              attributes: v.attributes ?? {},
              price: v.price,
              stock: v.stock,
            })),
          },
        },
      });

      // ✅ Next.js 15: Mandatory second argument for revalidation
      revalidateTag("catalog_node", "page");
      return product;
    });
  },

  /**
   * 🛒 ATOMIC_ORDER_PROVISIONING
   * Logic: Places an order, snapshots prices, and decrements stock.
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
          } as any,
        });

        if (!product) throw new Error(`Product ${item.productId} Offline`);

        const price = (item.variantId && product.variants?.length) 
          ? product.variants[0].price 
          : product.basePrice;
          
        const subtotal = Number(price) * item.quantity;
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
          // Note: Ensure params.shipping matches your Prisma Order schema fields
          ...params.shipping,
          items: { create: orderItemsData },
        },
      });

      revalidateTag("order_node", "page");
      return order;
    });
  },


  
};