"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Activity, ShieldCheck } from "lucide-react";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

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
 * 🌊 FLUID TIER SELECTOR (Institutional v16.16.12)
 * Logic: Haptic-synced resource allocation with kinetic selection ingress.
 * Design: v9.9.2 Hyper-Glass with Fluid Typography.
 */
export function TierSelector({ tiers, selectedTierId, onSelect, currency }: TierSelectorProps) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";

  const sortedTiers = React.useMemo(() => 
    [...tiers].sort((a, b) => parseFloat(a.price) - parseFloat(b.price)),
  [tiers]);

  const handleSelection = (tierId: string) => {
    if (tierId !== selectedTierId) {
      impact("light"); // 🏁 TACTILE SYNC: Micro-tick on allocation change
    }
    onSelect(tierId);
  };

  return (
    <div className="grid gap-4 md:gap-6 w-full min-w-0">
      {sortedTiers.map((tier, index) => {
        const isSelected = tier.id === selectedTierId;
        const hasDiscount = tier.discountPercentage > 0;
        const isOptimal = tier.discountPercentage >= 20 || tier.name.toLowerCase().includes("popular");

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => handleSelection(tier.id)}
            style={{ animationDelay: `${index * 50}ms` }}
            className={cn(
              "group relative w-full overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border-2 p-6 md:p-8 text-left transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] animate-in fade-in slide-in-from-bottom-4",
              "focus:outline-none focus:ring-4 focus:ring-primary/10",
              isSelected 
                ? (isStaff ? "border-amber-500 bg-amber-500/[0.04] shadow-2xl scale-[1.02]" : "border-primary bg-primary/[0.04] shadow-2xl scale-[1.02]") 
                : "border-white/5 bg-card/40 backdrop-blur-3xl hover:border-white/20 active:scale-[0.98]"
            )}
          >
            {/* 🏷️ OPTIMAL NODE RIBBON */}
            {isOptimal && (
              <div className={cn(
                "absolute right-0 top-0 px-6 py-2 rounded-bl-[2rem] border-b border-l transition-all duration-700 z-20 italic",
                isSelected 
                  ? (isStaff ? "bg-amber-500 border-amber-500" : "bg-primary border-primary") 
                  : "bg-white/5 border-white/10"
              )}>
                <p className={cn(
                  "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]",
                  isSelected ? "text-primary-foreground" : (isStaff ? "text-amber-500" : "text-primary")
                )}>
                  <Star className={cn("size-3 fill-current", isSelected && "animate-pulse")} />
                  <span>Optimal_Node</span>
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-6 relative z-10">
              <div className="flex-1 space-y-4 min-w-0">
                
                {/* ID & DISCOUNT TELEMETRY */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic transition-colors duration-500",
                    isSelected && "opacity-100"
                  )}>
                    Tier_Allocation_{tier.id.slice(0, 4)}
                  </span>
                  {hasDiscount && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[9px] font-black px-3 py-1 italic">
                      -{tier.discountPercentage}%_FLUX
                    </Badge>
                  )}
                </div>

                {/* FLUID PRICE VECTOR */}
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className={cn(
                    "font-black tracking-tighter italic leading-none transition-all duration-700 whitespace-nowrap",
                    "text-[clamp(2rem,10vw,4rem)]",
                    isSelected ? (isStaff ? "text-amber-500" : "text-primary") : "text-foreground"
                  )}>
                    <span className="text-sm align-top mr-1 opacity-20 italic">{currency}</span>
                    {parseFloat(tier.price).toFixed(2)}
                  </span>
                </div>

                {/* PROTOCOL METRICS */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all italic",
                    isSelected ? "bg-white/5 border-white/10 text-foreground" : "bg-white/5 border-white/5 text-muted-foreground/30"
                  )}>
                    <Zap className={cn("size-3.5", isSelected && "text-primary animate-pulse")} />
                    <span>{tier.intervalCount}_{tier.interval}_Epoch</span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all italic",
                    isSelected ? "bg-white/5 border-white/10 text-foreground" : "bg-white/5 border-white/5 text-muted-foreground/30"
                  )}>
                    <Activity className="size-3.5" />
                    <span>{tier.type === "RECURRING" ? "Auto_Sync" : "One_Time_Provision"}</span>
                  </div>
                </div>
              </div>

              {/* TACTILE SELECTION APERTURE */}
              <div
                className={cn(
                  "size-14 md:size-16 shrink-0 items-center justify-center rounded-[1.5rem] md:rounded-[2rem] border-2 flex transition-all duration-700 shadow-inner",
                  isSelected 
                    ? (isStaff 
                        ? "scale-110 border-amber-500 bg-amber-500 text-black shadow-2xl shadow-amber-500/30 rotate-[360deg]" 
                        : "scale-110 border-primary bg-primary text-primary-foreground shadow-2xl shadow-primary/30 rotate-[360deg]") 
                    : "border-white/10 bg-black/20 text-transparent",
                )}
              >
                <Check className="size-7 md:size-8 stroke-[4px]" />
              </div>
            </div>

            {/* SUBSURFACE SHIELD WATERMARK */}
            <ShieldCheck className="absolute -bottom-6 -right-6 size-32 opacity-[0.02] -rotate-12 pointer-events-none" />
          </button>
        );
      })}
    </div>
  );
}