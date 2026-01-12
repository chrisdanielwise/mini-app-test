"use client"

import { useTelegramContext } from "@/src/components/telegram/telegram-provider"
import { Button } from "@/src/components/ui/button"
import { ArrowLeft, MessageSquare, ExternalLink, LifeBuoy } from "lucide-react"
import Link from "next/link"

export default function UserSupportPage() {
  const { isReady } = useTelegramContext()

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
        <h1 className="text-xl font-bold tracking-tight">Help & Support</h1>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <LifeBuoy className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="font-bold text-lg">Need Assistance?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our support team is available via Telegram to help you with signals, subscriptions, or technical issues.
            </p>
          </div>
          
          <Button className="w-full rounded-xl h-12 font-bold gap-2" asChild>
            <a href="https://t.me/your_support_bot" target="_blank" rel="noreferrer">
              <MessageSquare className="h-5 w-5" />
              Contact Support
              <ExternalLink className="h-4 w-4 opacity-50" />
            </a>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Common Topics</h3>
          <ul className="text-sm space-y-3">
            <li className="flex items-center justify-between opacity-70">
              <span>How to join the signals channel?</span>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li className="flex items-center justify-between opacity-70">
              <span>Subscription renewal guide</span>
              <ChevronRight className="h-4 w-4" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Adding missing Lucide import for the list
import { ChevronRight } from "lucide-react"