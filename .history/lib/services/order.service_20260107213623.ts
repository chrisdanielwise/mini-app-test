import prisma from "@/lib/db"
import type { OrderStatus } from "@/generated/prisma"
import { Decimal } from "@prisma/client/runtime/library"

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
   */
  static async create(input: CreateOrderInput) {
    return prisma.$transaction(async (tx) => {
      // Calculate totals and validate stock
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
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        })

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`)
        }

        let unitPrice = product.basePrice
        let variantInfo: object | undefined

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId)
          if (!variant) {
            throw new Error(`Variant not found: ${item.variantId}`)
          }
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

      // Create order
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
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          customer: {
            select: {
              fullName: true,
              username: true,
              telegramId: true,
            },
          },
          merchant: {
            select: {
              companyName: true,
            },
          },
        },
      })

      return order
    })
  }

  /**
   * Get order by ID
   */
  static async getById(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        customer: {
          select: {
            id: true,
            telegramId: true,
            fullName: true,
            username: true,
            phoneNumber: true,
          },
        },
        merchant: {
          select: {
            id: true,
            companyName: true,
            contactSupportUrl: true,
          },
        },
        rider: {
          include: {
            user: {
              select: {
                fullName: true,
                phoneNumber: true,
              },
            },
          },
        },
        payments: true,
      },
    })
  }

  /**
   * Update order status
   */
  static async updateStatus(orderId: string, status: OrderStatus, note?: string) {
    const updateData: any = { status }

    if (status === "DISPATCHED") {
      updateData.dispatchedAt = new Date()
    } else if (status === "DELIVERED") {
      updateData.deliveredAt = new Date()
    }

    if (note) {
      updateData.merchantNote = note
    }

    return prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: true,
        customer: {
          select: {
            telegramId: true,
            fullName: true,
          },
        },
      },
    })
  }

  /**
   * Assign rider to order
   */
  static async assignRider(orderId: string, riderId: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        riderId,
        status: "DISPATCHED",
        dispatchedAt: new Date(),
      },
      include: {
        rider: {
          include: {
            user: {
              select: {
                fullName: true,
                phoneNumber: true,
                telegramId: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Get merchant orders
   */
  static async getMerchantOrders(
    merchantId: string,
    options: {
      status?: OrderStatus
      limit?: number
      offset?: number
    } = {},
  ) {
    const { status, limit = 50, offset = 0 } = options

    const where = {
      merchantId,
      ...(status && { status }),
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
          customer: {
            select: {
              fullName: true,
              username: true,
            },
          },
          rider: {
            include: {
              user: {
                select: {
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where }),
    ])

    return { orders, total }
  }

  /**
   * Get rider's active orders
   */
  static async getRiderOrders(riderId: string) {
    return prisma.order.findMany({
      where: {
        riderId,
        status: { in: ["DISPATCHED", "READY_FOR_PICKUP"] },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
        customer: {
          select: {
            fullName: true,
            phoneNumber: true,
            telegramId: true,
          },
        },
        merchant: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })
  }

  /**
   * Complete order (release escrow to merchant)
   */
  static async complete(orderId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          merchant: true,
          payments: { where: { status: "SUCCESS" } },
        },
      })

      if (!order) {
        throw new Error("Order not found")
      }

      if (order.status !== "DELIVERED") {
        throw new Error("Order must be delivered before completion")
      }

      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      })

      // Transfer from escrow to available balance
      // (Payment was already in escrow, now release it)
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
   * Get orders ready for pickup (for logistics topic)
   */
  static async getReadyForPickup(merchantId?: string) {
    return prisma.order.findMany({
      where: {
        status: "READY_FOR_PICKUP",
        ...(merchantId && { merchantId }),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                dispatchType: true,
              },
            },
          },
        },
        customer: {
          select: {
            fullName: true,
            phoneNumber: true,
          },
        },
        merchant: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })
  }
}
