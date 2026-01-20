import { requireAuth } from "@/lib/auth/session";
import prisma from "@/lib/db";
import CouponsClientPage from "./coupons-client";

/**
 * 🛰️ COUPONS_PAGE_SERVER
 * Logic: Implements dynamic merchant hydration and explicit serialization cleanup.
 * Goal: Resolve "Invisible Coupons" by ensuring live DB truth overrides stale JWT data.
 */
export default async function CouponsPage(props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  // 🔐 1. IDENTITY_HANDSHAKE
  // design: use requireAuth to allow any valid user (including new merchants)
  const session = await requireAuth();
  
  // 🧬 2. DYNAMIC IDENTITY HYDRATION
  // fix: manually fetch the latest profile from DB to ensure merchantId is never undefined
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      role: true,
      merchantProfile: { select: { id: true } } 
    }
  });

  // 🏁 RESOLVE IDENTITY NODES
  const currentRole = dbUser?.role?.toLowerCase() || session.user.role;
  const realMerchantId = dbUser?.merchantProfile?.id || session.merchantId;
  const isSuperAdmin = ["super_admin", "platform_manager"].includes(currentRole);

  // ⚙️ 3. SEARCH & PAGINATION PARAMS
  const searchParams = await props.searchParams;
  const PAGE_SIZE = 10;
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const skip = (currentPage - 1) * PAGE_SIZE;

  // 🛡️ 4. DYNAMIC PROTOCOL FILTER
  // logic: filter by merchantId if present; otherwise, show global ledger for admins
  const whereClause = {
    ...(realMerchantId ? { merchantId: realMerchantId } : {}),
    code: { contains: query, mode: "insensitive" as const },
  };

  // 🏁 5. DATA FETCH
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
  console.log(rawCoupons,totalcount"")

  // 🧼 6. SERIALIZATION CLEANUP
  // prisma Decimal objects and BigInt fields must be converted for the UI
  const coupons = rawCoupons.map(coupon => ({
    ...coupon,
    // Convert Prisma Decimal to Number to prevent rendering [object Object]
    amount: typeof coupon.amount === 'object' ? Number(coupon.amount) : coupon.amount,
    // Convert Dates to ISO strings for stable Next.js hydration
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