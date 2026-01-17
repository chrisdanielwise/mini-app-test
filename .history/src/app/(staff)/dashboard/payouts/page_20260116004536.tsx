"use client";

import * as React from "react";
import { 
  CreditCard, Terminal, Search, Download, Zap, 
  Clock, ExternalLink, ShieldAlert, Building2,
  Filter, Activity, ChevronRight, Globe, ArrowUpRight
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * 🌊 PAYOUTS_LEDGER (Institutional Apex v2026.1.16)
 * Strategy: Defensive Ingress Logic with Restored Chroma Protocol.
 * Fix: Explicitly handles undefined 'payouts' to prevent '.length' crashes.
 */
export default function PayoutsPage({ payouts = [], session }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { 
    isReady, 
    isMobile, 
    screenSize, 
    safeArea, 
  } = useDeviceContext();

  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = session?.merchantId;

  // 🛡️ CRASH SHIELD: Verify data is an array before processing
  const safePayouts = React.useMemo(() => 
    Array.isArray(payouts) ? payouts : [], 
    [payouts]
  );

  // 🛡️ HYDRATION SHIELD: Prevent layout snapping during handshake
  if (!isReady) return <div className="min-h-screen bg-black/40 animate-pulse rounded-[3rem]" />;

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto space-y-8 md:space-y-16 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.25rem" : "0px",
        paddingRight: isMobile ? "1.25rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <CreditCard className={cn("size-4", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.5em] leading-none",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Global_Liquidity_Protocol" : "Merchant_Settlement_Node"}
              </span>
              <span className="text-[7px] font-mono uppercase tracking-widest mt-1 opacity-50">Audit_Cycle_v16.31</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Payout <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Ledger</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Terminal className={cn("size-3.5", isPlatformStaff ? "text-amber-500/40" : "text-primary/40")} />
            <span className="tracking-[0.2em]">NODE_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}</span>
            <div className="h-px w-8 bg-white/5" />
            {/* 🛡️ FIXED LINE: safePayouts ensures .length never evaluates on undefined */}
            <span className="tracking-[0.1em]">{safePayouts.length} Cycles Validated</span>
          </div>
        </div>

        {/* --- TACTICAL COMMAND HUB --- */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto shrink-0 relative z-20">
          <div className="relative flex-1 sm:w-80 group">
            <Search className={cn(
              "absolute left-5 top-1/2 -translate-y-1/2 size-4 transition-colors",
              isPlatformStaff ? "text-amber-500/20 group-focus-within:text-amber-500" : "text-primary/20 group-focus-within:text-primary"
            )} />
            <Input 
              onFocus={() => impact("light")}
              placeholder="SEARCH DESTINATION..." 
              className={cn(
                "h-14 pl-12 pr-6 rounded-2xl border bg-black/40 text-[10px] font-black uppercase tracking-widest italic transition-all",
                isPlatformStaff ? "border-amber-500/10 focus:border-amber-500/30" : "border-white/5 focus:border-primary/30"
              )}
            />
          </div>
          <Button 
            onClick={() => impact("medium")}
            variant="outline" 
            className="h-14 px-8 rounded-2xl border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest italic text-foreground hover:bg-white/10"
          >
            <Download className="mr-3 size-4 opacity-40" /> Export_Ledger
          </Button>
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Ledger --- */}
      <div className={cn(
        "rounded-[2.8rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10",
        isPlatformStaff ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        {isMobile ? (
          /* 📱 MOBILE PROTOCOL */
          <div className="p-6 space-y-6">
            {safePayouts.length === 0 ? <NoData /> : safePayouts.map((payout: any, i: number) => (
              <PayoutCard key={payout.id} payout={payout} isPlatformStaff={isPlatformStaff} index={i} onClick={selectionChange} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP PROTOCOL */
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Liquidity_Target</th>
                  {isPlatformStaff && <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin</th>}
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Destination</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Value</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Timestamp</th>
                  <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {safePayouts.length === 0 ? <tr><td colSpan={6}><NoData /></td></tr> : safePayouts.map((payout: any, index: number) => (
                  <tr 
                    key={payout.id} 
                    onClick={() => selectionChange()}
                    className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer animate-in fade-in slide-in-from-bottom-4" 
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "size-12 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-700 group-hover:rotate-6 group-hover:scale-105",
                          isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                        )}>
                          <Zap className="size-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">{payout.id.slice(0, 12)}</span>
                          <span className="text-[9px] font-mono text-muted-foreground/20 mt-1 uppercase">Ref_{payout.transactionRef || 'NODE_PENDING'}</span>
                        </div>
                      </div>
                    </td>
                    {isPlatformStaff && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest">
                          <Building2 className="size-4" />
                          {payout.merchant?.companyName || "ROOT_NODE"}
                        </div>
                      </td>
                    )}
                    <td className="px-10 py-8">
                       <Badge className="rounded-xl text-[9px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/5 border-white/5 text-muted-foreground/40 italic">
                        {payout.destination || "UNSPECIFIED_NODE"}
                      </Badge>
                    </td>
                    <td className="px-10 py-8">
                       <span className="text-2xl font-black italic tracking-tighter text-foreground tabular-nums leading-none">
                         <span className="text-xs opacity-30 mr-1.5 font-bold">{payout.currency}</span>
                         {parseFloat(payout.amount.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3 text-muted-foreground/40 italic">
                         <Clock className="size-4" />
                         <span className="text-[11px] font-black uppercase tracking-widest">{format(new Date(payout.createdAt), "dd MMM yyyy")}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <StatusBadge status={payout.status} processed={!!payout.processedAt} isStaff={isPlatformStaff} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER TELEMETRY */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <div className="flex items-center gap-4">
           <Activity className={cn("size-4 animate-pulse", isPlatformStaff ? "text-amber-500" : "text-primary")} />
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Audit_Core_Synchronized // Node_ID: {realMerchantId ? realMerchantId.slice(0, 8) : "ROOT"}
           </p>
        </div>
        {!isMobile && <div className="size-1 rounded-full bg-foreground" />}
        <span className="text-[8px] font-mono tabular-nums opacity-60">[v16.31_STABLE]</span>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Settlement Node Card */
function PayoutCard({ payout, isPlatformStaff, index, onClick }: { payout: any, isPlatformStaff: boolean, index: number, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "p-6 rounded-[2rem] border transition-all duration-700 space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-8",
        isPlatformStaff ? "bg-amber-500/[0.03] border-amber-500/10 shadow-amber-500/5" : "bg-white/[0.01] border-white/5"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-5">
          <div className={cn(
            "size-12 rounded-xl flex items-center justify-center border shadow-inner",
            isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <Zap className="size-6" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground leading-none">{payout.id.slice(0, 12)}</h3>
            <p className="text-[9px] font-black text-muted-foreground/30 uppercase mt-2 italic tracking-widest">Ref_{payout.transactionRef || 'PENDING'}</p>
          </div>
        </div>
        <StatusBadge status={payout.status} processed={!!payout.processedAt} isStaff={isPlatformStaff} />
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Value</p>
           <p className="text-xl font-black italic tracking-tighter text-foreground tabular-nums">
              <span className="text-xs opacity-20 mr-1">{payout.currency}</span>
              {parseFloat(payout.amount.toString()).toLocaleString()}
           </p>
        </div>
        <div className="text-right space-y-2">
           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Destination</p>
           <p className={cn(
             "text-[10px] font-black uppercase italic tracking-widest truncate",
             isPlatformStaff ? "text-amber-500" : "text-primary"
           )}>{payout.destination || "NODE_EXT"}</p>
        </div>
      </div>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function StatusBadge({ status, processed, isStaff }: { status: string, processed: boolean, isStaff: boolean }) {
  const isPaid = status === 'PAID';
  const isRejected = status === 'REJECTED';

  return (
    <div className={cn(
      "inline-flex items-center rounded-xl px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm italic",
      isPaid ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5" : 
      isRejected ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5" : 
      isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5" : "bg-white/5 text-muted-foreground border-white/10"
    )}>
      {status}
      {processed && <ExternalLink className="ml-2 size-3 opacity-40" />}
    </div>
  );
}

function NoData() {
  return (
    <div className="py-24 text-center space-y-6 opacity-10">
      <ShieldAlert className="size-16 animate-pulse mx-auto" />
      <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">Zero_Settlement_Cycles</p>
    </div>
  );
}