"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Activity } from "lucide-react";
// 🛰️ INTEGRATION: Unified Identity Node link
import { useTelegramContext } from "@/components/telegram/telegram-provider";

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
 * 🛰️ TIER SELECTOR (Protocol V2.6)
 * Fixed: Optimized for safe-area containment and tactile feedback.
 */
export function TierSelector({ tiers, selectedTierId, onSelect, currency }: TierSelectorProps) {
  // 🏁 INITIALIZE CONTEXT: Link to Telegram Native Hardware
  const { hapticFeedback } = useTelegramContext();

  const sortedTiers = [...tiers].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  const handleSelection = (tierId: string) => {
    // ⚡ TACTILE HANDSHAKE: Trigger light haptic on selection shift
    if (tierId !== selectedTierId) {
      hapticFeedback("light");
    }
    onSelect(tierId);
  };

  return (
    <div className="grid gap-4 w-full">
      {sortedTiers.map((tier) => {
        const isSelected = tier.id === selectedTierId;
        const hasDiscount = tier.discountPercentage > 0;
        const isMostPopular = tier.name.toLowerCase().includes("popular") || tier.discountPercentage >= 20;

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => handleSelection(tier.id)}
            // 🛡️ Added: min-h and responsive padding to prevent content clipping
            className={cn(
              "group relative w-full overflow-hidden rounded-[2.5rem] border-2 p-6 text-left transition-all duration-500",
              "active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20",
              isSelected 
                ? "border-primary bg-primary/[0.04] shadow-[0_20px_40px_rgba(var(--primary-rgb),0.1)]" 
                : "border-border/40 bg-card/40 backdrop-blur-md hover:border-primary/20"
            )}
          >
            {/* 🏷️ Strategic "Optimal Node" Ribbon */}
            {isMostPopular && (
              <div className={cn(
                "absolute right-0 top-0 px-5 py-2 rounded-bl-3xl border-b border-l transition-colors duration-500",
                isSelected ? "bg-primary border-primary" : "bg-amber-500/10 border-amber-500/20"
              )}>
                <p className={cn(
                  "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em]",
                  isSelected ? "text-primary-foreground" : "text-amber-600"
                )}>
                  <Star className={cn("h-3 w-3 fill-current", isSelected && "animate-pulse")} />
                  Optimal Node
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-xl font-black uppercase tracking-tighter italic transition-colors duration-500",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {tier.name}
                  </span>
                  {hasDiscount && (
                    <Badge className="bg-emerald-500 text-white border-none rounded-xl text-[9px] font-black px-3 py-1 animate-in zoom-in duration-500">
                      -{tier.discountPercentage}% OFF
                    </Badge>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    "text-5xl font-black tracking-tighter italic leading-none transition-colors duration-500",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    <span className="text-sm align-top mr-1 opacity-40 italic">{currency}</span>
                    {tier.price}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all",
                    isSelected ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/30 border-border/40 text-muted-foreground/60"
                  )}>
                    <Zap className="h-3 w-3" />
                    {tier.intervalCount} {tier.interval} Epoch
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all",
                    isSelected ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-muted/30 border-border/40 text-muted-foreground/60"
                  )}>
                    <Activity className="h-3 w-3" />
                    {tier.type === "RECURRING" ? "Auto_Sync" : "One_Time"}
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-[1.25rem] border-2 transition-all duration-700",
                  isSelected 
                    ? "scale-110 border-primary bg-primary text-primary-foreground shadow-2xl shadow-primary/40 rotate-[360deg]" 
                    : "border-border/60 bg-muted/20 text-transparent",
                )}
              >
                <Check className="h-6 w-6 stroke-[4px]" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}