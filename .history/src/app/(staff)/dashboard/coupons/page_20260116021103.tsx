import { requireStaff } from "@/lib/auth/session";
import prisma from "@/lib/db";
import CouponsClientPage from "./copons-client";

/**
 * 🎫 PROMOTION_LEDGER_SERVER
 * Logic: Parallelized Database Ingress with RBAC Filtering.
 */
export default async function CouponsPage(props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  // 🔐 1. Identity & Role Handshake
  const session = await requireStaff();
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  
  // 🎨 2. Theme Logic: Check if user is a Super Admin
  const isSuperAdmin = ["super_admin", "platform_manager"].includes(role);

  // ⚙️ 3. Search & Pagination Params
  const searchParams = await props.searchParams;
  const PAGE_SIZE = 10;
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const skip = (currentPage - 1) * PAGE_SIZE;

  // 🛡️ 4. Dynamic Protocol Filter
  // If Staff: We don't filter by merchantId so we see everything.
  // If Merchant: We only show coupons belonging to their merchantId.
  const whereClause = {
    ...(realMerchantId ? { merchantId: realMerchantId } : {}),
    code: { contains: query, mode: "insensitive" as const },
  };

  // 🏁 5. Data Fetch (Parallelized for Speed)
  const [coupons, totalCount] = await Promise.all([
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

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // 🚀 6. Handover to Client Component
  // Make sure the prop name "coupons" matches the client's input!
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