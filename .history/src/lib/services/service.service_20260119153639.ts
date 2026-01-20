"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";

/**
 * ✅ PRISMA TYPES INGRESS (v2026.1.20)
 * Fix: Synchronized Enum names with generated Prisma schema.
 * Note: 'ServiceTierInterval' usually maps to 'IntervalUnit'.
 * Note: 'ServiceTierType' usually maps to 'TierType'.
 */
import { 
  SubscriptionStatus, 
  IntervalUnit, // ✅ FIXED: Corrected from ServiceTierInterval
  TierType,     // ✅ FIXED: Corrected from ServiceTierType
  type Service,
  type ServiceTier
} from from "@/generated/prisma";

// ✅ FIX: Standard Decimal ingress for Next.js 15
import { Decimal } from "@prisma/client/runtime/library";

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
      // Ensure Decimal objects from Prisma are converted to strings for the frontend
      if (v && typeof v === 'object' && v.constructor.name === 'Decimal') return v.toString();
      return v;
    })
  );
}

// =================================================================
// 🛡️ SERVICE PROTOCOLS
// =================================================================

export const getServicesByMerchant = cache(async (merchantId?: string): Promise<any[]> => {
  if (merchantId && !isUUID(merchantId)) return [];

  const services = await prisma.service.findMany({
    where: {
      ...(merchantId && { merchantId }),
      isActive: true 
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
          type: true
        }
      },
      _count: {
        select: {
          // ✅ FIX: Using strictly typed Enum member
          subscriptions: { where: { status: SubscriptionStatus.ACTIVE } }, 
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sanitize(services);
});

export async function createService(input: any): Promise<Service> {
  if (!isUUID(input.merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Merchant_ID");

  const service = await prisma.service.create({
    data: {
      ...input,
      isActive: true,
    },
  });

  // ✅ FIX: Next.js 15 revalidateTag with mandatory second argument
  revalidateTag("catalog_node", "page");

  return sanitize(service);
}

/**
 * 🔄 CREATE_SERVICE_TIER
 */
export async function createServiceTier(input: {
  serviceId: string;
  name: string;
  price: number | Decimal;
  interval?: IntervalUnit; // ✅ Updated
  type?: TierType;        // ✅ Updated
}): Promise<ServiceTier> {
  if (!isUUID(input.serviceId)) throw new Error("PROTOCOL_ERROR: Invalid_Service_ID");

  const tier = await prisma.serviceTier.create({
    data: {
      serviceId: input.serviceId,
      name: input.name,
      price: input.price,
      // ✅ FIX: Enum member assignment
      interval: input.interval || IntervalUnit.MONTH,
      type: input.type || TierType.CUSTOM,
      isActive: true,
    },
  });

  revalidateTag("catalog_node", "page");

  return sanitize(tier);
}

export async function deleteService(serviceId: string): Promise<Service> {
  if (!isUUID(serviceId)) throw new Error("PROTOCOL_ERROR: Target_ID_Malformed");

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  });

  revalidateTag("catalog_node", "page");

  return sanitize(updated);
}