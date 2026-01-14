import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { 
  successResponse, 
  notFoundResponse, 
  serverError, 
  errorResponse 
} from "@/lib/utils/api-response";
import { isUUID } from "@/lib/utils/validators";
import { getSession } from "@/lib/auth/session"; // 🚀 UPDATED: Universal Resolver

/**
 * 🛰️ MERCHANT SERVICES INGRESS (Institutional v9.0.4)
 * Logic: Supports Public Storefront, Merchant Cluster, and Staff Oversight.
 * Optimization: Tunnel-safe headers and Decimal-to-String serialization.
 */
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ merchantId: string }> }
) {
  // 🛡️ TUNNEL BYPASS PROTOCOL
  // Ensures SWR/Fetch requests don't trigger the "Browser Warning" pages 
  // that return HTML instead of JSON, crashing the Mini App.
  const responseHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
  };

  try {
    const { merchantId } = await params;

    // 🛡️ 1. IDENTITY & CLEARANCE HANDSHAKE
    // Uses the hardened polymorphic session resolver
    const session = await getSession();
    
    // 🚀 ROLE NORMALIZATION
    // session.isStaff already handles the .toLowerCase() check from the JWT
    const isStaff = session?.isStaff;

    // 2. IDENTITY HANDSHAKE
    // Logic: If Staff requests 'all', we aggregate the platform service catalog.
    const isGlobalRequest = merchantId === "all" && isStaff;

    if (!isGlobalRequest && !isUUID(merchantId)) {
      return errorResponse("Invalid Merchant UUID format. Data ingress aborted.", 400);
    }

    // 3. DYNAMIC QUERY BUILDING
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
      const merchantExists = await prisma.merchantProfile.findUnique({ where: { id: merchantId } });
      if (!merchantExists) return notFoundResponse("Merchant node not found in the ledger.");
    }

    // 4. SANITIZED DATA EGRESS
    const result = successResponse({
      count: services.length,
      mode: isGlobalRequest ? "GLOBAL_OVERSIGHT" : "TENANT_ISOLATION",
      services: services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        categoryTag: service.categoryTag,
        origin: {
          id: service.merchant.id,
          companyName: service.merchant.companyName,
          botUsername: service.merchant.botUsername,
        },
        tiers: service.tiers.map((tier) => ({
          id: tier.id,
          name: tier.name,
          price: tier.price.toString(), // 🛡️ Stringification prevents JSON parse errors
          interval: tier.interval,
          type: tier.type,
        })),
      })),
    });

    // Inject vital tunnel and cache headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      result.headers.set(key, value);
    });

    return result;

  } catch (error: any) {
    console.error("🔥 [Services_API_Failure]:", error.message);
    return serverError("Failed to synchronize service catalog.");
  }
}