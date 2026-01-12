import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🚀 INTERFACES
// =================================================================

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

// =================================================================
// 🛠️ INTERNAL HELPERS
// =================================================================

/**
 * Ensures Decimal types are converted to strings for Next.js Server-to-Client transport.
 */
function sanitizeProduct(product: any) {
  if (!product) return null;
  return JSON.parse(
    JSON.stringify(product, (key, value) => {
      if (value instanceof Decimal) return value.toString();
      if (typeof value === "bigint") return value.toString();
      return value;
    })
  );
}

// =================================================================
// 🛡️ NAMED EXPORTS (RBAC & Staff Aware)
// =================================================================

/**
 * 🛰️ CREATE PRODUCT
 */
export async function createProduct(input: CreateProductInput) {
  if (!isUUID(input.merchantId) || !isUUID(input.categoryId)) {
    throw new Error("Invalid Merchant or Category ID format");
  }

  const product = await prisma.product.create({
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

  return sanitizeProduct(product);
}

/**
 * 🔍 GET PRODUCT BY ID
 */
export async function getProductById(productId: string) {
  if (!isUUID(productId)) return null;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      variants: true,
      merchant: { select: { id: true, companyName: true } },
    },
  });

  return sanitizeProduct(product);
}

/**
 * 🛰️ GET PRODUCTS BY MERCHANT (Staff Aware)
 * Logic: If merchantId is undefined (Staff), it fetches platform-wide inventory.
 */
export async function getProductsByMerchant(
  merchantId?: string,
  options: {
    categoryId?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  } = {}
) {
  // 🛡️ Guard: Only validate if ID is provided. Staff bypass for oversight.
  if (merchantId && !isUUID(merchantId)) {
    return { products: [], total: 0 };
  }

  const { categoryId, isActive = true, limit = 50, offset = 0 } = options;

  if (categoryId && !isUUID(categoryId)) {
    throw new Error("Invalid Category ID format");
  }

  // Build Dynamic Scope
  const where = {
    ...(merchantId && { merchantId }),
    isActive,
    ...(categoryId && { categoryId }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
        merchant: { select: { companyName: true } }, // Helpful for Staff view
      },
      orderBy: [{ popularity: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => sanitizeProduct(p)),
    total,
  };
}

/**
 * 🔄 UPDATE PRODUCT
 */
export async function updateProduct(productId: string, data: Partial<CreateProductInput>) {
  if (!isUUID(productId)) throw new Error("Invalid Product ID format");

  const updated = await prisma.product.update({
    where: { id: productId },
    data,
    include: {
      category: true,
      variants: true,
    },
  });

  return sanitizeProduct(updated);
}

/**
 * 📦 ADD VARIANT
 */
export async function addProductVariant(input: CreateVariantInput) {
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
 * 📉 DECREMENT STOCK (Atomic Protocol)
 */
export async function decrementProductStock(variantId: string, quantity: number) {
  if (!isUUID(variantId)) throw new Error("Invalid Variant ID format");

  return prisma.productVariant.update({
    where: { id: variantId },
    data: {
      stock: { decrement: quantity },
    },
  });
}

/**
 * 📈 INCREMENT POPULARITY
 */
export async function incrementProductPopularity(productId: string) {
  if (!isUUID(productId)) throw new Error("Invalid Product ID format");

  return prisma.product.update({
    where: { id: productId },
    data: { popularity: { increment: 1 } },
  });
}

/**
 * 🔍 SEARCH PRODUCTS (Staff Aware)
 */
export async function searchProducts(query: string, merchantId?: string, limit = 20) {
  if (merchantId && !isUUID(merchantId)) return [];

  const products = await prisma.product.findMany({
    where: {
      ...(merchantId && { merchantId }),
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      category: true,
      variants: true,
      merchant: { select: { companyName: true } },
    },
    orderBy: { popularity: "desc" },
    take: limit,
  });

  return products.map((p) => sanitizeProduct(p));
}