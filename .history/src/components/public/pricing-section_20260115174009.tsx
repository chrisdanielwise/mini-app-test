"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Zap, Layers, Waves, Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
// import { useInstitutionalAuth } from "@/hooks/use-institutional-auth";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

/**
 * 🛰️ PRICING_MATRIX (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: Morphology-aware subscription ingress with kinetic "Steam" radiance.
 */
export function PricingSection() {
  const { flavor } = useLayout();
  const { isStaff } = useInstitutionalAuth();
  
  // 🛰️ DEVICE PHYSICS: Hardware Ingress
  const { 
    screenSize, isMobile, isTablet, isDesktop, 
    isPortrait, viewportWidth, isReady 
  } = useDeviceContext();

  const isAmber = flavor === "AMBER" || isStaff;

  // 🛡️ HYDRATION GUARD
  if (!isReady) return <div className="min-h-[60vh] animate-pulse bg-white/[0.02] rounded-[3rem] mx-6" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating grid geometry based on the 6-tier system.
   */
  const gridCols = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-3" : "grid-cols-1";
  const sectionPadding = screenSize === 'xs' ? "py-16 px-5" : "py-[clamp(4rem,12vh,10rem)] px-6 md:px-10";

  return (
    <section id="pricing" className={cn("relative overflow-hidden transition-all duration-1000", sectionPadding)}>
      
      {/* 🔮 SUBSURFACE RADIANCE: Hardware-Fluid Kinetic Energy */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[140px] opacity-[0.03] pointer-events-none transition-all duration-1000",
          isAmber ? "bg-amber-500" : "bg-primary"
        )}
        style={{ width: `${viewportWidth * 0.6}px`, height: `${viewportWidth * 0.6}px` }}
      />

      {/* --- SECTION HEADER: MORPHOLOGY SCALING --- */}
      <div className="flex flex-col items-center mb-12 md:mb-20 text-center space-y-4">
        <div className="flex items-center gap-3 italic opacity-30">
          <Layers className={cn("size-3.5", isAmber ? "text-amber-500" : "text-primary")} />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">
            Scalability_Protocol
          </span>
        </div>
        <h2 className={cn(
          "font-black uppercase italic tracking-tighter leading-none text-foreground",
          screenSize === 'xs' ? "text-4xl" : "text-5xl md:text-7xl"
        )}>
          Choose Your <span className={isAmber ? "text-amber-500" : "text-primary"}>Tier.</span>
        </h2>
      </div>

      {/* --- TIER GRID: KINETIC MATRIX --- */}
      <div className={cn("grid gap-6 md:gap-8 max-w-7xl mx-auto", gridCols)}>
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
          features={["Unlimited Nodes", "Advanced Telemetry", "1.5% Platform Fee", "Coupon Engine"]}
          tierLevel="medium"
          isAmber={isAmber}
        />
        <PricingCard
          name="Institutional"
          price="Custom"
          desc="Enterprise Core"
          features={["Dedicated DB Cluster", "White-label Identity", "0.5% Platform Fee", "SLA Protection"]}
          tierLevel="heavy"
          isAmber={isAmber}
        />
      </div>

      {/* 📐 BACKGROUND GRID MASK */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </section>
  );
}

interface PricingCardProps {
  name: string;
  price: string;
  desc: string;
  features: string[];
  featured?: boolean;
  tierLevel: "light" | "medium" | "heavy";
  isAmber: boolean;
}

function PricingCard({ name, price, desc, features, featured, tierLevel, isAmber }: PricingCardProps) {
  const { impact } = useHaptics();

  return (
    <Card className={cn(
      "rounded-[2.5rem] p-8 md:p-10 flex flex-col relative transition-all duration-1000 backdrop-blur-3xl group cursor-default shadow-apex overflow-hidden border-white/5",
      featured 
        ? (isAmber ? "bg-amber-500/[0.03] border-amber-500/20 scale-100 lg:scale-[1.05]" : "bg-primary/[0.03] border-primary/20 scale-100 lg:scale-[1.05]") 
        : "bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10"
    )}>
      {/* 🧪 KINETIC STEAM GLOW */}
      <div className={cn(
        "absolute -right-20 -top-20 size-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000",
        isAmber ? "bg-amber-500" : "bg-primary"
      )} />

      {featured && <Activity className={cn("absolute top-6 right-8 size-5 animate-pulse", isAmber ? "text-amber-500" : "text-primary")} />}
      
      <div className="mb-8 relative z-10">
        <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground/90">{name}</h3>
        <p className="text-[10px] font-bold text-muted-foreground/30 mt-2 uppercase tracking-[0.3em] italic">{desc}</p>
      </div>

      <div className="flex items-baseline gap-2 mb-10 md:mb-14 relative z-10">
        {price !== "Custom" && <span className={cn("text-2xl font-black italic tracking-tighter", isAmber ? "text-amber-500/20" : "text-primary/20")}>$</span>}
        <span className={cn(
          "font-black italic tracking-tighter leading-none tabular-nums text-foreground transition-all duration-700", 
          price === "Custom" ? "text-3xl md:text-5xl" : "text-5xl md:text-7xl group-hover:scale-110 group-hover:origin-left"
        )}>
          {price}
        </span>
        {price !== "Custom" && <span className="text-[10px] font-black uppercase text-muted-foreground/20 tracking-[0.4em] ml-2">/MO</span>}
      </div>

      <div className="space-y-4 flex-1 mb-12 md:mb-16 relative z-10">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-4 group/item">
            <div className={cn(
              "size-5 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-700 shadow-inner", 
              featured 
                ? (isAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary") 
                : "bg-white/5 border-white/5 text-muted-foreground/20 group-hover/item:text-foreground"
            )}>
              <Check className="size-3" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group-hover/item:text-foreground transition-all duration-500">
              {f.replace(/ /g, "_")}
            </span>
          </div>
        ))}
      </div>

      <Button 
        asChild 
        onClick={() => impact(tierLevel)} 
        className={cn(
          "w-full h-18 md:h-20 rounded-[1.8rem] font-black uppercase italic tracking-[0.2em] text-[11px] shadow-apex transition-all duration-1000 hover:scale-[1.02] active:scale-95 group/btn", 
          featured 
            ? (isAmber ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-primary-foreground shadow-primary/30") 
            : "bg-white/5 text-foreground border border-white/10 hover:bg-white/10"
        )}
      >
        <Link href="/register" className="flex items-center justify-center gap-3">
          <span>Initialize_{name}</span>
          <Sparkles className="size-4 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
        </Link>
      </Button>

      {/* 🌊 KINETIC WATERMARK */}
      <Waves className="absolute -bottom-6 -left-6 size-32 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 pointer-events-none" />
    </Card>
  );
}