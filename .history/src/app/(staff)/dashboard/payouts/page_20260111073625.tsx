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
  CreditCard, 
  Activity, 
  Terminal, 
  Search, 
  Download,
  Globe,
  Zap,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

/**
 * 🏛️ SETTLEMENT & PAYOUT LEDGER (Tactical Medium)
 * Fixed: TypeError on null method node via safety handshake.
 * Normalized: World-standard fluid scaling for institutional liquidity audits.
 */
export default async function PayoutsPage() {
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // 🏁 Data Fetch: Payout Manifest
  const payouts = await prisma.payout.findMany({
    where: { merchantId: realMerchantId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-8">
      
      {/* --- COMMAND HUD HEADER: TACTICAL SYNC --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary/60">
            <CreditCard className="h-4 w-4 shrink-0 fill-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              Settlement Protocol
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Payout <span className="text-primary">Ledger</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
              Active Epoch: <span className="text-foreground tabular-nums">{payouts.length}</span> Cycles Verified
            </p>
          </div>
        </div>

        {/* Global Search & Action Cluster */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full lg:w-auto shrink-0">
          <div className="relative min-w-0 sm:w-60 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-30" />
            <Input 
              placeholder="SEARCH PAYOUT_ID..." 
              className="h-10 md:h-11 w-full pl-10 rounded-xl border-border/40 bg-card/40 font-bold text-[9px] uppercase tracking-widest focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" className="h-10 md:h-11 px-4 rounded-xl border-border/40 bg-muted/10 text-[9px] font-bold uppercase tracking-widest">
            <Download className="mr-2 h-3.5 w-3.5 opacity-40" /> Export
          </Button>
        </div>
      </div>

      {/* --- DATA NODE: THE LEDGER (High Density) --- */}
      <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto scrollbar-hide">
          <Table className="w-full text-left border-collapse min-w-[850px]">
            <TableHeader className="bg-muted/30 border-b border-border/10">
              <TableRow className="hover:bg-transparent border-none"> 
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Liquidity Target</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Method</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Value</TableHead>
                <TableHead className="h-12 px-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Sync Date</TableHead>
                <TableHead className="h-12 px-6 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">Status</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className="divide-y divide-border/10 text-foreground tabular-nums">
              {payouts.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={5} className="h-40 text-center opacity-20">
                    <p className="text-xs font-black uppercase italic tracking-widest">No Settlement Cycles Detected.</p>
                  </TableCell>
                </TableRow>
              ) : (
                payouts.map((payout) => (
                  <TableRow key={payout.id} className="hover:bg-primary/[0.02] transition-colors group border-none">
                    {/* Liquidity Target */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40 border border-primary/20 shadow-inner group-hover:scale-105 transition-all">
                          <Zap className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black text-foreground uppercase italic tracking-tight text-sm md:text-base leading-none truncate group-hover:text-primary transition-colors">
                            {payout.accountName || 'EXTERNAL_VAULT'}
                          </p>
                          <p className="text-[8px] font-mono font-bold text-muted-foreground/40 uppercase tracking-tighter mt-1">
                            Ref: {payout.id.slice(0, 12)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Method Node (The Fixed Line) */}
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className="rounded-lg bg-muted/5 border-border/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest opacity-60">
                        {payout.method?.replace("_", " ") || "UNSPECIFIED_NODE"}
                      </Badge>
                    </TableCell>

                    {/* Value Node */}
                    <TableCell className="px-6 py-4">
                      <p className="text-lg md:text-xl font-black tracking-tighter italic text-foreground leading-none tabular-nums">
                        <span className="text-xs align-top mr-0.5 opacity-40 font-bold">$</span>
                        {parseFloat(payout.amount.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </TableCell>

                    {/* Timestamp Node */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground/30" />
                        <span className="font-bold text-[10px] uppercase italic text-foreground/60 leading-none">
                          {format(new Date(payout.createdAt), "dd MMM yyyy")}
                        </span>
                      </div>
                    </TableCell>

                    {/* Protocol Status */}
                    <TableCell className="px-6 py-4 text-right">
                      <div className={cn(
                        "inline-flex items-center rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-widest border shadow-sm",
                        payout.status === 'COMPLETED' 
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      )}>
                        {payout.status}
                        <ExternalLink className="ml-1.5 h-2.5 w-2.5 opacity-40" />
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
      <div className="flex items-center justify-center gap-3 opacity-20 py-4">
         <Terminal className="h-3 w-3 text-muted-foreground" />
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground italic text-center leading-none">
           Settlement Protocol synchronized // Last Ingress: {new Date().toLocaleTimeString()}
         </p>
      </div>
    </div>
  );
}