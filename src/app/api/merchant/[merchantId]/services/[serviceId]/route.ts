import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { 
  successResponse, 
  notFoundResponse, 
  serverError, 
  errorResponse 
} from "@/lib/utils/api-response";
import { isUUID } from "@/lib/utils/validators";

/**
 * 🛰️ SERVICE DETAIL INGRESS (Institutional v14.42.0)
 * Logic: Fetches a single service node with its associated tiers.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ merchantId: string; serviceId: string }> }
) {
  const { merchantId, serviceId } = await params;

  try {
    // 🛡️ 1. VALIDATION GATE
    if (!isUUID(merchantId) || !isUUID(serviceId)) {
      return errorResponse("Invalid UUID identifiers. Ingress aborted.", 400);
    }

    // 🛰️ 2. QUERY NODE: Fetch single service with tiers
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        merchantId: merchantId,
        isActive: true,
      },
      include: {
        merchant: { select: { id: true, companyName: true } },
        tiers: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        }
      }
    });

    if (!service) {
      return notFoundResponse("Service node not found or offline.");
    }

    // 🛡️ 3. SANITIZED DATA EGRESS
    return successResponse({
      id: service.id,
      name: service.name,
      description: service.description,
      currency: service.currency,
      merchant: service.merchant,
      tiers: service.tiers.map((tier) => ({
        id: tier.id,
        name: tier.name,
        price: tier.price.toString(), // 🛡️ Decimal serialization fix
        interval: tier.interval,
        type: tier.type,
      })),
    });

  } catch (error: any) {
    console.error("🔥 [API_Service_Detail_Error]:", error.message);
    return serverError("Failed to synchronize specific service node.");
  }
}