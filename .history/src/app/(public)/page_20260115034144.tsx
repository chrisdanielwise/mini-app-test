"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Globe,
  Check,
  Fingerprint,
  Activity,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

/**
 * 🛰️ GLOBAL LANDING PAGE (Institutional v9.5.0)
 * Architecture: High-Conversion Marketing Ingress.
 * Feature: Staggered entry animations for Turbopack optimization.
 */
export default function LandingPage() {
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || "ZiphaSignals_Bot";

  // Inside your main page's useEffect:
useEffect(() => {
  const authChannel = new BroadcastChannel("zipha_auth_sync");
  
  authChannel.onmessage = (event) => {
    if (event.data.action === "RELOAD_SESSION") {
      // ✅ Tab B signaled success! Refresh Tab A to log in.
      window.location.reload(); 
    }
  };

  return () => authChannel.close();
}, []);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background selection:bg-primary/20 overflow-x-hidden text-foreground">
      
      {/* --- HERO: THE ENTRY PROTOCOL --- */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center border-b border-border/10">
        {/* Institutional Grid Protocol */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Identity Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Fingerprint className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">
            Zipha_Terminal_v2.26
          </span>
        </div>

        {/* Fluid Typography Header */}
        <div className="space-y-2 mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
            Signal
            <br />
            <span className="text-primary">Mastery.</span>
          </h1>
          <div className="flex items-center justify-center gap-3 opacity-20 pt-4">
            <div className="h-px w-8 md:w-12 bg-foreground" />
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">
              Autonomous Merchant Infrastructure
            </p>
            <div className="h-px w-8 md:w-12 bg-foreground" />
          </div>
        </div>

        <p className="max-w-xl text-sm md:text-lg text-muted-foreground font-bold uppercase tracking-tight mb-10 opacity-60 leading-relaxed italic animate-in fade-in duration-1000 delay-300">
          Architecting the future of Telegram signal broadcasters.{" "}
          <br className="hidden md:block" />
          <span className="text-foreground">Scale your cluster. Automate your capital.</span>
        </p>

        {/* Adaptive Button Stack */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Button
            asChild
            className="flex-1 rounded-xl h-14 text-[11px] md:text-xs font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <Link href={`https://t.me/${botUsername}`}>
              Launch Bot Hub
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-xl h-14 text-[11px] md:text-xs font-black uppercase tracking-[0.2em] border-border/40 bg-card/40 backdrop-blur-3xl hover:bg-muted/10 transition-all active:scale-95"
          >
            <Link href="/register">Deploy Node</Link>
          </Button>
        </div>
      </section>

      {/* --- INFRASTRUCTURE TELEMETRY --- */}
      <section className="w-full px-6 py-16 md:py-20 bg-muted/5 border-b border-border/10 overflow-hidden relative">
        <Globe className="absolute -right-10 -bottom-10 h-48 w-48 opacity-[0.02] rotate-12" />

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 relative z-10">
          <StatNode label="Active Clusters" value="840+" />
          <StatNode label="Verified Nodes" value="122k" />
          <StatNode label="Node Uptime" value="99.9%" />
          <StatNode label="Capital Flow" value="$1.2M" />
        </div>
      </section>

      {/* --- PRICING: PROTOCOL TIERS --- */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[180px] -z-10 pointer-events-none" />

        <div className="flex flex-col items-center mb-16 md:mb-24 text-center space-y-3">
          <div className="flex items-center gap-2 text-primary/60">
            <Layers className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Scalability Protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            Choose Your <span className="text-primary">Tier.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
          <PricingCard
            name="Starter"
            price="49"
            desc="Individual Broadcaster"
            features={[
              "2 Service Nodes",
              "Standard Analytics",
              "3% Platform Fee",
            ]}
          />
          <PricingCard
            name="Professional"
            price="149"
            featured
            desc="High-Frequency Merchant"
            features={[
              "Unlimited Nodes",
              "Advanced Telemetry",
              "1.5% Platform Fee",
              "Coupon Engine",
            ]}
          />
          <PricingCard
            name="Institutional"
            price="Custom"
            desc="Enterprise Core"
            features={[
              "Dedicated DB Cluster",
              "White-label Identity",
              "0.5% Platform Fee",
              "SLA Protection",
            ]}
          />
        </div>
      </section>
      
      {/* FOOTER SIGNAL */}
      <footer className="py-12 border-t border-border/10 opacity-20 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] italic">
          Zipha Intelligence Hub // Secure Channel Established
        </p>
      </footer>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- **/

function StatNode({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 group cursor-default">
      <span className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none group-hover:text-primary transition-colors duration-500 tabular-nums">
        {value}
      </span>
      <div className="flex items-center gap-2 opacity-30 italic">
        <Activity className="h-3.5 w-3.5" />
        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
          {label}
        </span>
      </div>
    </div>
  );
}

function PricingCard({ name, price, desc, features, featured }: any) {
  return (
    <Card
      className={cn(
        "rounded-[2rem] p-8 md:p-10 flex flex-col relative transition-all duration-700 backdrop-blur-2xl group cursor-default shadow-2xl overflow-hidden",
        featured
          ? "border-primary/40 border-2 bg-card/60 md:scale-[1.05] z-10"
          : "border-border/10 bg-card/30 hover:border-primary/20"
      )}
    >
      {featured && <Zap className="absolute -top-4 -right-4 h-24 w-24 opacity-5 rotate-12 text-primary" />}
      
      <div className="mb-8 md:mb-10">
        <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight">
          {name}
        </h3>
        <p className="text-[9px] font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-40 italic">
          {desc}
        </p>
      </div>

      <div className="flex items-baseline gap-2 mb-10 md:mb-16">
        {price !== "Custom" && (
          <span className="text-2xl font-black italic tracking-tighter text-primary/40">$</span>
        )}
        <span className={cn(
            "font-black italic tracking-tighter leading-none tabular-nums",
            price === "Custom" ? "text-3xl md:text-4xl" : "text-5xl md:text-6xl"
          )}>
          {price}
        </span>
        {price !== "Custom" && (
          <span className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-widest ml-2">/MO</span>
        )}
      </div>

      <div className="space-y-4 flex-1 mb-10 md:mb-16">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-4 group/item">
            <div className={cn(
                "h-5 w-5 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-500",
                featured ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted/20 border-border/10 text-muted-foreground"
              )}>
              <Check className="h-3 w-3" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-40 group-hover/item:opacity-90 transition-opacity">
              {f}
            </span>
          </div>
        ))}
      </div>

      <Button
        asChild
        className={cn(
          "w-full h-14 rounded-xl font-black uppercase italic tracking-[0.15em] text-[10px] shadow-xl transition-all hover:scale-[1.02] active:scale-95",
          featured ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-muted/10 text-foreground border border-border/40 hover:bg-muted/20"
        )}
      >
        <Link href="/register">Select {name}</Link>
      </Button>
    </Card>
  );
}