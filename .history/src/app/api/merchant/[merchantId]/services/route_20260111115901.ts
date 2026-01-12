import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { 
  successResponse, 
  notFoundResponse, 
  serverError, 
  errorResponse 
} from "@/lib/utils/api-response";
import { isUUID } from "@/lib/utils/validators";
import { getMerchantSession } from "@/lib/auth/merchant-session";

/**
 * 🛰️ MERCHANT SERVICES INGRESS
 * Logic: Supports Public Storefront, Merchant Cluster, and Staff Oversight.
 */
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ merchantId: string }> }
) {
  try {
    const { merchantId } = await params;

    // 🛡️ 1. SESSION & CLEARANCE
    const session = await getMerchantSession();
    const isStaff = session?.user?.role && ["super_admin", "platform_manager", "platform_support"].includes(session.user.role);

    // 2. IDENTITY HANDSHAKE
    // Logic: If Staff requests 'all', we aggregate the platform service catalog.
    const isGlobalRequest = merchantId === "all" && isStaff;

    if (!isGlobalRequest && !isUUID(merchantId)) {
      return errorResponse("Invalid Merchant UUID format. Data ingress aborted.", 400);
    }

    // 3. DYNAMIC QUERY BUILDING
    // If Global: Fetch all active services across the platform.
    // If Scoped: Fetch only for the specific merchant.
    const whereClause: any = {
      isActive: true,
      ...(isGlobalRequest ? {} : { merchantId })
    };

    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        merchant: { select: { id: true, companyName: true, botUsername: true } },
        tiers: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { createdAt: "desc" }
    });

    if (!isGlobalRequest && services.length === 0) {
      // We check if the merchant even exists if no services were found
      const merchantExists = await prisma.merchantProfile.findUnique({ where: { id: merchantId } });
      if (!merchantExists) return notFoundResponse("Merchant node not found in the ledger.");
    }

    // 4. SANITIZED DATA EGRESS
    // Ensuring high-precision Decimal to String conversion for Next.js 15 hydration.
    return successResponse({
      count: services.length,
      mode: isGlobalRequest ? "GLOBAL_OVERSIGHT" : "TENANT_ISOLATION",
      services: services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        categoryTag: service.categoryTag,
        // Include merchant metadata for Staff Global View
        origin: {
          id: service.merchant.id,
          companyName: service.merchant.companyName,
          botUsername: service.merchant.botUsername,
        },
        tiers: service.tiers.map((tier) => ({
          id: tier.id,
          name: tier.name,
          price: tier.price.toString(), 
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