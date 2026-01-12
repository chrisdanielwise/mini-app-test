import prisma from "@/lib/db";
import type { OrderStatus } from "@/generated/prisma";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🚀 INTERFACES
// =================================================================

export interface OrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerId: string;
  merchantId: string;
  items: OrderItemInput[];
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCountry?: string;
  customerNote?: string;
}

// =================================================================
// 🛠️ INTERNAL HELPERS
// =================================================================

function sanitizeOrder(order: any) {
  if (!order) return null;
  return JSON.parse(
    JSON.stringify(order, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (value instanceof Decimal) return value.toString();
      return value;
    })
  );
}

// =================================================================
// 🛡️ NAMED EXPORTS (RBAC & Staff Aware)
// =================================================================

/**
 * 🛰️ CREATE ORDER
 * PRISMA 7: Atomic transaction with stock protection.
 */
export async function createOrder(input: CreateOrderInput) {
  if (!isUUID(input.customerId) || !isUUID(input.merchantId)) {
    throw new Error("Invalid Customer or Merchant ID format");
  }

  return prisma.$transaction(async (tx) => {
    let totalAmount = new Decimal(0);
    const orderItems: any[] = [];

    for (const item of input.items) {
      if (!isUUID(item.productId) || (item.variantId && !isUUID(item.variantId))) {
        throw new Error(`Invalid ID format for product: ${item.productId}`);
      }

      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product) throw new Error(`Product not found: ${item.productId}`);

      let unitPrice = product.basePrice;
      let variantInfo: object | undefined;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) throw new Error(`Variant not found: ${item.variantId}`);
        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
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

    const order = await tx.order.create({
      data: {
        customerId: input.customerId,
        merchantId: input.merchantId,
        status: "PENDING_PAYMENT",
        totalAmount,
        currency: "USD",
        shippingName: input.shippingName,
        shippingPhone: input.shippingPhone,
        shippingAddress: input.shippingAddress,
        shippingCity: input.shippingCity,
        shippingState: input.shippingState,
        shippingZip: input.shippingZip,
        shippingCountry: input.shippingCountry,
        customerNote: input.customerNote,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: true, variant: true } },
        customer: { select: { fullName: true, username: true, telegramId: true } },
        merchant: { select: { companyName: true } },
      },
    });

    return sanitizeOrder(order);
  });
}

/**
 * 🔍 GET ORDER BY ID
 */
export async function getOrderById(orderId: string) {
  if (!isUUID(orderId)) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true, variant: true } },
      customer: { select: { id: true, telegramId: true, fullName: true, username: true, phoneNumber: true } },
      merchant: { select: { id: true, companyName: true, contactSupportUrl: true } },
      rider: { include: { user: { select: { fullName: true, phoneNumber: true } } } },
      payments: true,
    },
  });

  return sanitizeOrder(order);
}

/**
 * 🛰️ GET MERCHANT ORDERS (Staff Aware)
 * Logic: If merchantId is undefined (Staff), it fetches platform-wide orders.
 */
export async function getMerchantOrders(
  merchantId?: string, 
  options: { status?: OrderStatus; limit?: number; offset?: number } = {}
) {
  if (merchantId && !isUUID(merchantId)) return { orders: [], total: 0 };

  const { status, limit = 50, offset = 0 } = options;
  
  // 🛡️ RBAC Scope filtering
  const where = {
    ...(merchantId && { merchantId }),
    ...(status && { status })
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: { include: { product: { select: { name: true, imageUrl: true } } } },
        customer: { select: { fullName: true, username: true } },
        rider: { include: { user: { select: { fullName: true } } } },
        merchant: { select: { companyName: true } }, // Useful for Staff Global View
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map(o => sanitizeOrder(o)),
    total,
  };
}

/**
 * 🔄 UPDATE ORDER STATUS
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  if (!isUUID(orderId)) throw new Error("Invalid Order ID format");

  const updateData: any = { status };
  if (status === "DISPATCHED") updateData.dispatchedAt = new Date();
  else if (status === "DELIVERED") updateData.deliveredAt = new Date();
  if (note) updateData.merchantNote = note;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: updateData,
    include: { customer: { select: { telegramId: true, fullName: true } } },
  });

  return sanitizeOrder(order);
}

/**
 * 🏁 COMPLETE ORDER (Escrow Release)
 */
export async function completeOrder(orderId: string) {
  if (!isUUID(orderId)) throw new Error("Invalid Order ID");

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { merchant: true },
    });

    if (!order) throw new Error("Order not found");
    if (order.status !== "DELIVERED") throw new Error("Deliver protocol incomplete");

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    // 🏧 FINANCIAL RECONCILIATION
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