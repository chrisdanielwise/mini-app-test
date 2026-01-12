import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { IntervalUnit, SubscriptionType } from "@/generated/prisma";

// =================================================================
// 🚀 INTERFACES
// =================================================================

export interface CreateServiceInput {
  merchantId: string;
  name: string;
  description?: string;
  categoryTag?: string;
  vipChannelId?: bigint;
}

export interface CreateTierInput {
  serviceId: string;
  name: string;
  price: number;
  interval?: IntervalUnit;
  type?: SubscriptionType;
}

// =================================================================
// 🛠️ INTERNAL HELPERS
// =================================================================

/**
 * 🛰️ HYDRATION TRANSLATOR
 * Essential for Next.js 15+ to handle BigInts and Decimals safely.
 */
function sanitize(data: any) {
  if (!data) return null;
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// =================================================================
// 🛡️ SERVICE COMMANDS (Hardened Named Exports)
// =================================================================

/**
 * 🛰️ FETCH CLUSTER: getServicesByMerchant
 * Logic: If merchantId is undefined (Staff), it fetches the platform-wide service catalog.
 */
export async function getServicesByMerchant(merchantId?: string) {
  // 🛡️ Staff Bypass: Only validate if ID is provided.
  if (merchantId && !isUUID(merchantId)) return [];

  const where = {
    ...(merchantId && { merchantId }),
    isActive: true 
  };

  const services = await prisma.service.findMany({
    where,
    include: {
      tiers: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
      merchant: { select: { companyName: true } }, // Helpful for Staff oversight
      _count: {
        select: {
          subscriptions: { where: { status: "ACTIVE" } }, 
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sanitize(services);
}

/**
 * 🛰️ FETCH NODE: getServiceById
 */
export async function getServiceById(serviceId: string) {
  if (!isUUID(serviceId)) return null;

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      tiers: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
      merchant: { select: { companyName: true, id: true } }
    },
  });

  return sanitize(service);
}

/**
 * 🛰️ CREATE NODE: createService
 */
export async function createService(input: CreateServiceInput) {
  if (!isUUID(input.merchantId)) throw new Error("Format_Error: Invalid Merchant ID");

  const service = await prisma.service.create({
    data: {
      ...input,
      isActive: true,
    },
  });

  return sanitize(service);
}

/**
 * 🛰️ CREATE SUB-NODE: createServiceTier
 */
export async function createServiceTier(input: CreateTierInput) {
  if (!isUUID(input.serviceId)) throw new Error("Format_Error: Invalid Service ID");

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
 * 🛰️ SOFT DELETE: deleteService
 */
export async function deleteService(serviceId: string) {
  if (!isUUID(serviceId)) throw new Error("Format_Error: Invalid ID");

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  });

  return sanitize(updated);
}