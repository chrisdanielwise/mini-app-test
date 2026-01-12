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
  ArrowDownLeft,
  Globe,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

interface PayoutRecord {
  id: string;
  amount: string;
  currency: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  method: "USDT_TRC20" | "USDT_ERC20" | "BANK_TRANSFER";
  destination: string;
  txId?: string;
  createdAt: string;
  merchantName?: string; // 🛡️ Added for Staff Oversight visibility
}

/**
 * 🏛️ PAYOUT HISTORY LEDGER
 * Logic: Synchronized with Universal Identity. 
 * Adaptive: Flavor-shifts (Amber/Emerald) based on operator context.
 */
export function PayoutHistoryLedger({ payouts }: { payouts: PayoutRecord[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  // FILTER LOGIC: Search across amounts, destinations, and merchant names
  const filteredPayouts = payouts.filter(p => 
    p.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.amount.includes(searchTerm) ||
    (p.merchantName && p.merchantName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={cn(
      "rounded-2xl md:rounded-[3rem] border backdrop-blur-3xl shadow-2xl overflow-hidden animate-in fade-in duration-1000 max-w-7xl mx-auto transition-colors duration-700",
      isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-card/40 border-border/40"
    )}>
      
      {/* --- TELEMETRY HEADER --- */}
      <div className="p-5 md:p-10 border-b border-border/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1 md:space-y-1.5">
          <div className="flex items-center gap-2 italic opacity-40">
             {isStaff ? <Globe className="h-3 w-3 text-amber-500" /> : <Terminal className="h-3 w-3 text-primary" />}
             <h3 className={cn(
               "text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]",
               isStaff ? "text-amber-500" : "text-muted-foreground"
             )}>
                {isStaff ? "Platform_Global_Ledger" : "Audit Ledger"}
             </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Disbursement <span className={isStaff ? "text-amber-500" : "text-primary"}>History</span>
          </p>
        </div>

        <div className="relative group w-full lg:w-auto">
           <Search className={cn(
             "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
             isStaff ? "group-focus-within:text-amber-500 text-muted-foreground/30" : "group-focus-within:text-primary text-muted-foreground/30"
           )} />
           <input 
             placeholder={isStaff ? "SEARCH GLOBAL NODES..." : "FILTER TELEMETRY..."}
             className={cn(
               "h-11 md:h-12 w-full lg:w-72 pl-12 pr-4 rounded-xl md:rounded-2xl bg-muted/10 border text-[9px] md:text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 transition-all shadow-inner placeholder:opacity-30",
               isStaff ? "border-amber-500/20 focus:ring-amber-500/20" : "border-border/40 focus:ring-primary/20"
             )}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* --- DATA NODE: TABLE --- */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-full">
          <thead>
            <tr className="bg-muted/30 border-b border-border/10">
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Liquidity</th>
              {isStaff && <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/60">Merchant Node</th>}
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hidden sm:table-cell">Protocol</th>
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Destination</th>
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Status</th>
              <th className="px-5 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {filteredPayouts.length === 0 ? (
              <tr>
                <td colSpan={isStaff ? 7 : 6} className="py-24 md:py-32 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-20 italic">
                      <Hash className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
                        Zero Telemetry Found
                      </p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-muted/5 transition-all group cursor-default">
                  {/* Amount Cluster */}
                  <td className="px-5 md:px-10 py-6 md:py-8">
                    <div className="flex flex-col gap-1 min-w-0">
                       <div className="flex items-center gap-2">
                          <ArrowDownLeft className="h-3 w-3 text-rose-500 opacity-40 shrink-0" />
                          <span className="text-base md:text-lg font-black italic tracking-tighter text-foreground truncate">
                            ${parseFloat(payout.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                       </div>
                       <span className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-5 opacity-40">
                         {format(new Date(payout.createdAt), "dd MMM")} • {payout.currency}
                       </span>
                    </div>
                  </td>

                  {/* Merchant Identity (Staff Exclusive) */}
                  {isStaff && (
                    <td className="px-5 md:px-10 py-6 md:py-8">
                      <span className="text-[10px] font-black uppercase italic tracking-tight text-amber-500/80">
                        {payout.merchantName || "Unknown_Node"}
                      </span>
                    </td>
                  )}

                  {/* Protocol Method */}
                  <td className="px-5 md:px-10 py-6 md:py-8 hidden sm:table-cell">
                    <Badge variant="outline" className="rounded-lg bg-muted/5 border-border/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 italic shrink-0 whitespace-nowrap text-foreground">
                      {payout.method.replace("_", " ")}
                    </Badge>
                  </td>

                  {/* Destination Node */}
                  <td className="px-5 md:px-10 py-6 md:py-8">
                    <div className="flex flex-col gap-1 min-w-0">
                       <div className="flex items-center gap-2">
                          <ShieldCheck className={cn("h-3 w-3 shrink-0 opacity-30", isStaff ? "text-amber-500" : "text-primary")} />
                          <span className="text-[9px] md:text-[10px] font-mono font-bold tracking-widest text-foreground/80 truncate">
                            {payout.destination.slice(0, 6)}...{payout.destination.slice(-6)}
                          </span>
                       </div>
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

                  {/* Action Terminal */}
                  <td className="px-5 md:px-10 py-6 md:py-8 text-right">
                    {payout.txId ? (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => hapticFeedback("light")}
                        className={cn(
                          "h-9 w-9 md:h-10 md:w-10 rounded-xl border transition-all active:scale-90 group/link",
                          isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20" : "bg-primary/5 border-primary/10 text-primary hover:bg-primary/20"
                        )} 
                        asChild
                      >
                        <a href={`https://tronscan.org/#/transaction/${payout.txId}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover/link:scale-110" />
                        </a>
                      </Button>
                    ) : (
                      <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center opacity-10">
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