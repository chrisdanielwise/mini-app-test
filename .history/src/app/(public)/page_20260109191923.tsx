import { Button } from "@/components/ui/button"
import { Zap, ArrowRight, ShieldCheck, BarChart3, Globe, Terminal } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* --- HERO SECTION --- */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Zap className="h-4 w-4 text-primary fill-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">V2.0.0 Performance Node Live</span>
        </div>
        
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] mb-8">
          Signal<br /><span className="text-primary">Economy.</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-medium uppercase tracking-tight mb-12 opacity-80">
          The infrastructure for elite Signal Providers. <br className="hidden md:block" /> 
          Automated subscriptions, instant delivery, zero friction.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          {/* Main Funnel: Regular Users go to Bot */}
          <Button asChild size="lg" className="flex-1 rounded-[2rem] h-20 text-md font-black uppercase italic tracking-widest shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95">
            <Link href="https://t.me/YOUR_BOT_USERNAME">
              Launch Bot <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="flex-1 rounded-[2rem] h-20 text-md font-black uppercase tracking-widest border-border/60 hover:bg-muted/50 transition-all">
            <Link href="/dashboard">Merchant Portal</Link>
          </Button>
        </div>
      </section>

      {/* --- FEATURE GRID --- */}
      <section id="features" className="container mx-auto px-6 py-32 border-t border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={ShieldCheck} 
            title="Secure Ledger" 
            desc="Stateless JWT handshakes and Neon-based financial tracking."
          />
          <FeatureCard 
            icon={Terminal} 
            title="Webhooks" 
            desc="Connect TradingView or MT4 alerts directly to your VIP nodes."
          />
          <FeatureCard 
            icon={Globe} 
            title="Global Edge" 
            desc="Optimized for multi-currency payments and instant channel access."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex flex-col gap-4 p-8 rounded-[3rem] border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-colors group">
      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-black uppercase italic tracking-tighter">{title}</h3>
      <p className="text-sm font-medium text-muted-foreground uppercase leading-relaxed tracking-tight">{desc}</p>
    </div>
  )
}