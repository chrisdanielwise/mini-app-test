import { Button } from "@/components/ui/button"
import { Zap, ArrowRight, ShieldCheck, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">V2.0.0 Live on Neon</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic italic">
          Zipha<span className="text-primary">.</span>
        </h1>
        
        <p className="max-w-2xl text-lg text-muted-foreground font-medium uppercase tracking-tight">
          The high-resiliency automation engine for Telegram Signal providers and Digital Merchants.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          {/* User Entry: Redirects 100% to Bot */}
          <Button asChild size="lg" className="flex-1 rounded-2xl h-14 font-black uppercase italic tracking-widest shadow-xl shadow-primary/20">
            <Link href="https://t.me/YOUR_BOT_USERNAME">Launch Bot <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          
          {/* Staff Entry: Secured by Middleware */}
          <Button asChild variant="outline" size="lg" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest border-border/50">
            <Link href="/dashboard">Merchant Login</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}