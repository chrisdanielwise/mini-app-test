import type { NextRequest } from "next/server"
import prisma from "@/lib/db"
import { successResponse, notFoundResponse, serverError } from "@/lib/utils/api-response"

export async function GET(request: NextRequest, { params }: { params: Promise<{ merchantId: string }> }) {
  try {
    const { merchantId } = await params

    const merchant = await prisma.merchantProfile.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
        companyName: true,
        botUsername: true,
        services: {
          where: { isActive: true },
          include: {
            tiers: {
              where: { isActive: true },
              orderBy: { price: "asc" },
            },
          },
        },
      },
    })

    if (!merchant) {
      return notFoundResponse("Merchant not found")
    }

    return successResponse({
      merchant: {
        id: merchant.id,
        companyName: merchant.companyName,
        botUsername: merchant.botUsername,
      },
      services: merchant.services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        currency: service.currency,
        categoryTag: service.categoryTag,
        tiers: service.tiers.map((tier) => ({
          id: tier.id,
          name: tier.name,
          price: tier.price.toString(),
          compareAtPrice: tier.compareAtPrice?.toString(),
          discountPercentage: tier.discountPercentage,
          interval: tier.interval,
          intervalCount: tier.intervalCount,
          type: tier.type,
        })),
      })),
    })
  } catch (error) {
    console.error("[Services] Error:", error)
    return serverError()
  }
}
