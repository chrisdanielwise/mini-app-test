import { requireStaff } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { 
  Percent, Gift, ChevronLeft, ChevronRight, ShieldAlert, 
  Terminal, Globe, Tag, Building2, Activity 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CreateCouponModal } from "@/components/dashboard/create-coupon-modal";
import { CouponActionWrapper } from "@/components/dashboard/coupon-action-wrapper";
import { CouponSearch } from "@/components/dashboard/coupon-search";
import Link from "next/link";

export default async function CouponsPage(props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  // 🔐 1. Identity Handshake
  const session = await requireStaff();
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  
  // 🎨 2. Theme Resolution (Amber for Staff, Primary for Merchants)
  const isSuperAdmin = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // ⚙️ 3. Search & Pagination Engine
  const searchParams = await props.searchParams;
  const PAGE_SIZE = 10;
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const skip = (currentPage - 1) * PAGE_SIZE;

  // 🛡️ 4. Dynamic Protocol Filter (Fix: Handles null merchantId for Staff)
  const whereClause = {
    ...(realMerchantId ? { merchantId: realMerchantId } : {}),
    code: { contains: query, mode: "insensitive" as const },
  };

  // 🏁 5. Data Fetch (Parallelized Cluster Sync)
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 px-4 text-foreground animate-in fade-in duration-500">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2">
            <Tag className={cn("size-4", isSuperAdmin ? "text-amber-500 fill-amber-500" : "text-primary fill-primary")} />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-60">
              {isSuperAdmin ? "Global Marketing Protocol" : "Merchant Promotion Node"}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none">
              Node <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Discounts</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
              {query ? `Manifest Active: "${query}"` : `Total Managed: ${totalCount} Campaigns`}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
          <CouponSearch />
          <CreateCouponModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- LEDGER DATA GRID --- */}
      <div className={cn(
        "rounded-2xl border backdrop-blur-3xl overflow-hidden shadow-xl bg-card/40",
        isSuperAdmin ? "border-amber-500/10" : "border-white/5"
      )}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="border-b border-white/5 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-[0.3em]">Identity Node</th>
                {isSuperAdmin && <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-[0.3em]">Origin</th>}
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-[0.3em]">Adjustment</th>
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-[0.3em]">Utilization</th>
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-[0.3em]">Target Node</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* 🛠️ FIX: Using 'coupons' variable directly to match server fetch */}
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 6 : 5} className="px-6 py-32 text-center opacity-20">
                    <ShieldAlert className="h-10 w-10 mx-auto mb-4" />
                    <p className="text-sm font-black uppercase italic tracking-tight">Zero discount nodes detected.</p>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon: any) => (
                  <tr key={coupon.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6",
                            Number(coupon.amount) >= 100 
                              ? (isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20")
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {Number(coupon.amount) >= 100 ? <Gift className="h-5 w-5" /> : <Percent className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-black uppercase italic text-sm text-foreground">{coupon.code}</p>
                          <p className="text-[8px] font-mono text-muted-foreground/40 mt-1 uppercase">ID: {coupon.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>

                    {isSuperAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground/60 italic">
                          <Building2 className="h-3 w-3" />
                          <span className="text-[10px] font-black uppercase">{coupon.merchant?.companyName || "ROOT_NODE"}</span>
                        </div>
                      </td>
                    )}

                    <td className="px-6 py-4">
                       <span className="font-black text-xl tracking-tighter italic text-foreground tabular-nums">
                         {coupon.discountType === 'PERCENTAGE' ? `-${coupon.amount}%` : `$${coupon.amount}`}
                       </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 max-w-[140px]">
                         <span className="font-black text-[9px] uppercase tracking-widest text-muted-foreground/60 italic leading-none">
                           {coupon.currentUses} / {coupon.maxUses || "∞"}
                         </span>
                         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full transition-all duration-1000", Number(coupon.amount) >= 100 ? (isSuperAdmin ? "bg-amber-500" : "bg-primary") : "bg-emerald-500")} 
                              style={{ width: `${coupon.maxUses ? (coupon.currentUses / coupon.maxUses) * 100 : 100}%` }} 
                            />
                         </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[8px] font-black uppercase italic tracking-tighter text-muted-foreground/60 bg-white/5 border-white/5">
                        {coupon.service?.name || "Global Node"}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <CouponActionWrapper couponId={coupon.id} code={coupon.code} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PERFORMANCE PAGINATION --- */}
        <div className="bg-white/[0.01] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
          <div className="flex items-center gap-2 opacity-20">
            <Terminal className="h-3.5 w-3.5" />
            <p className="text-[8px] font-black uppercase tracking-[0.2em] italic">
              Range: {skip + 1} - {Math.min(skip + PAGE_SIZE, totalCount)} // Total: {totalCount}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href={`?page=${currentPage - 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-10 px-4 rounded-xl border border-white/5 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-white/5",
                currentPage <= 1 && "pointer-events-none opacity-20"
              )}
            >
              <ChevronLeft className="size-3.5" /> PREV
            </Link>
            <div className={cn(
              "size-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white",
              isSuperAdmin ? "bg-amber-500 shadow-lg shadow-amber-500/20" : "bg-primary shadow-lg shadow-primary/20"
            )}>
              {currentPage}
            </div>
            <Link
              href={`?page=${currentPage + 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-10 px-4 rounded-xl border border-white/5 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-white/5",
                currentPage >= totalPages && "pointer-events-none opacity-20"
              )}
            >
              NEXT <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}