"use client"

import { useTelegramContext } from "@/components/telegram/telegram-provider"
import { useApi } from "@/lib/hooks/use-api"
import { LoadingScreen } from "@/components/ui/loading-spinner"
import { SubscriptionCard } from "@/components/mini-app/subscription-card"
import { SkeletonList } from "@/components/ui/skeleton-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { hapticFeedback } from "@/lib/telegram/webapp"
import { ArrowRight, Sparkles, ShoppingBag, Bell, Wallet } from "lucide-react"
import Link from "next/link"

interface Subscription {
  id: string
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING"
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
    price: string // Prisma 7: Decimal returned as string for precision
  }
  merchant: {
    companyName?: string
    botUsername?: string
  }
}

export default function HomePage() {
  const { auth, isReady, user } = useTelegramContext()

  // 1. Fetching logic - useApi handles the Bearer JWT token automatically
  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: Subscription[]
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null)

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Establishing secure link..." />
  }

  // 2. Auth Guard with actionable UI
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center bg-background">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-destructive/20" />
          <div className="relative rounded-full bg-destructive/10 p-5 border border-destructive/20">
            <Bell className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight uppercase italic">Access Denied</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This session is not verified by Telegram. Please launch the app via the official bot to sync your ledger.
          </p>
        </div>
      </div>
    )
  }

  const activeSubscriptions = subscriptions?.subscriptions?.filter((s) => s.status === "ACTIVE") || []

  return (
    <div className="min-h-screen space-y-8 bg-background pb-20">
      {/* Header with Dynamic Greetings */}
      <header className="p-6 pt-10 border-b border-border bg-card/30">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border-2 border-primary/20 text-xl font-black text-primary italic shadow-lg">
            {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="text-xl font-black tracking-tight truncate uppercase">
              Hi, {user?.first_name || auth.user?.fullName?.split(" ")[0] || "User"}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {activeSubscriptions.length} Active Services
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 space-y-8">
        {/* Quick Actions Grid */}
        
        <section className="grid grid-cols-2 gap-4">
          <Link
            href="/services"
            onClick={() => hapticFeedback("light")}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-primary/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Marketplace</span>
          </Link>
          <Link
            href="/history"
            onClick={() => hapticFeedback("light")}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-foreground/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 text-foreground group-hover:bg-muted/80">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Ledger</span>
          </Link>
        </section>

        {/* Active Subscriptions List */}
        
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">Current Services</h2>
            {activeSubscriptions.length > 0 && (
              <Badge variant="outline" className="font-mono text-[10px] border-emerald-500/20 text-emerald-500">
                LATEST
              </Badge>
            )}
          </div>

          {subsLoading ? (
            <SkeletonList count={2} />
          ) : activeSubscriptions.length > 0 ? (
            <div className="space-y-4">
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
                  <Button variant="outline" className="w-full rounded-xl border-dashed py-6 font-bold uppercase tracking-widest hover:bg-muted/50">
                    View All Subscriptions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/30 p-10 text-center">
              <Sparkles className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Digital Vault Empty</h3>
              <p className="mb-6 mt-1 text-xs text-muted-foreground">Subscribe to a service to unlock premium content.</p>
              <Link href="/services">
                <Button className="rounded-xl px-8 font-black uppercase italic shadow-lg shadow-primary/20">
                  Explore Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}