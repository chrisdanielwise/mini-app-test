import type { NextRequest } from "next/server"
import prisma from "@/lib/db"
import { successResponse, serverError } from "@/lib/utils/api-response"

export async function GET(request: NextRequest, { params }: { params: Promise<{ merchantId: string }> }) {
  try {
    const { merchantId } = await params
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")

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
