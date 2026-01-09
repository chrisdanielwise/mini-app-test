"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Zap } from "lucide-react"
import { hapticFeedback } from "@/lib/telegram/webapp"

interface ServiceTier {
  id: string
  name: string
  price: string // PRISMA 7: Decimal returned as string
  compareAtPrice?: string
  discountPercentage: number
  interval: string
  intervalCount: number
}

interface ServiceCardProps {
  id: string
  name: string
  description?: string
  currency: string
  tiers: ServiceTier[]
  merchantId: string
  className?: string
}

export function ServiceCard({
  id,
  name,
  description,
  currency,
  tiers,
  merchantId,
  className
}: ServiceCardProps) {

  // 1. Safety logic for calculating the "Starting At" price
  // We use parseFloat because Prisma 7 Decimals arrive as strings to prevent JS precision loss.
  const lowestTier = tiers.length > 0
    ? tiers.reduce((min, tier) =>
      parseFloat(tier.price) < parseFloat(min.price) ? tier : min
    )
    : null;

  const hasDiscount = tiers.some((t) => t.discountPercentage > 0);

  const handleClick = () => {
    hapticFeedback("light"); // Native Telegram interaction feel
  };

  if (!lowestTier) return null;

  return (

    <Link
      href={`/merchant/${merchantId}/service/${id}`}
      onClick={handleClick}
      className={cn(
        "group block rounded-2xl border border-border bg-card p-5 transition-all",
        "active:scale-[0.97] active:bg-muted/50",
        "hover:border-primary/30 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Header & Status */}
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black tracking-tight text-foreground uppercase italic">
              {name}
            </h3>
            {hasDiscount && (
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                PROMO
              </Badge>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          {/* Pricing Row */}
          <div className="flex flex-col gap-0.5 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-primary italic">
                {currency} {lowestTier.price}
              </span>
              {lowestTier.compareAtPrice && (
                <span className="text-xs text-muted-foreground line-through decoration-destructive/50">
                  {currency} {lowestTier.compareAtPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                PER {lowestTier.intervalCount > 1 ? lowestTier.intervalCount : ""} {lowestTier.interval}
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                <Zap className="h-2.5 w-2.5 fill-primary" />
                {tiers.length} PLANS
              </span>
            </div>
          </div>
        </div>

        {/* Action Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted/30 group-hover:bg-primary/10 transition-colors">
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}