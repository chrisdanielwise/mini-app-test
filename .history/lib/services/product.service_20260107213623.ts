import prisma from "@/lib/db"
import type { Decimal } from "@prisma/client/runtime/library"

export interface CreateProductInput {
  merchantId: string
  categoryId: string
  name: string
  slug: string
  description?: string
  basePrice: Decimal
  currency?: string
  imageUrl?: string
  dispatchType?: "BIKE" | "VAN" | "TRUCK"
}

export interface CreateVariantInput {
  productId: string
  sku?: string
  attributes: Record<string, string>
  price: Decimal
  stock: number
  mediaUrl?: string
}

export class ProductService {
  /**
   * Create a new product
   */
  static async create(input: CreateProductInput) {
    return prisma.product.create({
      data: {
        merchantId: input.merchantId,
        categoryId: input.categoryId,
        name: input.name,
        slug: input.slug,
        description: input.description,
        basePrice: input.basePrice,
        currency: input.currency || "USD",
        imageUrl: input.imageUrl,
        dispatchType: input.dispatchType || "BIKE",
      },
      include: {
        category: true,
        variants: true,
      },
    })
  }

  /**
   * Get product by ID
   */
  static async getById(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        variants: true,
        merchant: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    })
  }

  /**
   * Get products by merchant
   */
  static async getByMerchant(
    merchantId: string,
    options: {
      categoryId?: string
      isActive?: boolean
      limit?: number
      offset?: number
    } = {},
  ) {
    const { categoryId, isActive = true, limit = 50, offset = 0 } = options

    const where = {
      merchantId,
      isActive,
      ...(categoryId && { categoryId }),
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
        },
        orderBy: [{ popularity: "desc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
      prisma.product.count({ where }),
    ])

    return { products, total }
  }

  /**
   * Get products by category (for bot gallery)
   */
  static async getByCategory(categoryId: string, limit = 10) {
    return prisma.product.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      include: {
        variants: {
          where: { stock: { gt: 0 } },
        },
      },
      orderBy: { popularity: "desc" },
      take: limit,
    })
  }

  /**
   * Update product
   */
  static async update(productId: string, data: Partial<CreateProductInput>) {
    return prisma.product.update({
      where: { id: productId },
      data,
      include: {
        category: true,
        variants: true,
      },
    })
  }

  /**
   * Add variant to product
   */
  static async addVariant(input: CreateVariantInput) {
    return prisma.productVariant.create({
      data: {
        productId: input.productId,
        sku: input.sku,
        attributes: input.attributes,
        price: input.price,
        stock: input.stock,
        mediaUrl: input.mediaUrl,
      },
    })
  }

  /**
   * Update variant stock
   */
  static async updateStock(variantId: string, quantity: number) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: quantity },
    })
  }

  /**
   * Decrement variant stock (for orders)
   */
  static async decrementStock(variantId: string, quantity: number) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: {
        stock: { decrement: quantity },
      },
    })
  }

  /**
   * Increment product popularity (for analytics)
   */
  static async incrementPopularity(productId: string) {
    return prisma.product.update({
      where: { id: productId },
      data: { popularity: { increment: 1 } },
    })
  }

  /**
   * Search products
   */
  static async search(merchantId: string, query: string, limit = 20) {
    return prisma.product.findMany({
      where: {
        merchantId,
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: true,
        variants: true,
      },
      orderBy: { popularity: "desc" },
      take: limit,
    })
  }
}
