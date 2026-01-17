"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Percent, Gift, ChevronLeft, ChevronRight, ShieldAlert, 
  Terminal, Globe, Tag, Building2, Activity 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { Badge } from "@/components/ui/badge";
import { CreateCouponModal } from "@/components/dashboard/create-coupon-modal";
import { CouponActionWrapper } from "@/components/dashboard/coupon-action-wrapper";
import { CouponSearch } from "@/components/dashboard/coupon-search";

/**
 * 🛰️ PROMOTION_LEDGER_CLIENT (Institutional Apex v2026.1.20)
 * Strategy: De-stacked Independent Scroll Volume & Vertical Compression.
 * Fix: Forced 'h-full' and 'flex-1' to isolate scrolling; reduced row py for density.
 */
export default function CouponsClientPage({ 
  coupons = [], 
  totalCount, 
  query, 
  pagination, 
  isSuperAdmin, 
  realMerchantId 
}: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 italic opacity-30">
              <Tag className={cn("size-3", isSuperAdmin ? "text-amber-500" : "text-primary")} />
              <span className={cn(
                  "text-[8px] font-black uppercase tracking-[0.4em] leading-none",
                  isSuperAdmin ? "text-amber-500" : "text-primary"
              )}>
                {isSuperAdmin ? "Global_Marketing_Protocol" : "Merchant_Promotion_Node"}
              </span>
            </div>
            
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
              Node <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Discounts</span>
            </h1>
            
            <div className="flex items-center gap-2 text-[7px] font-black text-muted-foreground/20 italic uppercase tracking-[0.2em]">
              <Terminal className="size-2.5" />
              <span className="truncate">
                {query ? `Manifest Active: "${query}"` : `Total Managed: ${totalCount} Campaigns`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 scale-90 origin-bottom-right">
            <div className="relative min-w-0 w-48 lg:w-64">
              <CouponSearch />
            </div>
            <CreateCouponModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Fleet Grid --- */}
      <div className="flex-1 min-h-0 w-full relative flex flex-col px-6 pt-4 pb-6">
        <div className={cn(
          "flex-1 w-full rounded-[1.5rem] border backdrop-blur-3xl shadow-2xl bg-card/40 flex flex-col overflow-hidden",
          isSuperAdmin ? "border-amber-500/10" : "border-white/5"
        )}>
          {/* 🛡️ THE SCROLL ENGINE */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <thead className="bg-white/[0.04] border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
                <tr>
                  <th className="w-[30%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity Node</th>
                  {isSuperAdmin && <th className="w-[18%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.4em] text-amber-500/30 italic">Origin</th>}
                  <th className="w-[15%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Adjustment</th>
                  <th className="w-[15%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Utilization</th>
                  <th className="w-[15%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Target Node</th>
                  <th className="w-[7%] px-6 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 6 : 5} className="py-24 text-center opacity-10">
                      <ShieldAlert className="size-12 mx-auto mb-4 animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Zero_Promotion_Vectors</p>
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon: any) => (
                    <tr 
                      key={coupon.id} 
                      onMouseEnter={() => impact("light")}
                      onClick={() => selectionChange()}
                      className="hover:bg-white/[0.01] transition-colors border-none group"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                              "size-9 shrink-0 rounded-lg flex items-center justify-center border transition-transform group-hover:rotate-12",
                              Number(coupon.amount) >= 100 
                                ? (isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20")
                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          )}>
                            {Number(coupon.amount) >= 100 ? <Gift className="size-4" /> : <Percent className="size-4" />}
                          </div>
                          <div className="flex flex-col min-w-0 leading-tight">
                            <span className="text-sm font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors truncate">{coupon.code}</span>
                            <span className="text-[6px] font-mono text-muted-foreground/20 uppercase mt-0.5">ID: {coupon.id.slice(-8)}</span>
                          </div>
                        </div>
                      </td>

                      {isSuperAdmin && (
                        <td className="px-6 py-3.5">
                           <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[9px] truncate">
                            <Building2 className="size-3 shrink-0" />
                            {coupon.merchant?.companyName || "ROOT_NODE"}
                          </div>
                        </td>
                      )}

                      <td className="px-6 py-3.5">
                         <span className="text-lg font-black italic text-foreground leading-none tabular-nums">
                           {coupon.discountType === 'PERCENTAGE' ? `-${coupon.amount}%` : `$${coupon.amount}`}
                         </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <div className="w-24 space-y-1.5">
                           <div className="flex justify-between text-[6px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none">
                             <span>{coupon.currentUses} / {coupon.maxUses || "∞"}</span>
                           </div>
                           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full transition-all duration-1000", Number(coupon.amount) >= 100 ? (isSuperAdmin ? "bg-amber-500" : "bg-primary") : "bg-emerald-500")} 
                                style={{ width: `${coupon.maxUses ? (coupon.currentUses / coupon.maxUses) * 100 : 100}%` }} 
                              />
                           </div>
                        </div>
                      </td>

                      <td className="px-6 py-3.5">
                        <Badge variant="outline" className="rounded-lg text-[7px] font-black uppercase italic tracking-tighter text-muted-foreground/40 bg-white/5 px-1.5 py-0.5 border-white/5 truncate max-w-[120px]">
                          {coupon.service?.name || "Global Node"}
                        </Badge>
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        <CouponActionWrapper couponId={coupon.id} code={coupon.code} compact />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* --- PERFORMANCE PAGINATION --- */}
          <div className="shrink-0 bg-white/[0.04] px-6 py-3 flex items-center justify-between border-t border-white/5 backdrop-blur-3xl">
            <div className="flex items-center gap-3 opacity-10 italic">
              <Terminal className="size-3" />
              <p className="text-[7.5px] font-black uppercase tracking-[0.2em]">
                Range: {pagination.skip + 1}-{Math.min(pagination.skip + pagination.pageSize, totalCount)} // Total: {totalCount}
              </p>
            </div>
            
            <div className="flex items-center gap-2 scale-90">
              <Link
                href={`?page=${pagination.currentPage - 1}${query ? `&query=${query}` : ""}`}
                className={cn(
                  "h-8 px-3 rounded-lg border border-white/5 bg-white/[0.02] flex items-center gap-2 text-[8px] font-black uppercase tracking-widest italic hover:bg-primary/5 transition-all",
                  pagination.currentPage <= 1 && "pointer-events-none opacity-10"
                )}
              >
                <ChevronLeft className="size-3" />
              </Link>
              <div className={cn(
                "size-8 rounded-lg flex items-center justify-center text-[9px] font-black text-white shadow-lg italic",
                isSuperAdmin ? "bg-amber-500" : "bg-primary"
              )}>
                {pagination.currentPage}
              </div>
              <Link
                href={`?page=${pagination.currentPage + 1}${query ? `&query=${query}` : ""}`}
                className={cn(
                  "h-8 px-3 rounded-lg border border-white/5 bg-white/[0.02] flex items-center gap-2 text-[8px] font-black uppercase tracking-widest italic hover:bg-primary/5 transition-all",
                  pagination.currentPage >= pagination.totalPages && "pointer-events-none opacity-10"
                )}
              >
                <ChevronRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}