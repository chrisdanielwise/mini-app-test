import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { IntervalUnit, SubscriptionType } from "@/src/generated/prisma";

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

/**
 * 🛰️ HYDRATION TRANSLATOR
 * Essential for Next.js 15 + Turbopack to handle BigInts safely.
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
// 🛡️ SERVICE COMMANDS
// =================================================================

/**
 * 🛰️ FETCH CLUSTER: getServicesByMerchant
 * Retrieves the full service stack for a merchant with live telemetry.
 */
export async function getServicesByMerchant(merchantId: string) {
  if (!isUUID(merchantId)) return [];

  const services = await prisma.service.findMany({
    where: { merchantId, isActive: true },
    include: {
      tiers: {
        where: { isActive: true },
        orderBy: { price: "asc" },
      },
      _count: {
        select: {
          // ✅ APEX FIX: Case-sensitive status matching
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
 * Defines the monetization interval (Day/Month/Year).
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
 * Preserves historical ledger data by flipping the 'isActive' flag.
 */
export async function deleteService(serviceId: string) {
  if (!isUUID(serviceId)) throw new Error("Format_Error: Invalid ID");

  return prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  });
}