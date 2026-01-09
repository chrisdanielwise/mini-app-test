import type { NextRequest } from "next/server"
import { ProductService } from "@/lib/services/product.service"
import { successResponse, serverError } from "@/lib/utils/api-response"

export async function GET(request: NextRequest, { params }: { params: Promise<{ merchantId: string }> }) {
  try {
    const { merchantId } = await params
    const { searchParams } = new URL(request.url)

    const categoryId = searchParams.get("categoryId") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    const { products, total } = await ProductService.getByMerchant(merchantId, {
      categoryId,
      limit,
      offset,
    })

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
      { total, limit, offset },
    )
  } catch (error) {
    console.error("[Products] Error:", error)
    return serverError()
  }
}
