import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import prisma from "@/lib/db";
import {
  Percent,
  Gift,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Terminal,
  Activity,
  Zap,
} from "lucide-react";
import { CreateCouponModal } from "@/components/dashboard/create-coupon-modal";
import { CouponSearch } from "@/components/dashboard/coupon-search";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CouponActionWrapper } from "@/components/dashboard/coupon-action-wrapper";

/**
 * 🎫 PROMOTION LEDGER (Tier 2)
 * High-resiliency value adjustment node for merchant marketing operations.
 * Optimized for Next.js 15+ Async searchParams.
 */
export default async function CouponsPage(props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const session = await requireMerchantSession();

  // ⚙️ SEARCH & PAGINATION ENGINE: Unwrap the Promise
  const searchParams = await props.searchParams;
  const PAGE_SIZE = 10;
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.query || "";
  const skip = (currentPage - 1) * PAGE_SIZE;

  // 🏁 DATA FETCH: Parallelized for Institutional Speed
  const [coupons, totalCount] = await Promise.all([
    prisma.coupon.findMany({
      where: {
        merchantId: session.merchant.id,
        code: { contains: query, mode: "insensitive" },
      },
      include: { service: true },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: skip,
    }),
    prisma.coupon.count({
      where: {
        merchantId: session.merchant.id,
        code: { contains: query, mode: "insensitive" },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-12 p-6 sm:p-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 fill-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Marketing Protocol
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Node <span className="text-primary">Discounts</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-4 opacity-40">
            {query
              ? `Search Manifest Active: "${query}"`
              : `Total Campaigns Managed: ${totalCount}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <CouponSearch />
          <CreateCouponModal merchantId={session.merchant.id} />
        </div>
      </div>

      {/* --- LEDGER DATA GRID --- */}
      <div className="rounded-[3.5rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                {["Identity Node", "Adjustment", "Utilization Telemetry", "Target Link", "Command"].map((head) => (
                  <th key={head} className="px-10 py-8 font-black uppercase text-[9px] text-muted-foreground/60 tracking-[0.3em]">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-48 text-center">
                    <div className="flex flex-col items-center gap-8 opacity-20">
                      <div className="h-24 w-24 rounded-[3rem] bg-muted/50 border border-dashed border-border/40 flex items-center justify-center">
                        <ShieldAlert className="h-10 w-10" />
                      </div>
                      <p className="text-sm font-black uppercase italic tracking-tighter">
                        No active discount nodes detected in current cluster.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-primary/[0.02] transition-all duration-500 group cursor-default"
                  >
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-6">
                        <div
                          className={cn(
                            "h-16 w-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                            coupon.discountPercent === 100
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-emerald-500/5"
                          )}
                        >
                          {coupon.discountPercent === 100 ? (
                            <Gift className="h-7 w-7" />
                          ) : (
                            <Percent className="h-7 w-7" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <p className="font-black text-foreground uppercase tracking-tighter text-3xl group-hover:text-primary transition-colors leading-none italic">
                            {coupon.code}
                          </p>
                          <p className="text-[9px] font-black text-muted-foreground uppercase opacity-40 tracking-widest">
                            {coupon.discountPercent === 100
                              ? "GIFT_ACCESS_KEY"
                              : "LIQUIDITY_DISCOUNT"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-2xl uppercase tracking-tighter italic">
                          -{coupon.discountPercent}%
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30 italic leading-none">Price Burn</span>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="font-black text-[10px] uppercase tracking-widest text-primary italic">
                            {coupon.useCount} / {coupon.maxUses || "∞"}
                          </span>
                          <span className="text-[8px] font-black text-muted-foreground opacity-30 italic uppercase tracking-widest">Load Factor</span>
                        </div>
                        <div className="w-40 h-2 bg-muted/30 rounded-full overflow-hidden shadow-inner border border-border/20">
                          <div
                            className={cn(
                              "h-full transition-all duration-1000",
                              coupon.discountPercent === 100 ? "bg-primary" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            )}
                            style={{
                              width: `${
                                coupon.maxUses
                                  ? (coupon.useCount / coupon.maxUses) * 100
                                  : 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-10">
                      <Badge variant="outline" className="text-[9px] font-black uppercase italic tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                        {coupon.service?.name || "Global Node"}
                      </Badge>
                    </td>
                    <td className="px-10 py-10 text-right">
                      <CouponActionWrapper
                        couponId={coupon.id}
                        code={coupon.code}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PERFORMANCE PAGINATION ENGINE --- */}
        <div className="bg-muted/30 p-10 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-border/40 backdrop-blur-3xl shadow-inner">
          <div className="flex items-center gap-3 opacity-40 italic group">
            <Terminal className="h-3 w-3" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
              Identity Node Range: {skip + 1} - {Math.min(skip + PAGE_SIZE, totalCount)} of {totalCount}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href={`?page=${currentPage - 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-14 px-8 rounded-2xl border border-border/40 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-primary/10 hover:text-primary active:scale-95 group",
                currentPage <= 1 && "pointer-events-none opacity-20"
              )}
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> PREV
            </Link>
            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-[12px] font-black text-primary-foreground shadow-2xl shadow-primary/30">
              {currentPage}
            </div>
            <Link
              href={`?page=${currentPage + 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-14 px-8 rounded-2xl border border-border/40 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-primary/10 hover:text-primary active:scale-95 group",
                currentPage >= totalPages && "pointer-events-none opacity-20"
              )}
            >
              NEXT <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}