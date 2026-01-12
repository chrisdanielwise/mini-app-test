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
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
 * 🏛️ PAYOUT STATUS LEDGER (Tier 2)
 * High-resiliency telemetry for merchant capital movement.
 */
export function PayoutLedger({ requests }: { requests: PayoutRequest[] }) {
  return (
    <div className="rounded-[3rem] border border-border/40 bg-card/30 backdrop-blur-3xl shadow-2xl overflow-hidden animate-in fade-in duration-1000">
      
      {/* --- LEDGER HEADER --- */}
      <div className="p-10 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">
            Capital Telemetry
          </h3>
          <p className="text-2xl font-black uppercase italic tracking-tighter">
            Liquidation <span className="text-primary">History</span>
          </p>
        </div>

        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
           <input 
             placeholder="SEARCH BY TX_ID..." 
             className="h-12 w-full md:w-64 pl-12 pr-4 rounded-2xl bg-muted/10 border border-border/40 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
           />
        </div>
      </div>

      {/* --- DATA NODE: TABLE --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/40">
              {["Disbursement", "Protocol", "Destination Node", "Status", "Timestamp", ""].map((head) => (
                <th key={head} className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-center">
                        <Hash className="h-6 w-6 text-muted-foreground/20" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">
                        No Liquidation Logs Found
                      </p>
                   </div>
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-primary/[0.03] transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                       <span className="text-lg font-black italic tracking-tighter">
                         ${parseFloat(request.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </span>
                       <span className="text-[9px] font-black text-muted-foreground opacity-40 uppercase tracking-widest mt-1">
                         {request.currency}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <Badge variant="outline" className="rounded-lg bg-muted/10 border-border/40 text-[9px] font-black uppercase tracking-widest px-3 py-1 italic">
                      {request.method.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-mono font-black tracking-tighter opacity-70">
                         {request.destination.slice(0, 12)}...
                       </span>
                       <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40 italic">
                         External Node ID
                       </p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <Badge className={cn(
                      "rounded-lg text-[8px] font-black uppercase tracking-[0.15em] px-3 py-1.5 border shadow-sm",
                      getStatusStyles(request.status)
                    )}>
                      {getStatusIcon(request.status)}
                      <span className="ml-2">{request.status}</span>
                    </Badge>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                       <Clock className="h-3 w-3 text-muted-foreground opacity-30" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
                         {format(new Date(request.createdAt), "MMM dd, HH:mm")}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {request.txHash ? (
                      <a 
                        href={`https://tronscan.org/#/transaction/${request.txHash}`} 
                        target="_blank" 
                        className="p-3 rounded-xl hover:bg-primary/10 text-primary transition-all border border-transparent hover:border-primary/20 inline-flex items-center"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <div className="p-3 opacity-10 cursor-not-allowed">
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

/**
 * 🛠️ TELEMETRY HELPERS
 */
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
    case "COMPLETED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "REJECTED": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    default: return "bg-muted text-muted-foreground border-border/40";
  }
}