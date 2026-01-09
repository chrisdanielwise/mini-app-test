"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface Tier {
  id: string
  name: string
  price: string
  compareAtPrice?: string
  discountPercentage: number
  interval: string
  intervalCount: number
  type: string
}

interface TierSelectorProps {
  tiers: Tier[]
  selectedTierId: string | null
  onSelect: (tierId: string) => void
  currency: string
}

export function TierSelector({ tiers, selectedTierId, onSelect, currency }: TierSelectorProps) {
  return (
    <div className="space-y-3">
      {tiers.map((tier) => {
        const isSelected = tier.id === selectedTierId
        const hasDiscount = tier.discountPercentage > 0

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onSelect(tier.id)}
            className={cn(
              "w-full rounded-xl border p-4 text-left transition-all",
              isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{tier.name}</span>
                  {hasDiscount && (
                    <Badge className="bg-success/20 text-success text-xs">{tier.discountPercentage}% OFF</Badge>
                  )}
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    {currency} {tier.price}
                  </span>
                  {tier.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {currency} {tier.compareAtPrice}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.intervalCount} {tier.interval.toLowerCase()}
                  {tier.intervalCount > 1 ? "s" : ""} access
                </p>
              </div>

              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground",
                )}
              >
                {isSelected && <Check className="h-4 w-4" />}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
