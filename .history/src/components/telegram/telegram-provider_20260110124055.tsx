"use client";

import { cn } from "@/src/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { Check, Star, Zap, Activity } from "lucide-react";

interface Tier {
  id: string;
  name: string;
  price: string;
  compareAtPrice?: string;
  discountPercentage: number;
  interval: string;
  intervalCount: number;
  type: string;
}

interface TierSelectorProps {
  tiers: Tier[];
  selectedTierId: string | null;
  onSelect: (tierId: string) => void;
  currency: string;
}

/**
 * 🛰️ RESOURCE TIER SELECTOR (Apex Tier)
 * Strategic selection node for capital allocation.
 * Optimized for high-density mobile viewports.
 */
export function TierSelector({ tiers, selectedTierId, onSelect, currency }: TierSelectorProps) {
  // Sort tiers: Provides a logical "ladder" of value
  const sortedTiers = [...tiers].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  return (
    <div className="grid gap-4">
      {sortedTiers.map((tier) => {
        const isSelected = tier.id === selectedTierId;
        const hasDiscount = tier.discountPercentage > 0;
        const isMostPopular = tier.name.toLowerCase().includes("popular") || tier.discountPercentage >= 20;

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onSelect(tier.id)}
            className={cn(
              "group relative w-full overflow-hidden rounded-[2rem] border-2 p-6 text-left transition-all duration-500",
              "active:scale-[0.97]",
              isSelected 
                ? "border-primary bg-primary/[0.04] shadow-[0_20px_40px_rgba(var(--primary-rgb),0.1)] ring-8 ring-primary/[0.02]" 
                : "border-border/40 bg-card/40 backdrop-blur-md hover:border-primary/20"
            )}
          >
            {/* 🏷️ Strategic "Best Value" Ribbon */}
            {isMostPopular && (
              <div className={cn(
                "absolute right-0 top-0 px-4 py-1.5 rounded-bl-2xl border-b border-l transition-colors duration-500",
                isSelected ? "bg-primary border-primary" : "bg-amber-500/10 border-amber-500/20"
              )}>
                <p className={cn(
                  "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest",
                  isSelected ? "text-primary-foreground" : "text-amber-600"
                )}>
                  <Star className={cn("h-3 w-3 fill-current", isSelected && "animate-pulse")} />
                  Optimal Node
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-3">
                
                {/* Identity & Badge Cluster */}
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-lg font-black uppercase tracking-tighter italic transition-colors duration-500",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {tier.name}
                  </span>
                  
                  {hasDiscount && (
                    <Badge className="bg-emerald-500 text-white border-none rounded-lg text-[8px] font-black px-3 py-1 animate-in zoom-in duration-500">
                      -{tier.discountPercentage}% OFF
                    </Badge>
                  )}
                </div>

                {/* Pricing Architecture */}
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    "text-4xl font-black tracking-tighter italic leading-none transition-colors duration-500",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    <span className="text-sm align-top mr-1 opacity-40">{currency}</span>
                    {tier.price}
                  </span>
                  
                  {tier.compareAtPrice && (
                    <span className="text-xs font-black text-muted-foreground/30 line-through tracking-widest">
                      {currency}{tier.compareAtPrice}
                    </span>
                  )}
                </div>

                {/* Telemetry Footnote */}
                <div className="flex items-center gap-2 pt-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest",
                    isSelected ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/30 border-border/40 text-muted-foreground/60"
                  )}>
                    <Zap className="h-2.5 w-2.5" />
                    {tier.intervalCount} {tier.interval} Epoch
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest",
                    isSelected ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-muted/30 border-border/40 text-muted-foreground/60"
                  )}>
                    <Activity className="h-2.5 w-2.5" />
                    {tier.type === "RECURRING" ? "Auto_Sync" : "One_Time"}
                  </div>
                </div>
              </div>

              {/* Selection Physics Indicator */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-500",
                  isSelected 
                    ? "scale-110 border-primary bg-primary text-primary-foreground shadow-2xl shadow-primary/40 rotate-[360deg]" 
                    : "border-border/60 bg-muted/20 text-transparent",
                )}
              >
                <Check className="h-5 w-5 stroke-[4px]" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}