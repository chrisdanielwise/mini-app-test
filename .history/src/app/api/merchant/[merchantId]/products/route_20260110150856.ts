import { NextRequest } from "next/server";
import { ProductService } from "@/lib/services/product.service";
import {
  successResponse,
  serverError,
  errorResponse,
} from "@/lib/utils/api-response";

/**
 * 🛡️ APEX UUID VALIDATOR
 * Ensuring data integrity before reaching the ProductService.
 */
const isUUID = (id: string | null | undefined): id is string =>
  !!id &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ merchantId: string }> }
) {
  try {
    const { merchantId } = await params;
    const { searchParams } = new URL(request.url);

    // 1. Extraction of Telemetry & Filters
    const categoryId = searchParams.get("categoryId") || undefined;
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50", 10), 100);
    const offset = Math.max(Number.parseInt(searchParams.get("offset") || "0", 10), 0);

    // 2. Strict ID Handshake
    // Rejects 'demo-merchant' or any malformed string to prevent DB syntax errors.
    if (!isUUID(merchantId)) {
      return errorResponse("Invalid Merchant ID format. Institutional UUID required.", 400);
    }

    if (categoryId && !isUUID(categoryId)) {
      return errorResponse("Invalid Category ID format.", 400);
    }

    // 3. Execution via ProductService
    const { products, total } = await ProductService.getByMerchant(merchantId, {
      categoryId,
      limit,
      offset,
    });

    // 4. Sanitized Data Egress
    // Crucial for Next.js 15: BigInt/Decimal values mapped to high-precision strings.
    return successResponse(
      {
        products: products.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          basePrice: product.basePrice.toString(),
          currency: product.currency,
          imageUrl: product.imageUrl,
          category: product.category,
          variants: product.variants.map((v) => ({
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
  } catch (error: any) {
    console.error(`🔥 [Product_Route_Failure]: ${error.message}`);
    return serverError();
  }
}