import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface Payment {
  id: string
  amount: string // PRISMA 7: Changed from number to string for Decimal safety
  currency: string
  createdAt: string // Changed from Date to string (ISO format for client-side)
  user: {
    fullName: string | null
    username: string | null
  }
  service: {
    name: string
  } | null
}

interface RecentPaymentsProps {
  payments: Payment[]
  className?: string
}

export function RecentPayments({ payments, className }: RecentPaymentsProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card shadow-sm", className)}>
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-bold tracking-tight">Recent Payments</h3>
        <p className="text-sm text-muted-foreground">Latest verified transactions across your services</p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/50 mb-3 flex items-center justify-center">
                <span className="text-muted-foreground">Ø</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">No transaction history found</p>
            </div>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="group flex items-center justify-between transition-all hover:bg-muted/30 -mx-2 px-2 py-1 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar with dynamic styling */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-black text-primary italic">
                    {(payment.user.fullName || payment.user.username || "U").charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold leading-none text-foreground">
                      {payment.user.fullName || payment.user.username || "Legacy User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payment.service?.name || "Uncategorized Service"}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <p className="text-sm font-black text-foreground">
                    {/* Safe parsing of the Decimal string */}
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency || 'USD',
                    }).format(parseFloat(payment.amount))}
                  </p>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-tighter">
                    {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}