"use client"

import { useTelegramContext } from "@/components/telegram/telegram-provider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UserPreferencesPage() {
  const { isReady, user } = useTelegramContext()

  if (!isReady) return null

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold tracking-tight">App Preferences</h1>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Bell className="h-4 w-4" />
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Subscription Alerts</Label>
              <p className="text-[10px] text-muted-foreground">Notify me before a service expires</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Shield className="h-4 w-4" />
            Privacy & Data
          </h2>
          <p className="text-xs text-muted-foreground italic">
            Your Telegram ID ({user?.id}) is used to manage your secure access to services.
          </p>
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground pt-10">
        Preferences • Zipha Platform v2.4.0
      </p>
    </div>
  )
}