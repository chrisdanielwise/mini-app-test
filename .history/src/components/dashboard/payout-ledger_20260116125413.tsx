"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ShieldCheck,
  Search,
  Zap,
  Globe,
  Terminal,
  Activity,
  ArrowDownLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface PayoutRequest {
  id: string;
  amount: string;
  currency: string;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED";
  method: string;
  destination: string;
  createdAt: string;
  txHash?: string;
  merchantName?: string;
}

/**
 * 🛰️ SETTLEMENT_LEDGER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Independent Tactical Scroll.
 * Fix: High-density rows (py-3) and stationary header prevents blowout.
 */
export function PayoutLedger({ requests = [] }: { requests?: PayoutRequest[] }) {
  const [query, setQuery] = useState("");
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();
  const isStaffTheme = flavor === "AMBER";

  const safeRequests = useMemo(() => Array.isArray(requests) ? requests : [], [requests]);
  const filtered = safeRequests.filter(r => 
    r.destination.toLowerCase().includes(query.toLowerCase()) ||
    r.amount.includes(query) ||
    r.merchantName?.toLowerCase().includes(query.toLowerCase())
  );

  if (!isReady) return <div className="h-full w-full bg-card/10 animate-pulse rounded-2xl border border-white/5" />;

  return (
    <div className={cn(
      "relative flex flex-col w-full h-full min-w-0 overflow-hidden border backdrop-blur-3xl shadow-2xl transition-all duration-700",
      "rounded-2xl md:rounded-3xl",
      isStaffTheme ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/40 border-white/5"
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE */}
      <div className={cn(
        "absolute -right-24 -top-24 size-48 blur-[100px] opacity-10 pointer-events-none transition-all",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div className={cn(
        "shrink-0 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-20",
        "p-5 md:p-6"
      )}>
        <div className="space-y-1.5 leading-none">
          <div className="flex items-center gap-2.5 italic opacity-30">
            {isStaffTheme ? <Globe className="size-2.5 text-amber-500 animate-pulse" /> : <Zap className="size-2.5 text-primary animate-pulse" />}
            <div className="flex flex-col">
              <h3 className={cn(
                "text-[7.5px] font-black uppercase tracking-[0.4em] leading-none",
                isStaffTheme ? "text-amber-500" : "text-foreground"
              )}>
                {isStaffTheme ? "Settlement_Oversight" : "Liquidity_Vector"}
              </h3>
            </div>
          </div>
          <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
            Settlement <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Ledger</span>
          </p>
        </div>

        <div className="relative group w-full md:w-64 lg:w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
           <input 
             onFocus={() => impact("light")}
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="INDEX_SEARCH..." 
             className={cn(
               "h-9 w-full pl-9 pr-4 rounded-xl bg-white/[0.02] border text-[9px] font-black uppercase tracking-widest outline-none focus:ring-4 transition-all placeholder:opacity-10",
               isStaffTheme ? "border-amber-500/10 focus:ring-amber-500/5" : "border-white/5 focus:ring-primary/5"
             )}
           />
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Data Stream --- */}
      <div className="flex-1 min-h-0 w-full relative z-10">
        {isMobile ? (
          <div className="h-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filtered.length === 0 ? <NoData /> : filtered.map((r, i) => (
              <SettlementCard key={r.id} request={r} isStaff={isStaffTheme} index={i} />
            ))}
          </div>
        ) : (
          <div className="h-full overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <thead className="sticky top-0 z-30 bg-black/60 backdrop-blur-md border-b border-white/5">
                <tr>
                  <th className="w-[20%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">Liquidity</th>
                  {isStaffTheme && <th className="w-[15%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-amber-500/30 italic leading-none">Origin</th>}
                  <th className="w-[15%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">Method</th>
                  <th className="w-[25%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">Destination</th>
                  <th className="w-[15%] px-6 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">Status</th>
                  <th className="w-[10%] px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr><td colSpan={isStaffTheme ? 6 : 5}><NoData /></td></tr>
                ) : (
                  filtered.map((request, index) => (
                    <tr 
                      key={request.id} 
                      onMouseEnter={() => impact("light")}
                      className="hover:bg-white/[0.01] transition-colors group animate-in fade-in slide-in-from-bottom-1"
                    >
                      <td className="px-6 py-3">
                        <div className="flex flex-col leading-none">
                           <div className="flex items-center gap-2">
                              <ArrowDownLeft className="size-3.5 text-rose-500 opacity-20" />
                              <span className="text-base font-black italic tracking-tighter text-foreground tabular-nums">
                                ${parseFloat(request.amount).toFixed(2)}
                              </span>
                           </div>
                           <span className="text-[6.5px] font-mono text-muted-foreground/20 uppercase mt-1 tracking-tighter">
                             {format(new Date(request.createdAt), "MMM dd, HH:mm")}
                           </span>
                        </div>
                      </td>

                      {isStaffTheme && (
                        <td className="px-6 py-3">
                           <span className="text-[9px] font-black uppercase italic tracking-widest text-amber-500/40 group-hover:text-amber-500 transition-colors truncate block">
                             {request.merchantName || "ROOT_NODE"}
                           </span>
                        </td>
                      )}

                      <td className="px-6 py-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-foreground/20 italic">
                          {request.method.split('_')[1] || request.method}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-[8px] font-mono font-bold tracking-tighter text-foreground/20 group-hover:text-foreground/40 transition-colors truncate block">
                          {request.destination.slice(0, 10)}...{request.destination.slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <TerminalLink txHash={request.txHash} isStaff={isStaffTheme} />
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
           Settlement_Handshake_Active
         </p>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Compressed Settlement Card */
function SettlementCard({ request, isStaff, index }: { request: PayoutRequest, isStaff: boolean, index: number }) {
  return (
    <div 
      style={{ animationDelay: `${index * 40}ms` }}
      className={cn(
        "p-4 rounded-xl border transition-all duration-500 space-y-3 animate-in fade-in duration-500",
        isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-white/[0.01] border-white/5"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <ArrowDownLeft className="size-3 text-rose-500 opacity-20" />
           <span className="text-sm font-black italic tracking-tighter tabular-nums">${parseFloat(request.amount).toLocaleString()}</span>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <div className="flex items-center justify-between text-[7px] font-black uppercase opacity-20 tracking-widest italic leading-none">
         <span>{format(new Date(request.createdAt), "dd MMM")}</span>
         <span>{request.method.split('_')[1] || request.method}</span>
      </div>
      <TerminalLink txHash={request.txHash} isStaff={isStaff} fullWidth />
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
      status === "APPROVED" && "bg-blue-500/5 text-blue-500 border-blue-500/10",
      status === "REJECTED" && "bg-rose-500/5 text-rose-500 border-rose-500/10"
    )}>
      <div className={cn("size-1 rounded-full animate-pulse", 
        status === "COMPLETED" && "bg-emerald-500", 
        status === "PENDING" && "bg-amber-500",
        status === "REJECTED" && "bg-rose-500"
      )} />
      {status}
    </div>
  );
}

function TerminalLink({ txHash, isStaff, fullWidth = false }: { txHash?: string, isStaff: boolean, fullWidth?: boolean }) {
  if (!txHash) return null;
  return (
    <a 
      href={`https://tronscan.org/#/transaction/${txHash}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "rounded-lg border transition-all active:scale-95 flex items-center justify-center",
        fullWidth ? "w-full h-9 text-[8px] font-black uppercase tracking-[0.2em] italic gap-2" : "size-8",
        isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/20 text-primary"
      )} 
    >
      <ExternalLink className="size-3.5" />
      {fullWidth && <span>EXPLORER</span>}
    </a>
  );
}

function NoData() {
  return (
    <div className="py-20 text-center opacity-10">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Zero_Settlement_Telemetry</p>
    </div>
  );
}