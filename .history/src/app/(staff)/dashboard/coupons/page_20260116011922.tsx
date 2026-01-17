"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Percent, Gift, ChevronLeft, ChevronRight, ShieldAlert, 
  Terminal, Globe, Tag, Building2, Activity, Filter, 
  Plus, Search, MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateCouponModal } from "@/components/dashboard/create-coupon-modal";
import { CouponActionWrapper } from "@/components/dashboard/coupon-action-wrapper";
import { CouponSearch } from "@/components/dashboard/coupon-search";

/**
 * 🎫 PROMOTION_LEDGER (Institutional Apex v16.31.25)
 * Strategy: Re-integration of Legacy RBAC Filters with v16 Ingress.
 * Fix: Restored Amber/Emerald conditional radiance protocols and fixed pagination.
 */
export default function CouponsPage({ 
  coupons = [], 
  totalCount = 0, 
  query = "",
  pagination = { currentPage: 1, totalPages: 1, skip: 0, pageSize: 10 } 
}: any) {
  const { flavor } = useLayout();
  const { user } = useInstitutionalAuth();
  const { impact, selectionChange } = useHaptics();
  const { 
    isReady, isMobile, safeArea, viewportHeight 
  } = useDeviceContext();

  // 🛡️ IDENTITY & COLOR RESOLUTION (Restored from Legacy)
  const isSuperAdmin = flavor === "AMBER";
  const realMerchantId = user?.merchantId;
  const role = user?.role || "NODE_GUEST";

  // 🛡️ CRASH SHIELD: Verify data is an array before processing
  const safeCoupons = React.useMemo(() => 
    Array.isArray(coupons) ? coupons : [], 
    [coupons]
  );

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto transition-all duration-1000",
        "animate-in fade-in slide-in-from-bottom-12",
        viewportHeight < 700 ? "space-y-6" : "space-y-10 md:space-y-14"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0px",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: isMobile ? "1.25rem" : "2rem",
        paddingRight: isMobile ? "1.25rem" : "2rem"
      }}
    >
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8 relative group">
        <div className="space-y-4">
          <div className="flex items-center gap-3 italic opacity-40">
            <Tag className={cn("size-3.5", isSuperAdmin ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
                isSuperAdmin ? "text-amber-500" : "text-primary"
              )}>
                {isSuperAdmin ? "Global_Marketing_Protocol" : "Merchant_Promotion_Node"}
              </span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2rem,8vw,4rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Node <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Discounts</span>
          </h1>
          
          <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground/30 italic uppercase tracking-[0.2em]">
            <Terminal className="size-3" />
            <span>{query ? `Manifest Active: "${query}"` : `Total Managed: ${totalCount} Campaigns`}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full md:w-auto shrink-0 relative z-20">
          <div className="relative min-w-0 sm:w-64">
            <CouponSearch />
          </div>
          <CreateCouponModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- LEDGER DATA GRID: Obsidian Depth --- */}
      <div className={cn(
        "rounded-[2.8rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10",
        isSuperAdmin ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity Node</th>
                {isSuperAdmin && <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin</th>}
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Adjustment</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Utilization</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Target Node</th>
                <th className="px-10 py-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {safeCoupons.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 6 : 5} className="px-10 py-32 text-center opacity-10">
                    <div className="flex flex-col items-center gap-6">
                      <ShieldAlert className="size-16 animate-pulse" />
                      <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">Zero_Promotion_Vectors</p>
                    </div>
                  </td>
                </tr>
              ) : (
                safeCoupons.map((coupon: any, index: number) => (
                  <tr 
                    key={coupon.id} 
                    onMouseEnter={() => impact("light")}
                    onClick={() => selectionChange()}
                    className="hover:bg-white/[0.02] transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                            "size-11 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-700 group-hover:rotate-12",
                            Number(coupon.amount) >= 100 
                              ? (isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20")
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {Number(coupon.amount) >= 100 ? <Gift className="size-5" /> : <Percent className="size-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">{coupon.code}</span>
                          <span className="text-[8px] font-mono text-muted-foreground/20 mt-1 uppercase">ID: {coupon.id.slice(-8)}</span>
                        </div>
                      </div>
                    </td>

                    {isSuperAdmin && (
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest">
                          <Building2 className="size-4" />
                          {coupon.merchant?.companyName || "ROOT_NODE"}
                        </div>
                      </td>
                    )}

                    <td className="px-10 py-8">
                       <span className="text-xl font-black italic tracking-tighter text-foreground tabular-nums leading-none">
                         {coupon.discountType === 'PERCENTAGE' ? `-${coupon.amount}%` : `$${coupon.amount}`}
                       </span>
                    </td>

                    <td className="px-10 py-8">
                      <div className="w-32 space-y-3">
                         <div className="flex justify-between text-[8px] font-black uppercase italic tracking-widest text-muted-foreground/40 leading-none">
                           <span>{coupon.currentUses} Uses</span>
                           <span>{coupon.maxUses || "∞"}</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full transition-all duration-1000", Number(coupon.amount) >= 100 ? "bg-primary" : "bg-emerald-500")} 
                              style={{ width: `${coupon.maxUses ? (coupon.currentUses / coupon.maxUses) * 100 : 100}%` }} 
                            />
                         </div>
                      </div>
                    </td>

                    <td className="px-10 py-8">
                      <Badge variant="outline" className="rounded-xl text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/5 border-white/5 text-muted-foreground/60 italic truncate max-w-[140px]">
                        {coupon.service?.name || "Global_Node"}
                      </Badge>
                    </td>

                    <td className="px-10 py-8 text-right">
                      <CouponActionWrapper couponId={coupon.id} code={coupon.code} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PERFORMANCE PAGINATION --- */}
        <div className="bg-white/[0.01] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 backdrop-blur-3xl">
          <div className="flex items-center gap-4 opacity-10 italic">
            <Terminal className="size-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">
              Range: {pagination.skip + 1} - {Math.min(pagination.skip + (pagination.pageSize || 10), totalCount)} // Total: {totalCount}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href={`?page=${pagination.currentPage - 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-10 px-5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-2.5 text-[9px] font-black uppercase tracking-widest transition-all italic hover:bg-primary/5 hover:text-primary active:scale-95",
                pagination.currentPage <= 1 && "pointer-events-none opacity-10 grayscale"
              )}
            >
              <ChevronLeft className="size-3" /> PREV
            </Link>
            <div className={cn(
              "size-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white shadow-lg italic",
              isSuperAdmin ? "bg-amber-500 shadow-amber-500/20" : "bg-primary shadow-primary/20"
            )}>
              {pagination.currentPage}
            </div>
            <Link
              href={`?page=${pagination.currentPage + 1}${query ? `&query=${query}` : ""}`}
              className={cn(
                "h-10 px-5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-2.5 text-[9px] font-black uppercase tracking-widest transition-all italic hover:bg-primary/5 hover:text-primary active:scale-95",
                pagination.currentPage >= pagination.totalPages && "pointer-events-none opacity-10 grayscale"
              )}
            >
              NEXT <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div className="flex items-center justify-center gap-5 opacity-10 py-12 border-t border-white/5">
        <Activity className={cn("size-3.5", isSuperAdmin ? "text-amber-500" : "text-primary")} />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-foreground italic">
           Promotion deployment synchronized // Node: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}
        </p>
      </div>
    </div>
  );
}