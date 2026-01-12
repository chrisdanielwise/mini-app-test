import { NextRequest } from "next/server";
// ✅ FIXED: Using named function imports to resolve Turbopack build errors
import { getProductsByMerchant } from "@/lib/services/product.service";
import {
  successResponse,
  serverError,
  errorResponse,
} from "@/lib/utils/api-response";
import { isUUID } from "@/lib/utils/validators";
import { getMerchantSession } from "@/lib/auth/merchant-session";

/**
 * 🛰️ PRODUCT INGRESS API
 * Logic: Supports Merchant cluster isolation and Staff global oversight.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ merchantId: string }> }
) {
  try {
    const { merchantId } = await params;
    const { searchParams } = new URL(request.url);

    // 🛡️ 1. SESSION & CLEARANCE CHECK
    const session = await getMerchantSession();
    const isStaff = session?.user?.role && ["super_admin", "platform_manager", "platform_support"].includes(session.user.role);

    // 2. EXTRACTION OF TELEMETRY
    const categoryId = searchParams.get("categoryId") || undefined;
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "50", 10), 100);
    const offset = Math.max(Number.parseInt(searchParams.get("offset") || "0", 10), 0);

    // 3. IDENTITY HANDSHAKE
    // Logic: If Staff requests 'all', we bypass the UUID check for global telemetry.
    const isGlobalRequest = merchantId === "all" && isStaff;

    if (!isGlobalRequest && !isUUID(merchantId)) {
      return errorResponse("Invalid Merchant ID format. Institutional UUID required.", 400);
    }

    if (categoryId && !isUUID(categoryId)) {
      return errorResponse("Invalid Category ID format.", 400);
    }

    // 4. EXECUTION VIA HARDENED SERVICE
    // We pass undefined for merchantId if it's a global request to trigger the platform-wide fetch.
    const targetMerchantId = isGlobalRequest ? undefined : merchantId;

    const { products, total } = await getProductsByMerchant(targetMerchantId, {
      categoryId,
      limit,
      offset,
    });

    // 5. SANITIZED DATA EGRESS
    return successResponse(
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
          // 🛡️ STAFF OVERLAY: Include origin metadata if viewing globally
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
  } catch (error: any) {
    console.error(`🔥 [Product_Route_Failure]: ${error.message}`);
    return serverError();
  }
}