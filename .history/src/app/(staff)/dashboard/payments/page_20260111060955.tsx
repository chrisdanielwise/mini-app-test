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
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * 🛰️ CAPITAL INGRESS LEDGER (Apex Tier)
 * Normalized: World-standard typography and responsive viewport constraints.
 * Fixed: Identity handshake aligned with session.merchantId.
 */
export default async function TransactionsPage() {
  // 🔐 1. Identity Guard: Synchronized with hardened session protocol
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // 🏁 2. Telemetry Fetch: Real-time telemetry from the ledger service
  const transactions = await getMerchantActivity(realMerchantId);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between border-b border-border/40 pb-8 md:pb-12">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ArrowDownLeft className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Ingress Telemetry
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Inflow <span className="text-primary">Ledger</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-40">
            Node ID: <span className="text-foreground">{realMerchantId.slice(0, 16)}</span> // Global_Edge_Sync
          </p>
        </div>

        {/* Global Control Strip - Responsive Width */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="FILTER BY ID..." 
              className="h-12 md:h-14 w-full pl-12 rounded-2xl border-border/40 bg-card/40 text-xs font-black uppercase tracking-widest placeholder:opacity-20 shadow-inner"
            />
          </div>
          <Button variant="outline" className="h-12 md:h-14 px-6 rounded-2xl border-border/40 bg-muted/10 text-xs font-black uppercase tracking-widest">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* --- TRANSACTION GRID --- */}
      <div className="rounded-3xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <Table className="min-w-[900px]">
            
            <TableBody className="divide-y divide-border/10">
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-40 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-muted/50 border border-border/40 flex items-center justify-center">
                        <Terminal className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-black uppercase italic tracking-widest">
                        Zero Ingress Activity Detected
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-primary/[0.02] transition-all group duration-500 border-none">
                    {/* Timestamp */}
                    <TableCell className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] md:text-[11px] font-black uppercase italic tracking-widest text-foreground/80 leading-none">
                          {format(new Date(tx.createdAt), "dd MMM yyyy")}
                        </p>
                        <p className="text-[9px] font-mono text-muted-foreground/30 font-bold uppercase tracking-widest mt-1">
                          {format(new Date(tx.createdAt), "HH:mm:ss")}
                        </p>
                      </div>
                    </TableCell>

                    {/* Customer Identity */}
                    <TableCell className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                           <p className="font-black text-foreground uppercase italic tracking-tighter text-base md:text-lg leading-none truncate group-hover:text-primary transition-colors">
                             @{tx.user?.username || "ANON_NODE"}
                           </p>
                           <p className="text-[8px] font-mono font-bold text-muted-foreground/30 mt-1.5 uppercase truncate">
                             UID: {tx.user?.id.slice(-12) || "0x000000"}
                           </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Service Info */}
                    <TableCell className="px-6 py-6">
                       <div className="flex flex-col">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary italic leading-none mb-1 truncate max-w-[150px]">
                             {tx.serviceName}
                          </p>
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30">Broadcasting Tier</span>
                       </div>
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="px-6 py-6">
                       <p className="text-xl md:text-2xl font-black tracking-tighter italic text-foreground leading-none">
                          <span className="text-xs md:text-sm align-top mr-1 opacity-40 font-bold">$</span>
                          {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </p>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="px-6 py-6 text-right">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm transition-all",
                        tx.status === "SUCCESSFUL"
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10"
                          : "bg-muted text-muted-foreground border-border/40"
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

      {/* Footer System Status */}
      <div className="flex items-center gap-3 px-6 opacity-20">
         <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
           Capital Synchronization: Success // Node_ID: {realMerchantId.slice(0, 12)}
         </p>
      </div>
    </div>
  );
}