import { requireStaff } from "@/lib/auth/session";
import prisma from "@/lib/db";
import CouponsClientPage from "./coupons-client"; // This is the component you provided

export default async function CouponsPage(props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  // 🔐 Identity Handshake
  const session = await requireStaff();
  const realMerchantId = session.merchantId;
  const isSuperAdmin = session.user.role === "super_admin";

  // ⚙️ Search & Pagination Engine
  const searchParams = await props.searchParams;
  const PAGE_SIZE = 10;
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const skip = (currentPage - 1) * PAGE_SIZE;

  // 🛡️ Protocol Filter
  const whereClause = {
    ...(realMerchantId ? { merchantId: realMerchantId } : {}),
    code: { contains: query, mode: "insensitive" as const },
  };

  // 🏁 Data Fetch
  const [coupons, totalCount] = await Promise.all([
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

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // 🛰️ Transmit to Client Chassis
  return (
    <CouponsClientPage 
      coupons={JSON.parse(JSON.stringify(coupons))} // Serialization safe
      totalCount={totalCount}
      query={query}
      isSuperAdmin={isSuperAdmin}
      realMerchantId={realMerchantId}
      pagination={{
        currentPage,
        totalPages,
        pageSize: PAGE_SIZE,
        skip
      }}
    />
  );
}