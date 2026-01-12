import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { getPayoutData } from "@/lib/services/merchant.service";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Banknote,
  Activity,
  Terminal,
  TrendingUp,
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
 * 💰 LIQUIDITY COMMAND CENTER (Apex Tier)
 * Normalized: World-standard typography and responsive grid constraints.
 * Fixed: Identity handshake aligned with session.merchantId.
 */
export default async function PayoutsPage() {
  // 🔐 1. Identity Guard: Synchronized with hardened session protocol
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  // 🏁 2. Telemetry Fetch: Real-time financial data synchronization
  const { balance, payouts } = await getPayoutData(realMerchantId);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between border-b border-border/40 pb-8 md:pb-12">
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Financial Protocol
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Ledger <span className="text-primary">// Payouts</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2 opacity-40">
            Node: <span className="text-foreground">{session.config.companyName}</span> // Edge_Sync: Stable
          </p>
        </div>

        <RequestPayoutModal
          merchantId={realMerchantId}
          availableBalance={balance.available}
        />
      </div>

      {/* --- LIQUIDITY OVERRIDE CARDS --- */}
      <div className="grid gap-6 md:gap-10 md:grid-cols-2">
        {/* Available Liquidity Node */}
        <div className="group relative overflow-hidden rounded-3xl md:rounded-[3.5rem] border border-border/40 bg-card/40 p-6 sm:p-8 md:p-10 backdrop-blur-3xl shadow-2xl transition-all hover:border-emerald-500/20">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-10 transition-opacity pointer-events-none">
            <TrendingUp className="h-32 w-32 md:h-48 md:w-48 text-emerald-500" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full gap-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500 italic leading-none">
                  Available Liquidity
                </p>
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                  Ready for Immediate Sync
                </span>
              </div>
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:rotate-6 transition-transform">
                <Wallet className="h-6 w-6 md:h-8 md:w-8 text-emerald-500" />
              </div>
            </div>
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tighter italic leading-none">
              <span className="text-emerald-500 text-xl md:text-3xl align-top mr-1 font-bold italic">
                $
              </span>
              {Number(balance.available).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Pending Settlement Node */}
        <div className="group relative overflow-hidden rounded-3xl md:rounded-[3.5rem] border border-border/40 bg-muted/5 p-6 sm:p-8 md:p-10 backdrop-blur-xl transition-all">
          <div className="relative z-10 flex flex-col justify-between h-full gap-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 italic leading-none">
                  Pending Settlement
                </p>
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-20">
                  Awaiting Clearing Epoch
                </span>
              </div>
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-[1.5rem] bg-muted/20 flex items-center justify-center border border-border/10">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground/30" />
              </div>
            </div>
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-muted-foreground/20 tracking-tighter italic leading-none">
              <span className="text-xl md:text-3xl align-top mr-1 font-bold italic">
                $
              </span>
              {Number(balance.pending).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* --- DISBURSEMENT HISTORY LEDGER --- */}
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between px-2 border-b border-border/10 pb-4">
          <div className="flex items-center gap-3">
            <ArrowUpRight className="h-5 w-5 text-primary" />
            <h2 className="text-base md:text-lg font-black uppercase tracking-[0.3em] italic leading-none">
              Disbursement <span className="text-primary">Log</span>
            </h2>
          </div>
          <p className="hidden sm:block text-[8px] font-black uppercase text-muted-foreground tracking-widest opacity-30 italic">
            Telemetry showing last 30 entries
          </p>
        </div>

        <div className="rounded-3xl md:rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto scrollbar-hide">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-muted/30 border-b border-border/40">
                <TableRow className="hover:bg-transparent border-none">
                  {[
                    "Transaction Node",
                    "Timestamp",
                    "Volume",
                    "Protocol",
                    "Status",
                  ].map((head) => (
                    <TableHead
                      key={head}
                      className="px-6 py-6 font-black uppercase text-[10px] tracking-[0.2em] text-muted-foreground/40"
                    >
                      {head}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/10">
                {payouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-6 opacity-20">
                        <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl bg-muted/50 border border-border/40 flex items-center justify-center">
                          <Banknote className="h-8 w-8" />
                        </div>
                        <p className="text-[10px] font-black uppercase italic tracking-widest">
                          Zero Withdrawal Telemetry Detected
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  payouts.map((payout: any) => (
                    <TableRow
                      key={payout.id}
                      className="hover:bg-primary/[0.02] transition-all group border-none"
                    >
                      <TableCell className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-muted/20 flex items-center justify-center border border-border/10">
                            <Terminal className="h-3.5 w-3.5 text-muted-foreground opacity-30" />
                          </div>
                          <p className="font-mono text-[10px] font-black tracking-widest text-muted-foreground opacity-60">
                            {payout.id.slice(0, 16).toUpperCase()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <p className="text-[10px] font-black uppercase italic tracking-widest text-foreground/70">
                          {format(new Date(payout.createdAt), "dd MMM yyyy // HH:mm")}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <p className="text-xl font-black tracking-tighter italic">
                          $
                          {Number(payout.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <Badge
                          variant="outline"
                          className="rounded-lg bg-muted/5 border-border/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest italic opacity-60"
                        >
                          {payout.method.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-6 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm",
                            payout.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          )}
                        >
                          {payout.status === "COMPLETED" ? (
                            <CheckCircle2 className="mr-1.5 h-3 w-3" />
                          ) : (
                            <Activity className="mr-1.5 h-3 w-3 animate-pulse" />
                          )}
                          {payout.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="flex items-center gap-3 px-6 opacity-20">
        <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">
          Audit Protocol Active // Node_ID: {realMerchantId.slice(0, 12)}
        </p>
      </div>
    </div>
  );
}