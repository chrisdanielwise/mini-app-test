import prisma from "@/lib/db"

export interface CreateServiceInput {
  merchantId: string
  name: string
  description?: string
  shortDescription?: string
  telegramChannelId?: bigint
  telegramGroupId?: bigint
}

export interface CreateTierInput {
  serviceId: string
  name: string
  description?: string
  priceUsd: number
  durationDays: number
  maxConcurrentDevices?: number
}

export class ServiceService {
  /**
   * Get all services for a merchant
   */
  static async getByMerchant(merchantId: string) {
    return prisma.service.findMany({
      where: { merchantId, isActive: true },
      include: {
        tiers: {
          where: { isActive: true },
          orderBy: { priceUsd: "asc" },
        },
        _count: {
          select: {
            subscriptions: { where: { status: "ACTIVE" } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Get a single service by ID
   */
  static async getById(serviceId: string) {
    return prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        tiers: {
          where: { isActive: true },
          orderBy: { priceUsd: "asc" },
        },
        merchant: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    })
  }

  /**
   * Create a new service
   */
  static async create(input: CreateServiceInput) {
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
    })
  }

  /**
   * Update a service
   */
  static async update(serviceId: string, data: Partial<CreateServiceInput>) {
    return prisma.service.update({
      where: { id: serviceId },
      data,
    })
  }

  /**
   * Create a tier for a service
   */
  static async createTier(input: CreateTierInput) {
    return prisma.serviceTier.create({
      data: {
        serviceId: input.serviceId,
        name: input.name,
        description: input.description,
        priceUsd: input.priceUsd,
        durationDays: input.durationDays,
        maxConcurrentDevices: input.maxConcurrentDevices || 1,
        isActive: true,
      },
    })
  }

  /**
   * Update a tier
   */
  static async updateTier(tierId: string, data: Partial<CreateTierInput>) {
    return prisma.serviceTier.update({
      where: { id: tierId },
      data,
    })
  }

  /**
   * Delete a service (soft delete)
   */
  static async delete(serviceId: string) {
    return prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    })
  }

  /**
   * Delete a tier (soft delete)
   */
  static async deleteTier(tierId: string) {
    return prisma.serviceTier.update({
      where: { id: tierId },
      data: { isActive: false },
    })
  }
}
