"use client";

import * as React from "react";
import { useState } from "react";
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
  Activity
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
 * 🛰️ PAYOUT_HISTORY_LEDGER (Institutional Apex v2026.1.20)
 * Strategy: Stationary HUD & Independent Tactical Scroll.
 * Fix: High-density row compression (py-3) and geometry lock.
 */
export function PayoutHistoryLedger({ payouts }: { payouts: PayoutRecord[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  const filteredPayouts = payouts.filter(p => 
    p.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.amount.includes(searchTerm) ||
    (p.merchantName && p.merchantName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isReady) return <div className="h-full w-full bg-card/10 animate-pulse rounded-2xl border border-white/5" />;

  return (
    <div className={cn(
      "relative flex flex-col w-full h-full min-w-0 overflow-hidden border backdrop-blur-3xl shadow-2xl transition-all duration-700",
      "rounded-2xl md:rounded-3xl",
      isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/40 border-white/5"
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE */}
      <div className={cn(
        "absolute -right-24 -top-24 size-48 blur-[100px] opacity-10 pointer-events-none transition-all",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div className={cn(
        "shrink-0 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-20",
        "p-5 md:p-6"
      )}>
        <div className="space-y-1.5 leading-none">
          <div className="flex items-center gap-2.5 italic opacity-30">
             {isStaff ? <Globe className="size-3 text-amber-500 animate-pulse" /> : <Terminal className="size-3 text-primary" />}
             <div className="flex flex-col">
                <h3 className={cn(
                  "text-[7.5px] font-black uppercase tracking-[0.3em] leading-none",
                  isStaff ? "text-amber-500" : "text-foreground"
                )}>
                    {isStaff ? "Global_Ledger" : "Audit_Log"}
                </h3>
             </div>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
            Disbursement <span className={isStaff ? "text-amber-500" : "text-primary"}>History</span>
          </p>
        </div>

        <div className="relative group w-full md:w-64 lg:w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
           <input 
             onFocus={() => impact("light")}
             placeholder="INDEX_SEARCH..."
             className={cn(
               "h-9 w-full pl-9 pr-4 rounded-xl bg-white/[0.02] border text-[9px] font-black uppercase tracking-widest outline-none focus:ring-4 transition-all placeholder:opacity-10",
               isStaff ? "border-amber-500/10 focus:ring-amber-500/5" : "border-white/5 focus:ring-primary/5"
             )}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Ledger Stream --- */}
      <div className="flex-1 min-h-0 w-full relative z-10">
        {isMobile ? (
          <div className="h-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredPayouts.length === 0 ? <NoData /> : filteredPayouts.map((p, i) => (
              <PayoutCard key={p.id} payout={p} isStaff={isStaff} index={i} />
            ))}
          </div>
        ) : (
          <div className="h-full overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <thead className="sticky top-0 z-30 bg-black/60 backdrop-blur-md border-b border-white/5">
                <tr>
                  <th className="w-[20%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">Liquidity_Vol</th>
                  {isStaff && <th className="w-[15%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-amber-500/30 italic leading-none">Merchant</th>}
                  <th className="w-[15%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">Protocol</th>
                  <th className="w-[25%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">Destination</th>
                  <th className="w-[15%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">Status</th>
                  <th className="w-[10%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic text-right leading-none">Terminal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayouts.length === 0 ? <tr><td colSpan={isStaff ? 6 : 5}><NoData /></td></tr> : (
                  filteredPayouts.map((payout, index) => (
                    <tr 
                      key={payout.id} 
                      onMouseEnter={() => impact("light")}
                      className="hover:bg-white/[0.01] transition-colors group animate-in fade-in slide-in-from-bottom-1"
                    >
                      <td className="px-6 py-3">
                         <div className="flex flex-col leading-none">
                            <div className="flex items-center gap-2">
                               <ArrowDownLeft className="size-3.5 text-rose-500 opacity-20" />
                               <span className="text-base font-black italic tracking-tighter text-foreground tabular-nums">
                                 ${parseFloat(payout.amount).toFixed(2)}
                               </span>
                            </div>
                            <span className="text-[6.5px] font-mono text-muted-foreground/20 uppercase mt-1 tracking-tighter">
                              {format(new Date(payout.createdAt), "dd MMM, HH:mm")}
                            </span>
                         </div>
                      </td>
                      {isStaff && (
                        <td className="px-6 py-3">
                          <span className="text-[9px] font-black uppercase italic tracking-widest text-amber-500/40 group-hover:text-amber-500 truncate block">
                            {payout.merchantName || "Node_Alpha"}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-foreground/20 italic">
                          {payout.method.split("_")[1]}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono font-bold tracking-tighter text-foreground/20 group-hover:text-foreground/40 transition-colors truncate">
                            {payout.destination.slice(0, 14)}...
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                         <StatusBadge status={payout.status} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <TerminalLink txId={payout.txId} isStaff={isStaff} />
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
         <div className="size-1 rounded-full bg-primary animate-pulse" />
         <p className="text-[7px] font-black uppercase tracking-[0.3em] opacity-10 italic">
           Institutional_Ledger_Optimal
         </p>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Compressed Payout Card */
function PayoutCard({ payout, isStaff, index }: { payout: PayoutRecord, isStaff: boolean, index: number }) {
  const { impact } = useHaptics();
  return (
    <div 
      onClick={() => impact("light")}
      className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3 animate-in fade-in duration-500"
    >
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <ArrowDownLeft className="size-3 text-rose-500 opacity-20" />
            <span className="text-sm font-black italic tracking-tighter tabular-nums">${parseFloat(payout.amount).toLocaleString()}</span>
         </div>
         <StatusBadge status={payout.status} />
      </div>
      <div className="flex items-center justify-between text-[7px] font-black uppercase opacity-20 tracking-widest italic leading-none">
         <span>{format(new Date(payout.createdAt), "dd MMM")}</span>
         <span>{payout.method.split('_')[1]}</span>
      </div>
      <TerminalLink txId={payout.txId} isStaff={isStaff} fullWidth />
    </div>
  );
}

/** --- ATOMIC COMPONENTS: Tactical Compression --- */
function StatusBadge({ status }: { status: string }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[7px] font-black uppercase tracking-[0.1em] italic leading-none",
      status === "COMPLETED" && "bg-emerald-500/5 text-emerald-500 border-emerald-500/10",
      status === "PENDING" && "bg-amber-500/5 text-amber-500 border-amber-500/10",
      status === "PROCESSING" && "bg-blue-500/5 text-blue-500 border-blue-500/10",
      status === "FAILED" && "bg-rose-500/5 text-rose-500 border-rose-500/10"
    )}>
      <div className={cn("size-1 rounded-full animate-pulse", 
        status === "COMPLETED" && "bg-emerald-500", 
        status === "PENDING" && "bg-amber-500",
        status === "FAILED" && "bg-rose-500"
      )} />
      {status}
    </div>
  );
}

function TerminalLink({ txId, isStaff, fullWidth = false }: { txId?: string, isStaff: boolean, fullWidth?: boolean }) {
  if (!txId) return null;
  return (
    <Button 
      variant="ghost" 
      size={fullWidth ? "default" : "icon"} 
      className={cn(
        "rounded-lg border transition-all active:scale-95 group/link",
        fullWidth ? "w-full h-9 text-[8px] font-black uppercase tracking-[0.2em] italic gap-2" : "size-8",
        isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/10 text-primary"
      )} 
      asChild
    >
      <a href={`https://tronscan.org/#/transaction/${txId}`} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="size-3.5" />
        {fullWidth && <span>Explorer</span>}
      </a>
    </Button>
  );
}

function NoData() {
  return (
    <div className="py-20 text-center opacity-10">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Zero_Disbursements</p>
    </div>
  );
}