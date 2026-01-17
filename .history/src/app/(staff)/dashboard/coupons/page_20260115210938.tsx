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

// 🛠️ Atomic UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateCouponModal } from "@/components/dashboard/create-coupon-modal";
import { CouponActionWrapper } from "@/components/dashboard/coupon-action-wrapper";

/**
 * 🌊 PROMOTION_LEDGER (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Transition | Obsidian-OLED Depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
 */
export default function CouponsPage({ coupons, totalCount, session, query, pagination }: any) {
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();
  
  // 🛡️ IDENTITY RESOLUTION
  const isSuperAdmin = flavor === "AMBER";
  const realMerchantId = session?.merchantId;

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="min-h-screen bg-background animate-pulse" />;

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto space-y-10 md:space-y-16 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.5rem" : "0px",
        paddingRight: isMobile ? "1.5rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <Tag className={cn("size-4", isSuperAdmin ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                {isSuperAdmin ? "Global_Marketing_Protocol" : "Merchant_Promotion_Node"}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-50">v16.31_STABLE</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Node <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Discounts</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Terminal className="size-3.5" />
            <span className="tracking-[0.2em]">NODE_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}</span>
            <div className="h-px w-8 bg-white/5" />
            <span className="tracking-[0.1em]">{totalCount} Campaigns Managed</span>
          </div>
        </div>

        {/* --- TACTICAL COMMAND HUB --- */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto shrink-0 relative z-20">
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Query_Campaign_Code..."
              className="h-14 pl-12 pr-6 rounded-2xl border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest italic focus:ring-primary/10 transition-all"
            />
          </div>
          <CreateCouponModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Ledger --- */}
      <div className={cn(
        "rounded-[3rem] border border-white/5 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-apex relative z-10",
        isSuperAdmin ? "bg-amber-500/[0.01] border-amber-500/10" : ""
      )}>
        {isMobile ? (
          /* 📱 MOBILE PROTOCOL: Kinetic Identity Cards */
          <div className="p-6 space-y-6">
            {coupons.length === 0 ? <NoData isSuperAdmin={isSuperAdmin} /> : coupons.map((coupon: any, i: number) => (
              <CouponCard key={coupon.id} coupon={coupon} isSuperAdmin={isSuperAdmin} index={i} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP PROTOCOL: Institutional Oversight Ledger */
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity_Node</th>
                  {isSuperAdmin && <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin</th>}
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Adjustment</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Utilization</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Target_Service</th>
                  <th className="px-10 py-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.length === 0 ? <tr><td colSpan={6}><NoData isSuperAdmin={isSuperAdmin} /></td></tr> : coupons.map((coupon: any, index: number) => (
                  <tr key={coupon.id} className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 60}ms` }}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                            "size-12 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12",
                            Number(coupon.amount) >= 100 ? "bg-primary/10 text-primary border-primary/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {Number(coupon.amount) >= 100 ? <Gift className="size-6" /> : <Percent className="size-6" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">{coupon.code}</span>
                          <span className="text-[9px] font-mono text-muted-foreground/20 mt-1 uppercase">NODE_{coupon.id.slice(-8)}</span>
                        </div>
                      </div>
                    </td>
                    {isSuperAdmin && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest">
                          <Building2 className="size-4" />
                          {coupon.merchant.companyName}
                        </div>
                      </td>
                    )}
                    <td className="px-10 py-8">
                       <span className="text-2xl font-black italic tracking-tighter text-foreground tabular-nums leading-none">
                         {coupon.discountType === 'PERCENTAGE' ? `-${coupon.amount}%` : `$${coupon.amount}`}
                       </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="w-32 space-y-3">
                         <div className="flex justify-between text-[9px] font-black uppercase italic tracking-widest text-muted-foreground/40">
                           <span>{coupon.currentUses} Uses</span>
                           <span>{coupon.maxUses || "∞"}</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${coupon.maxUses ? (coupon.currentUses / coupon.maxUses) * 100 : 100}%` }} />
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <Badge className="rounded-xl text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/5 border-white/5 text-muted-foreground/60 italic">
                        {coupon.service?.name || "Global_Node"}
                      </Badge>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <CouponActionWrapper couponId={coupon.id} code={coupon.code} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- PERFORMANCE PAGINATION --- */}
        <div className="bg-white/[0.02] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 backdrop-blur-3xl">
          <div className="flex items-center gap-4 opacity-20 italic">
            <Terminal className="size-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              Range: {pagination.skip + 1} - {Math.min(pagination.skip + pagination.pageSize, totalCount)} // Total: {totalCount}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <PaginationBtn href={`?page=${pagination.currentPage - 1}${query ? `&query=${query}` : ""}`} disabled={pagination.currentPage <= 1}>
              <ChevronLeft className="size-4" /> PREV
            </PaginationBtn>
            <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-[12px] font-black text-white shadow-apex-primary italic">
              {pagination.currentPage}
            </div>
            <PaginationBtn href={`?page=${pagination.currentPage + 1}${query ? `&query=${query}` : ""}`} disabled={pagination.currentPage >= pagination.totalPages}>
              NEXT <ChevronRight className="size-4" />
            </PaginationBtn>
          </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <div className="flex items-center gap-4">
           <Activity className="size-4 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Promotion_Deployment_Synchronized // Node_{realMerchantId ? realMerchantId.slice(0, 8) : "ROOT"}
           </p>
        </div>
        {!isMobile && <div className="size-1 rounded-full bg-foreground" />}
        <span className="text-[8px] font-mono tabular-nums opacity-60">[v16.31_STABLE]</span>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Promotion Node Card */
function CouponCard({ coupon, isSuperAdmin, index }: { coupon: any, isSuperAdmin: boolean, index: number }) {
  return (
    <div 
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "p-8 rounded-[2.8rem] border border-white/5 bg-white/[0.02] space-y-8 shadow-apex animate-in fade-in slide-in-from-bottom-8",
        isSuperAdmin ? "bg-amber-500/[0.02] border-amber-500/10" : ""
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-5">
           <div className={cn(
              "size-14 rounded-2xl flex items-center justify-center border shadow-inner",
              Number(coupon.amount) >= 100 ? "bg-primary/10 text-primary border-primary/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          )}>
            {Number(coupon.amount) >= 100 ? <Gift className="size-7" /> : <Percent className="size-7" />}
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground leading-none">{coupon.code}</h3>
            {isSuperAdmin && (
              <p className="text-[8px] font-black text-amber-500 uppercase mt-2 italic tracking-widest">{coupon.merchant.companyName}</p>
            )}
            <p className="text-[10px] font-black text-muted-foreground/30 uppercase mt-3 italic tracking-[0.2em]">{coupon.service?.name || "Global_Node"}</p>
          </div>
        </div>
        <CouponActionWrapper couponId={coupon.id} code={coupon.code} />
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Adjustment</p>
           <p className="text-2xl font-black italic tracking-tighter text-foreground">
              {coupon.discountType === 'PERCENTAGE' ? `-${coupon.amount}%` : `$${coupon.amount}`}
           </p>
        </div>
        <div className="text-right space-y-2">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Utilization</p>
           <p className="text-xl font-black italic tracking-tighter text-primary">{coupon.currentUses} / {coupon.maxUses || "∞"}</p>
        </div>
      </div>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function PaginationBtn({ href, disabled, children }: any) {
  return (
    <Link
      href={href}
      className={cn(
        "h-12 px-6 rounded-2xl border border-white/5 bg-white/[0.03] flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all italic hover:bg-primary/10 hover:text-primary active:scale-95",
        disabled && "pointer-events-none opacity-10 grayscale"
      )}
    >
      {children}
    </Link>
  );
}

function NoData({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  return (
    <div className="py-32 flex flex-col items-center gap-8 opacity-20">
      <ShieldAlert className="size-20" />
      <div className="text-center space-y-3">
        <p className="text-[14px] font-black uppercase tracking-[0.5em] italic">Zero_Promotion_Nodes</p>
        <p className="text-[9px] font-black uppercase tracking-widest">Protocol_Handshake_Isolated</p>
      </div>
    </div>
  );
}