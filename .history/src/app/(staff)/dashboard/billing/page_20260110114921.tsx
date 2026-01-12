import { requireMerchantSession } from "@/src/lib/auth/merchant-auth"
import { MerchantService } from "@/src/lib/services/merchant.service"
import { Button } from "@/src/components/ui/button"
import { 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ArrowUpRight,
  Terminal,
  Activity,
  Layers,
  ShieldCheck,
  ChevronRight
} from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { cn } from "@/src/lib/utils"

/**
 * 🏛️ BILLING & RESOURCE TERMINAL (Tier 2)
 * High-resiliency management of merchant capacity and subscription status.
 */
export default async function BillingPage() {
  // 🛡️ 1. Auth Guard: Verify administrative node session
  const session = await requireMerchantSession()
  const merchant = await MerchantService.getById(session.merchant.id)

  const currentPlan = merchant?.planStatus || "Institutional"

  return (
    <div className="mx-auto max-w-6xl space-y-16 p-8 sm:p-12 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* --- HUD HEADER --- */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-4 w-4 fill-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Resource Allocation Node
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Billing <span className="text-primary">& Plan</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40 italic mt-4">
            Manage institutional capacity and capital epochs.
          </p>
        </div>

        <Badge variant="outline" className="h-12 border-primary/30 bg-primary/5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-inner">
          <Clock className="mr-3 h-4 w-4" />
          Next Epoch: Feb 08, 2026
        </Badge>
      </div>

      <div className="grid gap-10 xl:grid-cols-3">
        
        {/* --- LEFT: ACTIVE PROTOCOL CARD --- */}
        <div className="xl:col-span-2 group relative overflow-hidden rounded-[3.5rem] border border-border/40 bg-card/40 p-10 md:p-14 backdrop-blur-3xl shadow-2xl transition-all hover:border-primary/20">
          
          <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none rotate-12 scale-150">
            <Zap className="h-96 w-96 text-primary" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full space-y-12">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 italic">Current Access Tier</p>
                <h2 className="text-6xl font-black text-primary italic uppercase tracking-tighter leading-none">
                  {currentPlan}
                </h2>
              </div>
              <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Capacity Telemetry */}
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                "Capacity: 500 Subscribers",
                "Unlimited Signal Nodes",
                "White-Label Bot Protocol",
                "Priority Support Handshake"
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-4 group/item">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                     <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-foreground/80 group-hover/item:text-foreground transition-colors">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-10 border-t border-border/20">
              <Button className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[11px] shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-all">
                Change Node Plan
              </Button>
              <Button variant="outline" className="h-16 px-10 rounded-2xl border-border/40 bg-muted/10 font-black uppercase text-[10px] tracking-widest">
                Audit Invoices
              </Button>
            </div>
          </div>
        </div>

        {/* --- RIGHT: PAYMENT GATEWAY NODE --- */}
        <div className="space-y-8">
          <div className="rounded-[3rem] border border-border/40 bg-card/40 p-10 backdrop-blur-3xl shadow-2xl flex flex-col justify-between aspect-square lg:aspect-auto">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-primary">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                   <CreditCard className="h-4 w-4" />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em]">Payment Terminal</h3>
              </div>
              
              <div className="rounded-3xl border border-border/40 bg-muted/20 p-8 shadow-inner group cursor-pointer hover:border-primary/30 transition-all">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3 opacity-40 italic italic">Verified Visa Node</p>
                <div className="flex items-center justify-between">
                   <p className="font-mono text-xl font-black tracking-widest">•••• 4242</p>
                   <ShieldCheck className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </div>

            <Button variant="ghost" className="text-primary font-black uppercase italic tracking-[0.2em] text-[10px] p-0 h-auto justify-start mt-10 hover:bg-transparent hover:text-primary/70 group">
              Update Identity Card 
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* System Compliance Node */}
          <div className="p-8 rounded-[2.5rem] bg-muted/10 border border-border/40 space-y-4">
             <div className="flex items-center gap-2 opacity-30">
                <Terminal className="h-3 w-3" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Compliance Audit</p>
             </div>
             <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest opacity-50">
               All transactions are broadcasted via encrypted SSL/TLS channels. Billing cycles are strictly 30-day epochs.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}