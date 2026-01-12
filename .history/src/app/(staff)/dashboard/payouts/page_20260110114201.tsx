import { requireMerchantSession } from "@/lib/auth/merchant-auth";
/** * ✅ FIXED: Using named import for Turbopack consistency.
 */
import { getPayoutData } from "@/lib/services/merchant.service";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Banknote,
  AlertCircle,
  TrendingUp,
  Terminal,
  Activity,
  ArrowDownLeft,
  ChevronRight,
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
import { cn } from "@/lib/utils";

/**
 * 💰 LIQUIDITY COMMAND CENTER (Tier 2)
 * High-resiliency financial ledger for managing earnings and asset liquidation.
 */
export default async function PayoutsPage() {
  // 🔐 1. Identity Guard: Verify administrative node session
  const session = await requireMerchantSession();
  const realMerchantId = session.merchant.id;

  // 🏁 2. Telemetry Fetch: Real-time financial data synchronization
  const { balance, payouts } = await getPayoutData(realMerchantId);

  return (
    <div className="space-y-12 p-8 sm:p-12 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-7xl mx-auto">
      {/* --- HUD HEADER --- */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-4 w-4 fill-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Financial Protocol
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Ledger <span className="text-primary">// Payouts</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-4 opacity-40">
            Institution: {session.merchant.companyName} // Edge_Node_Sync:
            Stable
          </p>
        </div>

        {/* ✅ Dynamic Modal for requesting withdrawals */}
        <RequestPayoutModal
          merchantId={realMerchantId}
          availableBalance={balance.available}
        />
      </div>

      {/* --- LIQUIDITY OVERRIDE CARDS --- */}
      <div className="grid gap-10 md:grid-cols-2">
        {/* Available Liquidity Node */}
        <div className="group relative overflow-hidden rounded-[3.5rem] border border-border/40 bg-card/40 p-12 backdrop-blur-3xl shadow-2xl transition-all hover:border-emerald-500/20">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
            <TrendingUp className="h-48 w-48 text-emerald-500" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-500 italic leading-none">
                  Available Liquidity
                </p>
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                  Ready for Immediate Sync
                </span>
              </div>
              <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500">
                <Wallet className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
            <p className="text-6xl md:text-7xl font-black text-foreground tracking-tighter italic leading-none">
              <span className="text-emerald-500 text-3xl md:text-4xl align-top mr-1 font-bold italic">
                $
              </span>
              {Number(balance.available).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Pending Settlement Node */}
        <div className="group relative overflow-hidden rounded-[3.5rem] border border-border/40 bg-muted/10 p-12 backdrop-blur-xl transition-all">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 italic leading-none">
                  Pending Settlement
                </p>
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-20">
                  Awaiting Clearing Epoch
                </span>
              </div>
              <div className="h-16 w-16 rounded-[1.5rem] bg-muted/30 flex items-center justify-center shadow-inner">
                <Clock className="h-8 w-8 text-muted-foreground/40" />
              </div>
            </div>
            <p className="text-6xl md:text-7xl font-black text-muted-foreground/30 tracking-tighter italic leading-none">
              <span className="text-2xl md:text-3xl align-top mr-1 font-bold italic">
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
      <div className="space-y-10">
        <div className="flex items-center justify-between px-2 border-b border-border/20 pb-6">
          <div className="flex items-center gap-4">
            <ArrowUpRight className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-black uppercase tracking-[0.4em] italic leading-none">
              Disbursement <span className="text-primary">Log</span>
            </h2>
          </div>
          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-40 italic">
            Telemetry showing last 30 entries
          </p>
        </div>

        <div className="rounded-[3.5rem] border border-border/40 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
          <Table>
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
                    className="px-10 py-8 font-black uppercase text-[10px] tracking-[0.3em] text-muted-foreground/60"
                  >
                    {head}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/20">
              {payouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <div className="h-20 w-20 rounded-[2.5rem] bg-muted/50 border border-border/40 flex items-center justify-center">
                        <Banknote className="h-10 w-10" />
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
                    className="hover:bg-primary/[0.02] transition-all group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted/20 flex items-center justify-center">
                          <Terminal className="h-4 w-4 text-muted-foreground opacity-30" />
                        </div>
                        <p className="font-mono text-[10px] font-black tracking-widest text-muted-foreground">
                          {payout.id.slice(0, 16)}...
                        </p>
                      </div>
                    </td>
                    <td className="py-8">
                      <p className="text-[10px] font-black uppercase italic tracking-widest text-foreground/70">
                        {format(
                          new Date(payout.createdAt),
                          "dd MMM yyyy // HH:mm"
                        )}
                      </p>
                    </td>
                    <td className="py-8">
                      <p className="text-xl font-black tracking-tighter italic">
                        $
                        {Number(payout.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </td>
                    <td className="py-8">
                      <Badge
                        variant="outline"
                        className="rounded-lg bg-muted/10 border-border/40 px-3 py-1 text-[9px] font-black uppercase tracking-widest italic opacity-60"
                      >
                        {payout.method.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-2xl px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border",
                          payout.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}
                      >
                        {payout.status === "COMPLETED" ? (
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                        ) : (
                          <Activity className="mr-2 h-3.5 w-3.5 animate-pulse" />
                        )}
                        {payout.status}
                      </span>
                    </td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="flex items-center gap-3 px-8 opacity-20 group">
        <Terminal className="h-3 w-3" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] italic group-hover:opacity-100 transition-opacity">
          Audit Protocol Active // Merchant_UID: {realMerchantId.slice(0, 12)}
        </p>
      </div>
    </div>
  );
}
