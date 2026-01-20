import { requireAuth, requireStaff } from "@/lib/auth/session";
import prisma from "@/lib/db";
import CouponsClientPage from "./coupons-client";

/**
 * 🛰️ COUPONS_PAGE_SERVER
 * Logic: Implements explicit serialization cleanup to prevent Prisma/Next.js hydration errors.
 */
export default async function CouponsPage(props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  // 🔐 1. IDENTITY_HANDSHAKE
  const session = await requireStaff()
  
  // ⚠️ BIGINT SAFETY: Ensure session data passed to client is serializable
  const isSuperAdmin = ["super_admin", "platform_manager"].includes(session.user.role);
  const realMerchantId = session.merchantId;

  // ⚙️ 2. SEARCH & PAGINATION PARAMS
  const searchParams = await props.searchParams;
  const PAGE_SIZE = 10;
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const skip = (currentPage - 1) * PAGE_SIZE;

  // 🛡️ 3. DYNAMIC PROTOCOL FILTER
  const whereClause = {
    ...(realMerchantId ? { merchantId: realMerchantId } : {}),
    code: { contains: query, mode: "insensitive" as const },
  };

  // 🏁 4. DATA FETCH
  const [rawCoupons, totalCount] = await Promise.all([
    prisma.coupon.findMany({
      where: whereClause,
      include: { 
        service: { select: { name: true } },
        merchant: { select: { companyName: true } } 
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: skip,
    }),
    prisma.coupon.count({ where: whereClause }),
  ]);

  // 🧼 5. SERIALIZATION CLEANUP
  // Logic: Prisma Decimal objects and BigInt fields must be converted to strings/numbers
  const coupons = rawCoupons.map(coupon => ({
    ...coupon,
    // Convert Prisma Decimal to Number for the UI (prevents [object Object] errors)
    amount: typeof coupon.amount === 'object' ? Number(coupon.amount) : coupon.amount,
    // Convert Dates to ISO strings for stable hydration
    createdAt: coupon.createdAt.toISOString(),
    updatedAt: coupon.updatedAt.toISOString(),
    expiresAt: coupon.expiresAt?.toISOString() || null,
  }));

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // 🛰️ TRANSMIT TO CLIENT CHASSIS
  return (
    <CouponsClientPage 
      coupons={coupons as any} 
      totalCount={totalCount}
      query={query}
      isSuperAdmin={isSuperAdmin}
      realMerchantId={realMerchantId || ""}
      pagination={{
        currentPage,
        totalPages,
        pageSize: PAGE_SIZE,
        skip
      }}
    />
  );
}