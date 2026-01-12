import { requireStaff } from "@/lib/auth/session";
import prisma from "@/lib/db";
import {
  Percent,
  Gift,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Terminal,
  Globe,
  Tag,
  Building2
} from "lucide-react";
import { CreateCouponModal } from "@/components/dashboard/create-coupon-modal";
import { CouponSearch } from "@/components/dashboard/coupon-search";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CouponActionWrapper } from "@/components/dashboard/coupon-action-wrapper";

/**
 * 🎫 PROMOTION LEDGER (Institutional v9.4.0)
 * Fix: Dynamic RBAC Filter prevents Prisma validation crash on 'null' merchantId.
 * Fix: Field alignment with Schema v2.0.0 (amount, currentUses).
 */
export default async function CouponsPage(props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  // 🔐 Identity Handshake
  const session = await requireStaff();
  const realMerchantId = session.merchantId;
  const isSuperAdmin = session.user.role === "super_admin";

  // ⚙️ SEARCH & PAGINATION ENGINE
  const searchParams = await props.searchParams;
  const PAGE_SIZE = 10;
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const skip = (currentPage - 1) * PAGE_SIZE;

  // 🛡️ DYNAMIC PROTOCOL FILTER
  // Logic: If Staff, fetch global campaigns. If Merchant, isolate cluster.
  const whereClause = {
    ...(realMerchantId ? { merchantId: realMerchantId } : {}),
    code: { contains: query, mode: "insensitive" as const },
  };

  // 🏁 DATA FETCH: Parallelized Cluster Sync
  const [coupons, totalCount] = await Promise.all([
    prisma.coupon.findMany({
      where: whereClause,
      include: { 
        service: true,
        merchant: { select: { companyName: true } } // Visibility for Super Admin
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: skip,
    }),
    prisma.coupon.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 px-4 text-foreground">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary/60">
            <Tag className="h-4 w-4 shrink-0 fill-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              {isSuperAdmin ? "Global Marketing Protocol" : "Merchant Promotion Node"}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none">
              Node <span className="text-primary">Discounts</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
              {query
                ? `Manifest Active: "${query}"`
                : `Total Managed: ${totalCount} Campaigns`}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto shrink-0">
          <div className="relative min-w-0 sm:w-64 group">
            <CouponSearch />
          </div>
          <div className="shrink-0">
            {/* 🚀 FIXED: Fallback ID for staff so modal doesn't crash */}
            <CreateCouponModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
          </div>
        </div>
      </div>

      {/* --- LEDGER DATA GRID --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-border/10 bg-muted/20">
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-widest">Identity Node</th>
                {isSuperAdmin && <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-widest">Origin</th>}
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-widest">Adjustment</th>
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-widest">Utilization</th>
                <th className="px-6 py-4 font-black uppercase text-[9px] text-muted-foreground/60 tracking-widest">Target Node</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 6 : 5} className="px-6 py-32 text-center opacity-20">
                    <div className="flex flex-col items-center gap-4">
                      <ShieldAlert className="h-10 w-10" />
                      <p className="text-sm font-black uppercase italic tracking-tight">Zero discount nodes detected.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border shadow-inner",
                            Number(coupon.amount) >= 100
                              ? "bg-primary/5 text-primary border-primary/20"
                              : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                          )}>
                          {Number(coupon.amount) >= 100 ? <Gift className="h-5 w-5" /> : <Percent className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black uppercase italic tracking-tight text-sm truncate group-hover:text-primary transition-colors">
                            {coupon.code}
                          </p>
                          <p className="text-[8px] font-mono font-bold text-muted-foreground/40 uppercase tracking-tighter mt-1">
                            ID: {coupon.id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {isSuperAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                          <Building2 className="h-3 w-3" />
                          <span className="text-[10px] font-black uppercase italic">{coupon.merchant.companyName}</span>
                        </div>
                      </td>
                    )}

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-lg md:text-xl tracking-tighter italic leading-none">
                          {coupon.discountType === 'PERCENTAGE' ? `-${coupon.amount}%` : `$${coupon.amount}`}
                        </span>
                        <span className="text-[8px] font-bold uppercase text-muted-foreground/30 tracking-widest mt-1">
                          {coupon.discountType}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 max-w-[140px]">
                        <div className="flex items-center justify-between px-0.5">
                          <span className="font-black text-[9px] uppercase tracking-widest text-primary/60 italic leading-none tabular-nums">
                            {coupon.currentUses} / {coupon.maxUses || "∞"}
                          </span>
                        </div>
                        <div className="w-full h-1 bg-muted/20 rounded-full overflow-hidden border border-border/5">
                          <div
                            className={cn("h-full transition-all duration-1000", Number(coupon.amount) >= 100 ? "bg-primary" : "bg-emerald-500")}
                            style={{ width: `${coupon.maxUses ? (coupon.currentUses / coupon.maxUses) * 100 : 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[8px] font-black uppercase italic tracking-tighter text-primary/60 bg-primary/5 px-2 py-0.5 rounded border-primary/10 truncate max-w-[140px]">
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
        <div className="bg-muted/10 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/10 backdrop-blur-3xl">
          <div className="flex items-center gap-2.5 opacity-20">
            <Terminal className="h-3.5 w-3.5" />
            <p className="text-[8px] font-black uppercase tracking-[0.2em] italic">
              Range: {skip + 1} - {Math.min(skip + PAGE_SIZE, totalCount)} // Total: {totalCount}
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <Link
              href={`?page=${currentPage - 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-10 px-4 rounded-xl border border-border/10 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-primary/10 hover:text-primary group",
                currentPage <= 1 && "pointer-events-none opacity-20 grayscale"
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> PREV
            </Link>
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-[11px] font-black text-primary-foreground shadow-lg">
              {currentPage}
            </div>
            <Link
              href={`?page=${currentPage + 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-10 px-4 rounded-xl border border-border/10 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all hover:bg-primary/10 hover:text-primary group",
                currentPage >= totalPages && "pointer-events-none opacity-20 grayscale"
              )}
            >
              NEXT <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
         <Globe className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Promotion deployment synchronized // Node: {realMerchantId ? realMerchantId.slice(0, 8) : "ROOT"}
         </p>
      </div>
    </div>
  );
}