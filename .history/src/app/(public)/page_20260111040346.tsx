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
 * 🛰️ GLOBAL LANDING PAGE (Apex Standard)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive geometry for high-conversion marketing across all device nodes.
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background selection:bg-primary/20 overflow-x-hidden">
      {/* --- HERO: THE ENTRY PROTOCOL --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32 text-center border-b border-border/40">
        {/* Institutional Grid Protocol */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] md:bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Identity Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-8 md:mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
          <Fingerprint className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary animate-pulse" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            Zipha_Core_v2.0.26_Online
          </span>
        </div>

        {/* Fluid Typography Header */}
        <div className="space-y-4 mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[clamp(4rem,15vw,13rem)] font-black tracking-tighter uppercase italic leading-[0.8] md:leading-[0.75]">
            Signal
            <br />
            <span className="text-primary">Mastery.</span>
          </h1>
          <div className="flex items-center justify-center gap-3 md:gap-4 opacity-20 pt-2">
            <div className="h-px w-8 md:w-12 bg-foreground" />
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em]">
              Autonomous Merchant Infrastructure
            </p>
            <div className="h-px w-8 md:w-12 bg-foreground" />
          </div>
        </div>

        <p className="max-w-2xl text-base md:text-2xl text-muted-foreground font-black uppercase tracking-tight mb-12 md:mb-20 opacity-60 leading-tight italic">
          Architecting the future of Telegram signal broadcasters.{" "}
          <br className="hidden md:block" />
          <span className="text-foreground">
            Scale your cluster. Automate your capital.
          </span>
        </p>

        {/* Adaptive Button Stack */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <Button
            asChild
            className="flex-1 rounded-2xl md:rounded-[2rem] h-16 md:h-24 text-base md:text-lg font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-95 group"
          >
            <Link href="https://t.me/YOUR_BOT_USERNAME">
              Launch Bot{" "}
              <ArrowRight className="ml-3 md:ml-4 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-2xl md:rounded-[2rem] h-16 md:h-24 text-base md:text-lg font-black uppercase tracking-[0.2em] border-border/40 bg-card/40 backdrop-blur-3xl hover:bg-muted/20 transition-all"
          >
            <Link href="/register">Deploy Node</Link>
          </Button>
        </div>
      </section>

      {/* --- INFRASTRUCTURE TELEMETRY --- */}
      <section
        id="infrastructure"
        className="w-full px-6 md:px-8 py-16 md:py-20 bg-muted/5 border-b border-border/40 overflow-hidden relative"
      >
        <Globe className="absolute -right-10 -bottom-10 h-48 w-48 md:h-64 md:w-64 opacity-[0.02] rotate-12" />

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 lg:gap-20">
          <StatNode label="Active Clusters" value="840+" />
          <StatNode label="Verified Identities" value="122k" />
          <StatNode label="Node Uptime" value="99.9%" />
          <StatNode label="Capital Flow" value="$1.2M" />
        </div>
      </section>

      {/* --- PRICING: PROTOCOL TIERS --- */}
      <section
        id="pricing"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-40 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[180px] -z-10 pointer-events-none" />

        <div className="flex flex-col items-center mb-16 md:mb-32 text-center space-y-3 md:space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Layers className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Scalability Protocol
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
            Choose Your <span className="text-primary">Tier.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto">
          <PricingCard
            name="Starter"
            price="49"
            desc="Individual Broadcaster"
            features={[
              "2 Service Nodes",
              "Basic Analytics",
              "Standard Payouts",
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
              "Priority Handshake",
              "1.5% Platform Fee",
              "Coupon Engine",
            ]}
          />
          <PricingCard
            name="Institutional"
            price="Custom"
            desc="Global Enterprise Node"
            features={[
              "Dedicated DB Cluster",
              "White-label Identity",
              "Full API Handshake",
              "0.5% Platform Fee",
              "SLA Protection",
            ]}
          />
        </div>
      </section>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- **/

function StatNode({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 md:gap-2 group cursor-default">
      <span className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">
        {value}
      </span>
      <div className="flex items-center gap-2 opacity-40 italic">
        <Activity className="h-3 w-3" />
        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
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
        "rounded-3xl md:rounded-[3.5rem] p-8 md:p-12 flex flex-col relative transition-all duration-700 backdrop-blur-3xl group cursor-default shadow-2xl",
        featured
          ? "border-primary/40 border-2 md:border-[3px] bg-card/60 lg:scale-105 z-10"
          : "border-border/40 bg-card/30 hover:border-primary/20"
      )}
    >
      <div className="mb-8 md:mb-12">
        <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">
          {name}
        </h3>
        <p className="text-[9px] md:text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-[0.2em] opacity-40 italic">
          {desc}
        </p>
      </div>

      <div className="flex items-baseline gap-2 mb-10 md:mb-16">
        {price !== "Custom" && (
          <span className="text-2xl md:text-4xl font-black italic tracking-tighter text-primary opacity-40">
            $
          </span>
        )}
        <span
          className={cn(
            "font-black italic tracking-tighter leading-none",
            price === "Custom" ? "text-4xl md:text-5xl" : "text-6xl md:text-8xl"
          )}
        >
          {price}
        </span>
        {price !== "Custom" && (
          <span className="text-[8px] md:text-[10px] font-black uppercase text-muted-foreground opacity-30 tracking-[0.3em] ml-2 md:ml-4">
            /NODE
          </span>
        )}
      </div>

      <div className="space-y-4 md:space-y-6 flex-1 mb-10 md:mb-16">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3 md:gap-4 group/item">
            <div
              className={cn(
                "h-5 w-5 md:h-6 md:w-6 rounded-lg flex items-center justify-center shrink-0 border transition-all",
                featured
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-muted/30 border-border/40 text-muted-foreground"
              )}
            >
              <Check className="h-3 w-3" />
            </div>
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest opacity-60 group-hover/item:opacity-100 transition-opacity">
              {f}
            </span>
          </div>
        ))}
      </div>

      <Button
        asChild
        className={cn(
          "w-full h-14 md:h-20 rounded-xl md:rounded-2xl font-black uppercase italic tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-[11px] shadow-2xl transition-all hover:scale-[1.02]",
          featured
            ? "bg-primary text-primary-foreground shadow-primary/20"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Link href="/register">Select {name}</Link>
      </Button>
    </Card>
  );
}
