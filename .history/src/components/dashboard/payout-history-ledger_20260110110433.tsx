"use client";

import { useState } from "react";
import { 
  format 
} from "date-fns";
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
import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

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
 * 🏛️ PAYOUT HISTORY LEDGER (Tier 2)
 * High-resiliency telemetry for merchant capital movement.
 * Optimized for blockchain verification and institutional auditing.
 */
export function PayoutHistoryLedger({ payouts }: { payouts: PayoutRecord[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden animate-in fade-in duration-1000">
      
      {/* --- TELEMETRY HEADER --- */}
      <div className="p-10 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
            Audit Ledger
          </h3>
          <p className="text-2xl font-black uppercase italic tracking-tighter leading-none">
            Disbursement <span className="text-primary">History</span>
          </p>
        </div>

        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
           <input 
             placeholder="FILTER BY TXID OR ADDR..." 
             className="h-12 w-full md:w-72 pl-12 pr-4 rounded-2xl bg-muted/10 border border-border/40 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner placeholder:opacity-20"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* --- DATA NODE: TABLE --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/40">
              {["Liquidity", "Protocol", "Network Address", "Status", "Timestamp", ""].map((head) => (
                <th key={head} className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {payouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-32 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-20">
                      <div className="h-16 w-16 rounded-[2rem] bg-muted/50 border border-border/40 flex items-center justify-center">
                        <Hash className="h-8 w-8" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                        Zero Disbursement Telemetry Detected
                      </p>
                   </div>
                </td>
              </tr>
            ) : (
              payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-primary/[0.02] transition-all group">
                  {/* Amount Cluster */}
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2">
                          <ArrowDownLeft className="h-3 w-3 text-rose-500 opacity-50" />
                          <span className="text-lg font-black italic tracking-tighter text-foreground">
                            ${parseFloat(payout.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                       </div>
                       <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-5">
                         {payout.currency} NODE
                       </span>
                    </div>
                  </td>

                  {/* Protocol Method */}
                  <td className="px-10 py-8">
                    <Badge variant="outline" className="rounded-lg bg-muted/10 border-border/40 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 italic">
                      {payout.method.replace("_", " ")}
                    </Badge>
                  </td>

                  {/* Destination Node */}
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-2">
                          <ShieldCheck className="h-3 w-3 text-primary opacity-30" />
                          <span className="text-[10px] font-mono font-black tracking-widest opacity-80">
                            {payout.destination.slice(0, 6)}...{payout.destination.slice(-4)}
                          </span>
                       </div>
                       <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40 ml-5 italic">
                         Target Gateway
                       </p>
                    </div>
                  </td>

                  {/* Status Node */}
                  <td className="px-10 py-8">
                    <Badge className={cn(
                      "rounded-lg text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border shadow-sm",
                      getStatusStyles(payout.status)
                    )}>
                      {getStatusIcon(payout.status)}
                      <span className="ml-2">{payout.status}</span>
                    </Badge>
                  </td>

                  {/* Timestamp Cluster */}
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                       <Clock className="h-3 w-3 text-muted-foreground opacity-30" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
                         {format(new Date(payout.createdAt), "dd MMM yyyy")}
                       </span>
                    </div>
                  </td>

                  {/* Action Terminal */}
                  <td className="px-10 py-8 text-right">
                    {payout.txId ? (
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/20 text-primary transition-all group/link" asChild>
                        <a href={`https://tronscan.org/#/transaction/${payout.txId}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 group-hover/link:scale-110" />
                        </a>
                      </Button>
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center opacity-10 grayscale">
                        <Hash className="h-4 w-4" />
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

/**
 * 🛠️ TELEMETRY STYLE PROTOCOLS
 */
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
    case "COMPLETED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10";
    case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10";
    case "PROCESSING": return "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/10";
    case "FAILED": return "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10";
    default: return "bg-muted text-muted-foreground border-border/40";
  }
}