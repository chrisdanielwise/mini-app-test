"use server";

import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { cache } from "react";
import { revalidateTag } from "next/cache";

/**
 * ✅ PRISMA TYPES INGRESS (v2026.1.20)
 * Fix: TS2305 - Mapping the specific SubscriptionType members from your schema.
 */
import {
  SubscriptionStatus,
  IntervalUnit,
  SubscriptionType, // ✅ Use the name exactly as it appears in your prisma file
  type Service,
  type ServiceTier,
} from "@/generated/prisma";

import { Decimal } from "@prisma/client-runtime-utils";

// =================================================================
// 🛠️ INTERNAL SYSTEM HELPERS
// =================================================================

function sanitize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(
    JSON.stringify(data, (_, v) => {
      if (typeof v === "bigint") return v.toString();
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

/**
 * 🔄 CREATE_SERVICE_TIER
 */
export async function createServiceTier(input: {
  serviceId: string;
  name: string;
  price: number | Decimal;
  interval?: IntervalUnit;
  type?: SubscriptionType;
}): Promise<ServiceTier> {
  if (!isUUID(input.serviceId))
    throw new Error("PROTOCOL_ERROR: Invalid_Service_ID");

  const tier = await prisma.serviceTier.create({
    data: {
      serviceId: input.serviceId,
      name: input.name,
      price: input.price,
      // ✅ FIX: Using the members defined in your specific enum
      interval: input.interval || IntervalUnit.MONTH,
      type: input.type || SubscriptionType.ONE_MONTH, 
      isActive: true,
    },
  });

  revalidateTag("catalog_node", "page");

  return sanitize(tier);
}

export async function deleteService(serviceId: string): Promise<Service> {
  if (!isUUID(serviceId))
    throw new Error("PROTOCOL_ERROR: Target_ID_Malformed");

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  });

  revalidateTag("catalog_node" ,"page");

  return sanitize(updated);
}

