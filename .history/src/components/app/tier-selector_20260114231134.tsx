"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Activity } from "lucide-react";
import { useTelegramContext } from "@/components/providers/telegram-provider";

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
 * 🛰️ TIER SELECTOR (Apex Tier)
 * Normalized: Fluid typography scales prices to prevent horizontal container breakage.
 * Optimized: Adaptive safe-zones and institutional haptics for mobile staff.
 */
export function TierSelector({ tiers, selectedTierId, onSelect, currency }: TierSelectorProps) {
  const { hapticFeedback } = useTelegramContext();

  const sortedTiers = [...tiers].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  const handleSelection = (tierId: string) => {
    if (tierId !== selectedTierId) {
      hapticFeedback("light");
    }
    onSelect(tierId);
  };

  return (
    <div className="grid gap-3 md:gap-4 w-full min-w-0">
      {sortedTiers.map((tier) => {
        const isSelected = tier.id === selectedTierId;
        const hasDiscount = tier.discountPercentage > 0;
        const isMostPopular = tier.name.toLowerCase().includes("popular") || tier.discountPercentage >= 20;

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => handleSelection(tier.id)}
            className={cn(
              "group relative w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border-2 p-5 md:p-6 text-left transition-all duration-500",
              "active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20",
              isSelected 
                ? "border-primary bg-primary/[0.04] shadow-xl md:shadow-2xl" 
                : "border-border/40 bg-card/40 backdrop-blur-3xl hover:border-primary/20"
            )}
          >
            {/* 🏷️ Strategic "Optimal Node" Ribbon */}
            {isMostPopular && (
              <div className={cn(
                "absolute right-0 top-0 px-3 md:px-5 py-1.5 md:py-2 rounded-bl-2xl md:rounded-bl-3xl border-b border-l transition-colors duration-500 z-20",
                isSelected ? "bg-primary border-primary" : "bg-amber-500/10 border-amber-500/20"
              )}>
                <p className={cn(
                  "flex items-center gap-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em]",
                  isSelected ? "text-primary-foreground" : "text-amber-600"
                )}>
                  <Star className={cn("h-2.5 w-2.5 md:h-3 md:w-3 fill-current", isSelected && "animate-pulse")} />
                  <span className="truncate">Optimal Node</span>
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 md:gap-4 relative z-10">
              <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <span className={cn(
                    "text-lg md:text-xl font-black uppercase tracking-tighter italic transition-colors duration-500 truncate max-w-[140px] md:max-w-none",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {parseFloat(tier.price).toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 shrink-0">
                      -{tier.discountPercentage}%
                    </Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-1 md:gap-2 min-w-0">
                  <span className={cn(
                    "font-black tracking-tighter italic leading-none transition-colors duration-500 whitespace-nowrap",
                    // FLUID TYPOGRAPHY: Scale based on viewport
                    "text-[clamp(1.75rem,8vw,3rem)]",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    <span className="text-[10px] md:text-sm align-top mr-1 opacity-30 italic">{currency}</span>
                    {tier.price}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-xl border text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all",
                    isSelected ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/30 border-border/10 text-muted-foreground/40"
                  )}>
                    <Zap className="h-2.5 w-2.5 md:h-3 md:w-3 shrink-0" />
                    <span className="whitespace-nowrap">{tier.intervalCount} {tier.interval} Epoch</span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-xl border text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all",
                    isSelected ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-muted/30 border-border/10 text-muted-foreground/40"
                  )}>
                    <Activity className="h-2.5 w-2.5 md:h-3 md:w-3 shrink-0" />
                    <span className="whitespace-nowrap">{tier.type === "RECURRING" ? "Auto_Sync" : "One_Time"}</span>
                  </div>
                </div>
              </div>

              {/* TACTILE SELECTION INDICATOR */}
              <div
                className={cn(
                  "flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl md:rounded-[1.25rem] border-2 transition-all duration-700",
                  isSelected 
                    ? "scale-110 border-primary bg-primary text-primary-foreground shadow-xl md:shadow-2xl shadow-primary/30 rotate-[360deg]" 
                    : "border-border/40 bg-muted/10 text-transparent",
                )}
              >
                <Check className="h-5 w-5 md:h-6 md:w-6 stroke-[4px]" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}