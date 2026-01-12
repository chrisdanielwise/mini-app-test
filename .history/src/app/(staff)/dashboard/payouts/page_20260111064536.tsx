import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { getPayoutData } from "@/lib/services/merchant.service";
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Banknote, 
  Activity, 
  Terminal, 
  TrendingUp,
  Globe
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { RequestPayoutModal } from "@/components/dashboard/request-payout-modal";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * 💰 LIQUIDITY COMMAND CENTER (Tactical Medium)
 * Normalized: World-standard typographic scaling for financial telemetry.
 * Optimized: Resilient grid geometry to prevent horizontal cropping.
 */
export default async function PayoutsPage() {
  // 🔐 1. Identity Guard: Synchronized with hardened session protocol
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // 🏁 2. Telemetry Fetch: Real-time financial data synchronization
  const { balance, payouts } = await getPayoutData(realMerchantId);

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 px-4">
      
      {/* --- COMMAND HUD HEADER: TACTICAL SYNC --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary/60">
            <Activity className="h-4 w-4 shrink-0 fill-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              Financial Protocol
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Ledger <span className="text-primary">// Payouts</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 opacity-40">
              <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="h-3 w-3" />
                Node: <span className="text-foreground italic uppercase">{session.config.companyName}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <RequestPayoutModal
            merchantId={realMerchantId}
            availableBalance={balance.available}
          />
        </div>
      </div>

      {/* --- LIQUIDITY OVERRIDE CARDS: COMPACT SCALING --- */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
        {/* Available Liquidity Node */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-card/40 p-6 md:p-8 shadow-xl transition-all hover:shadow-emerald-500/5">
          <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-10 transition-opacity pointer-events-none">
            <TrendingUp className="h-24 w-24 text-emerald-500 -rotate-12" />
          </div>

          <div className="relative z-10 flex flex-col justify-between gap-6 h-full">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">
                  Available Liquidity
                </p>
                <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-40">
                  Ready for Sync
                </span>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tighter italic leading-none tabular-nums">
              <span className="text-emerald-500 text-lg md:text-2xl align-top mr-0.5 font-bold">$</span>
              {Number(balance.available).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Pending Settlement Node */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/40 bg-muted/5 p-6 md:p-8 backdrop-blur-xl transition-all">
          <div className="relative z-10 flex flex-col justify-between gap-6 h-full">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 italic">
                  Pending Settlement
                </p>
                <span className="text-[8px] font-bold text-muted-foreground uppercase opacity-20">
                  Clearing Epoch
                </span>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-muted/20 flex items-center justify-center border border-border/10">
                <Clock className="h-5 w-5 text-muted-foreground/30" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-muted-foreground/20 tracking-tighter italic leading-none tabular-nums">
              <span className="text-lg md:text-2xl align-top mr-0.5 font-bold">$</span>
              {Number(balance.pending).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* --- DISBURSEMENT HISTORY LEDGER --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 border-b border-border/10 pb-3">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <h2 className="text-sm md:text-base font-black uppercase tracking-widest italic text-foreground">
              Disbursement <span className="text-primary">Log</span>
            </h2>
          </div>
          <Badge variant="secondary" className="rounded-lg text-[8px] font-black uppercase italic opacity-40">Telemetry Active</Badge>
        </div>

        <div className="rounded-2xl border border-border/10 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto scrollbar-hide">
            <Table className="w-full text-left border-collapse min-w-[800px]">
              <TableHeader className="bg-muted/30 border-b border-border/10">
                <TableRow className="hover:bg-transparent border-none">
                  {["Transaction Node", "Timestamp", "Volume", "Protocol", "Status"].map((head) => (
                    <TableHead key={head} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none">
                      {head}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/10 text-foreground">
                {payouts.length === 0 ? (
                  <TableRow className="border-none">
                    <TableCell colSpan={5} className="px-6 py-32 text-center opacity-20">
                      <div className="flex flex-col items-center gap-4">
                        <Banknote className="h-8 w-8" />
                        <p className="text-xs font-black uppercase italic tracking-widest">Zero signals detected.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  payouts.map((payout: any) => (
                    <TableRow key={payout.id} className="hover:bg-primary/[0.02] transition-colors group border-none">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted/10 flex items-center justify-center border border-border/10">
                            <Terminal className="h-3.5 w-3.5 text-muted-foreground opacity-30" />
                          </div>
                          <p className="font-mono text-[9px] font-bold tracking-tighter text-muted-foreground/60">
                            {payout.id.slice(0, 12).toUpperCase()}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <p className="text-[10px] font-black uppercase italic text-foreground/70 leading-none">
                          {format(new Date(payout.createdAt), "dd MMM yyyy")}
                        </p>
                        <span className="text-[8px] font-mono font-bold opacity-30 mt-1 block">
                          {format(new Date(payout.createdAt), "HH:mm:ss")}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <p className="text-lg font-black tracking-tighter italic tabular-nums">
                          ${Number(payout.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="outline" className="rounded-lg bg-muted/5 border-border/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest opacity-60">
                          {payout.method.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className={cn(
                          "inline-flex items-center rounded-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border",
                          payout.status === "COMPLETED"
                            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                        )}>
                          {payout.status === "COMPLETED" ? (
                            <CheckCircle2 className="mr-1.5 h-3 w-3" />
                          ) : (
                            <Activity className="mr-1.5 h-3 w-3 animate-pulse" />
                          )}
                          {payout.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 opacity-20 py-10">
        <Terminal className="h-3 w-3 text-muted-foreground" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-center">
          Liquidity Protocol Synced // Ledger_Node_{realMerchantId.slice(0, 6)}
        </p>
      </div>
    </div>
  );
}