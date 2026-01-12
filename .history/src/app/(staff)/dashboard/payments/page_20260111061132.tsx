import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { getMerchantActivity } from "@/lib/services/merchant.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowDownLeft, 
  Globe, 
  Hash, 
  Activity,
  Terminal,
  Search,
  Download,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * 🛰️ CAPITAL INGRESS LEDGER (Apex Tier)
 * Fixed: JSX parsing logic for TableHeader and TableRow.
 * Normalized: Fluid typographic scaling and intrinsic wrap layout.
 * Optimized: Responsive viewport clamping for zero-bleed rendering.
 */
export default async function TransactionsPage() {
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // Real-time telemetry from the ledger service
  const transactions = await getMerchantActivity(realMerchantId);

  return (
    <div className="max-w-full overflow-x-hidden space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-8 w-full px-1">
        <div className="flex flex-col gap-4 min-w-fit flex-1">
          <div className="flex items-center gap-3 text-primary">
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
              <ArrowDownLeft className="h-4 w-4 fill-primary animate-pulse" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic opacity-80 whitespace-nowrap">
              Ingress Telemetry
            </span>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] uppercase italic leading-[0.8] text-foreground whitespace-normal break-words max-w-[90vw]">
              Inflow <span className="text-primary">Ledger</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-3 opacity-40">
              Active Node: <span className="text-foreground tabular-nums">{realMerchantId.slice(0, 12)}</span> // Global_Sync
            </p>
          </div>
        </div>

        {/* Global Control Strip: Wraps automatically on collision */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto shrink-0 lg:mt-auto">
          <div className="relative min-w-0 sm:w-64 xl:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="FILTER BY TRANS_ID..." 
              className="h-11 md:h-13 w-full pl-11 rounded-2xl border-border/40 bg-card/40 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] focus:ring-primary/20 transition-all placeholder:opacity-30"
            />
          </div>
          
          <div className="flex gap-2 h-11 md:h-13">
            <Button variant="outline" className="flex-1 lg:flex-none h-full px-5 rounded-2xl border-border/40 bg-muted/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">
              <Download className="mr-2 h-3.5 w-3.5" /> Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* --- TRANSACTION GRID --- */}
      <div className="rounded-2xl md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <Table className="w-full text-left border-collapse min-w-[850px]">
            {/* ✅ FIXED: Synchronized Header Protocol */}
            <TableHeader className="bg-muted/30 border-b border-border/10">
              <TableRow className="hover:bg-transparent border-none"> 
                {["Timestamp", "Identity Node", "Service // Node", "Liquidity", "Status"].map((head) => (
                  <TableHead 
                    key={head} 
                    className="h-16 px-6 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 leading-none"
                  >
                    {head}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-border/10">
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <Terminal className="h-10 w-10 text-muted-foreground" />
                      <p className="text-xs font-black uppercase italic tracking-widest">
                        Zero Ingress Activity Detected
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-primary/[0.02] transition-all group duration-500 border-none">
                    
                    {/* Timestamp Telemetry */}
                    <TableCell className="px-6 py-6 md:py-8">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] md:text-[11px] font-black uppercase italic tracking-widest text-foreground leading-none">
                          {format(new Date(tx.createdAt), "dd MMM yyyy")}
                        </p>
                        <p className="text-[8px] font-mono text-muted-foreground/40 font-bold uppercase tracking-widest">
                          {format(new Date(tx.createdAt), "HH:mm:ss")}
                        </p>
                      </div>
                    </TableCell>

                    {/* Node Identity */}
                    <TableCell className="px-6 py-6 md:py-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                           <p className="font-black text-foreground uppercase italic tracking-tighter text-base md:text-xl leading-none truncate group-hover:text-primary transition-colors">
                             @{tx.user?.username || "ANON_NODE"}
                           </p>
                           <p className="text-[8px] font-mono font-bold text-muted-foreground/30 mt-1.5 uppercase truncate tracking-tighter">
                             ID: {tx.user?.id.slice(-12) || "0x000000"}
                           </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Service Mapping */}
                    <TableCell className="px-6 py-6 md:py-8">
                       <div className="flex flex-col">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary italic leading-none mb-1.5 truncate max-w-[150px]">
                             {tx.serviceName}
                          </p>
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30">Identity Broadcaster</span>
                       </div>
                    </TableCell>

                    {/* Liquidity (Amount) */}
                    <TableCell className="px-6 py-6 md:py-8">
                       <p className="text-xl md:text-2xl font-black tracking-tighter italic text-foreground leading-none tabular-nums">
                          <span className="text-xs md:text-sm align-top mr-0.5 opacity-40 font-bold">$</span>
                          {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </p>
                    </TableCell>

                    {/* Protocol Status */}
                    <TableCell className="px-6 py-6 md:py-8 text-right">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm transition-all",
                        tx.status === "SUCCESSFUL"
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5"
                          : "bg-muted/10 text-muted-foreground border-border/40"
                      )}>
                        {tx.status === "SUCCESSFUL" ? (
                          <Activity className="h-3 w-3 mr-2 animate-pulse" />
                        ) : (
                          <Hash className="h-3 w-3 mr-2" />
                        )}
                        {tx.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* FOOTER: SYSTEM SIGNAL */}
      <div className="flex items-center gap-3 px-2 opacity-20">
         <Terminal className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic leading-none">
           Ledger Sync Active // Identity Node Verified
         </p>
      </div>
    </div>
  );
}