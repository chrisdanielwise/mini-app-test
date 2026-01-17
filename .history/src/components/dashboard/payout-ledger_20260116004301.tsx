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
 * 🌊 SETTLEMENT_LEDGER (Institutional Apex v2026.1.16)
 * Strategy: Defensive Ingress Logic with Restored Chroma Protocol.
 * Fix: Explicitly handles undefined 'requests' to prevent '.length' crashes.
 */
export function PayoutLedger({ requests = [] }: { requests?: PayoutRequest[] }) {
  const [query, setQuery] = useState("");
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile } = useDeviceContext();
  const isStaffTheme = flavor === "AMBER";

  // 🛡️ CRASH SHIELD: Verify data is an array before processing
  const safeRequests = useMemo(() => 
    Array.isArray(requests) ? requests : [], 
    [requests]
  );

  const filtered = safeRequests.filter(r => 
    r.destination.toLowerCase().includes(query.toLowerCase()) ||
    r.amount.includes(query) ||
    r.merchantName?.toLowerCase().includes(query.toLowerCase())
  );

  // 🛡️ HYDRATION SHIELD: Prevents layout snap during handshake
  if (!isReady) return <div className="min-h-[400px] w-full bg-card/10 animate-pulse rounded-[3rem]" />;

  return (
    <div className={cn(
      "relative group flex flex-col w-full overflow-hidden border backdrop-blur-3xl shadow-2xl transition-all duration-1000",
      "rounded-[2.8rem] md:rounded-[3.5rem]",
      isStaffTheme ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-card/30 border-white/5"
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE: Restored Atmosphere */}
      <div className={cn(
        "absolute -right-32 -top-32 size-80 blur-[140px] opacity-10 pointer-events-none transition-colors duration-[2000ms]",
        isStaffTheme ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- LEDGER HEADER: Tactical Clamping --- */}
      <div className={cn(
        "border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10",
        isMobile ? "p-8" : "p-10 md:p-12"
      )}>
        <div className="space-y-3">
          <div className="flex items-center gap-3 italic opacity-40">
            {isStaffTheme ? (
              <Globe className="size-3.5 text-amber-500 animate-pulse" />
            ) : (
              <Zap className="size-3.5 text-primary animate-pulse" />
            )}
            <div className="flex flex-col">
              <h3 className={cn(
                "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
                isStaffTheme ? "text-amber-500" : "text-foreground"
              )}>
                {isStaffTheme ? "Global_Settlement_Oversight" : "Node_Liquidity_Vector"}
              </h3>
              <span className="text-[7px] font-mono uppercase tracking-widest mt-1 opacity-50">Audit_v16.31_Stable</span>
            </div>
          </div>
          <p className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Settlement <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Ledger</span>
          </p>
        </div>

        <div className="relative group w-full lg:w-80">
           <Search className={cn(
             "absolute left-5 top-1/2 -translate-y-1/2 size-4 transition-colors",
             isStaffTheme ? "group-focus-within:text-amber-500 text-muted-foreground/20" : "group-focus-within:text-primary text-muted-foreground/20"
           )} />
           <input 
             onFocus={() => impact("light")}
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="QUERY_PROTOCOL..." 
             className={cn(
               "h-12 w-full pl-12 pr-6 rounded-xl bg-black/40 border text-[10px] font-black uppercase tracking-widest italic transition-all",
               isStaffTheme ? "border-amber-500/10 focus:border-amber-500/30" : "border-white/5 focus:border-primary/30"
             )}
           />
        </div>
      </div>

      {/* --- DATA STREAM --- */}
      <div className="relative z-10">
        {isMobile ? (
          <div className="flex flex-col gap-4 p-6">
            {filtered.length === 0 ? <NoData /> : filtered.map((r, i) => (
              <SettlementCard key={r.id} request={r} isStaff={isStaffTheme} index={i} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5">
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">Liquidity</th>
                  {isStaffTheme && <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/30 italic">Origin_Node</th>}
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">Method</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">Destination</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">Status</th>
                  <th className="px-10 py-6 text-right"></th>
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
                      className="hover:bg-white/[0.02] transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                           <ArrowDownLeft className="size-4 text-rose-500 opacity-30" />
                           <span className="text-xl font-black italic tracking-tighter text-foreground tabular-nums">
                             ${parseFloat(request.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                           </span>
                        </div>
                        <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-[0.2em] mt-1 italic ml-8">
                          {format(new Date(request.createdAt), "MMM dd, HH:mm")}
                        </p>
                      </td>

                      {isStaffTheme && (
                        <td className="px-10 py-6">
                           <span className="text-[11px] font-black uppercase italic tracking-widest text-amber-500/40 group-hover:text-amber-500 transition-colors">
                             {request.merchantName || "ROOT_NODE"}
                           </span>
                        </td>
                      )}

                      <td className="px-10 py-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 italic">
                          {request.method.split('_')[1] || request.method}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-foreground/30 group-hover:text-foreground/60 transition-colors">
                          {request.destination.slice(0, 10)}...{request.destination.slice(-8)}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-10 py-6 text-right">
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
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Settlement Card */
function SettlementCard({ request, isStaff, index }: { request: PayoutRequest, isStaff: boolean, index: number }) {
  return (
    <div 
      style={{ animationDelay: `${index * 60}ms` }}
      className={cn(
        "p-6 rounded-[2rem] border transition-all duration-500 space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-6",
        isStaff ? "bg-amber-500/[0.03] border-amber-500/10 shadow-amber-500/5" : "bg-white/[0.01] border-white/5"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
           <div className="flex items-center gap-3">
              <ArrowDownLeft className="size-4 text-rose-500 opacity-30" />
              <span className="text-lg font-black italic tracking-tighter tabular-nums">${parseFloat(request.amount).toLocaleString()}</span>
           </div>
           <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest ml-7">{format(new Date(request.createdAt), "dd MMM, HH:mm")}</span>
        </div>
        <StatusBadge status={request.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
        <div className="space-y-1.5">
           <p className="text-[7px] font-black uppercase tracking-widest opacity-20">Destination</p>
           <p className="text-[9px] font-mono font-bold tracking-widest text-foreground/40 truncate">{request.destination.slice(0, 12)}...</p>
        </div>
        <div className="text-right space-y-1.5">
           <p className="text-[7px] font-black uppercase tracking-widest opacity-20">Method</p>
           <p className="text-[9px] font-black uppercase italic text-primary/40">{request.method.split('_')[1] || request.method}</p>
        </div>
      </div>

      <TerminalLink txHash={request.txHash} isStaff={isStaff} fullWidth />
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function StatusBadge({ status }: { status: string }) {
  return (
    <div className={cn(
      "rounded-lg text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border shadow-sm flex items-center gap-2 w-fit italic transition-all duration-500",
      status === "COMPLETED" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      status === "PENDING" && "bg-amber-500/10 text-amber-500 border-amber-500/20",
      status === "APPROVED" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
      status === "REJECTED" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
    )}>
      {status === "COMPLETED" && <CheckCircle2 className="size-3" />}
      {status === "PENDING" && <Clock className="size-3 animate-pulse" />}
      {status}
    </div>
  );
}

function TerminalLink({ txHash, isStaff, fullWidth = false }: { txHash?: string, isStaff: boolean, fullWidth?: boolean }) {
  if (!txHash) return <div className={cn("size-10 flex items-center justify-center opacity-5", fullWidth && "w-full")}><ShieldCheck className="size-5" /></div>;
  
  return (
    <a 
      href={`https://tronscan.org/#/transaction/${txHash}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "rounded-xl border transition-all active:scale-95 flex items-center justify-center",
        fullWidth ? "w-full h-11 text-[9px] font-black uppercase tracking-[0.3em] italic gap-3" : "size-10",
        isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black" : "bg-primary/5 border-primary/20 text-primary hover:bg-primary hover:text-black"
      )} 
    >
      {fullWidth && <span>EXPLORER_TERMINAL</span>}
      <ExternalLink className="size-4" />
    </a>
  );
}

function NoData() {
  return (
    <div className="py-24 text-center space-y-6 opacity-10">
      <Activity className="size-12 animate-pulse mx-auto" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Zero_Settlement_Telemetry</p>
    </div>
  );
}