"use client"

import { useApi } from "@/lib/hooks/use-api"
import { useTelegramContext } from "@/components/telegram/telegram-provider"
import { LoadingScreen } from "@/components/ui/loading-spinner"
import { SkeletonList } from "@/components/ui/skeleton-card"
import { Badge } from "@/components/ui/badge"
import { Receipt, CheckCircle, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Payment {
  id: string
  amount: string
  currency: string
  status: string
  gatewayProvider: string
  createdAt: string
  service: {
    name: string
  }
  merchant: {
    companyName?: string
  }
}

export default function HistoryPage() {
  const { auth, isReady } = useTelegramContext()

  const { data, isLoading } = useApi<{ payments: Payment[] }>(auth.isAuthenticated ? "/api/user/payments" : null)

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Loading history..." />
  }

  const payments = data?.payments || []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "FAILED":
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-warning" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      SUCCESS: "bg-success/20 text-success",
      FAILED: "bg-destructive/20 text-destructive",
      REJECTED: "bg-destructive/20 text-destructive",
      PENDING: "bg-warning/20 text-warning",
      REFUNDED: "bg-muted text-muted-foreground",
    }

    return <Badge className={cn("text-xs", variants[status] || variants.PENDING)}>{status}</Badge>
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <header className="space-y-1 pt-2">
        <h1 className="text-xl font-bold text-foreground">Payment History</h1>
        <p className="text-sm text-muted-foreground">Your recent transactions</p>
      </header>

      {/* Payments List */}
      <section>
        {isLoading ? (
          <SkeletonList count={5} />
        ) : payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getStatusIcon(payment.status)}</div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">{payment.service.name}</h3>
                      {payment.merchant.companyName && (
                        <p className="text-sm text-muted-foreground">{payment.merchant.companyName}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {payment.currency} {payment.amount}
                    </p>
                    <div className="mt-1">{getStatusBadge(payment.status)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <Receipt className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="font-medium text-foreground">No payments yet</h3>
            <p className="text-sm text-muted-foreground">Your payment history will appear here</p>
          </div>
        )}
      </section>
    </div>
  )
}
