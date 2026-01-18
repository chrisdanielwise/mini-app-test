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
import { Button } from "@/components/ui/button";

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
 * 🛰️ SETTLEMENT_LEDGER (Institutional v16.35.94)
 * Strategy: Stationary HUD & Independent Tactical Scroll.
 * Mission: High-density disbursement oversight for L80+ and Merchants.
 */
export function PayoutLedger({ requests = [] }: { requests?: PayoutRequest[] }) {
  const [query, setQuery] = useState("");
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  // 🛡️ DATA_INGRESS: Ensure stable array mapping
  const safeRequests = useMemo(() => Array.isArray(requests) ? requests : [], [requests]);
  
  // 🔍 FILTER_PROTOCOL: Unified search across origin, amount, and destination
  const filtered = useMemo(() => safeRequests.filter(r => 
    r.destination.toLowerCase().includes(query.toLowerCase()) ||
    r.amount.includes(query) ||
    r.merchantName?.toLowerCase().includes(query.toLowerCase())
  ), [safeRequests, query]);

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
            {isStaff ? <Globe className="size-3 text-amber-500 animate-pulse" /> : <Zap className="size-3 text-primary animate-pulse" />}
            <h3 className={cn(
              "text-[7.5px] font-black uppercase tracking-[0.4em] leading-none",
              isStaff ? "text-amber-500" : "text-muted-foreground"
            )}>
              {isStaff ? "Universal_Settlement_Audit" : "Capital_Telemetry"}
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
            Liquidation <span className={isStaff ? "text-amber-500" : "text-primary"}>History</span>
          </p>
        </div>

        <div className="relative group w-full md:w-80">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
           <input 
             onFocus={() => impact("light")}
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder={isStaff ? "SEARCH_GLOBAL_NODES..." : "SEARCH_BY_TX_ID..."} 
             className={cn(
               "h-11 w-full pl-11 pr-4 rounded-xl bg-white/[0.02] border text-[9px] font-black uppercase tracking-widest outline-none focus:ring-4 transition-all placeholder:opacity-20",
               isStaff ? "border-amber-500/10 focus:ring-amber-500/5" : "border-white/5 focus:ring-primary/5"
             )}
           />
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Independent Ledger Stream --- */}
      <div className="flex-1 min-h-0 w-full relative z-10 overflow-hidden">
        {isMobile ? (
          <div className="h-full overflow-y-auto p-4 space-y-3 scrollbar-hide overscroll-contain">
            {filtered.length === 0 ? <NoData /> : filtered.map((r, i) => (
              <SettlementCard key={r.id} request={r} isStaff={isStaff} index={i} />
            ))}
          </div>
        ) : (
          <div className="h-full overflow-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <thead className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/5">
                <tr>
                  <th className="w-[20%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Disbursement</th>
                  {isStaff && <th className="w-[15%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-amber-500/30 italic">Merchant</th>}
                  <th className="w-[15%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol</th>
                  <th className="w-[25%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Destination</th>
                  <th className="w-[15%] px-8 py-5 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                  <th className="w-[10%] px-8 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr><td colSpan={isStaff ? 6 : 5}><NoData /></td></tr>
                ) : (
                  filtered.map((request) => (
                    <tr 
                      key={request.id} 
                      onMouseEnter={() => impact("light")}
                      className="hover:bg-white/[0.01] transition-colors group animate-in fade-in slide-in-from-bottom-1"
                    >
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1 leading-none">
                           <div className="flex items-center gap-2">
                              <span className="text-base font-black italic tracking-tighter text-foreground tabular-nums">
                                ${parseFloat(request.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                              <span className="text-[8px] font-black text-muted-foreground opacity-30 uppercase tracking-widest mt-1 shrink-0">
                                {request.currency}
                              </span>
                           </div>
                           <span className="text-[7px] font-black text-muted-foreground/20 uppercase tracking-widest leading-none">
                             {format(new Date(request.createdAt), "MMM dd, HH:mm")}
                           </span>
                        </div>
                      </td>

                      {isStaff && (
                        <td className="px-8 py-5">
                           <span className="text-[10px] font-black uppercase italic tracking-widest text-amber-500/40 group-hover:text-amber-500 transition-colors truncate block">
                             {request.merchantName || "Unknown_Node"}
                           </span>
                        </td>
                      )}

                      <td className="px-8 py-5">
                        <Badge variant="outline" className="rounded-lg bg-white/[0.02] border-white/5 text-[8px] font-black uppercase tracking-widest px-2 py-1 italic text-foreground">
                          {request.method.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-mono font-bold tracking-tighter text-foreground/20 group-hover:text-foreground/40 transition-colors truncate block">
                            {request.destination.slice(0, 10)}...{request.destination.slice(-6)}
                          </span>
                          <span className="text-[6px] font-black uppercase text-muted-foreground/20 italic tracking-[0.2em]">Crypto Node ID</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <StatusNode status={request.status} />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <TerminalLink txHash={request.txHash} isStaff={isStaff} />
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
           Settlement_Ledger_Authorized // v16.35
         </p>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Compressed Settlement Card */
function SettlementCard({ request, isStaff, index }: { request: PayoutRequest, isStaff: boolean, index: number }) {
  const { impact } = useHaptics();
  return (
    <div 
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={() => impact("light")}
      className={cn(
        "p-5 rounded-2xl border transition-all duration-500 space-y-4 animate-in fade-in duration-500",
        isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-white/[0.01] border-white/5"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
             <span className="text-lg font-black italic tracking-tighter tabular-nums">${parseFloat(request.amount).toLocaleString()}</span>
             <span className="text-[8px] font-black opacity-20">{request.currency}</span>
          </div>
          <p className="text-[7px] font-black uppercase opacity-20 tracking-widest italic">
            {format(new Date(request.createdAt), "dd MMM, HH:mm")}
          </p>
        </div>
        <StatusNode status={request.status} />
      </div>
      <TerminalLink txHash={request.txHash} isStaff={isStaff} fullWidth />
    </div>
  );
}

/** --- ATOMIC UI PROTOCOLS --- */
function StatusNode({ status }: { status: string }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest italic leading-none",
      status === "COMPLETED" && "bg-emerald-500/5 text-emerald-500 border-emerald-500/10 shadow-emerald-500/10",
      status === "PENDING" && "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10",
      status === "APPROVED" && "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/10",
      status === "REJECTED" && "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10"
    )}>
      {status === "COMPLETED" && <CheckCircle2 className="size-3" />}
      {status === "PENDING" && <Clock className="size-3 animate-pulse" />}
      {status === "REJECTED" && <XCircle className="size-3" />}
      {status === "APPROVED" && <ArrowUpRight className="size-3 animate-bounce" />}
      {status}
    </div>
  );
}

function TerminalLink({ txHash, isStaff, fullWidth = false }: { txHash?: string, isStaff: boolean, fullWidth?: boolean }) {
  const { impact } = useHaptics();
  if (!txHash) return <div className="size-10 flex items-center justify-center opacity-5"><ShieldCheck className="size-4" /></div>;
  
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
      <a href={`https://tronscan.org/#/transaction/${txHash}`} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="size-4 group-hover/link:scale-110 transition-transform" />
        {fullWidth && <span>Verify_on_Explorer</span>}
      </a>
    </Button>
  );
}

function NoData() {
  return (
    <div className="py-24 text-center opacity-10 flex flex-col items-center gap-4">
      <Terminal className="size-12" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Zero_Settlement_Telemetry</p>
    </div>
  );
}