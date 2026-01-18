"use client";

import * as React from "react";
import { 
  CreditCard, Terminal, Search, Download, Zap, 
  Clock, ExternalLink, ShieldAlert, Building2,
  Activity, Globe, Lock, Cpu
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
 * 🛰️ PAYOUTS_PAGE (Institutional Apex v2026.1.20 - HARDENED)
 * Strategy: Viewport-Locked Chassis & Etched Tactical Grid.
 * Fix: Stationed HUD + Internal Scroll Engine + border-r for vertical lines.
 */
export default function PayoutsPage({ payouts = [], session }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = session?.merchantId;

  const safePayouts = React.useMemo(() => 
    Array.isArray(payouts) ? payouts : [], 
    [payouts]
  );

  if (!isReady) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
      <Cpu className="size-8 text-primary/20 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Establishing_Liquidity_Link...</p>
    </div>
  );

  return (
    /* 🏛️ PRIMARY CHASSIS: Locked at 100% height to anchor the Stationary Header */
    <div className="absolute inset-0 flex flex-col min-w-0 overflow-hidden bg-black text-foreground">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Layer (shrink-0) --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 px-6">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 italic opacity-30">
              <CreditCard className={cn("size-3", isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary")} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.4em] leading-none",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Global_Liquidity_Protocol" : "Merchant_Settlement_Node"}
              </span>
            </div>
            
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
              Payout <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Ledger</span>
            </h1>
            
            <div className="flex items-center gap-2 text-[7px] font-black text-muted-foreground/20 italic uppercase tracking-[0.2em]">
              <Terminal className="size-2.5" />
              <span className="truncate">NODE_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"} // {safePayouts.length} Cycles Validated</span>
            </div>
          </div>

          {/* --- TACTICAL COMMAND HUB --- */}
          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 scale-90 origin-bottom-right">
            <div className="relative min-w-0 w-48 lg:w-64 group">
              <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 transition-colors",
                isPlatformStaff ? "text-amber-500/20 group-focus-within:text-amber-500" : "text-primary/20 group-focus-within:text-primary"
              )} />
              <Input 
                onFocus={() => impact("light")}
                placeholder="SEARCH DESTINATION..." 
                className={cn(
                  "h-10 pl-10 pr-4 rounded-xl border bg-black/40 text-[9px] font-black uppercase tracking-widest italic",
                  isPlatformStaff ? "border-amber-500/10 focus:border-amber-500/30" : "border-white/5 focus:border-primary/30"
                )}
              />
            </div>
            <Button 
              onClick={() => impact("medium")}
              variant="outline" 
              className="h-10 px-4 rounded-xl border-white/5 bg-white/[0.02] text-[8px] font-black uppercase tracking-widest italic"
            >
              <Download className="mr-2 size-3.5 opacity-40" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: flex-1 + min-h-0 triggers independent scroll --- */}
      <div className="flex-1 min-h-0 w-full relative flex flex-col p-3 pb-6">
        <div className={cn(
          "flex-1 min-h-0 w-full rounded-[1.5rem] border backdrop-blur-3xl shadow-2xl bg-card/40 flex flex-col overflow-hidden",
          isPlatformStaff ? "border-amber-500/10" : "border-white/5"
        )}>
          {/* 🌊 THE SCROLL ENGINE */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar overscroll-contain">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed relative">
              <thead className="bg-zinc-950 sticky top-0 z-20 border-b border-white/5 backdrop-blur-md">
                <tr className="divide-x divide-white/5">
                  <th className="w-[30%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Liquidity_Target</th>
                  {isPlatformStaff && <th className="w-[15%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-amber-500/30 italic">Origin</th>}
                  <th className="w-[15%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Destination</th>
                  <th className="w-[15%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Value</th>
                  <th className="w-[15%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Timestamp</th>
                  <th className="w-[10%] px-6 py-3 text-right text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {safePayouts.length === 0 ? (
                  <tr><td colSpan={isPlatformStaff ? 6 : 5}><NoData /></td></tr>
                ) : (
                  safePayouts.map((payout: any) => (
                    <tr 
                      key={payout.id} 
                      onClick={() => selectionChange()}
                      className="hover:bg-white/[0.01] transition-colors divide-x divide-white/5 group cursor-pointer"
                    >
                      {/* 🏁 WHITE ETCHED LINES: Forced via border-r */}
                      <td className="px-6 py-4 border-r border-white/5">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={cn(
                            "size-9 shrink-0 rounded-lg flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6",
                            isPlatformStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                          )}>
                            <Zap className="size-4" />
                          </div>
                          <div className="flex flex-col min-w-0 leading-tight">
                            <span className="text-sm font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors truncate">{payout.id.slice(0, 12)}</span>
                            <span className="text-[6px] font-mono text-muted-foreground/20 mt-0.5 uppercase truncate tracking-widest">Ref_{payout.transactionRef || 'PENDING'}</span>
                          </div>
                        </div>
                      </td>
                      {isPlatformStaff && (
                        <td className="px-6 py-4 border-r border-white/5">
                          <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[9px] truncate">
                            <Building2 className="size-3 shrink-0" />
                            <span className="truncate">{payout.merchant?.companyName || "ROOT_NODE"}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 border-r border-white/5">
                         <Badge className="rounded-lg text-[7px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 border-white/5 text-muted-foreground/30 italic">
                          {payout.destination || "NODE_EXT"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 border-r border-white/5">
                         <span className="text-lg font-black italic text-foreground leading-none tabular-nums">
                           <span className="text-[8px] opacity-20 mr-1 font-bold">{payout.currency}</span>
                           {parseFloat(payout.amount.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                         </span>
                      </td>
                      <td className="px-6 py-4 border-r border-white/5">
                        <div className="flex items-center gap-2 text-muted-foreground/30 italic">
                           <Clock className="size-3" />
                           <span className="text-[9px] font-black uppercase tracking-widest leading-none">{format(new Date(payout.createdAt), "dd MMM yyyy")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StatusBadge status={payout.status} processed={!!payout.processedAt} isStaff={isPlatformStaff} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🌫️ MOBILE CLEARANCE: Prevents BottomNav overlap */}
        {isMobile && (
          <div 
            style={{ height: `calc(${safeArea.bottom}px + 6rem)` }} 
            className="shrink-0 w-full" 
          />
        )}

        {/* FOOTER TELEMETRY SIGNAL */}
        <div className="shrink-0 flex items-center justify-center gap-4 opacity-10 pt-4 pb-4">
          <Activity className={cn("size-3.5 animate-pulse", isPlatformStaff ? "text-amber-500" : "text-primary")} />
          <p className="text-[7px] font-black uppercase tracking-[0.5em] italic">
            Audit_Core_Synchronized // Node_ID: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}
          </p>
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
      "inline-flex items-center rounded-md px-2 py-1 text-[7px] font-black uppercase tracking-[0.2em] border shadow-sm italic leading-none",
      isPaid ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10 shadow-emerald-500/5" : 
      isRejected ? "bg-rose-500/5 text-rose-500 border-rose-500/10 shadow-rose-500/5" : 
      isStaff ? "bg-amber-500/5 text-amber-500 border-amber-500/10" : "bg-white/5 text-muted-foreground/40 border-white/5"
    )}>
      <div className={cn("size-1 rounded-full mr-1.5", isPaid ? "bg-emerald-500 animate-pulse" : isRejected ? "bg-rose-500" : "bg-muted-foreground/40")} />
      {status}
      {processed && <ExternalLink className="ml-1.5 size-2.5 opacity-30" />}
    </div>
  );
}

function NoData() {
  return (
    <div className="py-24 text-center space-y-4 opacity-10">
      <ShieldAlert className="size-12 animate-pulse mx-auto" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Zero_Settlement_Cycles</p>
    </div>
  );
}