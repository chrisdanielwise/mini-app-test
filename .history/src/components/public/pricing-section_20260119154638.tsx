"use client";

import * as React from "react";
import { useMemo } from "react";
import Link from "next/link";
import { Check, Layers, Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * ✅ FIX: TS2304 - Defined missing interface for institutional type safety
 */
interface PricingCardProps {
  name: string;
  price: string;
  desc: string;
  features: string[];
  featured?: boolean;
  tierLevel: "light" | "medium" | "heavy";
  isAmber: boolean;
}

/**
 * 🛰️ PRICING_MATRIX (Institutional Apex v2026.1.20)
 */
export function PricingSection() {
  const { flavor } = useLayout();
  const { isStaff } = useInstitutionalAuth();
  const { screenSize, isTablet, isDesktop, isPortrait, viewportWidth, isReady } = useDeviceContext();

  const isAmber = flavor === "AMBER" || isStaff;

  if (!isReady) return <div className="h-64 animate-pulse bg-white/[0.02] rounded-2xl mx-6" />;

  const gridCols = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-3" : "grid-cols-1";
  const sectionPadding = screenSize === 'xs' ? "py-10 px-5" : "py-16 md:py-20 px-6 md:px-8";

  return (
    <section id="pricing" className={cn("relative overflow-hidden transition-all duration-700", sectionPadding)}>
      
      {/* 🌫️ TACTICAL RADIANCE */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-[0.02] pointer-events-none transition-all",
          isAmber ? "bg-amber-500" : "bg-primary"
        )}
        style={{ width: `${viewportWidth * 0.4}px`, height: `${viewportWidth * 0.4}px` }}
      />

      <div className="flex flex-col items-center mb-10 md:mb-12 text-center space-y-2 leading-none">
        <div className="flex items-center gap-2.5 italic opacity-20">
          <Layers className={cn("size-3", isAmber ? "text-amber-500" : "text-primary")} />
          <span className="text-[7.5px] font-black uppercase tracking-[0.3em]">Scalability_v16</span>
        </div>
        <h2 className={cn(
          "font-black uppercase italic tracking-tighter text-foreground",
          screenSize === 'xs' ? "text-3xl" : "text-4xl md:text-5xl"
        )}>
          Choose Your <span className={isAmber ? "text-amber-500" : "text-primary"}>Tier</span>
        </h2>
      </div>

      <div className={cn("grid gap-3 md:gap-4 max-w-6xl mx-auto", gridCols)}>
        <PricingCard
          name="Starter"
          price="49"
          desc="Individual Broadcaster"
          features={["2 Service Nodes", "Standard Analytics", "3% Platform Fee"]}
          tierLevel="light"
          isAmber={isAmber}
        />
        <PricingCard
          name="Professional"
          price="149"
          featured
          desc="High-Frequency Merchant"
          features={["Unlimited Nodes", "Telemetry Pro", "1.5% Fee", "Coupon Engine"]}
          tierLevel="medium"
          isAmber={isAmber}
        />
        <PricingCard
          name="Institutional"
          price="Custom"
          desc="Enterprise Core"
          features={["DB Cluster", "White-label ID", "0.5% Fee", "SLA Guard"]}
          tierLevel="heavy"
          isAmber={isAmber}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[url('/assets/grid.svg')] bg-center" />
    </section>
  );
}

function PricingCard({ name, price, desc, features, featured, tierLevel, isAmber }: PricingCardProps) {
  const { impact } = useHaptics();

  return (
    <Card className={cn(
      "rounded-2xl p-6 md:p-8 flex flex-col relative transition-all duration-500 backdrop-blur-3xl group cursor-default shadow-2xl border-white/5",
      featured 
        ? (isAmber ? "bg-amber-500/[0.01] border-amber-500/10 scale-100 lg:scale-[1.03]" : "bg-card/60 border-primary/10 scale-100 lg:scale-[1.03]") 
        : "bg-white/[0.005] hover:bg-white/[0.01] hover:border-white/10"
    )}>
      {featured && <Activity className={cn("absolute top-5 right-6 size-3 animate-pulse", isAmber ? "text-amber-500" : "text-primary")} />}
      
      <div className="mb-6 relative z-10 leading-none">
        <h3 className="text-sm md:text-base font-black uppercase italic tracking-tighter text-foreground/80">{name}</h3>
        <p className="text-[7.5px] font-black text-muted-foreground/10 mt-1.5 uppercase tracking-[0.2em] italic">{desc}</p>
      </div>

      <div className="flex items-baseline gap-1.5 mb-8 md:mb-10 relative z-10 leading-none">
        {price !== "Custom" && <span className={cn("text-lg font-black italic tracking-tighter", isAmber ? "text-amber-500/20" : "text-primary/20")}>$</span>}
        <span className={cn(
          "font-black italic tracking-tighter tabular-nums text-foreground transition-all duration-700", 
          price === "Custom" ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl"
        )}>
          {price}
        </span>
        {price !== "Custom" && <span className="text-[7.5px] font-black uppercase text-muted-foreground/10 tracking-[0.2em] ml-1">/MO</span>}
      </div>

      <div className="space-y-3 flex-1 mb-10 md:mb-12 relative z-10">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3 group/item leading-none">
            <div className={cn(
              "size-4 rounded-md flex items-center justify-center shrink-0 border transition-all", 
              featured 
                ? (isAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary") 
                : "bg-white/5 border-white/5 text-muted-foreground/10 group-hover/item:text-foreground"
            )}>
              <Check className="size-2.5" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/30 group-hover/item:text-foreground transition-colors">
              {f.replace(/ /g, "_")}
            </span>
          </div>
        ))}
      </div>

      <Button 
        asChild 
        onClick={() => impact(tierLevel)} 
        className={cn(
          "w-full h-11 md:h-11 rounded-xl font-black uppercase italic tracking-widest text-[9px] shadow-lg transition-all group/btn", 
          featured 
            ? (isAmber ? "bg-amber-500 text-black" : "bg-primary text-primary-foreground") 
            : "bg-white/5 text-foreground border border-white/5 hover:bg-white/10"
        )}
      >
        <Link href="/register" className="flex items-center justify-center gap-2">
          <span>Initialize_{name}</span>
          <Sparkles className="size-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
        </Link>
      </Button>
    </Card>
  );
}