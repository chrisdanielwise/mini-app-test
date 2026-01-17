"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";
import { cache } from "react";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Architecture: Hydration safety for BigInt (Telegram IDs) and Decimals.
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v))
  );
}

// =================================================================
// 🛡️ SERVICE PROTOCOLS (Hardened v16.16.12)
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
 * Performance: Memoized for Next.js 15+ Partial Prerendering.
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
 * Logic: Initializes a new service cluster for a merchant.
 */
export async function createService(input: any) {
  if (!isUUID(input.merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Merchant_ID");

  const service = await prisma.service.create({
    data: {
      ...input,
      isActive: true,
    },
  });

  return sanitize(service);
}

/**
 * 🔄 CREATE_SERVICE_TIER
 * Logic: Establishes a pricing sub-node (Interval-aware).
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

  return sanitize(updated);
}