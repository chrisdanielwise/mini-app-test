"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";
// ✅ PRISMA TYPES INGRESS
import { 
  SubscriptionStatus, 
  ServiceTierInterval, 
  ServiceTierType, 
  Prisma,
  Service,
  ServiceTier
} from "@/generated/prisma";
// ✅ CORRECTED DECIMAL PATH
import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

/**
 * 🌊 ATOMIC_SANITIZE
 * Logic: Hydration safety for BigInt (TG_IDs) and Decimals.
 * Fix: Standardized to check constructor names for Decimal reliability.
 */
function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (_, v) => {
      if (typeof v === "bigint") return v.toString();
      if (v?.constructor?.name === 'Decimal') return v.toString();
      return v;
    })
  );
}

// =================================================================
// 🛡️ SERVICE PROTOCOLS (Hardened v2026.1.20)
// =================================================================

/**
 * 📊 GET_SERVICES_BY_MERCHANT
 * Fix: Replaced "ACTIVE" with SubscriptionStatus.ACTIVE.
 */
export const getServicesByMerchant = cache(async (merchantId?: string): Promise<any[]> => {
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
          // ✅ FIX: Use SubscriptionStatus.ACTIVE (Maps to "active" in DB)
          subscriptions: { where: { status: SubscriptionStatus.ACTIVE } }, 
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sanitize(services);
});

/**
 * 🔍 GET_SERVICE_BY_ID
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
 */
export async function createService(input: any): Promise<Service> {
  if (!isUUID(input.merchantId)) throw new Error("PROTOCOL_ERROR: Invalid_Merchant_ID");

  const service = await prisma.service.create({
    data: {
      ...input,
      isActive: true,
    },
  });

  // ✅ FIX: Mandatory second argument for revalidateTag in Next.js 15
  revalidateTag("catalog_node", "default");

  return sanitize(service);
}

/**
 * 🔄 CREATE_SERVICE_TIER
 * Fix: Replaced raw strings with ServiceTierInterval and ServiceTierType enums.
 */
export async function createServiceTier(input: {
  serviceId: string;
  name: string;
  price: number | Decimal;
  interval?: ServiceTierInterval;
  type?: ServiceTierType;
}): Promise<ServiceTier> {
  if (!isUUID(input.serviceId)) throw new Error("PROTOCOL_ERROR: Invalid_Service_ID");

  const tier = await prisma.serviceTier.create({
    data: {
      serviceId: input.serviceId,
      name: input.name,
      price: input.price,
      // ✅ FIX: Using Enum objects instead of strings like "MONTH"
      interval: input.interval || ServiceTierInterval.MONTH,
      type: input.type || ServiceTierType.CUSTOM,
      isActive: true,
    },
  });

  revalidateTag("catalog_node", "default");

  return sanitize(tier);
}

/**
 * 🧹 TERMINATE_SERVICE
 */
export async function deleteService(serviceId: string): Promise<Service> {
  if (!isUUID(serviceId)) throw new Error("PROTOCOL_ERROR: Target_ID_Malformed");

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  });

  revalidateTag("catalog_node", "default");

  return sanitize(updated);
}