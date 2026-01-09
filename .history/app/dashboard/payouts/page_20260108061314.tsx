import { requireMerchantSession } from "@/lib/auth/merchant-auth"
import { MerchantService } from "@/lib/services/merchant.service"
import { Button } from "@/components/ui/button"
import { 
  Wallet, 
  ArrowUpRight, 
  CheckCircle2, 
  Banknote,
  AlertCircle,
  Clock
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default async function PayoutsPage() {
  const session = await requireMerchantSession()
  
  // This service method must fetch from the 'payout_requests' table
  const { balance, payouts } = await MerchantService.getPayoutData(session.merchant.id)

  return (
    <div className="space-y-8 p-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">Payouts</h1>
          <p className="text-sm text-muted-foreground">Manage your earnings and signal revenue withdrawals.</p>
        </div>
        <Button className="rounded-xl font-bold bg-primary h-11 px-6 shadow-lg shadow-primary/20">
          <Banknote className="mr-2 h-4 w-4" /> Request Payout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available to Withdraw</p>
            <p className="text-4xl font-black text-foreground">${balance.available}</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Wallet className="h-7 w-7 text-primary" />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-muted/30 p-8 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Escrow</p>
            <p className="text-4xl font-black text-muted-foreground">${balance.pending}</p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
            <Clock className="h-7 w-7 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase italic flex items-center gap-2 px-1">
          <ArrowUpRight className="h-4 w-4 text-primary" />
          Withdrawal History
        </h2>
        
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold uppercase text-[10px]">Reference</TableHead>
                <TableHead className="font-bold uppercase text-[10px]">Amount</TableHead>
                <TableHead className="font-bold uppercase text-[10px]">Method</TableHead>
                <TableHead className="font-bold uppercase text-[10px]">Status</TableHead>
                <TableHead className="font-bold uppercase text-[10px] text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic uppercase text-xs font-bold">
                    No payout history found
                  </TableCell>
                </TableRow>
              ) : (
                payouts.map((payout: any) => (
                  <TableRow key={payout.id} className="hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
                    <td className="px-6 py-4 font-mono text-[10px] text-muted-foreground">
                      {payout.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-black">
                      ${payout.amount.toString()}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-black uppercase">
                      {payout.destination || "Bank Transfer"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={payout.status === "PAID" ? "default" : "secondary"}
                        className={payout.status === "PAID" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}
                      >
                        {payout.status === "PAID" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
                        {payout.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-xs font-medium text-muted-foreground">
                      {format(new Date(payout.createdAt), "MMM dd, yyyy")}
                    </td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}