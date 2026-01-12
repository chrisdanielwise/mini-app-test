import prisma from "@/lib/db";
// import type { Decimal } from "@prisma/client/runtime/library";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client-runtime-utils";

export interface CreateProductInput {
  merchantId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: Decimal;
  currency?: string;
  imageUrl?: string;
  dispatchType?: "BIKE" | "VAN" | "TRUCK";
}

export interface CreateVariantInput {
  productId: string;
  sku?: string;
  attributes: Record<string, string>;
  price: Decimal;
  stock: number;
  mediaUrl?: string;
}

export class ProductService {
  /**
   * Create a new product
   * Safeguarded with UUID validation for Merchant and Category
   */
  static async create(input: CreateProductInput) {
    if (!isUUID(input.merchantId) || !isUUID(input.categoryId)) {
      throw new Error("Invalid Merchant or Category ID format");
    }

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
    });
  }

  /**
   * Get product by ID
   */
  static async getById(productId: string) {
    if (!isUUID(productId)) return null;

    const product = await prisma.product.findUnique({
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
    });

    if (!product) return null;

    return {
      ...product,
      basePrice: product.basePrice.toString(), // Decimal safety
      variants: product.variants.map((v) => ({
        ...v,
        price: v.price.toString(),
      })),
    };
  }

  /**
   * Get products by merchant
   */
  static async getByMerchant(
    merchantId: string,
    options: {
      categoryId?: string;
      isActive?: boolean;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    if (!isUUID(merchantId)) return { products: [], total: 0 };

    const { categoryId, isActive = true, limit = 50, offset = 0 } = options;

    // Validate categoryId if provided
    if (categoryId && !isUUID(categoryId)) {
      throw new Error("Invalid Category ID format");
    }

    const where = {
      merchantId,
      isActive,
      ...(categoryId && { categoryId }),
    };

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
    ]);

    return {
      products: products.map((p) => ({
        ...p,
        basePrice: p.basePrice.toString(),
        variants: p.variants.map((v) => ({
          ...v,
          price: v.price.toString(),
        })),
      })),
      total,
    };
  }

  /**
   * Get products by category (for bot gallery)
   */
  static async getByCategory(categoryId: string, limit = 10) {
    if (!isUUID(categoryId)) return [];

    const products = await prisma.product.findMany({
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
    });

    return products.map((p) => ({
      ...p,
      basePrice: p.basePrice.toString(),
      variants: p.variants.map((v) => ({
        ...v,
        price: v.price.toString(),
      })),
    }));
  }

  /**
   * Update product
   */
  static async update(productId: string, data: Partial<CreateProductInput>) {
    if (!isUUID(productId)) throw new Error("Invalid Product ID format");

    return prisma.product.update({
      where: { id: productId },
      data,
      include: {
        category: true,
        variants: true,
      },
    });
  }

  /**
   * Add variant to product
   */
  static async addVariant(input: CreateVariantInput) {
    if (!isUUID(input.productId)) throw new Error("Invalid Product ID format");

    return prisma.productVariant.create({
      data: {
        productId: input.productId,
        sku: input.sku,
        attributes: input.attributes,
        price: input.price,
        stock: input.stock,
        mediaUrl: input.mediaUrl,
      },
    });
  }

  /**
   * Update variant stock
   */
  static async updateStock(variantId: string, quantity: number) {
    if (!isUUID(variantId)) throw new Error("Invalid Variant ID format");

    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: quantity },
    });
  }

  /**
   * Decrement variant stock (for orders)
   */
  static async decrementStock(variantId: string, quantity: number) {
    if (!isUUID(variantId)) throw new Error("Invalid Variant ID format");

    return prisma.productVariant.update({
      where: { id: variantId },
      data: {
        stock: { decrement: quantity },
      },
    });
  }

  /**
   * Increment product popularity (for analytics)
   */
  static async incrementPopularity(productId: string) {
    if (!isUUID(productId)) throw new Error("Invalid Product ID format");

    return prisma.product.update({
      where: { id: productId },
      data: { popularity: { increment: 1 } },
    });
  }

  /**
   * Search products
   */
  static async search(merchantId: string, query: string, limit = 20) {
    if (!isUUID(merchantId)) return [];

    const products = await prisma.product.findMany({
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
    });

    return products.map((p) => ({
      ...p,
      basePrice: p.basePrice.toString(),
      variants: p.variants.map((v) => ({
        ...v,
        price: v.price.toString(),
      })),
    }));
  }
}
