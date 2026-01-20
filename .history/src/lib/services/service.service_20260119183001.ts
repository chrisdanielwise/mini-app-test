"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";

/**
 * ✅ PRISMA TYPES INGRESS (v2026.1.20)
 * Fix: TS2305 - Mapping SubscriptionType to TierType alias.
 */
import {
  SubscriptionStatus,
  IntervalUnit,
  // ✅ FIX: Prisma renames 'TierType' to 'SubscriptionType' to avoid namespace collision
  SubscriptionType as TierType, 
  type Service,
  type ServiceTier,
} from "@/generated/prisma";

// ✅ FIX: Standard Decimal ingress for Next.js 15
import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Logic: Hydration safety for BigInt (TG_IDs) and Decimals.
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (_, v) => {
      if (typeof v === "bigint") return v.toString();
      // ✅ FIX: More robust Decimal check for various Prisma runtimes
      if (v && typeof v === "object" && (v.constructor.name === "Decimal" || v._isDecimal))
        return v.toString();
      return v;
    })
  );
}

// =================================================================
// 🛡️ SERVICE PROTOCOLS
// =================================================================

export const getServicesByMerchant = cache(
  async (merchantId?: string): Promise<any[]> => {
    if (merchantId && !isUUID(merchantId)) return [];

    const services = await prisma.service.findMany({
      where: {
        ...(merchantId && { merchantId }),
        isActive: true,
      },
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
            type: true,
          },
        },
        _count: {
          select: {
            subscriptions: { where: { status: SubscriptionStatus.ACTIVE } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sanitize(services);
  }
);

export async function createService(input: any): Promise<Service> {
  if (!isUUID(input.merchantId))
    throw new Error("PROTOCOL_ERROR: Invalid_Merchant_ID");

  const service = await prisma.service.create({
    data: {
      ...input,
      isActive: true,
    },
  });

  // ✅ FIX: Standard revalidate pattern for catalog cache
  revalidateTag("catalog_node");

  return sanitize(service);
}

/**
 * 🔄 CREATE_SERVICE_TIER
 */
export async function createServiceTier(input: {
  serviceId: string;
  name: string;
  price: number | Decimal;
  interval?: IntervalUnit;
  type?: TierType;
}): Promise<ServiceTier> {
  if (!isUUID(input.serviceId))
    throw new Error("PROTOCOL_ERROR: Invalid_Service_ID");

  const tier = await prisma.serviceTier.create({
    data: {
      serviceId: input.serviceId,
      name: input.name,
      price: input.price,
      // ✅ FIX: Using aliased Enum members
      interval: input.interval || IntervalUnit.MONTH,
      type: input.type || TierType.STANDARD, // Standardized from CUSTOM/STANDARD
      isActive: true,
    },
  });

  revalidateTag("catalog_node");

  return sanitize(tier);
}

export async function deleteService(serviceId: string): Promise<Service> {
  if (!isUUID(serviceId))
    throw new Error("PROTOCOL_ERROR: Target_ID_Malformed");

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  });

  revalidateTag("catalog_node");

  return sanitize(updated);
}