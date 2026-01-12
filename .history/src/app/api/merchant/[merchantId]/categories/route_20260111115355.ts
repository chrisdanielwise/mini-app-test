import { NextRequest } from "next/server"
import prisma from "@/lib/db"
import { 
  successResponse, 
  serverError, 
  errorResponse 
} from "@/lib/utils/api-response"
import { isUUID } from "@/lib/utils/validators"; // ✅ Use the shared utility
import { getMerchantSession } from "@/lib/auth/merchant-session";

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ merchantId: string }> }
) {
  try {
    const { merchantId } = await params
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")
    
    // 🛡️ 1. SESSION & ROLE CHECK
    // Ensure we know who is asking for this data
    const session = await getMerchantSession();
    const isStaff = session?.user?.role && ["super_admin", "platform_manager"].includes(session.user.role);

    // 2. IDENTITY VALIDATION
    // Logic: If 'all' is passed and user is staff, we skip UUID check for global view
    const isGlobalRequest = merchantId === "all" && isStaff;

    if (!isGlobalRequest && !isUUID(merchantId)) {
      return errorResponse("Invalid Merchant ID format.", 400)
    }

    // 3. HIERARCHY VALIDATION
    if (parentId && !isUUID(parentId)) {
      return errorResponse("Invalid Parent Category ID format.", 400)
    }

    /**
     * 🏁 4. DYNAMIC SCOPE
     * If Staff + 'all': Fetch across all merchants (Global Manifest).
     * Otherwise: Strict tenant isolation for the specific merchantId.
     */
    const whereClause: any = {
      parentId: parentId || null,
      isActive: true,
    };

    if (!isGlobalRequest) {
      whereClause.merchantId = merchantId;
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        merchant: { select: { companyName: true } }, // Helpful for Staff Global View
        _count: {
          select: {
            children: true,
            products: { where: { isActive: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    })

    // 5. SANITIZED EGRESS
    return successResponse({
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.imageUrl,
        isLeaf: cat.isLeaf,
        childCount: cat._count.children,
        productCount: cat._count.products,
        // Include merchant name only for global oversight
        origin: isGlobalRequest ? cat.merchant?.companyName : undefined,
      })),
    })
  } catch (error: any) {
    console.error(`🔥 [Categories_Sync_Failure]: ${error.message}`)
    return serverError()
  }
}