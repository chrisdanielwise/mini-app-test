import { NextRequest } from "next/server"
import prisma from "@/src/lib/db"
import { 
  successResponse, 
  serverError, 
  errorResponse 
} from "@/src/lib/utils/api-response"

/**
 * 🛡️ APEX UUID VALIDATOR
 * Prevents "invalid input syntax for type uuid" errors in PostgreSQL.
 */
const isUUID = (id: string) => 
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ merchantId: string }> }
) {
  try {
    const { merchantId } = await params
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")

    // 1. Identity Validation
    if (!isUUID(merchantId)) {
      return errorResponse("Invalid Merchant ID format. Institutional UUID required.", 400)
    }

    // 2. Hierarchy Validation
    if (parentId && !isUUID(parentId)) {
      return errorResponse("Invalid Parent Category ID format.", 400)
    }

    /**
     * 3. AGGREGATE FETCH
     * Uses Prisma's _count feature to provide real-time telemetry 
     * on sub-nodes and active product listings.
     */
    const categories = await prisma.category.findMany({
      where: {
        merchantId,
        parentId: parentId || null, // null fetches root categories
        isActive: true,
      },
      include: {
        _count: {
          select: {
            children: true,
            products: { where: { isActive: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    })

    // 4. Sanitized Egress
    return successResponse({
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.imageUrl,
        isLeaf: cat.isLeaf, // Indicates if this category can have products or just more categories
        childCount: cat._count.children,
        productCount: cat._count.products,
      })),
    })
  } catch (error: any) {
    console.error(`🔥 [Categories_Sync_Failure]: ${error.message}`)
    return serverError()
  }
}