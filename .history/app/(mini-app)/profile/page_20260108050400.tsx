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
    price: string 
  }
  merchant: {
    companyName?: string
    botUsername?: string
  }
}

export default function ProfilePage() {
  const { auth, isReady, user } = useTelegramContext()

  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: Subscription[]
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null)

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Syncing profile..." />
  }

  const allSubscriptions = subscriptions?.subscriptions || []
  const isPremium = user?.is_premium

  const handleMenuClick = () => {
    hapticFeedback("light")
  }

  // UPDATED: href now points to /profile/preferences to avoid folder conflict
  const menuItems = [
    {
      icon: Settings,
      label: "Settings",
      description: "App preferences & alerts",
      href: "/profile/preferences", 
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Contact merchant support",
      href: "/dashboard/support", 
    },
  ]

  return (
    <div className="min-h-screen space-y-6 bg-background pb-20">
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
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              {user?.first_name} {user?.last_name}
            </h1>
            {user?.username && <p className="text-sm font-medium text-muted-foreground">@{user.username}</p>}
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px] font-bold uppercase tracking-wider text-primary">
              {auth.user?.role || "USER"} ACCOUNT
            </Badge>
          </div>
        </div>
      </header>

      <div className="space-y-8 px-4">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Your Subscriptions</h2>
          {subsLoading ? (
            <SkeletonList count={2} />
          ) : allSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {allSubscriptions.map((sub) => (
                <SubscriptionCard key={sub.id} {...sub} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 py-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">No active services.</p>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Management</h2>
          <div className="grid gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleMenuClick}
                className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary group-hover:bg-primary/10 group-hover:text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-4">
          <Button
            variant="ghost"
            className="w-full rounded-2xl border border-destructive/20 bg-destructive/5 py-6 font-bold text-destructive hover:bg-destructive/10"
            onClick={() => auth.logout()}
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