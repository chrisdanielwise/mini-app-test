import prisma from "@/lib/db";
import { isUUID } from "@/lib/utils/validators";
import { Decimal } from "@prisma/client-runtime-utils";

export interface CreateServiceInput {
  merchantId: string;
  name: string;
  description?: string;
  shortDescription?: string;
  telegramChannelId?: bigint;
  telegramGroupId?: bigint;
}

export interface CreateTierInput {
  serviceId: string;
  name: string;
  description?: string;
  price: number | Decimal; // Updated to support Decimal precision
  durationDays: number;
  maxConcurrentDevices?: number;
}

export class ServiceService {
  /**
   * Get all services for a merchant
   * PRISMA 7: Safeguarded against malformed UUIDs and BigInt serialization
   */
  static async getByMerchant(merchantId: string) {
    if (!isUUID(merchantId)) return [];

    const services = await prisma.service.findMany({
      where: { merchantId, isActive: true },
      include: {
        tiers: {
          where: { isActive: true },
          orderBy: { price: "asc" }, // Assuming 'price' field name in schema
        },
        _count: {
          select: {
            subscriptions: { where: { status: "ACTIVE" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map to ensure BigInt and Decimal fields are serializable for Next.js
    return services.map((service) => ({
      ...service,
      telegramChannelId: service.telegramChannelId?.toString(),
      telegramGroupId: service.telegramGroupId?.toString(),
      tiers: service.tiers.map((tier) => ({
        ...tier,
        price: tier.price.toString(),
      })),
    }));
  }

  /**
   * Get a single service by ID
   */
  static async getById(serviceId: string) {
    if (!isUUID(serviceId)) return null;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        tiers: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
        merchant: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });

    if (!service) return null;

    return {
      ...service,
      telegramChannelId: service.telegramChannelId?.toString(),
      telegramGroupId: service.telegramGroupId?.toString(),
      tiers: service.tiers.map((tier) => ({
        ...tier,
        price: tier.price.toString(),
      })),
    };
  }

  /**
   * Create a new service
   */
  static async create(input: CreateServiceInput) {
    if (!isUUID(input.merchantId))
      throw new Error("Invalid Merchant ID format");

    return prisma.service.create({
      data: {
        merchantId: input.merchantId,
        name: input.name,
        description: input.description,
        shortDescription: input.shortDescription,
        telegramChannelId: input.telegramChannelId,
        telegramGroupId: input.telegramGroupId,
        isActive: true,
      },
    });
  }

  /**
   * Update a service
   */
  static async update(serviceId: string, data: Partial<CreateServiceInput>) {
    if (!isUUID(serviceId)) throw new Error("Invalid Service ID format");

    return prisma.service.update({
      where: { id: serviceId },
      data,
    });
  }

  /**
   * Create a tier for a service
   */
  static async createTier(input: CreateTierInput) {
    if (!isUUID(input.serviceId)) throw new Error("Invalid Service ID format");

    return prisma.serviceTier.create({
      data: {
        serviceId: input.serviceId,
        name: input.name,
        description: input.description,
        price: new Decimal(input.price), // Ensure high-precision Decimal math
        durationDays: input.durationDays,
        maxConcurrentDevices: input.maxConcurrentDevices || 1,
        isActive: true,
      },
    });
  }

  /**
   * Update a tier
   */
  static async updateTier(tierId: string, data: Partial<CreateTierInput>) {
    if (!isUUID(tierId)) throw new Error("Invalid Tier ID format");

    const updateData: any = { ...data };
    if (data.price) updateData.price = new Decimal(data.price);

    return prisma.serviceTier.update({
      where: { id: tierId },
      data: updateData,
    });
  }

  /**
   * Delete a service (soft delete)
   */
  static async delete(serviceId: string) {
    if (!isUUID(serviceId)) throw new Error("Invalid Service ID format");

    return prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    });
  }

  /**
   * Delete a tier (soft delete)
   */
  static async deleteTier(tierId: string) {
    if (!isUUID(tierId)) throw new Error("Invalid Tier ID format");

    return prisma.serviceTier.update({
      where: { id: tierId },
      data: { isActive: false },
    });
  }
}
