import { requireMerchantSession } from "@/lib/auth/merchant-session";
import { MerchantService } from "@/lib/services/merchant.service";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Clock,
  Terminal,
  Layers,
  ShieldCheck,
  ChevronRight,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * 🏛️ BILLING & RESOURCE TERMINAL (Tactical Medium)
 * Normalized: World-standard fluid scaling for administrative resource nodes.
 * Optimized: High-density layout to prevent horizontal cropping.
 */
export default async function BillingPage() {
  // 🛡️ 1. Auth Guard: Synchronized with hardened session protocol
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;

  const merchant = await MerchantService.getById(realMerchantId);
  const currentPlan = merchant?.planStatus || "Institutional";

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 px-4">
      
      {/* --- COMMAND HUD HEADER: TACTICAL SYNC --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary/60">
            <Layers className="h-4 w-4 shrink-0 fill-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              Resource Allocation Node
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">
              Billing <span className="text-primary">& Plan</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic">
              Node ID: {realMerchantId.slice(0, 8)} // Epoch_Sync: Stable
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Badge
            variant="outline"
            className="h-9 px-4 border-primary/20 bg-primary/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary shadow-sm"
          >
            <Clock className="mr-2 h-3.5 w-3.5" />
            Next Epoch: Feb 08, 2026
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* --- LEFT: ACTIVE PROTOCOL CARD (High Density) --- */}
        <div className="xl:col-span-2 group relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-6 md:p-10 backdrop-blur-3xl shadow-xl transition-all hover:border-primary/20">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none rotate-12">
            <Zap className="h-48 w-48 md:h-64 md:w-64 text-primary" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full space-y-8 md:space-y-10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 italic leading-none">
                  Current Access Tier
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary italic uppercase tracking-tighter leading-none">
                  {currentPlan}
                </h2>
              </div>
              <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
            </div>

            {/* Capacity Telemetry: Compact Grid */}
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {[
                "Capacity: 500 Subscribers",
                "Unlimited Signal Nodes",
                "White-Label Bot Protocol",
                "Priority Support Handshake",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2.5 group/item"
                >
                  <div className="h-5 w-5 shrink-0 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-foreground/70 truncate">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-6 border-t border-border/10">
              <Button className="h-11 md:h-12 px-6 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                Change Node Plan
              </Button>
              <Button
                variant="outline"
                className="h-11 md:h-12 px-6 rounded-xl border-border/40 bg-muted/10 font-bold uppercase text-[9px] tracking-widest"
              >
                Audit Invoices
              </Button>
            </div>
          </div>
        </div>

        {/* --- RIGHT: PAYMENT GATEWAY NODE --- */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8 backdrop-blur-3xl shadow-xl flex flex-col gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary/60">
                <CreditCard className="h-4 w-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">
                  Payment Terminal
                </h3>
              </div>

              <div className="rounded-xl border border-border/10 bg-muted/10 p-5 shadow-inner group cursor-pointer hover:border-primary/20 transition-all">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-40 italic">
                  Verified Visa Node
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-base md:text-lg font-bold tracking-widest leading-none">
                    •••• 4242
                  </p>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              className="text-primary font-black uppercase italic tracking-widest text-[9px] p-0 h-auto justify-start hover:bg-transparent hover:text-primary/70 group"
            >
              Update Identity Card
              <ChevronRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* System Compliance Node: Compact */}
          <div className="p-5 md:p-6 rounded-2xl bg-muted/5 border border-border/10 space-y-2 opacity-40">
            <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3" />
              <p className="text-[8px] font-black uppercase tracking-widest">
                Compliance Audit
              </p>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest">
              Encrypted SSL/TLS channels active. 30-day epoch synchronization enabled.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-6">
        <Globe className="h-3 w-3 text-muted-foreground" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-center">
          Administrative Core Synchronized // Node_Ref_{realMerchantId.slice(0, 8)}
        </p>
      </div>
    </div>
  );
}