"use client"

import { useTelegramContext } from "@/components/telegram/telegram-provider"
import { useApi } from "@/lib/hooks/use-api"
import { LoadingScreen } from "@/components/ui/loading-spinner"
import { SubscriptionCard } from "@/components/mini-app/subscription-card"
import { SkeletonList } from "@/components/ui/skeleton-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, ShoppingBag, Bell } from "lucide-react"
import Link from "next/link"

interface Subscription {
  id: string
  status: string
  startsAt: string
  expiresAt: string
  inviteLink?: string
  service: {
    id: string
    name: string
    description?: string
  }
  tier?: {
    id: string
    name: string
    price: string
  }
  merchant: {
    companyName?: string
    botUsername?: string
  }
}

export default function HomePage() {
  const { auth, isReady, user } = useTelegramContext()

  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: Subscription[]
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null)

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Connecting..." />
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-destructive/20 p-4">
          <Bell className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-xl font-bold">Authentication Required</h1>
        <p className="text-muted-foreground">Please open this app from Telegram to continue.</p>
      </div>
    )
  }

  const activeSubscriptions = subscriptions?.subscriptions?.filter((s) => s.status === "ACTIVE") || []

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <header className="pt-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <span className="text-lg font-bold text-primary">
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h1 className="font-semibold text-foreground">
              Welcome back, {user?.first_name || auth.user?.fullName?.split(" ")[0] || "User"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {activeSubscriptions.length} active subscription
              {activeSubscriptions.length !== 1 && "s"}
            </p>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-3">
        <Link
          href="/services"
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card/80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium">Browse Services</span>
        </Link>
        <Link
          href="/history"
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card/80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Sparkles className="h-5 w-5 text-foreground" />
          </div>
          <span className="text-sm font-medium">Payment History</span>
        </Link>
      </section>

      {/* Active Subscriptions */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">My Subscriptions</h2>
          {activeSubscriptions.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeSubscriptions.length} Active
            </Badge>
          )}
        </div>

        {subsLoading ? (
          <SkeletonList count={2} />
        ) : activeSubscriptions.length > 0 ? (
          <div className="space-y-3">
            {activeSubscriptions.slice(0, 3).map((sub) => (
              <SubscriptionCard
                key={sub.id}
                id={sub.id}
                status={sub.status}
                expiresAt={sub.expiresAt}
                inviteLink={sub.inviteLink}
                service={sub.service}
                tier={sub.tier}
                merchant={sub.merchant}
              />
            ))}
            {activeSubscriptions.length > 3 && (
              <Link href="/profile">
                <Button variant="ghost" className="w-full">
                  View all subscriptions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="font-medium text-foreground">No active subscriptions</h3>
            <p className="mb-4 text-sm text-muted-foreground">Browse available services to get started</p>
            <Link href="/services">
              <Button>
                Browse Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
