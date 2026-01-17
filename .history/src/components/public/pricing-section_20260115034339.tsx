"use client";

import Link from "next/link";
import { Check, Zap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

export function PricingSection() {
  const { impact } = useHaptics();

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[180px] -z-10 pointer-events-none" />

      <div className="flex flex-col items-center mb-16 md:mb-24 text-center space-y-3">
        <div className="flex items-center gap-2 text-primary/60">
          <Layers className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">
            Scalability Protocol
          </span>
        </div>
        <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-foreground">
          Choose Your <span className="text-primary">Tier.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
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
      "rounded-[2rem] p-8 md:p-10 flex flex-col relative transition-all duration-700 backdrop-blur-2xl group cursor-default shadow-2xl overflow-hidden",
      featured ? "border-primary/40 border-2 bg-card/60 md:scale-[1.05] z-10" : "border-border/10 bg-card/30 hover:border-primary/20"
    )}>
      {featured && <Zap className="absolute -top-4 -right-4 h-24 w-24 opacity-5 rotate-12 text-primary" />}
      <div className="mb-8 md:mb-10">
        <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight text-foreground">{name}</h3>
        <p className="text-[9px] font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-40 italic">{desc}</p>
      </div>
      <div className="flex items-baseline gap-2 mb-10 md:mb-16">
        {price !== "Custom" && <span className="text-2xl font-black italic tracking-tighter text-primary/40">$</span>}
        <span className={cn("font-black italic tracking-tighter leading-none tabular-nums text-foreground", price === "Custom" ? "text-3xl md:text-4xl" : "text-5xl md:text-6xl")}>{price}</span>
        {price !== "Custom" && <span className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-widest ml-2">/MO</span>}
      </div>
      <div className="space-y-4 flex-1 mb-10 md:mb-16">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-4 group/item">
            <div className={cn("h-5 w-5 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-500", featured ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/20 border-border/10 text-muted-foreground")}>
              <Check className="h-3 w-3" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-40 group-hover/item:opacity-90 transition-opacity text-foreground">{f}</span>
          </div>
        ))}
      </div>
      <Button asChild onClick={onSelect} className={cn("w-full h-14 rounded-xl font-black uppercase italic tracking-[0.15em] text-[10px] shadow-xl transition-all hover:scale-[1.02] active:scale-95", featured ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted/10 text-foreground border border-border/40 hover:bg-white/5")}>
        <Link href="/register">Select {name}</Link>
      </Button>
    </Card>
  );
}