import { formatDistanceToNow } from "date-fns"

interface Payment {
  id: string
  amount: number
  currency: string
  createdAt: Date
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
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold">Recent Payments</h3>
        <p className="text-sm text-muted-foreground">Latest transactions</p>
      </div>

      <div className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">No payments yet</p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                  <span className="text-sm font-medium">
                    {(payment.user.fullName || payment.user.username || "U").charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{payment.user.fullName || payment.user.username || "Unknown User"}</p>
                  <p className="text-sm text-muted-foreground">{payment.service?.name || "Unknown Service"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${Number(payment.amount).toFixed(2)} {payment.currency}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
