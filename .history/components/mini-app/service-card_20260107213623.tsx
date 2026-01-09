"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

interface ServiceTier {
  id: string
  name: string
  price: string
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

export function ServiceCard({ id, name, description, currency, tiers, merchantId, className }: ServiceCardProps) {
  const lowestTier = tiers.reduce((min, tier) =>
    Number.parseFloat(tier.price) < Number.parseFloat(min.price) ? tier : min,
  )

  const hasDiscount = tiers.some((t) => t.discountPercentage > 0)

  return (
    <Link
      href={`/services/${merchantId}/${id}`}
      className={cn(
        "block rounded-xl border border-border bg-card p-4 transition-all active:scale-[0.98]",
        "hover:border-primary/50 hover:bg-card/80",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{name}</h3>
            {hasDiscount && (
              <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                Sale
              </Badge>
            )}
          </div>
          {description && <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-foreground">
              {currency} {lowestTier.price}
            </span>
            {lowestTier.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {currency} {lowestTier.compareAtPrice}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              / {lowestTier.intervalCount} {lowestTier.interval.toLowerCase()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {tiers.length} plan{tiers.length !== 1 && "s"} available
          </p>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" />
      </div>
    </Link>
  )
}
