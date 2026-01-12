import { NextRequest, NextResponse } from "next/server";
// ✅ FIXED: Using named function imports to resolve Turbopack build errors
import { getProductsByMerchant } from "@/lib/services/product.service";
import {
  successResponse,
  serverError,
  errorResponse,
} from "@/lib/utils/api-response";
import { isUUID } from "@/lib/utils/validators";
import { getSession } from "@/lib/auth/session"; // 🚀 UPDATED: Universal Resolver

/**
 * 🛰️ PRODUCT INGRESS API (Institutional v9.0.3)
 * Hardened: Role-normalized access control and multi-tenant isolation.
 * Optimization: Tunnel-safe headers for Cloudflare/Ngrok resiliency.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ merchantId: string }> }
) {
  // 🛡️ TUNNEL BYPASS PROTOCOL
  // Ensures automated fetch requests (SWR) don't get caught by tunnel warning pages.
  const responseHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
  };

  try {
    const { merchantId } = await params;
    const { searchParams } = new URL(request.url);

    // 🛡️ 1. IDENTITY & CLEARANCE HANDSHAKE
    // Uses the hardened polymorphic session resolver
    const session = await getSession();
    
    // 🚀 ROLE NORMALIZATION CHECK
    // session.isStaff already handles the .toLowerCase() check internally
    const isStaff = session?.isStaff;

    // 2. EXTRACTION OF TELEMETRY
    const categoryId = searchParams.get("categoryId") || undefined;
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50", 10), 100);
    const offset = Math.max(Number.parseInt(searchParams.get("offset") || "0", 10), 0);

    // 3. IDENTITY VALIDATION
    // Logic: If Staff requests 'all', we permit the Global Platform Manifest view.
    const isGlobalRequest = merchantId === "all" && isStaff;

    if (!isGlobalRequest && !isUUID(merchantId)) {
      return errorResponse("Invalid Merchant Identity Format. Institutional UUID required.", 400);
    }

    if (categoryId && !isUUID(categoryId)) {
      return errorResponse("Invalid Category Identity Format.", 400);
    }

    // 4. EXECUTION VIA HARDENED SERVICE
    // We pass undefined for merchantId if it's a global request to trigger a cross-tenant fetch.
    const targetMerchantId = isGlobalRequest ? undefined : merchantId;

    const { products, total } = await getProductsByMerchant(targetMerchantId, {
      categoryId,
      limit,
      offset,
    });

    // 5. SANITIZED DATA EGRESS
    const result = successResponse(
      {
        products: products.map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          basePrice: product.basePrice.toString(),
          currency: product.currency,
          imageUrl: product.imageUrl,
          category: product.category,
          // 🛡️ STAFF OVERLAY: Include origin metadata for platform management
          merchantName: isGlobalRequest ? product.merchant?.companyName : undefined,
          variants: product.variants.map((v: any) => ({
            id: v.id,
            sku: v.sku,
            attributes: v.attributes,
            price: v.price.toString(),
            stock: v.stock,
            mediaUrl: v.mediaUrl,
          })),
        })),
      },
      { total, limit, offset }
    );

    // Inject bypass and cache headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      result.headers.set(key, value);
    });

    return result;

  } catch (error: any) {
    console.error(`🔥 [Product_Route_Failure]: ${error.message}`);
    return serverError("Failed to synchronize product manifest.");
  }
}