import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import { getMerchantActivity } from "@/lib/services/merchant.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  ArrowDownLeft, 
  Globe, 
  Hash, 
  Activity,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * 🛰️ CAPITAL INGRESS LEDGER (Tier 2)
 * High-resiliency transaction log for auditing global subscriber payments.
 */
export default async function TransactionsPage() {
  const session = await requireMerchantSession();

  // 🏁 1. Fetch real-time telemetry from the ledger service
  const transactions = await getMerchantActivity(session.merchant.id);

  return (
    <div className="space-y-12 p-8 sm:p-12 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-7xl mx-auto">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between border-b border-border/40 pb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowDownLeft className="h-4 w-4 fill-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Ingress Telemetry
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Inflow <span className="text-primary">Ledger</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">
            Node ID: {session.merchant.id.slice(0, 16)} // Global_Edge_Sync
          </p>
        </div>

        {/* Global Control Strip */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="FILTER BY ID OR NAME..." 
              className="h-14 w-full sm:w-72 pl-12 rounded-2xl border-border/40 bg-card/40 font-black text-[10px] uppercase tracking-[0.2em] focus:ring-primary/20 transition-all placeholder:opacity-20 shadow-inner"
            />
          </div>
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/40 bg-muted/10 text-[10px] font-black uppercase tracking-widest hover:bg-muted/20">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* --- TRANSACTION GRID --- */}
      <div className="rounded-[3.5rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/40">
              <TableRow className="hover:bg-transparent border-none">
                {["Timestamp", "Identity Node", "Service Node", "Liquidity", "Status"].map((head) => (
                  <TableHead key={head} className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/60">
                    {head}
                  </TableHead>
                ))}
              </tr>
            </TableHeader>
            <TableBody className="divide-y divide-border/20">
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-48 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <div className="h-20 w-20 rounded-[2.5rem] bg-muted/50 border border-border/40 flex items-center justify-center">
                        <Terminal className="h-10 w-10" />
                      </div>
                      <p className="text-[10px] font-black uppercase italic tracking-widest">
                        Zero Ingress Activity Detected
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-primary/[0.02] transition-all group duration-500">
                    {/* Timestamp */}
                    <td className="px-10 py-10">
                      <div className="flex flex-col gap-1">
                        <p className="text-[11px] font-black uppercase italic tracking-widest text-foreground/80">
                          {format(new Date(tx.createdAt), "dd MMM yyyy")}
                        </p>
                        <p className="text-[9px] font-mono text-muted-foreground/40 font-bold uppercase tracking-widest">
                          {format(new Date(tx.createdAt), "HH:mm:ss")}
                        </p>
                      </div>
                    </td>

                    {/* Customer Identity */}
                    <td className="px-10 py-10">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                           <p className="font-black text-foreground uppercase italic tracking-tighter text-lg leading-none">
                             @{tx.user?.username || "ANON_NODE"}
                           </p>
                           <p className="text-[8px] font-mono font-bold text-muted-foreground/30 mt-1 uppercase">
                             UID: {tx.user?.id.slice(-8) || "0x000000"}
                           </p>
                        </div>
                      </div>
                    </td>

                    {/* Service Info */}
                    <td className="px-10 py-10">
                       <div className="flex flex-col">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary italic leading-none mb-1">
                             {tx.serviceName}
                          </p>
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30">Broadcasting Tier</span>
                       </div>
                    </td>

                    {/* Amount */}
                    <td className="px-10 py-10">
                       <p className="text-2xl font-black tracking-tighter italic text-foreground">
                          <span className="text-sm align-top mr-1 opacity-40">$</span>
                          {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </p>
                    </td>

                    {/* Status Badge */}
                    <td className="px-10 py-10">
                      <div className={cn(
                        "inline-flex items-center rounded-2xl px-5 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all",
                        tx.status === "SUCCESSFUL"
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10"
                          : "bg-muted text-muted-foreground border-border/40"
                      )}>
                        {tx.status === "SUCCESSFUL" ? (
                          <Activity className="h-3.5 w-3.5 mr-2 animate-pulse" />
                        ) : (
                          <Hash className="h-3.5 w-3.5 mr-2" />
                        )}
                        {tx.status}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="flex items-center gap-3 px-8 opacity-20 group">
         <Terminal className="h-3 w-3" />
         <p className="text-[8px] font-black uppercase tracking-[0.4em] italic group-hover:opacity-100 transition-opacity">
           Capital Synchronization: Success // Protocol_v2.6
         </p>
      </div>
    </div>
  );
}