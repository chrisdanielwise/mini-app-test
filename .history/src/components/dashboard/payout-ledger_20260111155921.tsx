"use client";

import { format } from "date-fns";
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  ShieldCheck,
  Search,
  Hash,
  Zap,
  Globe,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

interface PayoutRequest {
  id: string;
  amount: string;
  currency: string;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED";
  method: string;
  destination: string;
  createdAt: string;
  txHash?: string;
  merchantName?: string; // 🛡️ Added for Staff Oversight
}

/**
 * 🏛️ PAYOUT STATUS LEDGER
 * Logic: Synchronized with Universal Identity.
 * Adaptive: Shifts visual flavor (Amber/Emerald) based on operator role.
 */
export function PayoutLedger({ requests }: { requests: PayoutRequest[] }) {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <div className={cn(
      "rounded-2xl md:rounded-[3rem] border backdrop-blur-3xl shadow-2xl overflow-hidden animate-in fade-in duration-1000 max-w-7xl mx-auto transition-colors duration-700",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/40 border-border/40"
    )}>
      
      {/* --- LEDGER HEADER --- */}
      <div className="p-6 md:p-10 border-b border-border/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1 md:space-y-1.5">
          <div className="flex items-center gap-2 italic opacity-40">
            {isStaff ? (
              <Globe className="h-3 w-3 text-amber-500 animate-pulse" />
            ) : (
              <Zap className="h-3 w-3 text-primary animate-pulse" />
            )}
            <h3 className={cn(
              "text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]",
              isStaff ? "text-amber-500" : "text-muted-foreground"
            )}>
              {isStaff ? "Global_Settlement_Audit" : "Capital Telemetry"}
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Liquidation <span className={isStaff ? "text-amber-500" : "text-primary"}>History</span>
          </p>
        </div>

        <div className="relative group w-full lg:w-auto">
           <Search className={cn(
             "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
             isStaff ? "group-focus-within:text-amber-500 text-muted-foreground/30" : "group-focus-within:text-primary text-muted-foreground/30"
           )} />
           <input 
             placeholder={isStaff ? "SEARCH GLOBAL NODES..." : "SEARCH BY TX_ID..."} 
             className={cn(
               "h-11 md:h-12 w-full lg:w-64 pl-12 pr-4 rounded-xl md:rounded-2xl border text-[9px] md:text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 transition-all shadow-inner placeholder:opacity-30",
               isStaff ? "bg-amber-500/5 border-amber-500/20 focus:ring-amber-500/20" : "bg-muted/10 border-border/40 focus:ring-primary/20"
             )}
           />
        </div>
      </div>

      {/* --- DATA NODE: TABLE --- */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-full">
          <thead>
            <tr className="bg-muted/30 border-b border-border/10">
              <th className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Disbursement</th>
              {isStaff && <th className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/60">Merchant</th>}
              <th className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hidden sm:table-cell">Protocol</th>
              <th className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Destination</th>
              <th className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Status</th>
              <th className="px-6 md:px-10 py-6 md:py-8 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={isStaff ? 6 : 5} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-20 italic">
                      <Terminal className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                        No Liquidation Logs Found
                      </p>
                   </div>
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-muted/5 transition-all group cursor-default">
                  <td className="px-6 md:px-10 py-6 md:py-8 text-foreground">
                    <div className="flex items-center gap-2 min-w-0">
                       <span className="text-base md:text-lg font-black italic tracking-tighter truncate">
                         ${parseFloat(request.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </span>
                       <span className="text-[8px] md:text-[9px] font-black text-muted-foreground opacity-30 uppercase tracking-widest mt-1 shrink-0">
                         {request.currency}
                       </span>
                    </div>
                    <p className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-40">
                      {format(new Date(request.createdAt), "MMM dd, HH:mm")}
                    </p>
                  </td>

                  {/* Merchant ID Column (Staff Only) */}
                  {isStaff && (
                    <td className="px-6 md:px-10 py-6 md:py-8">
                       <span className="text-[10px] font-black uppercase italic text-amber-500/80 truncate block max-w-[120px]">
                         {request.merchantName || "Unknown_Node"}
                       </span>
                    </td>
                  )}

                  <td className="px-6 md:px-10 py-6 md:py-8 hidden sm:table-cell">
                    <Badge variant="outline" className="rounded-lg bg-muted/5 border-border/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 italic shrink-0 whitespace-nowrap text-foreground">
                      {request.method.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8">
                    <div className="flex flex-col gap-0.5 min-w-0">
                       <span className="text-[9px] md:text-[10px] font-mono font-bold tracking-tighter opacity-70 truncate text-foreground">
                         {request.destination.slice(0, 10)}...{request.destination.slice(-4)}
                       </span>
                       <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30 italic">
                         Crypto Node ID
                       </p>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8">
                    <Badge className={cn(
                      "rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 md:px-3 py-1 border shadow-sm flex items-center gap-1.5 w-fit",
                      getStatusStyles(request.status)
                    )}>
                      {getStatusIcon(request.status)}
                      <span className="truncate">{request.status}</span>
                    </Badge>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                    {request.txHash ? (
                      <button 
                        onClick={() => {
                          hapticFeedback("light");
                          window.open(`https://tronscan.org/#/transaction/${request.txHash}`, '_blank');
                        }}
                        className={cn(
                          "p-2.5 md:p-3 rounded-xl transition-all border active:scale-90 inline-flex items-center group/btn",
                          isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/10 text-primary"
                        )}
                      >
                        <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover/btn:scale-110" />
                      </button>
                    ) : (
                      <div className="p-3 opacity-10">
                        <ShieldCheck className="h-4 w-4" />
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
    case "COMPLETED": return <CheckCircle2 className="h-3 w-3" />;
    case "PENDING": return <Clock className="h-3 w-3 animate-pulse" />;
    case "REJECTED": return <XCircle className="h-3 w-3" />;
    default: return <ShieldCheck className="h-3 w-3" />;
  }
}

function getStatusStyles(status: string) {
  switch (status) {
    case "COMPLETED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10";
    case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10";
    case "REJECTED": return "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10";
    default: return "bg-muted text-muted-foreground border-border/40";
  }
}