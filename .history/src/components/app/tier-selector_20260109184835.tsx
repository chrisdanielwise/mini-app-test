"use client"

import { cn } from "@/src/lib/utils"
import { Badge } from "@/src/components/ui/badge"
import { Check, Star } from "lucide-react"

interface Tier {
  id: string
  name: string
  price: string // PRISMA 7: Stringified Decimal for high precision
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
  // Sort tiers by price (lowest to highest) to provide a predictable UI flow
  const sortedTiers = [...tiers].sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

  return (
    <div className="grid gap-3">
      {sortedTiers.map((tier) => {
        const isSelected = tier.id === selectedTierId
        const hasDiscount = tier.discountPercentage > 0
        const isMostPopular = tier.name.toLowerCase().includes("popular") || tier.discountPercentage >= 20

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onSelect(tier.id)}
            className={cn(
              "relative w-full overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-200",
              "active:scale-[0.98]",
              isSelected 
                ? "border-primary bg-primary/[0.03] ring-4 ring-primary/5" 
                : "border-border bg-card hover:border-primary/30"
            )}
          >
            {/* Highlight for high-value tiers */}
            {isMostPopular && !isSelected && (
              <div className="absolute right-0 top-0 rounded-bl-xl bg-amber-500/10 px-2 py-1">
                <p className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-amber-600">
                  <Star className="h-2 w-2 fill-amber-600" /> Best Value
                </p>
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-black uppercase tracking-tight italic",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {tier.name}
                  </span>
                  
                  {hasDiscount && (
                    <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-500">
                      SAVE {tier.discountPercentage}%
                    </Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    "text-2xl font-black tracking-tighter italic",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {currency} {tier.price}
                  </span>
                  
                  {tier.compareAtPrice && (
                    <span className="text-sm font-medium text-muted-foreground/60 line-through decoration-destructive/40">
                      {currency} {tier.compareAtPrice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    FOR {tier.intervalCount} {tier.interval.toLowerCase()}{tier.intervalCount > 1 ? "S" : ""}
                  </p>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                    {tier.type === "RECURRING" ? "Auto-Renew" : "One-Time"}
                  </p>
                </div>
              </div>

              {/* Selection Indicator */}
              <div
                className={cn(
                  "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isSelected 
                    ? "scale-110 border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "border-muted-foreground/30 bg-transparent",
                )}
              >
                {isSelected && <Check className="h-4 w-4 stroke-[3px]" />}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}