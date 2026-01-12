"use client";

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
  ArrowDownLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hapticFeedback } from "@/lib/telegram/webapp";

interface PayoutRecord {
  id: string;
  amount: string;
  currency: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  method: "USDT_TRC20" | "USDT_ERC20" | "BANK_TRANSFER";
  destination: string;
  txId?: string;
  createdAt: string;
}

/**
 * 🏛️ PAYOUT HISTORY LEDGER (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Priority-based column visibility for cross-device telemetry parity.
 */
export function PayoutHistoryLedger({ payouts }: { payouts: PayoutRecord[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="rounded-2xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden animate-in fade-in duration-1000 max-w-7xl mx-auto">
      
      {/* --- TELEMETRY HEADER --- */}
      <div className="p-5 md:p-10 border-b border-border/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1 md:space-y-1.5">
          <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground opacity-40 italic">
            Audit Ledger
          </h3>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none">
            Disbursement <span className="text-primary">History</span>
          </p>
        </div>

        <div className="relative group w-full lg:w-auto">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
           <input 
             placeholder="FILTER TELEMETRY..." 
             className="h-11 md:h-12 w-full lg:w-72 pl-12 pr-4 rounded-xl md:rounded-2xl bg-muted/10 border border-border/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner placeholder:opacity-30"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* --- DATA NODE: TABLE --- */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-full">
          <thead>
            <tr className="bg-muted/30 border-b border-border/10">
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Liquidity</th>
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hidden sm:table-cell">Protocol</th>
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Destination</th>
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Status</th>
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hidden lg:table-cell">Timestamp</th>
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {payouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-24 md:py-32 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-20 italic">
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-[2rem] bg-muted/50 border border-border/10 flex items-center justify-center">
                        <Hash className="h-6 w-6 md:h-8 md:w-8" />
                      </div>
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">
                        Zero Telemetry Detected
                      </p>
                   </div>
                </td>
              </tr>
            ) : (
              payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-primary/[0.03] active:bg-primary/[0.05] transition-all group cursor-default">
                  {/* Amount Cluster */}
                  <td className="px-5 md:px-10 py-6 md:py-8">
                    <div className="flex flex-col gap-1 min-w-0">
                       <div className="flex items-center gap-2">
                          <ArrowDownLeft className="h-3 w-3 text-rose-500 opacity-40 shrink-0" />
                          <span className="text-base md:text-lg font-black italic tracking-tighter text-foreground truncate">
                            ${parseFloat(payout.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                       </div>
                       <span className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-5 opacity-60">
                         {payout.currency} NODE
                       </span>
                    </div>
                  </td>

                  {/* Protocol Method (Hidden on Mobile) */}
                  <td className="px-5 md:px-10 py-6 md:py-8 hidden sm:table-cell">
                    <Badge variant="outline" className="rounded-lg bg-muted/10 border-border/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 italic shrink-0 whitespace-nowrap">
                      {payout.method.replace("_", " ")}
                    </Badge>
                  </td>

                  {/* Destination Node */}
                  <td className="px-5 md:px-10 py-6 md:py-8">
                    <div className="flex flex-col gap-1 min-w-0">
                       <div className="flex items-center gap-2">
                          <ShieldCheck className="h-3 w-3 text-primary opacity-30 shrink-0" />
                          <span className="text-[9px] md:text-[10px] font-mono font-bold tracking-widest opacity-80 truncate">
                            {payout.destination.slice(0, 4)}...{payout.destination.slice(-4)}
                          </span>
                       </div>
                       <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30 ml-5 italic truncate">
                         Gateway
                       </p>
                    </div>
                  </td>

                  {/* Status Node */}
                  <td className="px-5 md:px-10 py-6 md:py-8">
                    <Badge className={cn(
                      "rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 md:px-3 py-1 border shadow-sm flex items-center gap-1.5 w-fit",
                      getStatusStyles(payout.status)
                    )}>
                      {getStatusIcon(payout.status)}
                      <span className="truncate">{payout.status}</span>
                    </Badge>
                  </td>

                  {/* Timestamp Cluster (Hidden on Tablet) */}
                  <td className="px-5 md:px-10 py-6 md:py-8 hidden lg:table-cell">
                    <div className="flex items-center gap-2 opacity-40">
                       <Clock className="h-3 w-3 shrink-0" />
                       <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest italic whitespace-nowrap">
                         {format(new Date(payout.createdAt), "dd MMM yyyy")}
                       </span>
                    </div>
                  </td>

                  {/* Action Terminal */}
                  <td className="px-5 md:px-10 py-6 md:py-8 text-right">
                    {payout.txId ? (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => hapticFeedback("light")}
                        className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/20 text-primary transition-all group/link active:scale-90" 
                        asChild
                      >
                        <a href={`https://tronscan.org/#/transaction/${payout.txId}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover/link:scale-110" />
                        </a>
                      </Button>
                    ) : (
                      <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center opacity-10 italic">
                        <Hash className="h-3.5 w-3.5" />
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

/** --- TELEMETRY STYLE PROTOCOLS --- */
function getStatusIcon(status: string) {
  switch (status) {
    case "COMPLETED": return <CheckCircle2 className="h-3 w-3" />;
    case "PENDING": return <Clock className="h-3 w-3 animate-pulse" />;
    case "PROCESSING": return <ArrowUpRight className="h-3 w-3 animate-bounce" />;
    case "FAILED": return <XCircle className="h-3 w-3" />;
    default: return <ShieldCheck className="h-3 w-3" />;
  }
}

function getStatusStyles(status: string) {
  switch (status) {
    case "COMPLETED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "PROCESSING": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "FAILED": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    default: return "bg-muted text-muted-foreground border-border/40";
  }
}