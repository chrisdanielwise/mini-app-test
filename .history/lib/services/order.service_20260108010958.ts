import prisma from "@/lib/db"
import type { OrderStatus } from "@/generated/prisma"
import { Decimal } from "@prisma/client/runtime/library"
import { isUUID } from "@/lib/utils/validators"

export interface OrderItemInput {
  productId: string
  variantId?: string
  quantity: number
}

export interface CreateOrderInput {
  customerId: string
  merchantId: string
  items: OrderItemInput[]
  shippingName?: string
  shippingPhone?: string
  shippingAddress?: string
  shippingCity?: string
  shippingState?: string
  shippingZip?: string
  shippingCountry?: string
  customerNote?: string
}

export class OrderService {
  /**
   * Create a new order
   * PRISMA 7: Uses transaction logic and validated UUIDs
   */
  static async create(input: CreateOrderInput) {
    // 1. Validate Input UUIDs
    if (!isUUID(input.customerId) || !isUUID(input.merchantId)) {
      throw new Error("Invalid Customer or Merchant ID format")
    }

    return prisma.$transaction(async (tx) => {
      let totalAmount = new Decimal(0)
      const orderItems: Array<{
        productId: string
        variantId?: string
        productName: string
        variantInfo?: object
        unitPrice: Decimal
        quantity: number
        totalPrice: Decimal
      }> = []

      for (const item of input.items) {
        // Validate Item UUIDs
        if (!isUUID(item.productId) || (item.variantId && !isUUID(item.variantId))) {
          throw new Error(`Invalid ID format for product: ${item.productId}`)
        }

        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        })

        if (!product) throw new Error(`Product not found: ${item.productId}`)

        let unitPrice = product.basePrice
        let variantInfo: object | undefined

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId)
          if (!variant) throw new Error(`Variant not found: ${item.variantId}`)
          
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`)
          }
          unitPrice = variant.price
          variantInfo = variant.attributes as object

          // Decrement stock
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        }

        const itemTotal = unitPrice.mul(item.quantity)
        totalAmount = totalAmount.add(itemTotal)

        orderItems.push({
          productId: item.productId,
          variantId: item.variantId,
          productName: product.name,
          variantInfo,
          unitPrice,
          quantity: item.quantity,
          totalPrice: itemTotal,
        })
      }

      // Create order record
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
          items: {
            create: orderItems,
          },
        },
        include: {
          items: { include: { product: true, variant: true } },
          customer: { select: { fullName: true, username: true, telegramId: true } },
          merchant: { select: { companyName: true } },
        },
      })

      // Convert BigInt for JSON safety
      return {
        ...order,
        customer: {
          ...order.customer,
          telegramId: order.customer.telegramId.toString()
        }
      }
    })
  }

  /**
   * Get order by ID
   */
  static async getById(orderId: string) {
    if (!isUUID(orderId)) return null

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true, variant: true } },
        customer: { select: { id: true, telegramId: true, fullName: true, username: true, phoneNumber: true } },
        merchant: { select: { id: true, companyName: true, contactSupportUrl: true } },
        rider: { include: { user: { select: { fullName: true, phoneNumber: true } } } },
        payments: true,
      },
    })

    if (!order) return null

    // Ensure telegramId is a string for Next.js API consumption
    return {
      ...order,
      customer: {
        ...order.customer,
        telegramId: order.customer.telegramId.toString()
      }
    }
  }

  /**
   * Update order status
   */
  static async updateStatus(orderId: string, status: OrderStatus, note?: string) {
    if (!isUUID(orderId)) throw new Error("Invalid Order ID format")

    const updateData: any = { status }
    if (status === "DISPATCHED") updateData.dispatchedAt = new Date()
    else if (status === "DELIVERED") updateData.deliveredAt = new Date()

    if (note) updateData.merchantNote = note

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        customer: { select: { telegramId: true, fullName: true } },
      },
    })

    return {
      ...order,
      customer: {
        ...order.customer,
        telegramId: order.customer.telegramId.toString()
      }
    }
  }

  /**
   * Assign rider to order
   */
  static async assignRider(orderId: string, riderId: string) {
    if (!isUUID(orderId) || !isUUID(riderId)) throw new Error("Invalid ID format")

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        riderId,
        status: "DISPATCHED",
        dispatchedAt: new Date(),
      },
      include: {
        rider: {
          include: {
            user: { select: { fullName: true, phoneNumber: true, telegramId: true } },
          },
        },
      },
    })

    return {
      ...order,
      rider: order.rider ? {
        ...order.rider,
        user: {
          ...order.rider.user,
          telegramId: order.rider.user.telegramId.toString()
        }
      } : null
    }
  }

  /**
   * Get merchant orders
   */
  static async getMerchantOrders(
    merchantId: string,
    options: { status?: OrderStatus; limit?: number; offset?: number } = {},
  ) {
    if (!isUUID(merchantId)) return { orders: [], total: 0 }

    const { status, limit = 50, offset = 0 } = options
    const where = { merchantId, ...(status && { status }) }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: { select: { name: true, imageUrl: true } } } },
          customer: { select: { fullName: true, username: true } },
          rider: { include: { user: { select: { fullName: true } } } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where }),
    ])

    return { 
      orders: orders.map(o => ({ ...o, totalAmount: o.totalAmount.toString() })), 
      total 
    }
  }

  /**
   * Get rider's active orders
   */
  static async getRiderOrders(riderId: string) {
    if (!isUUID(riderId)) return []

    const orders = await prisma.order.findMany({
      where: {
        riderId,
        status: { in: ["DISPATCHED", "READY_FOR_PICKUP"] },
      },
      include: {
        items: { include: { product: { select: { name: true } } } },
        customer: { select: { fullName: true, phoneNumber: true, telegramId: true } },
        merchant: { select: { companyName: true } },
      },
      orderBy: { createdAt: "asc" },
    })

    return orders.map(o => ({
      ...o,
      totalAmount: o.totalAmount.toString(),
      customer: { ...o.customer, telegramId: o.customer.telegramId.toString() }
    }))
  }

  /**
   * Complete order (release escrow to merchant)
   */
  static async complete(orderId: string) {
    if (!isUUID(orderId)) throw new Error("Invalid Order ID")

    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          merchant: true,
          payments: { where: { status: "SUCCESS" } },
        },
      })

      if (!order) throw new Error("Order not found")
      if (order.status !== "DELIVERED") throw new Error("Order must be delivered before completion")

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      })

      // Decimal Arithmetic for Escrow Release
      const newBalance = order.merchant.availableBalance.add(order.totalAmount)
      const newEscrow = order.merchant.pendingEscrow.sub(order.totalAmount)

      await tx.merchantProfile.update({
        where: { id: order.merchantId },
        data: {
          availableBalance: newBalance,
          pendingEscrow: newEscrow,
        },
      })

      return updatedOrder
    })
  }

  /**
   * Get orders ready for pickup
   */
  static async getReadyForPickup(merchantId?: string) {
    if (merchantId && !isUUID(merchantId)) return []

    const orders = await prisma.order.findMany({
      where: {
        status: "READY_FOR_PICKUP",
        ...(merchantId && { merchantId }),
      },
      include: {
        items: { include: { product: { select: { name: true, dispatchType: true } } } },
        customer: { select: { fullName: true, phoneNumber: true } },
        merchant: { select: { companyName: true } },
      },
      orderBy: { createdAt: "asc" },
    })

    return orders.map(o => ({ ...o, totalAmount: o.totalAmount.toString() }))
  }
}