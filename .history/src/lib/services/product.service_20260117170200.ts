"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client/runtime-library";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE_PRODUCT
 * Architecture: Pure functional normalization for Next.js 15+ & Turbopack.
 * Logic: Recursively handles BigInt (TG_IDs) and Decimals (Capital).
 */
function sanitizeProduct<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // Handle Prisma Decimal Class
      if (value?.d && value?.s) return value.toString();
      // Handle BigInt (Telegram IDs)
      if (typeof value === "bigint") return value.toString();
      return value;
    })
  );
}

// =================================================================
// 🛡️ PRODUCT PROTOCOLS (Hardened v16.16.20)
// =================================================================

/**
 * 🛰️ CREATE_PRODUCT
 * Logic: Anchors new inventory to a merchant and category node.
 * Fix: Implements CACHE_PROFILES.CONTENT ("static") purge for sub-1ms updates.
 */
export async function createProduct(input: any) {
  if (!isUUID(input.merchantId) || !isUUID(input.categoryId)) {
    throw new Error("PROTOCOL_ERROR: Invalid_Node_ID");
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
      category: { select: { name: true, slug: true } },
      variants: true,
    },
  });

  // 🏛️ ATOMIC CACHE PURGE
  // Profile: CACHE_PROFILES.CONTENT maps to "static"
  // Requirement: Refreshes the global/merchant catalog view instantly.
  revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);

  return sanitizeProduct(product);
}

/**
 * 📉 ATOMIC_STOCK_MUTATION
 * Logic: High-velocity stock decrement with protection against negative values.
 */
export async function decrementProductStock(variantId: string, quantity: number) {
  if (!isUUID(variantId)) throw new Error("PROTOCOL_ERROR: Invalid_Variant_ID");

  // We use a transaction to ensure we check current stock before decrementing
  return prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.findUnique({
      where: { id: variantId },
      select: { stock: true, productId: true }
    });

    if (!variant || variant.stock < quantity) {
      throw new Error("INVENTORY_EXHAUSTED: Insufficient_Stock_Node");
    }

    const updated = await tx.productVariant.update({
      where: { id: variantId },
      data: { stock: { decrement: quantity } },
    });

    // 🚀 PURGE: Invalidate catalog to show updated stock levels
    revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);

    return updated;
  });
}

/**
 * 🔍 GET_PRODUCTS (Staff & Merchant Aware)
 * Performance: Parallel count and findMany with lean selection.
 */
export const getProductsByMerchant = cache(async (
  merchantId?: string,
  options: {
    categoryId?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  } = {}
) => {
  if (merchantId && !isUUID(merchantId)) return { products: [], total: 0 };

  const { categoryId, isActive = true, limit = 50, offset = 0 } = options;

  const where = {
    ...(merchantId && { merchantId }),
    isActive,
    ...(categoryId && { categoryId }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        variants: { select: { price: true, stock: true, attributes: true } },
        merchant: { select: { companyName: true } },
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
});

/**
 * 🔍 SEARCH_CATALOG
 * Logic: Full-text search across Merchant/Global scopes.
 */
export const searchProducts = cache(async (query: string, merchantId?: string, limit = 20) => {
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
      category: { select: { name: true } },
      variants: { select: { price: true, stock: true } },
    },
    orderBy: { popularity: "desc" },
    take: limit,
  });

  return products.map((p) => sanitizeProduct(p));
});