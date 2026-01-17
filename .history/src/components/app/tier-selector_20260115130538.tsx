"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Activity, ShieldCheck, Waves } from "lucide-react";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

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
 * 🌊 FLUID TIER SELECTOR (Apex v16.16.29)
 * Logic: Hardware-Aware Morphology Tiering.
 * Feature: Accounts for all screenSize tiers (xs -> xxl) and isPortrait state.
 */
export function TierSelector({ tiers, selectedTierId, onSelect, currency }: TierSelectorProps) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const device = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  const sortedTiers = React.useMemo(() => 
    [...tiers].sort((a, b) => parseFloat(a.price) - parseFloat(b.price)),
  [tiers]);

  // 🛡️ HYDRATION GUARD
  if (!device.isReady) return <div className="h-64 animate-pulse bg-muted/10 rounded-[3rem]" />;

  const handleSelection = (tierId: string) => {
    if (tierId !== selectedTierId) {
      impact("medium"); 
    }
    onSelect(tierId);
  };

  /**
   * 🕵️ TACTICAL GRID CALCULATION
   * Determines layout morphology based on the 6-tier screen system.
   */
  const gridLayout = cn(
    "grid gap-4 md:gap-6 w-full min-w-0 transition-all duration-700",
    device.screenSize === 'xxl' ? "grid-cols-3" : 
    (device.isDesktop || (device.isTablet && !device.isPortrait)) ? "grid-cols-2" : 
    "grid-cols-1"
  );

  return (
    <div className={gridLayout}>
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
              "group relative w-full overflow-hidden text-left transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              "animate-in fade-in slide-in-from-bottom-4 border-2",
              
              // 📐 Morphology: Adaptive Padding & Corners
              device.isMobile ? "p-5 rounded-[2rem]" : "p-8 rounded-[3.5rem]",
              
              isSelected 
                ? (isStaff ? "border-amber-500 bg-amber-500/[0.04] shadow-2xl scale-[1.01]" : "border-primary bg-primary/[0.04] shadow-2xl scale-[1.01]") 
                : "border-white/5 bg-card/40 backdrop-blur-3xl hover:border-white/20 active:scale-[0.98]"
            )}
          >
            {/* 🏷️ OPTIMAL NODE RIBBON: Scales with device width */}
            {isOptimal && (
              <div className={cn(
                "absolute right-0 top-0 px-5 py-1.5 rounded-bl-[1.5rem] border-b border-l transition-all duration-700 z-20 italic",
                isSelected 
                  ? (isStaff ? "bg-amber-500 border-amber-500" : "bg-primary border-primary") 
                  : "bg-white/5 border-white/10",
                device.screenSize === 'xs' && "scale-90 origin-top-right"
              )}>
                <p className={cn(
                  "flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]",
                  isSelected ? "text-primary-foreground" : (isStaff ? "text-amber-500" : "text-primary")
                )}>
                  <Star className={cn("size-3 fill-current", isSelected && "animate-pulse")} />
                  <span className={cn(device.screenSize === 'xs' && "hidden")}>Optimal_Node</span>
                  {device.screenSize === 'xs' && <span>TOP</span>}
                </p>
              </div>
            )}

            <div className={cn(
              "flex justify-between relative z-10",
              device.screenSize === 'xs' ? "flex-col gap-4" : "flex-row items-center gap-6"
            )}>
              <div className="flex-1 space-y-3 min-w-0">
                
                {/* ID & DISCOUNT TELEMETRY */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic",
                    isSelected && "opacity-100 text-primary"
                  )}>
                    Tier_{tier.id.slice(0, 4)}
                  </span>
                  {hasDiscount && (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[8px] font-black px-2 py-0.5 italic">
                      -{tier.discountPercentage}%_FLUX
                    </Badge>
                  )}
                </div>

                {/* FLUID PRICE VECTOR: Uses viewportWidth for clamp range */}
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className={cn(
                    "font-black tracking-tighter italic leading-none transition-all duration-1000",
                    "text-[clamp(1.5rem,8vw,3.5rem)]", // Fluid scaling
                    isSelected ? (isStaff ? "text-amber-500" : "text-primary") : "text-foreground"
                  )}>
                    <span className="text-sm align-top mr-1 opacity-20 italic font-sans">{currency}</span>
                    {parseFloat(tier.price).toFixed(0)}
                    <span className="text-xs opacity-40 ml-0.5">.{(parseFloat(tier.price) % 1).toFixed(2).split('.')[1]}</span>
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-20 italic">/ {tier.interval}</span>
                </div>

                {/* PROTOCOL METRICS: Morphing size */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[8px] md:text-[9px] font-black uppercase tracking-widest italic transition-all",
                    isSelected ? "bg-white/5 border-white/10 text-foreground" : "bg-white/5 border-white/5 text-muted-foreground/30"
                  )}>
                    <Zap className={cn("size-3", isSelected && "text-primary animate-pulse")} />
                    <span>{tier.intervalCount} EPOCH</span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[8px] md:text-[9px] font-black uppercase tracking-widest italic transition-all",
                    isSelected ? "bg-white/5 border-white/10 text-foreground" : "bg-white/5 border-white/5 text-muted-foreground/30"
                  )}>
                    <Activity className="size-3" />
                    <span>{tier.type === "RECURRING" ? "AUTO" : "ONCE"}</span>
                  </div>
                </div>
              </div>

              {/* TACTILE SELECTION APERTURE: Fluid Sizing */}
              <div
                className={cn(
                  "shrink-0 items-center justify-center border-2 flex transition-all duration-1000 shadow-inner",
                  device.isMobile ? "size-12 rounded-[1.2rem]" : "size-16 rounded-[2rem]",
                  isSelected 
                    ? (isStaff 
                        ? "scale-110 border-amber-500 bg-amber-500 text-black rotate-[360deg]" 
                        : "scale-110 border-primary bg-primary text-primary-foreground rotate-[360deg]") 
                    : "border-white/10 bg-black/20 text-transparent",
                )}
              >
                <Check className={cn("stroke-[4px]", device.isMobile ? "size-6" : "size-8")} />
              </div>
            </div>

            {/* SUBSURFACE FLOW: Radiance Layer */}
            {isSelected && (
               <div className={cn(
                 "absolute inset-0 blur-3xl opacity-5 -z-10 animate-pulse",
                 isStaff ? "bg-amber-500" : "bg-primary"
               )} />
            )}
            
            <ShieldCheck className="absolute -bottom-6 -right-6 size-32 opacity-[0.01] -rotate-12 pointer-events-none group-hover:rotate-0 transition-all duration-1000" />
          </button>
        );
      })}
    </div>
  );
}