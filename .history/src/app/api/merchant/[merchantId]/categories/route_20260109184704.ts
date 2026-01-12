import type { NextRequest } from "next/server"
import prisma from "@/src/lib/db"
import { successResponse, serverError, errorResponse } from "@/src/lib/utils/api-response"

// Helper to validate UUID format
const isUUID = (id: string) => 
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export async function GET(request: NextRequest, { params }: { params: Promise<{ merchantId: string }> }) {
  try {
    const { merchantId } = await params
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")

    // 1. Validate Merchant ID format
    if (!isUUID(merchantId)) {
      return errorResponse("Invalid Merchant ID format. UUID expected.", 400)
    }

    // 2. Validate Parent ID format if it exists
    if (parentId && !isUUID(parentId)) {
      return errorResponse("Invalid Parent Category ID format. UUID expected.", 400)
    }

    // Get categories (root level if no parentId, or children of specified parent)
    const categories = await prisma.category.findMany({
      where: {
        merchantId,
        parentId: parentId || null,
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

    return successResponse({
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.imageUrl,
        isLeaf: cat.isLeaf,
        childCount: cat._count.children,
        productCount: cat._count.products,
      })),
    })
  } catch (error) {
    console.error("[Categories] Error:", error)
    return serverError()
  }
}