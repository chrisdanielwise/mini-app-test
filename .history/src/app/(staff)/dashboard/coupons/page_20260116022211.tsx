import { requireStaff } from "@/lib/auth/session";
import prisma from "@/lib/db";
import CouponsClientPage from "./copons-client";

/**
 * 🎫 PROMOTION_LEDGER_SERVER
 * Logic: Parallelized Database Ingress with Serialization Safety.
 */
export default async function CouponsPage(props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  // 🔐 1. Identity & Role Handshake
  const session = await require();
  
  // ⚠️ BIGINT SAFETY: Ensure session data passed to client is serializable
  const isSuperAdmin = ["super_admin", "platform_manager"].includes(session.user.role);
  const realMerchantId = session.merchantId;

  // ⚙️ 2. Search & Pagination Params
  const searchParams = await props.searchParams;
  const PAGE_SIZE = 10;
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const skip = (currentPage - 1) * PAGE_SIZE;

  // 🛡️ 3. Dynamic Protocol Filter
  const whereClause = {
    ...(realMerchantId ? { merchantId: realMerchantId } : {}),
    code: { contains: query, mode: "insensitive" as const },
  };

  // 🏁 4. Data Fetch
  const [rawCoupons, totalCount] = await Promise.all([
    prisma.coupon.findMany({
      where: whereClause,
      include: { 
        service: true,
        merchant: { select: { companyName: true } } 
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: skip,
    }),
    prisma.coupon.count({ where: whereClause }),
  ]);

  // 🧼 5. SERIALIZATION CLEANUP
  // Prisma Decimal objects and BigInt fields must be converted to strings/numbers
  const coupons = rawCoupons.map(coupon => ({
    ...coupon,
    // Convert Prisma Decimal to Number for the UI
    amount: typeof coupon.amount === 'object' ? Number(coupon.amount) : coupon.amount,
    // Convert Dates to ISO strings (Next.js handles this, but explicit is safer)
    createdAt: coupon.createdAt.toISOString(),
    updatedAt: coupon.updatedAt.toISOString(),
    expiresAt: coupon.expiresAt?.toISOString() || null,
  }));

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <CouponsClientPage 
      coupons={coupons} 
      totalCount={totalCount} 
      query={query}
      isSuperAdmin={isSuperAdmin}
      realMerchantId={realMerchantId}
      pagination={{
        currentPage,
        totalPages,
        skip,
        pageSize: PAGE_SIZE
      }}
    />
  );
}