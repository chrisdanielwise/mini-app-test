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
  ShieldCheck,
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
 * 🌊 FLUID_PAYOUT_LEDGER (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware grid resolution with Oversight Radiance.
 */
export function PayoutHistoryLedger({ payouts }: { payouts: PayoutRecord[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  const filteredPayouts = payouts.filter(p => 
    p.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.amount.includes(searchTerm) ||
    (p.merchantName && p.merchantName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="min-h-[500px] w-full bg-card/20 animate-pulse rounded-[3rem]" />;

  return (
    <div className={cn(
      "relative group flex flex-col w-full overflow-hidden border backdrop-blur-3xl shadow-apex transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      "rounded-[3rem] md:rounded-[4.5rem]",
      isStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-card/30 border-white/5"
    )}>
      
      {/* 🌫️ VAPOUR RADIANCE: Ambient subsurface wash */}
      <div className={cn(
        "absolute -right-32 -top-32 size-80 blur-[140px] opacity-10 pointer-events-none transition-colors duration-[2000ms]",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- TELEMETRY HEADER --- */}
      <div className={cn(
        "border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10",
        screenSize === 'xs' ? "p-8" : "p-10 md:p-14"
      )}>
        <div className="space-y-4">
          <div className="flex items-center gap-4 italic opacity-40">
             {isStaff ? <Globe className="size-4 text-amber-500 animate-pulse" /> : <Terminal className="size-4 text-primary" />}
             <div className="flex flex-col">
                <h3 className={cn(
                  "text-[10px] font-black uppercase tracking-[0.4em] leading-none",
                  isStaff ? "text-amber-500" : "text-foreground"
                )}>
                    {isStaff ? "Platform_Global_Ledger" : "Audit_Log_Vector"}
                </h3>
                <span className="text-[7px] font-black uppercase tracking-widest mt-1">Transaction_Handshake_v16.31</span>
             </div>
          </div>
          <p className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Disbursement <span className={isStaff ? "text-amber-500" : "text-primary"}>History</span>
          </p>
        </div>

        <div className="relative group w-full lg:w-96 transition-all duration-700">
           <Search className={cn(
             "absolute left-6 top-1/2 -translate-y-1/2 size-5 transition-colors duration-500",
             isStaff ? "group-focus-within:text-amber-500 text-muted-foreground/20" : "group-focus-within:text-primary text-muted-foreground/20"
           )} />
           <input 
             onFocus={() => impact("light")}
             placeholder={isStaff ? "SEARCH_GLOBAL_NODES..." : "FILTER_TELEMETRY..."}
             className={cn(
               "h-16 md:h-18 w-full pl-16 pr-8 rounded-2xl md:rounded-3xl bg-white/[0.03] border text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-8 transition-all placeholder:opacity-10",
               isStaff ? "border-amber-500/10 focus:ring-amber-500/5" : "border-white/5 focus:ring-primary/5"
             )}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* --- DATA NODE: TABLE vs CARDS --- */}
      <div className="relative z-10">
        {isMobile ? (
          /* 📱 MOBILE CARDS: Vertical Momentum Layout */
          <div className="flex flex-col gap-6 p-8">
            {filteredPayouts.length === 0 ? <NoData /> : filteredPayouts.map((p, i) => (
              <PayoutCard key={p.id} payout={p} isStaff={isStaff} index={i} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP LEDGER: Traditional Oversight Access */
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5">
                  <th className="px-14 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">Liquidity_Vol</th>
                  {isStaff && <th className="px-14 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/30 italic">Merchant_Node</th>}
                  <th className="px-14 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">Protocol</th>
                  <th className="px-14 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">Destination</th>
                  <th className="px-14 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic">Status</th>
                  <th className="px-14 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20 italic text-right">Terminal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayouts.length === 0 ? <tr><td colSpan={isStaff ? 6 : 5}><NoData /></td></tr> : (
                  filteredPayouts.map((payout, index) => (
                    <tr 
                      key={payout.id} 
                      onMouseEnter={() => impact("light")}
                      className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {/* Desktop Cell Logic... (Matches PayoutCard logic but formatted for table) */}
                      <td className="px-14 py-10">
                         <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                               <ArrowDownLeft className="size-5 text-rose-500 opacity-20 shrink-0" />
                               <span className="text-2xl font-black italic tracking-tighter text-foreground tabular-nums">
                                 ${parseFloat(payout.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                               </span>
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.2em] ml-9">
                              {format(new Date(payout.createdAt), "dd MMM, HH:mm")} • {payout.currency}
                            </span>
                         </div>
                      </td>
                      {isStaff && (
                        <td className="px-14 py-10">
                          <span className="text-[12px] font-black uppercase italic tracking-widest text-amber-500/60 transition-colors group-hover:text-amber-500">
                            {payout.merchantName || "Unknown_Node"}
                          </span>
                        </td>
                      )}
                      <td className="px-14 py-10">
                        <Badge variant="outline" className="rounded-2xl bg-white/[0.02] border-white/5 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 italic text-foreground/40">
                          {payout.method.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-14 py-10">
                        <div className="flex items-center gap-4">
                          <ShieldCheck className={cn("size-5 shrink-0 opacity-10", isStaff ? "text-amber-500" : "text-primary")} />
                          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-foreground/30 group-hover:text-foreground/80 transition-all duration-700">
                            {payout.destination.slice(0, 10)}...{payout.destination.slice(-10)}
                          </span>
                        </div>
                      </td>
                      <td className="px-14 py-10">
                         <StatusBadge status={payout.status} />
                      </td>
                      <td className="px-14 py-10 text-right">
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
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Payout Card */
function PayoutCard({ payout, isStaff, index }: { payout: PayoutRecord, isStaff: boolean, index: number }) {
  const { impact } = useHaptics();
  return (
    <div 
      onClick={() => impact("light")}
      style={{ animationDelay: `${index * 80}ms` }}
      className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-4">
              <ArrowDownLeft className="size-5 text-rose-500 opacity-20" />
              <span className="text-2xl font-black italic tracking-tighter tabular-nums">${parseFloat(payout.amount).toLocaleString()}</span>
           </div>
           <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest ml-9">{format(new Date(payout.createdAt), "dd MMM, HH:mm")}</span>
        </div>
        <StatusBadge status={payout.status} />
      </div>
      
      <div className="h-px w-full bg-white/5" />
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
           <p className="text-[8px] font-black uppercase tracking-widest opacity-20">Destination</p>
           <p className="text-[10px] font-mono font-bold tracking-widest text-foreground/50">{payout.destination.slice(0, 6)}...{payout.destination.slice(-6)}</p>
        </div>
        <div className="space-y-2 text-right flex flex-col items-end">
           <p className="text-[8px] font-black uppercase tracking-widest opacity-20">Protocol</p>
           <p className="text-[10px] font-black uppercase italic text-primary/60">{payout.method.split('_')[1]}</p>
        </div>
      </div>

      <TerminalLink txId={payout.txId} isStaff={isStaff} fullWidth />
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn(
      "rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 border shadow-apex flex items-center gap-3 w-fit italic transition-all duration-700",
      status === "COMPLETED" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5",
      status === "PENDING" && "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5",
      status === "PROCESSING" && "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5",
      status === "FAILED" && "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5"
    )}>
      {status === "COMPLETED" && <CheckCircle2 className="size-4" />}
      {status === "PENDING" && <Clock className="size-4 animate-pulse" />}
      {status === "PROCESSING" && <Activity className="size-4 animate-bounce" />}
      {status === "FAILED" && <XCircle className="size-4" />}
      {status}
    </Badge>
  );
}

function TerminalLink({ txId, isStaff, fullWidth = false }: { txId?: string, isStaff: boolean, fullWidth?: boolean }) {
  if (!txId) return <div className={cn("size-14 flex items-center justify-center opacity-5", fullWidth && "w-full")}><Terminal className="size-6" /></div>;
  return (
    <Button 
      variant="ghost" 
      size={fullWidth ? "default" : "icon"} 
      className={cn(
        "rounded-[1.5rem] border transition-all active:scale-95 group/link",
        fullWidth ? "w-full h-16 text-[10px] font-black uppercase tracking-[0.3em] italic gap-4" : "size-14",
        isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500" : "bg-primary/5 border-primary/10 text-primary hover:bg-primary"
      )} 
      asChild
    >
      <a href={`https://tronscan.org/#/transaction/${txId}`} target="_blank" rel="noopener noreferrer">
        {fullWidth && <span>Explorer_Terminal</span>}
        <ExternalLink className="size-5 group-hover/link:text-background transition-colors" />
      </a>
    </Button>
  );
}

function NoData() {
  return (
    <div className="py-40 text-center space-y-8 animate-in fade-in duration-1000">
      <div className="relative inline-flex">
         <Hash className="size-16 opacity-5" />
         <Terminal className="absolute -top-4 -right-4 size-6 text-primary/20 animate-pulse" />
      </div>
      <div className="space-y-2">
        <p className="text-[12px] md:text-[14px] font-black uppercase tracking-[0.6em] opacity-20 leading-none">Zero_Telemetry_Found</p>
        <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-10">Institutional_Ledger_Isolated</p>
      </div>
    </div>
  );
}