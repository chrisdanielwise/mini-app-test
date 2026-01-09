"use client"

import { useTelegramContext } from "@/components/telegram/telegram-provider"
import { useApi } from "@/lib/hooks/use-api"
import { LoadingScreen } from "@/components/ui/loading-spinner"
import { SubscriptionCard } from "@/components/mini-app/subscription-card"
import { SkeletonList } from "@/components/ui/skeleton-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { hapticFeedback } from "@/lib/telegram/webapp"
import { Settings, HelpCircle, LogOut, ChevronRight, Star, UserCircle } from "lucide-react"
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
    price: string // Prisma 7: Decimal returned as string for JSON safety
  }
  merchant: {
    companyName?: string
    botUsername?: string
  }
}

export default function ProfilePage() {
  const { auth, isReady, user } = useTelegramContext()

  // Fetching via our secure useApi hook which handles JWT headers automatically
  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: Subscription[]
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null)

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Syncing profile..." />
  }

  const allSubscriptions = subscriptions?.subscriptions || []
  const isPremium = user?.is_premium

  const handleMenuClick = () => {
    hapticFeedback("light") // Native Telegram feel on interaction
  }

  const menuItems = [
    {
      icon: Settings,
      label: "Settings",
      description: "App preferences & alerts",
      href: "/profile/settings",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Contact merchant support",
      href: "/profile/support",
    },
  ]

  return (
    <div className="min-h-screen space-y-6 bg-background pb-20">
      {/* Profile Header */}

      <header className="border-b border-border bg-card/30 p-6 pt-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10 text-3xl font-bold text-primary shadow-inner">
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || <UserCircle className="h-10 w-10" />}
            </div>
            {isPremium && (
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-amber-500 shadow-lg">
                <Star className="h-4 w-4 fill-white text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                {user?.first_name} {user?.last_name}
              </h1>
            </div>
            {user?.username && <p className="text-sm font-medium text-muted-foreground">@{user.username}</p>}
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary">
              {auth.user?.role || "USER"} ACCOUNT
            </Badge>
          </div>
        </div>
      </header>

      <div className="space-y-8 px-4">
        {/* Active Subscriptions Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Your Subscriptions</h2>
            <Badge variant="secondary" className="rounded-md font-mono text-[10px]">
              {allSubscriptions.length} TOTAL
            </Badge>
          </div>

          {subsLoading ? (
            <SkeletonList count={2} />
          ) : allSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {allSubscriptions.map((sub) => (
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 py-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">You don't have any active services.</p>
              <Link href="/" className="mt-3 text-sm font-bold text-primary hover:underline">
                Browse Marketplace
              </Link>
            </div>
          )}
        </section>

        {/* Account Settings Menu */}

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Management</h2>
          <div className="grid gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleMenuClick}
                className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:scale-[1.01] hover:bg-muted/50 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/50 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* Danger Zone / Session Management */}
        <section className="pt-4">
          <Button
            variant="ghost"
            className="w-full justify-center rounded-2xl border border-destructive/20 bg-destructive/5 py-6 font-bold text-destructive hover:bg-destructive/10"
            onClick={() => {
              hapticFeedback("warning");
              auth.logout();
            }}
          >
            <LogOut className="mr-2 h-5 w-5" />
            End Current Session
          </Button>
          <p className="mt-4 text-center text-[10px] text-muted-foreground">
            Zipha Platform v2.4.0 • Build 2026.01
          </p>
        </section>
      </div>
    </div>
  )
}