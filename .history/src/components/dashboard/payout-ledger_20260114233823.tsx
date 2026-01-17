"use client";

import * as React from "react";
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
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

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
 * 🌊 FLUID SETTLEMENT LEDGER (v16.16.12)
 * Logic: Haptic-synced liquidation scrubbing with Oversight Radiance.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function PayoutLedger({ requests }: { requests: PayoutRequest[] }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  return (
    <div className={cn(
      "relative group flex flex-col w-full overflow-hidden rounded-[3rem] border backdrop-blur-3xl shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/30 border-white/5 shadow-black/20"
    )}>
      
      {/* 🌊 AMBIENT RADIANCE: Oversight Vector Glow */}
      <div className={cn(
        "absolute -right-24 -top-24 size-64 blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000",
        isStaff ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- LEDGER HEADER --- */}
      <div className="p-8 md:p-12 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3 italic opacity-40">
            {isStaff ? (
              <Globe className="size-4 text-amber-500 animate-pulse" />
            ) : (
              <Zap className="size-4 text-primary animate-pulse" />
            )}
            <h3 className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em]",
              isStaff ? "text-amber-500" : "text-foreground"
            )}>
              {isStaff ? "Global_Settlement_Audit" : "Capital_Telemetry_Vector"}
            </h3>
          </div>
          <p className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Liquidation <span className={isStaff ? "text-amber-500" : "text-primary"}>History</span>
          </p>
        </div>

        <div className="relative group w-full lg:w-96">
           <Search className={cn(
             "absolute left-5 top-1/2 -translate-y-1/2 size-4 transition-colors",
             isStaff ? "group-focus-within:text-amber-500 text-muted-foreground/30" : "group-focus-within:text-primary text-muted-foreground/30"
           )} />
           <input 
             onFocus={() => impact("light")}
             placeholder={isStaff ? "SEARCH_GLOBAL_NODES..." : "SEARCH_BY_TX_ID..."} 
             className={cn(
               "h-14 w-full pl-14 pr-6 rounded-2xl bg-white/5 border text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 transition-all placeholder:opacity-20",
               isStaff ? "border-amber-500/20 focus:ring-amber-500/10" : "border-white/5 focus:ring-primary/10"
             )}
           />
        </div>
      </div>

      {/* --- DATA NODE: TABLE --- */}
      <div className="overflow-x-auto scrollbar-hide relative z-10">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Disbursement</th>
              {isStaff && <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Merchant_Node</th>}
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Destination</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
              <th className="px-10 py-8 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={isStaff ? 6 : 5} className="py-32 text-center">
                   <div className="flex flex-col items-center gap-6 opacity-20 italic">
                      <Terminal className="size-12 text-muted-foreground" />
                      <p className="text-[12px] font-black uppercase tracking-[0.4em]">Zero_Settlement_Logs</p>
                   </div>
                </td>
              </tr>
            ) : (
              requests.map((request, index) => (
                <tr 
                  key={request.id} 
                  onMouseEnter={() => impact("light")}
                  className="hover:bg-white/[0.03] transition-all duration-500 group cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                       <span className="text-xl font-black italic tracking-tighter text-foreground">
                         ${parseFloat(request.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </span>
                       <span className="text-[9px] font-black text-primary/50 uppercase tracking-widest mt-1">
                         {request.currency}
                       </span>
                    </div>
                    <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mt-2 italic">
                      {format(new Date(request.createdAt), "MMM dd, HH:mm")}
                    </p>
                  </td>

                  {isStaff && (
                    <td className="px-10 py-8">
                       <span className="text-[11px] font-black uppercase italic tracking-widest text-amber-500/80">
                         {request.merchantName || "Unknown_Node"}
                       </span>
                    </td>
                  )}

                  <td className="px-10 py-8">
                    <Badge variant="outline" className="rounded-xl bg-white/5 border-white/10 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 italic text-foreground/70">
                      {request.method.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-mono font-bold tracking-[0.1em] text-foreground/50 group-hover:text-foreground/80 transition-colors">
                         {request.destination.slice(0, 10)}...{request.destination.slice(-8)}
                       </span>
                       <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">
                         Crypto_Node_Hash
                       </p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <Badge className={cn(
                      "rounded-xl text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 border shadow-xl flex items-center gap-2 w-fit italic",
                      getStatusStyles(request.status)
                    )}>
                      {getStatusIcon(request.status)}
                      {request.status}
                    </Badge>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {request.txHash ? (
                      <button 
                        onClick={() => {
                          impact("medium");
                          window.open(`https://tronscan.org/#/transaction/${request.txHash}`, '_blank');
                        }}
                        className={cn(
                          "size-12 rounded-2xl border transition-all active:scale-90 group/btn inline-flex items-center justify-center",
                          isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500" : "bg-primary/5 border-primary/10 text-primary hover:bg-primary"
                        )}
                      >
                        <ExternalLink className="size-5 group-hover/btn:text-background transition-colors" />
                      </button>
                    ) : (
                      <div className="size-12 flex items-center justify-center opacity-10">
                        <ShieldCheck className="size-5" />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** --- TELEMETRY HELPERS --- */
function getStatusIcon(status: string) {
  switch (status) {
    case "COMPLETED": return <CheckCircle2 className="size-3.5" />;
    case "PENDING": return <Clock className="size-3.5 animate-pulse" />;
    case "REJECTED": return <XCircle className="size-3.5" />;
    default: return <ShieldCheck className="size-3.5" />;
  }
}

function getStatusStyles(status: string) {
  switch (status) {
    case "COMPLETED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
    case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
    case "REJECTED": return "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
    default: return "bg-muted text-muted-foreground border-white/5";
  }
}