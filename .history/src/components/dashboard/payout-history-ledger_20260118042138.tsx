"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Hash, 
  ExternalLink, 
  Search,
  ArrowDownLeft,
  Globe,
  Terminal,
  Activity,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface PayoutRecord {
  id: string;
  amount: string;
  currency: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  method: "USDT_TRC20" | "USDT_ERC20" | "BANK_TRANSFER";
  destination: string;
  txId?: string;
  createdAt: string;
  merchantName?: string;
}

/**
 * 🛰️ PAYOUT_HISTORY_LEDGER (Hardened v16.35.92)
 * Strategy: Stationary HUD & Independent Tactical Scroll.
 * Mission: High-density disbursement oversight for L80+ and Merchants.
 */
export function PayoutHistoryLedger({ payouts }: { payouts: PayoutRecord[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  // 🛡️ FILTER_PROTOCOL: Reintegrated from legacy for deep search
  const filteredPayouts = useMemo(() => payouts.filter(p => 
    p.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.amount.includes(searchTerm) ||
    (p.merchantName && p.merchantName.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [payouts, searchTerm]);

  if (!isReady) return <div className="h-full w-full bg-card/10 animate-pulse rounded-2xl border border-white/5" />;

  return (
    <div className={cn(
      "relative flex flex-col w-full h-full min-w-0 overflow-hidden border backdrop-blur-3xl shadow-2xl transition-all duration-700",
      "rounded-2xl md:rounded-3xl",
      isStaff ? "bg-amber-500/[0.01] border-amber-500/10 shadow-amber-500/5" : "bg-card/40 border-white/5"
    )}>
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div className="shrink-0 border-b border-white/5 p-5 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-20">
        <div className="space-y-1.5 leading-none">
          <div className="flex items-center gap-2.5 italic opacity-30">
             {isStaff ? <Globe className="size-3 text-amber-500 animate-pulse" /> : <Terminal className="size-3 text-primary" />}
             <h3 className={cn(
               "text-[7.5px] font-black uppercase tracking-[0.3em] leading-none",
               isStaff ? "text-amber-500" : "text-muted-foreground"
             )}>
                {isStaff ? "Universal_Global_Ledger" : "Local_Audit_Log"}
             </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
            Disbursement <span className={isStaff ? "text-amber-500" : "text-primary"}>History</span>
          </p>
        </div>

        <div className="relative group w-full md:w-80">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
           <input 
             onFocus={() => impact("light")}
             placeholder={isStaff ? "INDEX_GLOBAL_NODES..." : "FILTER_TELEMETRY..."}
             className={cn(
               "h-11 w-full pl-11 pr-4 rounded-xl bg-white/[0.02] border text-[9px] font-black uppercase tracking-widest outline-none focus:ring-4 transition-all placeholder:opacity-20",
               isStaff ? "border-amber-500/10 focus:ring-amber-500/5" : "border-white/5 focus:ring-primary/5"
             )}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Ledger Stream --- */}
      <div className="flex-1 min-h-0 w-full relative z-10 overflow-hidden">
        {isMobile ? (
          <div className="h-full overflow-y-auto p-4 space-y-3 scrollbar-hide overscroll-contain">
            {filteredPayouts.length === 0 ? <NoData /> : filteredPayouts.map((p) => (
              <PayoutCard key={p.id} payout={p} isStaff={isStaff} />
            ))}
          </div>
        ) : (
          <div className="h-full overflow-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <thead className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/5">
                <tr>
                  <th className="w-[20%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Liquidity_Vol</th>
                  {isStaff && <th className="w-[15%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-amber-500/30 italic">Merchant</th>}
                  <th className="w-[15%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol</th>
                  <th className="w-[25%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Destination</th>
                  <th className="w-[15%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                  <th className="w-[10%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic text-right">Terminal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayouts.length === 0 ? (
                  <tr><td colSpan={isStaff ? 6 : 5}><NoData /></td></tr>
                ) : (
                  filteredPayouts.map((p) => (
                    <tr 
                      key={p.id} 
                      onMouseEnter={() => impact("light")}
                      className="hover:bg-white/[0.01] transition-colors group animate-in fade-in slide-in-from-bottom-1"
                    >
                      <td className="px-8 py-5">
                         <div className="flex flex-col gap-1 leading-none">
                            <div className="flex items-center gap-2">
                               <ArrowDownLeft className="size-3.5 text-rose-500 opacity-20" />
                               <span className="text-base font-black italic tracking-tighter tabular-nums text-foreground">
                                 ${parseFloat(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                               </span>
                            </div>
                            <span className="text-[7px] font-mono text-muted-foreground/20 uppercase tracking-tighter">
                              {format(new Date(p.createdAt), "dd MMM, HH:mm")} • {p.currency}
                            </span>
                         </div>
                      </td>
                      {isStaff && (
                        <td className="px-8 py-5">
                          <span className="text-[10px] font-black uppercase italic tracking-widest text-amber-500/40 group-hover:text-amber-500 transition-colors truncate block">
                            {p.merchantName || "Unknown_Node"}
                          </span>
                        </td>
                      )}
                      <td className="px-8 py-5">
                        <Badge variant="outline" className="rounded-lg bg-white/[0.02] border-white/5 text-[8px] font-black uppercase tracking-widest px-2 py-1 italic text-foreground">
                          {p.method.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className={cn("size-3 opacity-30", isStaff ? "text-amber-500" : "text-primary")} />
                          <span className="text-[9px] font-mono font-bold tracking-tighter text-foreground/20 group-hover:text-foreground/40 transition-colors truncate">
                            {p.destination.slice(0, 10)}...{p.destination.slice(-6)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <StatusNode status={p.status} />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <TerminalLink txId={p.txId} isStaff={isStaff} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- 🌊 SLIM FOOTER --- */}
      <div className="shrink-0 p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-center gap-3">
         <Activity className="size-3 text-primary animate-pulse" />
         <p className="text-[7px] font-black uppercase tracking-[0.3em] opacity-10 italic">
           Institutional_Ledger_Optimal // v16.35
         </p>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Compressed Payout Card */
function PayoutCard({ payout, isStaff }: { payout: PayoutRecord, isStaff: boolean }) {
  const { impact } = useHaptics();
  return (
    <div 
      onClick={() => impact("light")}
      className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4 animate-in fade-in duration-500"
    >
      <div className="flex items-center justify-between">
         <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
               <ArrowDownLeft className="size-3.5 text-rose-500 opacity-20" />
               <span className="text-lg font-black italic tracking-tighter tabular-nums">${parseFloat(payout.amount).toLocaleString()}</span>
            </div>
            <span className="text-[7px] font-black text-muted-foreground/20 uppercase tracking-[0.2em] ml-5 italic">
              {format(new Date(payout.createdAt), "dd MMM")} • {payout.method.split('_')[1]}
            </span>
         </div>
         <StatusNode status={payout.status} />
      </div>
      <TerminalLink txId={payout.txId} isStaff={isStaff} fullWidth />
    </div>
  );
}

/** --- ATOMIC UI PROTOCOLS --- */
function StatusNode({ status }: { status: string }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest italic leading-none",
      status === "COMPLETED" && "bg-emerald-500/5 text-emerald-500 border-emerald-500/10",
      status === "PENDING" && "bg-amber-500/5 text-amber-500 border-amber-500/10",
      status === "PROCESSING" && "bg-blue-500/5 text-blue-500 border-blue-500/10",
      status === "FAILED" && "bg-rose-500/5 text-rose-500 border-rose-500/10"
    )}>
      <div className={cn("size-1.5 rounded-full animate-pulse", 
        status === "COMPLETED" && "bg-emerald-500 shadow-[0_0_8px_#10b981]", 
        status === "PENDING" && "bg-amber-500 shadow-[0_0_8px_#f59e0b]",
        status === "FAILED" && "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
      )} />
      {status}
    </div>
  );
}

function TerminalLink({ txId, isStaff, fullWidth = false }: { txId?: string, isStaff: boolean, fullWidth?: boolean }) {
  const { impact } = useHaptics();
  if (!txId) return <div className="size-8 flex items-center justify-center opacity-5"><Hash className="size-3" /></div>;
  
  return (
    <Button 
      variant="ghost" 
      size={fullWidth ? "default" : "icon"} 
      onClick={() => impact("medium")}
      className={cn(
        "rounded-xl border transition-all active:scale-95 group/link",
        fullWidth ? "w-full h-12 text-[9px] font-black uppercase tracking-[0.3em] italic gap-3" : "size-10",
        isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/10 text-primary"
      )} 
      asChild
    >
      <a href={`https://tronscan.org/#/transaction/${txId}`} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="size-4" />
        {fullWidth && <span>Verify_on_Explorer</span>}
      </a>
    </Button>
  );
}

function NoData() {
  return (
    <div className="py-24 text-center opacity-10 flex flex-col items-center gap-4">
      <Hash className="size-12" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Zero_Ledger_Signals</p>
    </div>
  );
}