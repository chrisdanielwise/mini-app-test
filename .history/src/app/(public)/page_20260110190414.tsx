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
 * High-Resiliency, Institutional-Grade Marketing Node.
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* --- HERO: THE ENTRY PROTOCOL --- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-32 text-center border-b border-border/40">
        {/* Institutional Grid Protocol */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] md:bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Floating Asset: Identity Node */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
          <Fingerprint className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            Zipha_Core_v2.0.26_Online
          </span>
        </div>

        {/* Fluid Typography: Massive for Presence */}
        <div className="space-y-4 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[13rem] font-black tracking-tighter uppercase italic leading-[0.75]">
            Signal
            <br />
            <span className="text-primary">Mastery.</span>
          </h1>
          <div className="flex items-center justify-center gap-4 opacity-20">
            <div className="h-px w-12 bg-foreground" />
            <p className="text-[10px] font-black uppercase tracking-[0.6em]">
              Autonomous Merchant Infrastructure
            </p>
            <div className="h-px w-12 bg-foreground" />
          </div>
        </div>

        <p className="max-w-2xl text-lg md:text-2xl text-muted-foreground font-black uppercase tracking-tight mb-20 opacity-60 leading-tight italic">
          Architecting the future of Telegram signal broadcasters. <br />
          <span className="text-foreground">
            Scale your cluster. Automate your capital.
          </span>
        </p>

        {/* Adaptive Button Stack */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <Button
            asChild
            size="lg"
            className="flex-1 rounded-[2rem] h-24 text-lg font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <Link href="https://t.me/YOUR_BOT_USERNAME">
              Launch Bot{" "}
              <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 rounded-[2rem] h-24 text-lg font-black uppercase tracking-[0.2em] border-border/40 bg-card/40 backdrop-blur-3xl hover:bg-muted/20 transition-all shadow-xl"
          >
            <Link href="/register">Deploy Node</Link>
          </Button>
        </div>
      </section>

      {/* --- INFRASTRUCTURE TELEMETRY --- */}
      <section
        id="infrastructure"
        className="w-full px-8 py-20 bg-muted/5 border-b border-border/40 overflow-hidden relative"
      >
        <Globe className="absolute -right-10 -bottom-10 h-64 w-64 opacity-[0.02] rotate-12" />

        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
          <StatNode label="Active Clusters" value="840+" />
          <StatNode label="Verified Identities" value="122k" />
          <StatNode label="Node Uptime" value="99.99%" />
          <StatNode label="Capital Flow" value="$1.2M" />
        </div>
      </section>

      {/* --- PRICING: PROTOCOL TIERS --- */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-40 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[180px] -z-10" />

        <div className="flex flex-col items-center mb-32 text-center space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Layers className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              Scalability Protocol
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
            Choose Your <span className="text-primary">Tier.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
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
    <div className="flex flex-col gap-2 group cursor-default">
      <span className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">
        {value}
      </span>
      <div className="flex items-center gap-2 opacity-40 italic">
        <Activity className="h-3 w-3" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">
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
        "rounded-[3.5rem] p-12 flex flex-col relative transition-all duration-700 backdrop-blur-3xl group cursor-default",
        featured
          ? "border-primary/40 border-[3px] shadow-2xl shadow-primary/20 bg-card/60 lg:scale-105 z-10"
          : "border-border/40 bg-card/30 hover:border-primary/20"
      )}
    >
      <div className="mb-12">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter">
          {name}
        </h3>
        <p className="text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-[0.2em] opacity-40 italic">
          {desc}
        </p>
      </div>

      <div className="flex items-baseline gap-2 mb-16">
        {price !== "Custom" && (
          <span className="text-4xl font-black italic tracking-tighter text-primary opacity-40">
            $
          </span>
        )}
        <span
          className={cn(
            "font-black italic tracking-tighter leading-none",
            price === "Custom" ? "text-5xl" : "text-8xl"
          )}
        >
          {price}
        </span>
        {price !== "Custom" && (
          <span className="text-[10px] font-black uppercase text-muted-foreground opacity-30 tracking-[0.4em] ml-4">
            /NODE
          </span>
        )}
      </div>

      <div className="space-y-6 flex-1 mb-16">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-4 group/item">
            <div
              className={cn(
                "h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border transition-all",
                featured
                  ? "bg-primary/20 border-primary/40 text-primary"
                  : "bg-muted/30 border-border/40 text-muted-foreground"
              )}
            >
              <Check className="h-3 w-3" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest opacity-60 group-hover/item:opacity-100 transition-opacity">
              {f}
            </span>
          </div>
        ))}
      </div>

      <Button
        asChild
        className={cn(
          "w-full h-20 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[11px] shadow-2xl transition-all hover:scale-[1.05]",
          featured
            ? "bg-primary text-primary-foreground shadow-primary/20"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Link href="/register">Select {name}</Link>
      </Button>
    </Card> // ✅ FIXED: Changed </div> to </Card>
  );
}
