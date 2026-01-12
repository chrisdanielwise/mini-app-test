import { requireMerchantSession } from "@/lib/auth/merchant-session";
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CouponActionWrapper } from "@/components/dashboard/coupon-action-wrapper";

/**
 * 🎫 PROMOTION LEDGER (Apex Tier)
 * Normalized: World-standard typography and responsive grid constraints.
 * Fixed: Identity handshake aligned with session.merchantId.
 */
export default async function CouponsPage(props: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  // 🔐 Identity Handshake
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

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
        merchantId: realMerchantId,
        code: { contains: query, mode: "insensitive" },
      },
      include: { service: true },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: skip,
    }),
    prisma.coupon.count({
      where: {
        merchantId: realMerchantId,
        code: { contains: query, mode: "insensitive" },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between border-b border-border/40 pb-8 md:pb-12">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Marketing Protocol
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Node <span className="text-primary">Discounts</span>
          </h1>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-40">
            {query
              ? `Search Manifest Active: "${query}"`
              : `Total Campaigns Managed: ${totalCount}`}
          </p>
        </div>

        {/* Responsive Utility Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="w-full sm:flex-1 xl:w-80">
            <CouponSearch />
          </div>
          <div className="w-full sm:w-auto">
            <CreateCouponModal merchantId={realMerchantId} />
          </div>
        </div>
      </div>

      {/* --- LEDGER DATA GRID --- */}
      <div className="rounded-3xl md:rounded-[3.5rem] border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-border/10 bg-muted/20">
                {["Identity Node", "Adjustment", "Utilization Telemetry", "Target Link", "Command"].map((head) => (
                  <th key={head} className="px-6 py-6 font-black uppercase text-[10px] text-muted-foreground/40 tracking-[0.2em]">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-muted/50 border border-border/10 flex items-center justify-center">
                        <ShieldAlert className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-black uppercase italic tracking-widest">
                        Zero discount nodes detected.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-primary/[0.02] transition-all duration-500 group"
                  >
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-5">
                        <div
                          className={cn(
                            "h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-500 group-hover:scale-105 border",
                            coupon.discountPercent === 100
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          )}
                        >
                          {coupon.discountPercent === 100 ? (
                            <Gift className="h-6 w-6" />
                          ) : (
                            <Percent className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase tracking-tighter text-xl md:text-2xl group-hover:text-primary transition-colors leading-none italic truncate">
                            {coupon.code}
                          </p>
                          <p className="text-[9px] font-black text-muted-foreground uppercase opacity-30 tracking-widest mt-1">
                            {coupon.discountPercent === 100
                              ? "GIFT_ACCESS_KEY"
                              : "LIQUIDITY_DISCOUNT"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col">
                        <span className="font-black text-xl md:text-2xl uppercase tracking-tighter italic">
                          -{coupon.discountPercent}%
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30 italic leading-none">Price Burn</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-2.5 max-w-[160px]">
                        <div className="flex items-center justify-between px-1">
                          <span className="font-black text-[10px] uppercase tracking-widest text-primary italic">
                            {coupon.useCount} / {coupon.maxUses || "∞"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden border border-border/10">
                          <div
                            className={cn(
                              "h-full transition-all duration-1000",
                              coupon.discountPercent === 100 ? "bg-primary" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
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
                    <td className="px-6 py-8">
                      <Badge variant="outline" className="text-[9px] font-black uppercase italic tracking-widest text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 truncate max-w-[150px] inline-block">
                        {coupon.service?.name || "Global Node"}
                      </Badge>
                    </td>
                    <td className="px-6 py-8 text-right">
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
        <div className="bg-muted/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/10 backdrop-blur-3xl shadow-inner">
          <div className="flex items-center gap-3 opacity-20 group">
            <Terminal className="h-3 w-3" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
              Identity Node Range: {skip + 1} - {Math.min(skip + PAGE_SIZE, totalCount)} of {totalCount}
            </p>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href={`?page=${currentPage - 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-12 md:h-14 px-5 md:px-8 rounded-xl md:rounded-2xl border border-border/10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-primary/10 hover:text-primary group",
                currentPage <= 1 && "pointer-events-none opacity-20 grayscale"
              )}
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> PREV
            </Link>
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center text-[12px] font-black text-primary-foreground shadow-xl shadow-primary/20">
              {currentPage}
            </div>
            <Link
              href={`?page=${currentPage + 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-12 md:h-14 px-5 md:px-8 rounded-xl md:rounded-2xl border border-border/10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-primary/10 hover:text-primary group",
                currentPage >= totalPages && "pointer-events-none opacity-20 grayscale"
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