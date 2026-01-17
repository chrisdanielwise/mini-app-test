"use client";

import * as React from "react";
import { 
  Ticket, Terminal, Search, Zap, 
  Activity, Tag, Users,
  Globe, ShieldCheck, MoreHorizontal,
  Trash2, Percent, Gift, ChevronLeft, ChevronRight, ShieldAlert, Building2
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreateCouponModal } from "@/components/dashboard/create-coupon";
import { CouponActionWrapper } from "@/components/dashboard/coupon-action";

/**
 * 🌊 COUPONS_PAGE (Institutional Apex v2026.1.16)
 * Strategy: Defensive Ingress Logic with Restored Chroma Protocol.
 * Fix: Explicitly handles undefined 'coupons' to prevent '.length' crashes.
 */
export default function CouponsPage({ 
  coupons = [], // 🛡️ Default parameter guard
  totalCount = 0, 
  session, 
  query = "", 
  pagination = { currentPage: 1, totalPages: 1, skip: 0, pageSize: 10 } 
}: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  // 🛡️ CHROMA PROTOCOL: Role-based aesthetic injection
  const isSuperAdmin = flavor === "AMBER";
  const realMerchantId = session?.merchantId;

  // 🛡️ CRASH SHIELD: Verify data is an array before processing
  const safeCoupons = React.useMemo(() => 
    Array.isArray(coupons) ? coupons : [], 
    [coupons]
  );

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-screen bg-black/40 animate-pulse rounded-[3rem]" />;

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto space-y-8 md:space-y-16 pb-24 px-6 md:px-12",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <Ticket className={cn("size-4", isSuperAdmin ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.5em] leading-none",
                isSuperAdmin ? "text-amber-500" : "text-primary"
              )}>
                {isSuperAdmin ? "Global_Promo_Protocol" : "Merchant_Campaign_Node"}
              </span>
              <span className="text-[7px] font-mono uppercase tracking-widest mt-1 opacity-50">Handshake_v16.31</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Promo <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Ledger</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Terminal className={cn("size-3.5", isSuperAdmin ? "text-amber-500/40" : "text-primary/40")} />
            <span className="tracking-[0.2em]">NODE_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}</span>
            <div className="h-px w-8 bg-white/5" />
            <span className="tracking-[0.1em]">{safeCoupons.length} Active Vectors</span>
          </div>
        </div>

        {/* --- TACTICAL COMMAND HUB --- */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto shrink-0 relative z-20">
          <div className="relative flex-1 sm:w-80 group">
            <Search className={cn(
              "absolute left-5 top-1/2 -translate-y-1/2 size-4 transition-colors",
              isSuperAdmin ? "text-amber-500/20 group-focus-within:text-amber-500" : "text-primary/20 group-focus-within:text-primary"
            )} />
            <Input 
              onFocus={() => impact("light")}
              placeholder="QUERY_CAMPAIGN..."
              className={cn(
                "h-14 pl-12 pr-6 rounded-2xl border bg-black/40 text-[10px] font-black uppercase tracking-widest italic transition-all",
                isSuperAdmin ? "border-amber-500/10 focus:border-amber-500/30" : "border-white/5 focus:border-primary/30"
              )}
            />
          </div>
          <CreateCouponModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Ledger --- */}
      <div className={cn(
        "rounded-[2.8rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10",
        isSuperAdmin ? "bg-amber-500/[0.02] border-amber-500/10 shadow-amber-500/5" : "bg-black/40 border-white/5"
      )}>
        {isMobile ? (
          /* 📱 MOBILE PROTOCOL */
          <div className="p-6 space-y-6">
            {safeCoupons.length === 0 ? <NoData isSuperAdmin={isSuperAdmin} /> : safeCoupons.map((coupon: any, i: number) => (
              <CouponCard key={coupon.id} coupon={coupon} isSuperAdmin={isSuperAdmin} index={i} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP PROTOCOL */
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Identity_Node</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol_Code</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Reduction</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Mesh_Usage</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                  <th className="px-10 py-8 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* 🛡️ FIXED LINE: safeCoupons ensures .length never evaluates on undefined */}
                {safeCoupons.length === 0 ? (
                  <tr><td colSpan={6}><NoData isSuperAdmin={isSuperAdmin} /></td></tr>
                ) : (
                  safeCoupons.map((coupon: any, index: number) => (
                    <tr 
                      key={coupon.id} 
                      onMouseEnter={() => impact("light")}
                      onClick={() => selectionChange()}
                      className="hover:bg-white/[0.02] transition-all duration-500 group cursor-pointer animate-in fade-in slide-in-from-bottom-4" 
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "size-11 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-700 group-hover:rotate-12",
                            isSuperAdmin ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                          )}>
                            {Number(coupon.discountPercent) >= 100 ? <Gift className="size-5" /> : <Tag className="size-5" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">
                              {coupon.service?.name || "Global Cluster"}
                            </span>
                            <span className="text-[8px] font-mono text-muted-foreground/20 mt-1 uppercase">ID_{coupon.id.slice(-8)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono font-black tracking-[0.2em] text-foreground/60">
                           {coupon.code}
                         </span>
                      </td>
                      <td className="px-10 py-8">
                         <span className="text-2xl font-black italic tracking-tighter text-foreground tabular-nums">
                           {coupon.discountPercent}% <span className="text-[10px] opacity-20 ml-1">OFF</span>
                         </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-muted-foreground/40 italic">
                           <Users className="size-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">
                             {coupon.timesUsed} / {coupon.maxUses || "∞"}
                           </span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <StatusBadge isActive={coupon.isActive} />
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
        )}
      </div>

      {/* FOOTER SIGNAL */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <Activity className={cn("size-4 animate-pulse", isSuperAdmin ? "text-amber-500" : "text-primary")} />
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic">
          Promo_Telemetry_Stable // Handshake_v16.31
        </p>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Campaign Node Card */
function CouponCard({ coupon, isSuperAdmin, index }: { coupon: any, isSuperAdmin: boolean, index: number }) {
  return (
    <div 
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "p-6 rounded-[2rem] border transition-all duration-700 space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-8",
        isSuperAdmin ? "bg-amber-500/[0.03] border-amber-500/10 shadow-amber-500/5" : "bg-white/[0.01] border-white/5"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
           <div className={cn(
              "size-12 rounded-xl flex items-center justify-center border shadow-inner",
              isSuperAdmin ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <Tag className="size-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground leading-none">
              {coupon.service?.name || "Global"}
            </h3>
            <p className="text-[10px] font-mono font-black text-muted-foreground/30 mt-1.5 uppercase tracking-widest">
              {coupon.code}
            </p>
          </div>
        </div>
        <StatusBadge isActive={coupon.isActive} />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div className="space-y-1.5">
           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Reduction</p>
           <p className="text-xl font-black italic tracking-tighter text-foreground">
              {coupon.discountPercent}% <span className="text-xs opacity-20 ml-1">OFF</span>
           </p>
        </div>
        <div className="text-right space-y-1.5">
           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Mesh_Usage</p>
           <p className={cn("text-lg font-black italic tracking-tighter", isSuperAdmin ? "text-amber-500" : "text-primary")}>
             {coupon.timesUsed} / {coupon.maxUses || "∞"}
           </p>
        </div>
      </div>
      
      <div className="pt-4">
        <CouponActionWrapper couponId={coupon.id} code={coupon.code} />
      </div>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm italic",
      isActive 
        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
    )}>
      {isActive ? <ShieldCheck className="size-3 mr-2 animate-pulse" /> : <Activity className="size-3 mr-2" />}
      {isActive ? "Live" : "Isolated"}
    </div>
  );
}

function NoData({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  return (
    <div className="py-24 text-center space-y-6 opacity-10">
      <Ticket className="size-16 animate-pulse mx-auto" />
      <div className="text-center space-y-2">
        <p className="text-[12px] font-black uppercase tracking-[0.4em] italic">Zero_Promo_Vectors</p>
        <p className="text-[8px] font-black uppercase tracking-widest">Node_Isolated</p>
      </div>
    </div>
  );
}