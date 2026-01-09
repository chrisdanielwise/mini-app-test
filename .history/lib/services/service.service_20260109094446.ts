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
 * Sanitizes data for Next.js hydration by converting BigInt and Decimal to strings.
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
// 🛡️ NAMED EXPORT FUNCTIONS (Fixed for Turbopack)
// =================================================================

/**
 * Get all services for a merchant with subscription counts and tiers.
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
          subscriptions: { where: { status: "active" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return sanitize(services);
}

/**
 * Get a single service by its UUID.
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
 * Create a new service record.
 */
export async function createService(input: CreateServiceInput) {
  if (!isUUID(input.merchantId)) throw new Error("Invalid Merchant ID");

  const service = await prisma.service.create({
    data: {
      merchantId: input.merchantId,
      name: input.name,
      description: input.description,
      categoryTag: input.categoryTag,
      vipChannelId: input.vipChannelId,
      isActive: true,
    },
  });

  return sanitize(service);
}

/**
 * Create a pricing tier for a digital service.
 */
export async function createServiceTier(input: CreateTierInput) {
  if (!isUUID(input.serviceId)) throw new Error("Invalid Service ID");

  const tier = await prisma.serviceTier.create({
    data: {
      serviceId: input.serviceId,
      name: input.name,
      price: input.price,
      interval: input.interval || "MONTH",
      type: input.type || "custom",
      isActive: true,
    },
  });

  return sanitize(tier);
}

/**
 * Soft delete a service.
 */
export async function deleteService(serviceId: string) {
  if (!isUUID(serviceId)) throw new Error("Invalid ID");

  return prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  });
}

/**
 * Soft delete a pricing tier.
 */
export async function deleteServiceTier(tierId: string) {
  if (!isUUID(tierId)) throw new Error("Invalid ID");

  return prisma.serviceTier.update({
    where: { id: tierId },
    data: { isActive: false },
  });
}