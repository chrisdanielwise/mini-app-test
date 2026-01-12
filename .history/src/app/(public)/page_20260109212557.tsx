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
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 🛰️ GLOBAL LANDING PAGE (Tier 1)
 * High-Resiliency, Multi-Viewport Optimized Node.
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* --- HERO: THE ENTRY PROTOCOL --- */}
      <section className="relative flex min-h-[90vh] md:min-h-screen flex-col items-center justify-center overflow-hidden px-4 md:px-6 py-20 text-center">
        {/* Background Grid Protocol */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Cpu className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            V2.0.0 Global Node Active
          </span>
        </div>

        {/* Fluid Typography: Massive for Desktop, Scaled for Mobile */}
        <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.8] mb-8 md:mb-12">
          Signal
          <br />
          <span className="text-primary">Mastery.</span>
        </h1>

        <p className="max-w-xs sm:max-w-md md:max-w-2xl text-base md:text-xl text-muted-foreground font-medium uppercase tracking-tight mb-12 md:mb-16 opacity-80 leading-snug md:leading-relaxed">
          The autonomous infrastructure for Telegram Merchants.{" "}
          <br className="hidden md:block" />
          Verify identities, automate billing, and scale your cluster with zero
          friction.
        </p>

        {/* Adaptive Button Stack */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-sm sm:max-w-2xl">
          <Button
            asChild
            size="lg"
            className="flex-1 rounded-2xl md:rounded-[2.5rem] h-16 md:h-24 text-sm md:text-md font-black uppercase italic tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Link href="https://t.me/YOUR_BOT_USERNAME">
              Launch Bot <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 rounded-2xl md:rounded-[2.5rem] h-16 md:h-24 text-sm md:text-md font-black uppercase tracking-widest border-border/60 bg-card/50 backdrop-blur-md hover:bg-muted/50 transition-all"
          >
            <Link href="/register">Start Merchant Node</Link>
          </Button>
        </div>
      </section>

      {/* --- INFRASTRUCTURE STATS --- */}
      <section
        id="infrastructure"
        className="w-full px-6 py-16 md:py-12 border-y border-border/40 bg-muted/5 text-center"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <StatNode label="Active Clusters" value="840+" />
          <StatNode label="Verified Users" value="122k" />
          <StatNode label="System Uptime" value="99.9%" />
          <StatNode label="Transactions" value="1.2M" />
        </div>
      </section>

      {/* --- PRICING: MERCHANT PROTOCOLS --- */}
      <section
        id="pricing"
        className="max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-40 relative overflow-hidden"
      >
        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[100px] md:blur-[150px] -z-10" />

        <div className="flex flex-col items-center mb-16 md:mb-24 text-center">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter">
            Scalable <span className="text-primary">Tiers.</span>
          </h2>
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-4">
            Platform Licensing Protocols
          </p>
        </div>

        {/* Responsive Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          <PricingCard
            name="Starter"
            price="49"
            desc="For individual providers."
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
            desc="For high-traffic merchants."
            features={[
              "Unlimited Nodes",
              "Advanced Charts",
              "Priority Handshake",
              "1.5% Platform Fee",
              "Coupon Engine",
            ]}
          />
          <PricingCard
            name="Elite"
            price="Custom"
            desc="For institutional clusters."
            features={[
              "Dedicated DB Instance",
              "White-label Bot",
              "API Access",
              "0.5% Platform Fee",
              "SLA Guarantee",
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
    <div className="flex flex-col gap-1">
      <span className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase">
        {value}
      </span>
      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function PricingCard({ name, price, desc, features, featured }: any) {
  return (
    <Card
      className={cn(
        "rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 flex flex-col relative transition-all duration-500",
        featured
          ? "border-primary border-2 shadow-2xl shadow-primary/10 bg-card lg:scale-105 z-10"
          : "border-border/50 bg-muted/20"
      )}
    >
      <div className="mb-8 md:mb-10">
        <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter">
          {name}
        </h3>
        <p className="text-[8px] md:text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-widest opacity-60">
          {desc}
        </p>
      </div>

      <div className="flex items-baseline gap-1 mb-10 md:mb-12">
        {price !== "Custom" && <span className="text-3xl md:text-5xl font-black italic tracking-tighter">$</span>}
        <span className={cn(
          "font-black italic tracking-tighter leading-none",
          price === "Custom" ? "text-4xl md:text-6xl" : "text-6xl md:text-8xl"
        )}>
          {price}
        </span>
        {price !== "Custom" && <span className="text-[10px] md:text-xs font-black uppercase text-muted-foreground opacity-50 tracking-widest ml-2 md:ml-3">
          /mo
        </span>}
      </div>

      <div className="space-y-4 md:space-y-5 flex-1 mb-12 md:mb-16">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3 md:gap-4">
            <div
              className={cn(
                "h-4 w-4 md:h-5 md:w-5 rounded flex items-center justify-center shrink-0",
                featured
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Check className="h-2.5 w-2.5 md:h-3 md:w-3" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tight opacity-80">
              {f}
            </span>
          </div>
        ))}
      </div>

      <Button
        asChild
        className={cn(
          "w-full h-14 md:h-16 rounded-xl md:rounded-2xl font-black uppercase italic tracking-widest text-[10px] md:text-xs shadow-lg",
          featured
            ? "bg-primary shadow-primary/20"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Link href="/register">Select {name}</Link>
      </Button>
    </Card>
  );
}