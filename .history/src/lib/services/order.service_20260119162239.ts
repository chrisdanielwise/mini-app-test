"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
// ✅ INSTITUTIONAL INGRESS
import { OrderStatus, type Order, Prisma } from "@/generated/prisma";
import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

function sanitizeOrder<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") return v.toString();
      if (value && typeof value === "object" && value.constructor.name === "Decimal") {
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
 * 🔍 GET_ORDER_BY_ID
 */
export const getOrderById = cache(async (orderId: string) => {
  if (!isUUID(orderId)) return null;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: { select: { name: true } } } },
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