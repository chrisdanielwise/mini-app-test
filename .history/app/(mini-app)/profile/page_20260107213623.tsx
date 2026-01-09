"use client"

import { useTelegramContext } from "@/components/telegram/telegram-provider"
import { useApi } from "@/lib/hooks/use-api"
import { LoadingScreen } from "@/components/ui/loading-spinner"
import { SubscriptionCard } from "@/components/mini-app/subscription-card"
import { SkeletonList } from "@/components/ui/skeleton-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, HelpCircle, LogOut, ChevronRight, Star } from "lucide-react"

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

export default function ProfilePage() {
  const { auth, isReady, user } = useTelegramContext()

  const { data: subscriptions, isLoading: subsLoading } = useApi<{
    subscriptions: Subscription[]
  }>(auth.isAuthenticated ? "/api/user/subscriptions" : null)

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Loading profile..." />
  }

  const allSubscriptions = subscriptions?.subscriptions || []
  const isPremium = user?.is_premium

  const menuItems = [
    {
      icon: Settings,
      label: "Settings",
      description: "Notifications and preferences",
      href: "/settings",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help with your account",
      href: "/support",
    },
  ]

  return (
    <div className="space-y-6 p-4">
      {/* Profile Header */}
      <header className="pt-2">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <span className="text-2xl font-bold text-primary">
              {(user?.first_name || auth.user?.fullName)?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground">
                {user?.first_name} {user?.last_name}
              </h1>
              {isPremium && (
                <Badge className="bg-warning/20 text-warning">
                  <Star className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>
            {user?.username && <p className="text-sm text-muted-foreground">@{user.username}</p>}
            <Badge variant="secondary" className="mt-1 text-xs">
              {auth.user?.role || "USER"}
            </Badge>
          </div>
        </div>
      </header>

      {/* All Subscriptions */}
      <section>
        <h2 className="mb-3 font-semibold text-foreground">All Subscriptions</h2>

        {subsLoading ? (
          <SkeletonList count={2} />
        ) : allSubscriptions.length > 0 ? (
          <div className="space-y-3">
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
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">No subscriptions yet</p>
          </div>
        )}
      </section>

      {/* Menu */}
      <section>
        <h2 className="mb-3 font-semibold text-foreground">Account</h2>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-card/80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <item.icon className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <section>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => auth.logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </section>
    </div>
  )
}
