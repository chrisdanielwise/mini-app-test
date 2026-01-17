"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Star, Zap, Activity, ShieldCheck } from "lucide-react";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ TIER_SELECTOR (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density padding (p-4) and shrunken typography prevent blowout.
 */
export function TierSelector({ tiers, selectedTierId, onSelect, currency }: any) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, screenSize, isDesktop, isPortrait } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  const sortedTiers = React.useMemo(() => 
    [...tiers].sort((a, b) => parseFloat(a.price) - parseFloat(b.price)),
  [tiers]);

  if (!isReady) return <div className="h-48 w-full bg-white/5 animate-pulse rounded-xl" />;

  const handleSelection = (tierId: string) => {
    if (tierId !== selectedTierId) impact("medium");
    onSelect(tierId);
  };

  // 📐 TACTICAL GRID: Determines density based on hardware tier
  const gridLayout = cn(
    "grid gap-3 w-full transition-all duration-700",
    isDesktop ? "grid-cols-2" : "grid-cols-1"
  );

  return (
    <div className={gridLayout}>
      {sortedTiers.map((tier, index) => {
        const isSelected = tier.id === selectedTierId;
        const isOptimal = tier.discountPercentage >= 20;

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => handleSelection(tier.id)}
            className={cn(
              "group relative w-full overflow-hidden text-left transition-all duration-500 rounded-xl border leading-none",
              // TACTICAL PADDING: Shrunken from p-8 to clinical p-4
              "p-4 md:p-5",
              isSelected 
                ? (isStaff ? "border-amber-500 bg-amber-500/[0.04] shadow-lg" : "border-primary bg-primary/[0.04] shadow-lg") 
                : "border-white/5 bg-zinc-950/40 hover:border-white/10"
            )}
          >
            {/* 🏷️ OPTIMAL BADGE: Institutional Scale */}
            {isOptimal && (
              <div className={cn(
                "absolute right-0 top-0 px-3 py-1 rounded-bl-lg border-b border-l text-[7px] font-black uppercase tracking-widest italic",
                isSelected ? "bg-primary border-primary text-black" : "bg-white/5 border-white/10 text-primary"
              )}>
                OPTIMAL
              </div>
            )}

            <div className="flex justify-between items-center gap-4 relative z-10">
              <div className="flex-1 space-y-2 min-w-0">
                <span className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-20">
                  Tier_{tier.id.slice(0, 4)}
                </span>

                {/* PRICE VECTOR: Compressed Institutional Scale */}
                <div className="flex items-baseline gap-1.5">
                  <span className={cn(
                    "font-black tracking-tighter italic transition-all",
                    "text-xl md:text-2xl", 
                    isSelected ? (isStaff ? "text-amber-500" : "text-primary") : "text-foreground/80"
                  )}>
                    <span className="text-xs mr-0.5 opacity-20 font-sans">{currency}</span>
                    {parseFloat(tier.price).toFixed(0)}
                  </span>
                  <span className="text-[7.5px] font-black uppercase opacity-10 italic">/ {tier.interval}</span>
                </div>

                {/* METRICS TAPE: Morphology Scaling */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                    <Zap className={cn("size-2.5", isSelected ? "text-primary" : "opacity-20")} />
                    <span className="text-[7px] font-black uppercase">{tier.intervalCount} EPOCH</span>
                  </div>
                </div>
              </div>

              {/* TACTILE APERTURE: Shrunken to size-9 standard */}
              <div className={cn(
                "shrink-0 size-9 rounded-lg border-2 flex items-center justify-center transition-all shadow-inner",
                isSelected 
                  ? (isStaff ? "border-amber-500 bg-amber-500 text-black rotate-0" : "border-primary bg-primary text-black") 
                  : "border-white/5 bg-black/20 text-transparent",
              )}>
                <Check className="size-4 stroke-[4px]" />
              </div>
            </div>

            <ShieldCheck className="absolute -bottom-4 -right-4 size-20 opacity-[0.01] pointer-events-none" />
          </button>
        );
      })}
    </div>
  );
}