"use client"

import { useTelegramContext } from "@/components/telegram/telegram-provider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UserSettingsPage() {
  const { isReady, user } = useTelegramContext()

  if (!isReady) return null

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold tracking-tight">App Settings</h1>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Bell className="h-4 w-4" />
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <Label>Subscription Alerts</Label>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            <Shield className="h-4 w-4" />
            Account Data
          </h2>
          <p className="text-xs text-muted-foreground italic">
            Connected as @{user?.username || user?.id}
          </p>
        </div>
      </div>
    </div>
  )
}