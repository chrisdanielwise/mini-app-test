import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";
/** * ✅ FIXED: Using named import for Turbopack consistency.
 */
import { getPayoutData } from "@/src/lib/services/merchant.service";
import { Button } from "@/src/components/ui/button";
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Banknote,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { format } from "date-fns";
import { RequestPayoutModal } from "@/src/components/dashboard/request-payout-modal";

/**
 * 💰 MERCHANT PAYOUTS LEDGER
 * Manage earnings, available liquidity, and withdrawal history.
 */
export default async function PayoutsPage() {
  // 🔐 1. Authenticate session
  const session = await requireMerchantSession();
  const realMerchantId = session.merchant.id;

  // 🏁 2. Fetch real financial data
  const { balance, payouts } = await getPayoutData(realMerchantId);

  return (
    <div className="space-y-8 p-6 pb-20 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Ledger: Payouts
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
            Financial Assets for {session.merchant.companyName}
          </p>
        </div>

        {/* ✅ Dynamic Modal for requesting withdrawals */}
        <RequestPayoutModal
          merchantId={realMerchantId}
          availableBalance={balance.available}
        />
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Available Liquidity */}
        <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Available Liquidity
              </p>
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            </div>
            <p className="text-5xl font-black text-foreground tracking-tighter">
              $
              {Number(balance.available).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Pending Settlement */}
        <div className="rounded-[2.5rem] border border-border bg-muted/20 p-8 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Pending Settlement
            </p>
            <p className="text-5xl font-black text-muted-foreground/50 tracking-tighter">
              $
              {Number(balance.pending).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="h-16 w-16 rounded-[1.5rem] bg-muted/50 flex items-center justify-center">
            <Clock className="h-8 w-8 text-muted-foreground/40" />
          </div>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <ArrowUpRight className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-black uppercase tracking-widest italic">
            Withdrawal History
          </h2>
        </div>

        <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="px-8 py-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                  Reference
                </TableHead>
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                  Amount
                </TableHead>
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                  Method
                </TableHead>
                <TableHead className="px-8 py-5 text-right font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Banknote className="h-8 w-8" />
                      <p className="text-[10px] font-black uppercase italic tracking-widest">
                        No payout history on record
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                payouts.map((payout: any) => (
                  <TableRow
                    key={payout.id}
                    className="hover:bg-muted/30 transition-all border-b border-border/50 last:border-none"
                  >
                    <td className="px-8 py-6">
                      <p className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                        {payout.id.slice(0, 12)}
                      </p>
                    </td>
                    <td className="py-6">
                      <p className="text-[10px] font-black uppercase">
                        {format(new Date(payout.createdAt), "MMM dd, yyyy")}
                      </p>
                    </td>
                    <td className="py-6">
                      <p className="text-sm font-black tracking-tight">
                        ${Number(payout.amount).toFixed(2)}
                      </p>
                    </td>
                    <td className="py-6">
                      <span className="text-[9px] font-bold uppercase bg-muted px-2 py-1 rounded-md">
                        {payout.method}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span
                        className={`inline-flex items-center rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-tighter ${
                          payout.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                        }`}
                      >
                        {payout.status === "COMPLETED" ? (
                          <CheckCircle2 className="mr-1.5 h-3 w-3" />
                        ) : (
                          <AlertCircle className="mr-1.5 h-3 w-3" />
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
    </div>
  );
}
