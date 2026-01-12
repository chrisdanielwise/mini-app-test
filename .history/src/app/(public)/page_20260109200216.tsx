import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Zap, ArrowRight, ShieldCheck, BarChart3, 
  Terminal, Globe, Check, Users, Cpu 
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      
      {/* --- HERO: THE ENTRY PROTOCOL --- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-24 text-center">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Cpu className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">V2.0.0 Global Node Active</span>
        </div>
        
        <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter uppercase italic leading-[0.7] mb-12">
          Signal<br /><span className="text-primary">Mastery.</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-medium uppercase tracking-tight mb-16 opacity-80 leading-relaxed">
          The autonomous infrastructure for Telegram Merchants. <br className="hidden md:block" /> 
          Verify identities, automate billing, and scale your cluster with zero friction.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
          <Button asChild size="lg" className="flex-1 rounded-[2.5rem] h-24 text-md font-black uppercase italic tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95">
            <Link href="https://t.me/YOUR_BOT_USERNAME">
              Launch Bot <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="flex-1 rounded-[2.5rem] h-24 text-md font-black uppercase tracking-widest border-border/60 bg-card/50 backdrop-blur-md hover:bg-muted/50 transition-all">
            <Link href="/register">Start Merchant Node</Link>
          </Button>
        </div>
      </section>

      {/* --- INFRASTRUCTURE STATS --- */}
      <section id="infrastructure" className="container mx-auto px-6 py-12 border-y border-border/40 bg-muted/5 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <StatNode label="Active Clusters" value="840+" />
          <StatNode label="Verified Users" value="122k" />
          <StatNode label="System Uptime" value="99.9%" />
          <StatNode label="Transactions" value="1.2M" />
        </div>
      </section>

      {/* --- PRICING: MERCHANT PROTOCOLS --- */}
      <section id="pricing" className="container mx-auto px-6 py-40 border-t border-border/40 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        
        <div className="flex flex-col items-center mb-24 text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Scalable <span className="text-primary">Tiers.</span></h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-4">Platform Licensing Protocols</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard 
            name="Starter" 
            price="49" 
            desc="For individual signal providers."
            features={["2 Service Nodes", "Basic Analytics", "Standard Payouts", "3% Platform Fee"]}
          />
          <PricingCard 
            name="Professional" 
            price="149" 
            featured
            desc="For high-traffic merchants."
            features={["Unlimited Nodes", "Advanced Charts", "Priority Handshake", "1.5% Platform Fee", "Coupon Engine"]}
          />
          <PricingCard 
            name="Elite" 
            price="Custom" 
            desc="For institutional signal clusters."
            features={["Dedicated DB Instance", "White-label Bot", "API Access", "0.5% Platform Fee", "SLA Guarantee"]}
          />
        </div>
      </section>
    </div>
  )
}

/** --- ATOMIC COMPONENTS --- **/

function StatNode({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-4xl font-black italic tracking-tighter uppercase">{value}</span>
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  )
}

function PricingCard({ name, price, desc, features, featured }: any) {
  return (
    <Card className={`rounded-[3.5rem] p-12 flex flex-col relative transition-all duration-500 ${featured ? 'border-primary border-2 shadow-2xl shadow-primary/10 bg-card scale-105 z-10' : 'border-border/50 bg-muted/20'}`}>
      <div className="mb-10">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">{name}</h3>
        <p className="text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-widest opacity-60">{desc}</p>
      </div>

      <div className="flex items-baseline gap-1 mb-12">
        <span className="text-5xl font-black italic tracking-tighter">$</span>
        <span className="text-8xl font-black italic tracking-tighter leading-none">{price}</span>
        <span className="text-xs font-black uppercase text-muted-foreground opacity-50 tracking-widest ml-3">/mo</span>
      </div>

      <div className="space-y-5 flex-1 mb-16">
        {features.map((f: string) => (
          <div key={f} className="flex items-center gap-4">
            <div className={`h-5 w-5 rounded-md flex items-center justify-center ${featured ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              <Check className="h-3 w-3" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight opacity-80">{f}</span>
          </div>
        ))}
      </div>

      <Button asChild className={`w-full h-16 rounded-2xl font-black uppercase italic tracking-widest text-xs ${featured ? 'bg-primary shadow-xl shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
        <Link href="/register">Select {name}</Link>
      </Button>
    </Card>
  )
}