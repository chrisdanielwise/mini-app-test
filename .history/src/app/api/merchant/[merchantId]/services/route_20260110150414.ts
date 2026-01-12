import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { 
  successResponse, 
  notFoundResponse, 
  serverError, 
  errorResponse 
} from "@/lib/utils/api-response";

/**
 * 🛡️ UUID VALIDATOR
 * Hardened regex to ensure database integrity.
 */
const isUUID = (id: string) => 
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ merchantId: string }> }
) {
  try {
    const { merchantId } = await params;

    // 1. ⚡ THE DEMO BYPASS (Optional/Development Only)
    // If you are using 'demo-merchant' for UI testing, we handle it here.
    // In production, your frontend should be passing the REAL UUID from the session.
    if (merchantId === "demo-merchant") {
       return errorResponse("The 'demo-merchant' slug is a placeholder. Please use a real Merchant UUID.", 400);
    }

    // 2. Format Validation
    if (!isUUID(merchantId)) {
      return errorResponse("Invalid ID format. Request aborted to protect DB integrity.", 400);
    }

    // 3. Institutional Query
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
    });

    if (!merchant) {
      return notFoundResponse("Merchant node not found in the ledger.");
    }

    // 4. Data Transformation (Decimal to String for Hydration)
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
        categoryTag: service.categoryTag,
        tiers: service.tiers.map((tier) => ({
          id: tier.id,
          name: tier.name,
          price: tier.price.toString(), // 🔒 High-precision safety
          interval: tier.interval,
          type: tier.type,
        })),
      })),
    });

  } catch (error: any) {
    console.error("🔥 [Services_API_Failure]:", error.message);
    return serverError();
  }
}