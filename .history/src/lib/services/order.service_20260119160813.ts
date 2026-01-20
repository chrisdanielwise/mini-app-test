"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
// ✅ INSTITUTIONAL INGRESS
import { OrderStatus, type Order } from "@/generated/prisma";
import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE_ORDER
 * Logic: Recursively converts BigInt and Decimals to strings for hydration safety.
 */
function sanitizeOrder<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (
        value && 
        typeof value === "object" &&
        value.constructor.name === "Decimal"
      ) {
        return value.toString();
      }
      return value;
    })
  );
}

// =================================================================
// 🛡️ ORDER PROTOCOLS (Hardened v2026.1.20)
// =================================================================

/**
 * 🛰️ CREATE_ORDER_PROTOCOL
 * Fix: Resolved TS2353 by adding explicit metadata support for shipping/notes.
 * Fix: Removed 'any' from orderItems to maintain type integrity.
 */
export async function createOrder(input: {
  customerId: string;
  merchantId: string;
  items: Array<{ productId: string; variantId?: string; quantity: number }>;
  metadata?: Record<string, any>; // ✅ FIX: Added to support shipping/notes
}) {
  if (!isUUID(input.customerId) || !isUUID(input.merchantId)) {
    throw new Error("PROTOCOL_ERROR: Invalid_Identity_Link");
  }

  return prisma.$transaction(async (tx) => {
    let totalAmount = new Decimal(0);
    
    // Define strict type for order items create input
    const orderItemsBatch: Array<{
      productId: string;
      variantId?: string;
      productName: string;
      variantInfo?: any;
      unitPrice: Decimal;
      quantity: number;
      totalPrice: Decimal;
    }> = [];

    for (const item of input.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product) throw new Error(`NODE_MISSING: ${item.productId}`);

      let unitPrice = product.basePrice;
      let variantInfo = undefined;

      // 2. Inventory Check & Decrement
      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant || variant.stock < item.quantity) {
          throw new Error(`INVENTORY_EXHAUSTED: ${product.name}`);
        }

        unitPrice = variant.price;
        variantInfo = variant.attributes;

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const itemTotal = unitPrice.mul(item.quantity);
      totalAmount = totalAmount.add(itemTotal);

      orderItemsBatch.push({
        productId: item.productId,
        variantId: item.variantId,
        productName: product.name,
        variantInfo,
        unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // 3. Final Order Anchor
    const order = await tx.order.create({
      data: {
        customerId: input.customerId,
        merchantId: input.merchantId,
        status: OrderStatus.PENDING_PAYMENT,
        totalAmount,
        currency: "USD",
        metadata: input.metadata || {}, // ✅ FIX: Successfully persists shipping data
        items: {
          create: orderItemsBatch.map(item => ({
            ...item,
            // Ensure Decimal values are handled correctly for Prisma create
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          }))
        },
      },
      include: {
        items: true,
        customer: { select: { fullName: true, telegramId: true } },
      },
    });

    return sanitizeOrder(order);
  });
}

/**
 * 🔍 GET_ORDER_BY_ID
 */
export const getOrderById = cache(async (orderId: string) => {
  if (!isUUID(orderId)) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
      customer: { select: { id: true, fullName: true, phoneNumber: true } },
      merchant: { select: { id: true, companyName: true } },
    },
  });

  return sanitizeOrder(order);
});

/**
 * 🏧 GET_USER_ORDERS
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  if (!isUUID(userId)) return [];

  const orders = await prisma.order.findMany({
    where: { customerId: userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return sanitizeOrder(orders);
}

/**
 * 🏧 COMPLETE_ORDER
 */
export async function completeOrder(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { totalAmount: true, merchantId: true, status: true },
    });

    if (!order || order.status !== OrderStatus.DELIVERED) {
      throw new Error("RECONCILIATION_FAIL: Order_Not_Delivered");
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.COMPLETED },
    });

    await tx.merchantProfile.update({
      where: { id: order.merchantId },
      data: {
        availableBalance: { increment: order.totalAmount },
        pendingEscrow: { decrement: order.totalAmount },
      },
    });

    return sanitizeOrder(updatedOrder);
  });
}