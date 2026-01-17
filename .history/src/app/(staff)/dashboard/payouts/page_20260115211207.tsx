"use client";

import * as React from "react";
import { 
  CreditCard, Terminal, Search, Download, Zap, 
  Clock, ExternalLink, ShieldAlert, Building2,
  Filter, Activity, ChevronRight
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
 * 🌊 PAYOUTS_LEDGER (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Ingress | Obsidian-OLED Depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
 */
export default function PayoutsPage({ payouts, session }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { 
    isReady, 
    isMobile, 
    screenSize, 
    safeArea, 
    viewportHeight 
  } = useDeviceContext();

  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = session?.merchantId;

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="min-h-screen bg-background animate-pulse" />;

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
              <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                {isPlatformStaff ? "Global_Liquidity_Protocol" : "Merchant_Settlement_Node"}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1">Audit_Cycle_v16.31</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Payout <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Ledger</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Terminal className="size-3.5" />
            <span className="tracking-[0.2em]">NODE_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}</span>
            <div className="h-px w-8 bg-white/5" />
            <span className="tracking-[0.1em]">{payouts.length} Cycles Validated</span>
          </div>
        </div>

        {/* --- TACTICAL COMMAND HUB --- */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto shrink-0 relative z-20">
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
            <Input 
              onFocus={() => impact("light")}
              placeholder="SEARCH DESTINATION..." 
              className="h-14 pl-12 pr-6 rounded-2xl border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest italic focus:ring-primary/10 transition-all"
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
        "rounded-[3rem] border border-white/5 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-apex relative z-10",
        isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : ""
      )}>
        {isMobile ? (
          /* 📱 MOBILE PROTOCOL: Kinetic Identity Cards */
          <div className="p-6 space-y-6">
            {payouts.length === 0 ? <NoData /> : payouts.map((payout: any, i: number) => (
              <PayoutCard key={payout.id} payout={payout} isPlatformStaff={isPlatformStaff} index={i} onClick={selectionChange} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP PROTOCOL: Institutional Oversight Ledger */
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
                {payouts.length === 0 ? <tr><td colSpan={6}><NoData /></td></tr> : payouts.map((payout: any, index: number) => (
                  <tr 
                    key={payout.id} 
                    onClick={() => selectionChange()}
                    className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer animate-in fade-in slide-in-from-bottom-4" 
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="size-12 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center text-primary/40 border border-white/5 shadow-inner group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
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
                          {payout.merchant.companyName}
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
                      <StatusBadge status={payout.status} processed={!!payout.processedAt} />
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
           <Activity className="size-4 animate-pulse" />
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
        "p-8 rounded-[2.8rem] border border-white/5 bg-white/[0.02] space-y-8 shadow-apex animate-in fade-in slide-in-from-bottom-8",
        isPlatformStaff ? "bg-amber-500/[0.02] border-amber-500/10" : ""
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-5">
          <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
            <Zap className="size-7 text-primary/40" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground leading-none">{payout.id.slice(0, 12)}</h3>
            <p className="text-[10px] font-black text-muted-foreground/30 uppercase mt-2 italic tracking-[0.2em]">Ref_{payout.transactionRef || 'PENDING'}</p>
          </div>
        </div>
        <StatusBadge status={payout.status} processed={!!payout.processedAt} />
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Value</p>
           <p className="text-2xl font-black italic tracking-tighter text-foreground tabular-nums">
              <span className="text-xs opacity-20 mr-1">{payout.currency}</span>
              {parseFloat(payout.amount.toString()).toLocaleString()}
           </p>
        </div>
        <div className="text-right space-y-2">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Destination</p>
           <p className="text-[11px] font-black uppercase italic tracking-widest text-primary truncate">{payout.destination || "NODE_EXT"}</p>
        </div>
      </div>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function StatusBadge({ status, processed }: { status: string, processed: boolean }) {
  const isPaid = status === 'PAID';
  const isRejected = status === 'REJECTED';

  return (
    <div className={cn(
      "inline-flex items-center rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border shadow-apex italic",
      isPaid ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
      isRejected ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : 
      "bg-amber-500/10 text-amber-500 border-amber-500/20"
    )}>
      {status}
      {processed && <ExternalLink className="ml-3 size-3.5 opacity-40" />}
    </div>
  );
}

function NoData() {
  return (
    <div className="py-32 flex flex-col items-center gap-8 opacity-20">
      <ShieldAlert className="size-20" />
      <p className="text-[14px] font-black uppercase tracking-[0.5em] italic">Zero_Settlement_Cycles</p>
    </div>
  );
}