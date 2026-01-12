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
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { hapticFeedback } from "@/lib/telegram/webapp";

interface PayoutRequest {
  id: string;
  amount: string;
  currency: string;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED";
  method: string;
  destination: string;
  createdAt: string;
  txHash?: string;
}

/**
 * 🏛️ PAYOUT STATUS LEDGER (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Priority-based column visibility for institutional telemetry parity.
 */
export function PayoutLedger({ requests }: { requests: PayoutRequest[] }) {
  return (
    <div className="rounded-2xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden animate-in fade-in duration-1000 max-w-7xl mx-auto">
      
      {/* --- LEDGER HEADER --- */}
      <div className="p-6 md:p-10 border-b border-border/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1 md:space-y-1.5">
          <div className="flex items-center gap-2 italic opacity-40">
            <Zap className="h-3 w-3 text-primary animate-pulse" />
            <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground">
              Capital Telemetry
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none">
            Liquidation <span className="text-primary">History</span>
          </p>
        </div>

        <div className="relative group w-full lg:w-auto">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
           <input 
             placeholder="SEARCH BY TX_ID..." 
             className="h-11 md:h-12 w-full lg:w-64 pl-12 pr-4 rounded-xl md:rounded-2xl bg-muted/10 border border-border/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner placeholder:opacity-30"
           />
        </div>
      </div>

      {/* --- DATA NODE: TABLE --- */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-full">
          <thead>
            <tr className="bg-muted/30 border-b border-border/10">
              <th className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Disbursement</th>
              <th className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hidden sm:table-cell">Protocol</th>
              <th className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Destination</th>
              <th className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Status</th>
              <th className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hidden lg:table-cell">Timestamp</th>
              <th className="px-6 md:px-10 py-6 md:py-8 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-20 italic">
                      <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-muted/20 border border-border/10 flex items-center justify-center">
                        <Hash className="h-6 w-6" />
                      </div>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                        No Liquidation Logs Found
                      </p>
                   </div>
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-primary/[0.03] active:bg-primary/[0.05] transition-all group cursor-default">
                  <td className="px-6 md:px-10 py-6 md:py-8">
                    <div className="flex items-center gap-2 min-w-0">
                       <span className="text-base md:text-lg font-black italic tracking-tighter truncate">
                         ${parseFloat(request.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </span>
                       <span className="text-[8px] md:text-[9px] font-black text-muted-foreground opacity-30 uppercase tracking-widest mt-1 shrink-0">
                         {request.currency}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8 hidden sm:table-cell">
                    <Badge variant="outline" className="rounded-lg bg-muted/10 border-border/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 italic shrink-0 whitespace-nowrap">
                      {request.method.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8">
                    <div className="flex flex-col gap-0.5 min-w-0">
                       <span className="text-[9px] md:text-[10px] font-mono font-bold tracking-tighter opacity-70 truncate">
                         {request.destination.slice(0, 12)}...
                       </span>
                       <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30 italic">
                         Node ID
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
                  <td className="px-6 md:px-10 py-6 md:py-8 hidden lg:table-cell whitespace-nowrap">
                    <div className="flex items-center gap-2 opacity-40">
                       <Clock className="h-3 w-3 shrink-0" />
                       <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest italic">
                         {format(new Date(request.createdAt), "MMM dd, HH:mm")}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                    {request.txHash ? (
                      <button 
                        onClick={() => {
                          hapticFeedback("light");
                          window.open(`https://tronscan.org/#/transaction/${request.txHash}`, '_blank');
                        }}
                        className="p-2.5 md:p-3 rounded-xl bg-primary/5 hover:bg-primary/20 text-primary transition-all border border-primary/10 active:scale-90 inline-flex items-center"
                      >
                        <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </button>
                    ) : (
                      <div className="p-3 opacity-10 grayscale">
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