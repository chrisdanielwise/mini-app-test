"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Percent, Gift, ChevronLeft, ChevronRight, ShieldAlert, 
  Terminal, Globe, Tag, Building2, Activity 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { Badge } from "@/components/ui/badge";
import { CreateCouponModal } from "@/components/dashboard/create-coupon-modal";
import { CouponActionWrapper } from "@/components/dashboard/coupon-action-wrapper";
import { CouponSearch } from "@/components/dashboard/coupon-search";

export default function CouponsClientPage({ 
  initialCoupons, totalCount, query, currentPage, pageSize, isSuperAdmin, realMerchantId 
}: any) {
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  const skip = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (!isReady) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-10 px-4 text-foreground">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-white/5 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2">
            {/* 🎨 COLOR: Amber fill for staff, Primary for merchants */}
            <Tag className={cn("size-4", isSuperAdmin ? "text-amber-500 fill-amber-500" : "text-primary fill-primary")} />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-60">
              {isSuperAdmin ? "Global Marketing Protocol" : "Merchant Promotion Node"}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Node <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>Discounts</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
              {query ? `Manifest Active: "${query}"` : `Total Managed: ${totalCount} Campaigns`}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto shrink-0">
          <CouponSearch />
          <CreateCouponModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- LEDGER DATA GRID --- */}
      <div className={cn(
        "rounded-2xl border backdrop-blur-3xl overflow-hidden shadow-xl",
        isSuperAdmin ? "border-amber-500/10 bg-amber-500/[0.01]" : "border-white/5 bg-card/40"
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
              {initialCoupons.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 6 : 5} className="px-6 py-32 text-center opacity-20">
                    <ShieldAlert className="h-10 w-10 mx-auto mb-4" />
                    <p className="text-sm font-black uppercase italic tracking-tight">Zero discount nodes detected.</p>
                  </td>
                </tr>
              ) : (
                initialCoupons.map((coupon: any) => (
                  <tr key={coupon.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border shadow-inner",
                            Number(coupon.amount) >= 100 
                              ? (isSuperAdmin ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20")
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {Number(coupon.amount) >= 100 ? <Gift className="h-5 w-5" /> : <Percent className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-black uppercase italic text-sm text-foreground">{coupon.code}</p>
                          <p className="text-[8px] font-mono text-muted-foreground/40 mt-1 uppercase tracking-tighter">ID: {coupon.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>

                    {isSuperAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                          <Building2 className="h-3 w-3" />
                          <span className="text-[10px] font-black uppercase italic">{coupon.merchant?.companyName}</span>
                        </div>
                      </td>
                    )}

                    <td className="px-6 py-4">
                       <span className="font-black text-lg tracking-tighter italic text-foreground leading-none">
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
                      <Badge variant="outline" className="text-[8px] font-black uppercase italic tracking-tighter text-muted-foreground/60 bg-white/5 px-2 py-0.5 rounded border-white/5">
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
      </div>

      <div className="flex items-center justify-center gap-3 opacity-20 py-4 border-t border-white/5">
         <Globe className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
            Promotion deployment synchronized // Node: {realMerchantId ? realMerchantId.slice(0, 8) : "ROOT"}
         </p>
      </div>
    </div>
  );
}