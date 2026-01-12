import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { 
  successResponse, 
  serverError, 
  errorResponse 
} from "@/lib/utils/api-response"
import { isUUID } from "@/lib/utils/validators"; 
import { getSession } from "@/lib/auth/session"; // 🚀 UPDATED: Universal Resolver

/**
 * 🛰️ CATEGORY SYNC NODE
 * Hardened: Role-normalized access control and multi-tenant isolation.
 * Optimization: Tunnel-safe headers for Cloudflare/Ngrok resiliency.
 */
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ merchantId: string }> }
) {
  // 🛡️ TUNNEL SAFETY: Prevents HTML warning pages from breaking JSON parsing
  const responseHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
  };

  try {
    const { merchantId } = await params
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")
    
    // 🛡️ 1. IDENTITY HANDSHAKE
    // Uses the hardened polymorphic session resolver
    const session = await getSession();
    
    // 🚀 ROLE NORMALIZATION CHECK
    // session.isStaff already handles the .toLowerCase() check internally
    const isStaff = session?.isStaff;

    // 2. IDENTITY VALIDATION
    // Logic: If 'all' is passed and user is staff, we permit the Global Manifest view
    const isGlobalRequest = merchantId === "all" && isStaff;

    if (!isGlobalRequest && !isUUID(merchantId)) {
      return errorResponse("Invalid Merchant Identity Format.", 400)
    }

    // 3. HIERARCHY VALIDATION
    if (parentId && !isUUID(parentId)) {
      return errorResponse("Invalid Parent Identity Format.", 400)
    }

    /**
     * 🏁 4. DYNAMIC SCOPE
     * If Staff + 'all': Fetch across the entire platform.
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
        merchant: { select: { companyName: true } }, 
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
    const result = successResponse({
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.imageUrl,
        isLeaf: cat.isLeaf,
        childCount: cat._count.children,
        productCount: cat._count.products,
        // Include origin data only for platform-wide oversight
        origin: isGlobalRequest ? cat.merchant?.companyName : undefined,
      })),
    });

    // Inject bypass and cache headers
    Object.entries(responseHeaders).forEach(([key, value]) => {
      result.headers.set(key, value);
    });

    return result;

  } catch (error: any) {
    console.error(`🔥 [Categories_Sync_Failure]: ${error.message}`)
    return serverError("Failed to synchronize category manifest.")
  }
}