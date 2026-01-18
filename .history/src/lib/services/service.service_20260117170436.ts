"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
import { CACHE_PROFILES } from "@/lib/auth/config";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Architecture: Hydration safety for BigInt (TG_IDs) and Decimals.
 * Fix: Ensures compatibility with Next.js 15+ streaming boundaries.
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  );
}

// =================================================================
// 🛡️ SERVICE PROTOCOLS (Hardened v16.16.20)
// =================================================================

/**
 * 📊 GET_SERVICES_BY_MERCHANT
 * Logic: Parallelized aggregate fetching with Lean Projections.
 */
export const getServicesByMerchant = cache(async (merchantId?: string) => {
  if (merchantId && !isUUID(merchantId)) return [];

  const where = {
    ...(merchantId && { merchantId }),
    isActive: true 
  };

  const services = await prisma.service.findMany({
    where,
    select: {
      id: true,
      name: true,
      description: true,
      categoryTag: true,
      createdAt: true,
      merchant: { select: { companyName: true } },
      tiers: {
        where: { isActive: true },
        orderBy: { price: "asc" },
        select: {
          id: true,
          name: true,
          price: true,
          interval: true,
          type: true
        }
      },
      _count: {
        select: {
          subscriptions: { where: { status: "ACTIVE" } }, 
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sanitize(services);
});

/**
 * 🔍 GET_SERVICE_BY_ID
 * Performance: Memoized for Next.js 15+ Partial Prerendering (PPR).
 */
export const getServiceById = cache(async (serviceId: string) => {
  if (!isUUID(serviceId)) return null;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      name: true,
      description: true,
      vipChannelId: true,
      merchant: { select: { companyName: true, id: true } },
      tiers: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      }
    },
  });

  return sanitize(service);
});

/**
 * 🏗️ CREATE_SERVICE_NODE
 * Logic: Initializes a new service cluster.
 * Fix: Atomic revalidation of the catalog profile.
 */
export async function createService(input: any) {
  if (!isUUID(input.merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Merchant_ID");

  const service = await prisma.service.create({
    data: {
      ...input,
      isActive: true,
    },
  });

  // 🏛️ ATOMIC CACHE PURGE
  revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);

  return sanitize(service);
}

/**
 * 🔄 CREATE_SERVICE_TIER
 * Logic: Establishes a pricing sub-node.
 */
export async function createServiceTier(input: any) {
  if (!isUUID(input.serviceId)) throw new Error("PROTOCOL_ERROR: Invalid_Service_ID");

  const tier = await prisma.serviceTier.create({
    data: {
      serviceId: input.serviceId,
      name: input.name,
      price: input.price,
      interval: input.interval || "MONTH",
      type: input.type || "CUSTOM",
      isActive: true,
    },
  });

  // 🚀 PURGE: Ensures new pricing reflects in the Mini App immediately
  revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);

  return sanitize(tier);
}

/**
 * 🧹 TERMINATE_SERVICE
 * Logic: Soft-delete protocol (isActive: false) to preserve ledger history.
 */
export async function deleteService(serviceId: string) {
  if (!isUUID(serviceId)) throw new Error("PROTOCOL_ERROR: Target_ID_Malformed");

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  });

  revalidateTag("catalog_node", CACHE_PROFILES.CONTENT);

  return sanitize(updated);
}