"use client";

import Link from "next/link";
import { Check, Zap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 PRICING_MATRIX (Institutional v16.16.14)
 * Logic: Subscription tiers with tactile ingress.
 * Refactor: Vertical compression & liquid scaling (v9.9.5).
 */
export function PricingSection() {
  const { impact } = useHaptics();

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-[clamp(4rem,12vh,8rem)] relative">
      {/* 🔮 SUBSURFACE RADIANCE: NORMALIZED */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[700px] h-[700px] bg-primary/[0.02] rounded-full blur-[140px] -z-10 pointer-events-none" />

      {/* --- SECTION HEADER: COMPRESSED --- */}
      <div className="flex flex-col items-center mb-12 md:mb-16 text-center space-y-2.5">
        <div className="flex items-center gap-2 text-primary/50">
          <Layers className="size-3.5" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">
            Scalability_Protocol
          </span>
        </div>
        <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-foreground">
          Choose Your <span className="text-primary">Tier.</span>
        </h2>
      </div>

      {/* --- TIER GRID: TACTICAL SCALE --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        <PricingCard
          name="Starter"
          price="49"
          desc="Individual Broadcaster"
          features={["2 Service Nodes", "Standard Analytics", "3% Platform Fee"]}
          onSelect={() => impact("light")}
        />
        <PricingCard
          name="Professional"
          price="149"
          featured
          desc="High-Frequency Merchant"
          features={["Unlimited Nodes", "Advanced Telemetry", "1.5% Platform Fee", "Coupon Engine"]}
          onSelect={() => impact("medium")}
        />
        <PricingCard
          name="Institutional"
          price="Custom"
          desc="Enterprise Core"
          features={["Dedicated DB Cluster", "White-label Identity", "0.5% Platform Fee", "SLA Protection"]}
          onSelect={() => impact("heavy")}
        />
      </div>
    </section>
  );
}

function PricingCard({ name, price, desc, features, featured, onSelect }: any) {
  return (
    <Card className={cn(
      "rounded-[1.5rem] p-6 md:p-8 flex flex-col relative transition-all duration-500 backdrop-blur-3xl group cursor-default shadow-2xl overflow-hidden",
      featured 
        ? "border-primary/30 border-[1.5px] bg-card/60 md:scale-[1.03] z-10 shadow-primary/5" 
        : "border-white/5 bg-card/30 hover:border-white/10"
    )}>
      {featured && <Zap className="absolute -top-3 -right-3 size-20 opacity-5 rotate-12 text-primary" />}
      
      <div className="mb-6 md:mb-8">
        <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tight text-foreground/90">{name}</h3>
        <p className="text-[8px] font-bold text-muted-foreground mt-1.5 uppercase tracking-widest opacity-30 italic">{desc}</p>
      </div>

      <div className="flex items-baseline gap-1.5 mb-8 md:mb-12">
        {price !== "Custom" && <span className="text-xl font-black italic tracking-tighter text-primary/30">$</span>}
        <span className={cn(
          "font-black italic tracking-tighter leading-none tabular-nums text-foreground", 
          price === "Custom" ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl"
        )}>
          {price}
        </span>
        {price !== "Custom" && <span className="text-[8px] font-black uppercase text-muted-foreground/20 tracking-widest ml-1.5">/MO</span>}
      </div>

      <div className="space-y-3.5 flex-1 mb-10 md:mb-12">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3.5 group/item">
            <div className={cn(
              "size-4.5 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-500", 
              featured ? "bg-primary/5 border-primary/10 text-primary" : "bg-white/5 border-white/5 text-muted-foreground/40"
            )}>
              <Check className="size-2.5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 group-hover/item:opacity-80 transition-opacity text-foreground">
              {f}
            </span>
          </div>
        ))}
      </div>

      <Button asChild onClick={onSelect} className={cn(
        "w-full h-12 rounded-xl font-black uppercase italic tracking-[0.15em] text-[9px] shadow-xl transition-all hover:scale-[1.02] active:scale-95", 
        featured ? "bg-primary text-primary-foreground shadow-primary/10" : "bg-white/5 text-foreground border border-white/5 hover:bg-white/10"
      )}>
        <Link href="/register">Initialize {name}</Link>
      </Button>
    </Card>
  );
}