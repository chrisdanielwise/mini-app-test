import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Zap, ArrowRight, ShieldCheck, BarChart3, 
  Layers, Terminal, Globe, Check, Users 
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      
      {/* --- HERO: THE FUNNEL --- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-24 text-center">
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Zap className="h-4 w-4 text-primary fill-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">V2.0.0 Global Node Active</span>
        </div>
        
        <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.75] mb-10">
          Signal<br /><span className="text-primary">Economy.</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-medium uppercase tracking-tight mb-14 opacity-80 leading-relaxed">
          The high-resiliency infrastructure for digital merchants. <br className="hidden md:block" /> 
          Deploy subscription nodes, automate deliveries, and scale in Telegram.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
          <Button asChild size="lg" className="flex-1 rounded-[2.5rem] h-24 text-md font-black uppercase italic tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95">
            <Link href="https://t.me/YOUR_BOT_USERNAME">
              Access Bot <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="flex-1 rounded-[2.5rem] h-24 text-md font-black uppercase tracking-widest border-border/60 bg-card/50 backdrop-blur-md hover:bg-muted/50 transition-all">
            <Link href="/register">Start Merchant Node</Link>
          </Button>
        </div>
      </section>

      {/* --- PLATFORM STATS: SOCIAL PROOF --- */}
      <section className="container mx-auto px-6 py-12 border-y border-border/40 bg-muted/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatNode label="Active Nodes" value="1,240+" />
          <StatNode label="Verified Users" value="85k" />
          <StatNode label="Global Uptime" value="99.9%" />
          <StatNode label="Total Volume" value="$2.8M" />
        </div>
      </section>

      {/* --- FEATURES: THE CORE --- */}
      <section id="features" className="container mx-auto px-6 py-40">
        <div className="flex flex-col items-center mb-24 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
            Engineered for <span className="text-primary">Precision.</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">The Tech Stack of Top 1% Signal Providers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={ShieldCheck} 
            title="Secure Ledger" 
            desc="Stateless identity verification and Neon-based financial auditing for absolute node security."
          />
          <FeatureCard 
            icon={Terminal} 
            title="Bot Automation" 
            desc="100% automated subscription lifecycle from payment to channel invitation and periodic revocation."
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Real-time Analytics" 
            desc="Deep-dive into revenue velocity and subscriber churn with our high-fidelity merchant dashboard."
          />
        </div>
      </section>

      {/* --- PRICING: MERCHANT TIERS --- */}
      <section id="pricing" className="container mx-auto px-6 py-40 border-t border-border/40 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        
        <div className="flex flex-col items-center mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Choose Your <span className="text-primary">Tier.</span></h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-4">Merchant Licensing Protocols</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard 
            name="Starter" 
            price="49" 
            desc="For individual signal providers starting their node."
            features={["3 Service Nodes", "Basic Analytics", "Community Support", "5% Transaction Fee"]}
          />
          <PricingCard 
            name="Pro" 
            price="149" 
            featured
            desc="For high-traffic merchants scaling their operations."
            features={["Unlimited Nodes", "Advanced Charts", "Priority Handshake", "2% Transaction Fee", "Custom Branding"]}
          />
          <PricingCard 
            name="Enterprise" 
            price="499" 
            desc="Bespoke infrastructure for institutional clusters."
            features={["Dedicated DB Instance", "White-label Bot", "24/7 Ops Support", "0.5% Transaction Fee", "API Access"]}
          />
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="container mx-auto px-6 py-40 border-t border-border/40 text-center">
        <div className="max-w-4xl mx-auto rounded-[4rem] bg-primary p-16 md:p-24 text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 leading-none">
            Ready to <br />Deploy?
          </h2>
          <p className="text-lg font-bold uppercase tracking-tight mb-12 opacity-90 max-w-xl mx-auto">
            Join 1,200+ merchants running their signal business on the Zipha Protocol.
          </p>
          <Button asChild variant="secondary" size="lg" className="h-20 px-12 rounded-[2rem] font-black uppercase italic tracking-widest text-lg transition-transform hover:scale-105 active:scale-95">
            <Link href="/register">Launch Merchant Node</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

/** --- ATOMIC COMPONENTS --- **/

function StatNode({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-3xl font-black italic tracking-tighter uppercase">{value}</span>
      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <Card className="rounded-[3rem] border-border/50 bg-card/30 backdrop-blur-md hover:border-primary/40 transition-all group p-10 shadow-xl shadow-black/5">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 mb-8">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{title}</h3>
      <p className="text-sm font-medium text-muted-foreground uppercase leading-relaxed tracking-tight opacity-80">{desc}</p>
    </Card>
  )
}

function PricingCard({ name, price, desc, features, featured }: any) {
  return (
    <Card className={`rounded-[3rem] p-10 flex flex-col relative transition-all duration-500 ${featured ? 'border-primary border-2 shadow-2xl shadow-primary/10 bg-card scale-105 z-10' : 'border-border/50 bg-muted/20'}`}>
      {featured && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Most Deployed</div>}
      
      <div className="mb-8">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">{name}</h3>
        <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-tight opacity-70">{desc}</p>
      </div>

      <div className="flex items-baseline gap-1 mb-10">
        <span className="text-5xl font-black italic tracking-tighter">$</span>
        <span className="text-7xl font-black italic tracking-tighter leading-none">{price}</span>
        <span className="text-xs font-black uppercase text-muted-foreground opacity-50 tracking-widest ml-2">/mo</span>
      </div>

      <div className="space-y-4 flex-1 mb-12">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-3">
            <div className={`h-5 w-5 rounded-md flex items-center justify-center ${featured ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              <Check className="h-3 w-3" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight opacity-80">{f}</span>
          </div>
        ))}
      </div>

      <Button asChild className={`w-full h-16 rounded-2xl font-black uppercase italic tracking-widest ${featured ? 'bg-primary shadow-xl shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
        <Link href="/register">Choose {name}</Link>
      </Button>
    </Card>
  )
}