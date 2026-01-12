import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowDownLeft, 
  Activity, 
  Terminal, 
  Search, 
  Download,
  Globe,
  Zap,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * 🏛️ CAPITAL INGRESS LEDGER (Final Apex Tier)
 * Fixed: Comprehensive replacement of HTML table tags with UI components to solve parsing errors.
 * Normalized: Fluid typographic scaling and zero-bleed layout logic.
 */
export default async function PaymentsPage() {
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  const transactions = await prisma.payment.findMany({
    where: {
      subscription: {
        service: {
          merchantId: realMerchantId
        }
      }
    },
    include: {
      subscription: {
        include: {
          user: true,
          service: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="max-w-full overflow-x-hidden space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-8 w-full px-1">
        <div className="flex flex-col gap-4 min-w-fit flex-1">
          <div className="flex items-center gap-3 text-primary">
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
              <ArrowDownLeft className="h-4 w-4 fill-primary" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic opacity-80 whitespace-nowrap">
              Financial Telemetry
            </span>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] uppercase italic leading-[0.8] text-foreground whitespace-normal break-words max-w-[90vw]">
              Inflow <span className="text-primary">Ledger</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-3 opacity-40 leading-none">
              Validated Signals: <span className="text-foreground tabular-nums">{transactions.length}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto shrink-0 lg:mt-auto">
          <div className="relative min-w-0 sm:w-64 xl:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
            <Input 
              placeholder="SEARCH TX_ID..." 
              className="h-11 md:h-13 w-full pl-11 rounded-2xl border-border/40 bg-card/40 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" className="h-11 md:h-13 px-5 rounded-2xl border-border/40 bg-muted/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 transition-all active:scale-95">
            <Download className="mr-2 h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* --- DATA NODE: THE LEDGER --- */}
      <div className="rounded-2xl md:rounded-[3rem] border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <Table className="w-full text-left border-collapse min-w-[850px]">
            {/* FIXED: Standard library-native Header Structure */}
            <TableHeader className="bg-muted/30 border-b border-border/10">
              <TableRow className="hover:bg-transparent border-none"> 
                <TableHead className="h-16 px-6 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Identity Node</TableHead>
                <TableHead className="h-16 px-6 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Service Node</TableHead>
                <TableHead className="h-16 px-6 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Liquidity</TableHead>
                <TableHead className="h-16 px-6 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Timestamp</TableHead>
                <TableHead className="h-16 px-6 text-right text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Protocol</TableHead>
              </TableRow>
            </TableHeader>
            
            {/* FIXED: Component-based TableBody prevents "jsx text" errors */}
            <TableBody className="divide-y divide-border/10">
              {transactions.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={5} className="h-64 text-center">
                    <p className="text-xs font-black uppercase italic tracking-tighter opacity-20">No Ingress Signals Detected.</p>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-primary/[0.02] transition-all group border-none">
                    <TableCell className="px-6 py-6 md:py-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 group-hover:scale-105 transition-all">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-base md:text-xl leading-none truncate group-hover:text-primary transition-colors">
                            @{tx.subscription.user.username || 'anon_node'}
                          </p>
                          <p className="text-[8px] md:text-[9px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">
                            UID: {tx.subscription.user.id.slice(-12)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-primary">
                          <Zap className="h-3 w-3 opacity-40" />
                          <p className="text-[10px] font-black uppercase tracking-widest italic leading-none truncate max-w-[150px]">
                            {tx.subscription.service.name}
                          </p>
                        </div>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest ml-5 opacity-40">
                          ID: {tx.id.slice(0, 8)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-6">
                      <p className="text-xl md:text-2xl font-black tracking-tighter italic text-foreground leading-none tabular-nums">
                        <span className="text-xs md:text-sm align-top mr-0.5 opacity-40 font-bold">$</span>
                        {parseFloat(tx.amount.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </TableCell>

                    <TableCell className="px-6 py-6">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground opacity-30" />
                        <span className="font-black text-[11px] uppercase italic tracking-tighter text-foreground/80 leading-none whitespace-nowrap">
                          {format(new Date(tx.createdAt), "dd MMM yyyy")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-6 text-right">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm transition-all",
                        tx.status === 'SUCCESSFUL' 
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      )}>
                        <div className={cn(
                          "h-1 w-1 rounded-full mr-2 animate-pulse",
                          tx.status === 'SUCCESSFUL' ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        {tx.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center gap-3 px-2 opacity-20">
         <Terminal className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic leading-none">
           Secure Ledger Protocol // Last Sync: {new Date().toLocaleTimeString()}
         </p>
      </div>
    </div>
  );
}