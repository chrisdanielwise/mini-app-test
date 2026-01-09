"use client"

import { useApi } from "@/lib/hooks/use-api"
import { useTelegramContext } from "@/components/telegram/telegram-provider"
import { LoadingScreen } from "@/components/ui/loading-spinner"
import { SkeletonList } from "@/components/ui/skeleton-card"
import { Badge } from "@/components/ui/badge"
import { Receipt, CheckCircle, XCircle, Clock, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface Payment {
  id: string
  amount: string // Prisma 7 Decimal returns as string for JSON safety
  currency: string
  status: "SUCCESS" | "FAILED" | "REJECTED" | "PENDING" | "REFUNDED"
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

  // Ensure we only fetch when authenticated. 
  // auth.isAuthenticated confirms we have a valid JWT.
  const { data, isLoading, error } = useApi<{ payments: Payment[] }>(
    auth.isAuthenticated ? "/api/user/payments" : null
  )

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Accessing ledger..." />
  }

  const payments = data?.payments || []

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "FAILED":
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-rose-500" />
      case "REFUNDED":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-amber-500" />
    }
  }

  const getStatusBadge = (status: Payment["status"]) => {
    const variants: Record<Payment["status"], string> = {
      SUCCESS: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      FAILED: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
      REJECTED: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
      PENDING: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
      REFUNDED: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    }

    return (
      <Badge variant="outline" className={cn("text-[10px] uppercase font-bold px-2 py-0", variants[status])}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen space-y-4 bg-background pb-10">
      {/* Header with Telegram Theme awareness */}
      <header className="sticky top-0 z-10 space-y-1 border-b border-border bg-background/80 p-4 backdrop-blur-md">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Payment History</h1>
        <p className="text-xs text-muted-foreground">Detailed logs of your digital service subscriptions</p>
      </header>

      {/* Main Content Area */}
      <main className="px-4">
        {isLoading ? (
          <SkeletonList count={6} />
        ) : error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">Unable to load transactions. Please try again.</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div 
                key={payment.id} 
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all active:scale-[0.98] active:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/50">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-semibold leading-none text-foreground">{payment.service.name}</h3>
                      <p className="text-xs font-medium text-muted-foreground">
                        {payment.merchant.companyName || "Service Provider"}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60">
                        {new Date(payment.createdAt).toLocaleString(undefined, {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-foreground">
                      {/* Currency formatting safety */}
                      {new Intl.NumberFormat(undefined, {
                        style: 'currency',
                        currency: payment.currency
                      }).format(parseFloat(payment.amount))}
                    </p>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-10 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No records found</h3>
            <p className="max-w-[200px] text-sm text-muted-foreground">
              Once you subscribe to a service, your history will be logged here.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}