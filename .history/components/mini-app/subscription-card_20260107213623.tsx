"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink } from "lucide-react"
import { openTelegramLink } from "@/lib/telegram/webapp"

interface SubscriptionCardProps {
  id: string
  status: string
  expiresAt: string
  inviteLink?: string
  service: {
    id: string
    name: string
    description?: string
  }
  tier?: {
    name: string
    price: string
  }
  merchant: {
    companyName?: string
    botUsername?: string
  }
  className?: string
}

export function SubscriptionCard({
  status,
  expiresAt,
  inviteLink,
  service,
  tier,
  merchant,
  className,
}: SubscriptionCardProps) {
  const isActive = status === "ACTIVE"
  const expiresDate = new Date(expiresAt)
  const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysLeft <= 3 && daysLeft > 0

  const handleJoinChannel = () => {
    if (inviteLink) {
      openTelegramLink(inviteLink)
    }
  }

  return (
    <div className={cn("rounded-xl border bg-card p-4", isActive ? "border-success/30" : "border-border", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{service.name}</h3>
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={cn("text-xs", isActive ? "bg-success text-success-foreground" : "")}
            >
              {status}
            </Badge>
          </div>

          {merchant.companyName && <p className="text-sm text-muted-foreground">by {merchant.companyName}</p>}

          {tier && <p className="text-sm text-muted-foreground">Plan: {tier.name}</p>}

          <div className="flex items-center gap-1.5 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {isActive ? (
              <span className={cn(isExpiringSoon && "text-warning")}>
                {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left` : "Expires today"}
              </span>
            ) : (
              <span className="text-muted-foreground">Expired {expiresDate.toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {isActive && inviteLink && (
          <Button size="sm" variant="secondary" onClick={handleJoinChannel} className="shrink-0">
            <ExternalLink className="mr-1.5 h-4 w-4" />
            Join
          </Button>
        )}
      </div>
    </div>
  )
}
