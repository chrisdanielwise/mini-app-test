import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Terminal,
  Globe,
  Check,
  Users,
  Cpu,
  Fingerprint,
  Activity,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🛰️ GLOBAL LANDING PAGE (Tactical Medium)
 * Normalized: World-standard fluid scaling for high-conversion marketing.
 * Optimized: Resilient grid geometry to prevent "over-scaled" component fatigue.
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background selection:bg-primary/20 overflow-x-hidden">
      
      {/* --- HERO: THE ENTRY PROTOCOL (NORMALIZED) --- */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center border-b border-border/10">
        {/* Institutional Grid Protocol: Sharpened */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Identity Badge: Compact */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <Fingerprint className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">
            Zipha_Core_v2.26
          </span>
        </div>

        {/* Fluid Typography Header: Clamped */}
        <div className="space-y-2 mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Signal
            <br />
            <span className="text-primary">Mastery.</span>
          </h1>
          <div className="flex items-center justify-center gap-3 opacity-20 pt-1">
            <div className="h-px w-6 md:w-10 bg-foreground" />
            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">
              Autonomous Merchant Infrastructure
            </p>
            <div className="h-px w-6 md:w-10 bg-foreground" />
          </div>
        </div>

        <p className="max-w-xl text-sm md:text-lg text-muted-foreground font-bold uppercase tracking-tight mb-10 opacity-60 leading-relaxed italic">
          Architecting the future of Telegram signal broadcasters.{" "}
          <br className="hidden md:block" />
          <span className="text-foreground">Scale your cluster. Automate your capital.</span>
        </p>

        {/* Adaptive Button Stack: Tactical Scale */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Button
            asChild
            className="flex-1 rounded-xl h-12 md:h-14 text-[11px] md:text-xs font-black uppercase italic tracking-[0.2em] shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 group"
          >
            <Link href="https://t.me/YOUR_BOT_USERNAME">
              Launch Bot{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-xl h-12 md:h-14 text-[11px] md:text-xs font-black uppercase tracking-[0.2em] border-border/10 bg-card/40 backdrop-blur-3xl hover:bg-muted/10 transition-all"
          >
            <Link href="/register">Deploy Node</Link>
          </Button>
        </div>
      </section>

      {/* --- INFRASTRUCTURE TELEMETRY (MEDIUM DENSITY) --- */}
      <section className="w-full px-6 py-12 md:py-16 bg-muted/5 border-b border-border/10 overflow-hidden relative">
        <Globe className="absolute -right-6 -bottom-6 h-32 w-32 opacity-[0.02] rotate-12" />

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <StatNode label="Active Clusters" value="840+" />
          <StatNode label="Verified Nodes" value="122k" />
          <StatNode label="Node Uptime" value="99.9%" />
          <StatNode label="Capital Flow" value="$1.2M" />
        </div>
      </section>

      {/* --- PRICING: PROTOCOL TIERS (NORMALIZED) --- */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[150px] -z-10 pointer-events-none" />

        <div className="flex flex-col items-center mb-12 md:mb-20 text-center space-y-2">
          <div className="flex items-center gap-2 text-primary/60">
            <Layers className="h-4 w-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">
              Scalability Protocol
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Choose Your <span className="text-primary">Tier.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
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
    </div>
  );
}

/** --- ATOMIC COMPONENTS: TACTICAL MEDIUM SCALE --- **/

function StatNode({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 group cursor-default">
      <span className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none group-hover:text-primary transition-colors text-foreground">
        {value}
      </span>
      <div className="flex items-center gap-2 opacity-30 italic">
        <Activity className="h-3 w-3" />
        <span className="text-[8px] font-bold uppercase tracking-widest leading-none">
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
        "rounded-2xl p-6 md:p-8 flex flex-col relative transition-all duration-500 backdrop-blur-xl group cursor-default shadow-xl",
        featured
          ? "border-primary/40 border-2 bg-card/60 md:scale-[1.02] z-10"
          : "border-border/10 bg-card/30 hover:border-primary/20"
      )}
    >
      <div className="mb-6 md:mb-8">
        <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tight text-foreground">
          {name}
        </h3>
        <p className="text-[8px] font-bold text-muted-foreground mt-1 uppercase tracking-widest opacity-40 italic">
          {desc}
        </p>
      </div>

      <div className="flex items-baseline gap-1.5 mb-8 md:mb-12">
        {price !== "Custom" && (
          <span className="text-lg md:text-xl font-black italic tracking-tighter text-primary/40">
            $
          </span>
        )}
        <span
          className={cn(
            "font-black italic tracking-tighter leading-none tabular-nums",
            price === "Custom" ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl"
          )}
        >
          {price}
        </span>
        {price !== "Custom" && (
          <span className="text-[8px] font-black uppercase text-muted-foreground/30 tracking-widest ml-2">
            /NODE
          </span>
        )}
      </div>

      <div className="space-y-3 flex-1 mb-8 md:mb-12">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3 group/item">
            <div
              className={cn(
                "h-4 w-4 rounded-md flex items-center justify-center shrink-0 border transition-all",
                featured
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-muted/20 border-border/10 text-muted-foreground"
              )}
            >
              <Check className="h-2.5 w-2.5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover/item:opacity-80 transition-opacity">
              {f}
            </span>
          </div>
        ))}
      </div>

      <Button
        asChild
        className={cn(
          "w-full h-11 md:h-12 rounded-lg font-black uppercase italic tracking-widest text-[9px] shadow-lg transition-all hover:scale-[1.02]",
          featured
            ? "bg-primary text-primary-foreground shadow-primary/10"
            : "bg-muted/10 text-muted-foreground border border-border/10"
        )}
      >
        <Link href="/register">Select {name}</Link>
      </Button>
    </Card>
  );
}