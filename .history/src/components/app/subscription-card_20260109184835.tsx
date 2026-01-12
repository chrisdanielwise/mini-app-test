"use client"

import { cn } from "@/src/lib/utils"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Clock, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react"
import { openTelegramLink, hapticFeedback } from "@/src/lib/telegram/webapp"

interface SubscriptionCardProps {
  id: string
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING"
  expiresAt: string // ISO String from Prisma 7
  inviteLink?: string
  service: {
    id: string
    name: string
    description?: string
  }
  tier?: {
    name: string
    price: string // Stringified Decimal
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
  
  // Logic: Calculate relative days for urgency UI
  const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = isActive && daysLeft <= 3 && daysLeft > 0

  const handleJoinChannel = () => {
    hapticFeedback("medium") // Tactile confirmation
    if (inviteLink) {
      openTelegramLink(inviteLink)
    }
  }

  return (
    
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card p-5 transition-all shadow-sm",
        isActive 
          ? "border-emerald-500/20 bg-emerald-500/[0.02]" 
          : "border-border grayscale-[0.5]",
        className
      )}
    >
      {/* Decorative Status Bar */}
      <div className={cn(
        "absolute left-0 top-0 h-full w-1",
        isActive ? "bg-emerald-500" : "bg-muted-foreground/30"
      )} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Service & Status */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase tracking-tight text-foreground">
                {service.name}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-bold border-none px-1.5 h-5",
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                {status}
              </Badge>
            </div>
            {merchant.companyName && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">
                PROV: {merchant.companyName}
              </p>
            )}
          </div>

          {/* Plan Info */}
          {tier && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-medium text-foreground">
                {tier.name} <span className="text-muted-foreground mx-1">•</span> ${tier.price}
              </p>
            </div>
          )}

          {/* Expiration Logic */}
          <div className="flex items-center gap-2">
            {isExpiringSoon ? (
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <p className={cn(
              "text-xs font-semibold",
              isExpiringSoon ? "text-amber-500 animate-pulse" : "text-muted-foreground"
            )}>
              {isActive ? (
                daysLeft > 0 ? `${daysLeft} days remaining` : "Access expires today"
              ) : (
                `Expired on ${expiresDate.toLocaleDateString()}`
              )}
            </p>
          </div>
        </div>

        {/* Action: Join/Invite */}
        {isActive && inviteLink && (
          <Button 
            size="sm" 
            onClick={handleJoinChannel} 
            className="h-10 rounded-xl bg-primary px-4 font-bold shadow-lg shadow-primary/20 active:scale-95"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            OPEN
          </Button>
        )}
      </div>
    </div>
  )
}