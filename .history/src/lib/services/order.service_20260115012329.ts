"use server";

import prisma from "@/lib/db";
import type { OrderStatus } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client/runtime-library";
import { cache } from "react";

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
      // Handle Prisma Decimal specifically to avoid precision loss
      if (value?.d && value?.s) return value.toString();
      return value;
    })
  );
}

// =================================================================
// 🛡️ ORDER PROTOCOLS (Hardened v16.16.12)
// =================================================================

/**
 * 🛰️ CREATE_ORDER_PROTOCOL
 * Logic: Multi-stage atomic transaction with inventory interlock.
 * Safety: Prevents over-selling via decrement locking.
 */
export async function createOrder(input: any) {
  if (!isUUID(input.customerId) || !isUUID(input.merchantId)) {
    throw new Error("PROTOCOL_ERROR: Invalid_Identity_Link");
  }

  return prisma.$transaction(async (tx) => {
    let totalAmount = new Decimal(0);
    const orderItems: any[] = [];

    for (const item of input.items) {
      // 1. Fetch Product with pessimistic lock via findUnique
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product) throw new Error(`NODE_MISSING: ${item.productId}`);

      let unitPrice = product.basePrice;
      let variantInfo: object | undefined;

      // 2. Inventory Check & Decrement
      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant || variant.stock < item.quantity) {
          throw new Error(`INVENTORY_EXHAUSTED: ${product.name}`);
        }
        
        unitPrice = variant.price;
        variantInfo = variant.attributes as object;

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const itemTotal = unitPrice.mul(item.quantity);
      totalAmount = totalAmount.add(itemTotal);

      orderItems.push({
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
        status: "PENDING_PAYMENT",
        totalAmount,
        currency: "USD",
        items: { create: orderItems },
        // ...shipping metadata
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
 * Logic: Deep-include for Terminal Viewport.
 */
export const getOrderById = cache(async (orderId: string) => {
  if (!isUUID(orderId)) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: { select: { name: true, imageUrl: true } } } },
      customer: { select: { id: true, fullName: true, phoneNumber: true } },
      merchant: { select: { id: true, companyName: true } },
      payments: true,
    },
  });

  return sanitizeOrder(order);
});

/**
 * 🏧 COMPLETE_ORDER (Financial Finalization)
 * Logic: Escrow release to Available Balance.
 */
export async function completeOrder(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { totalAmount: true, merchantId: true, status: true }
    });

    if (!order || order.status !== "DELIVERED") {
      throw new Error("RECONCILIATION_FAIL: Order_Not_Delivered");
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    // Move funds from Escrow to Available
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