import type { NextRequest } from "next/server"
import prisma from "@/lib/db"
import { successResponse, notFoundResponse, serverError, errorResponse } from "@/lib/utils/api-response"

// Helper to validate UUID format
const isUUID = (id: string) => 
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export async function GET(request: NextRequest, { params }: { params: Promise<{ merchantId: string }> }) {
  try {
    const { merchantId } = await params

    // 1. Validate UUID format before querying the database
    // This prevents the "invalid input syntax for type uuid" error
    if (!isUUID(merchantId)) {
      return errorResponse("Invalid Merchant ID format. A valid UUID is required.", 400)
    }

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