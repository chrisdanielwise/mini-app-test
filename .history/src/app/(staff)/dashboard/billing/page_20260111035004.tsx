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
  ChevronRight 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * 🏛️ BILLING & RESOURCE TERMINAL (Apex Tier)
 * Normalized: World-standard typography and responsive viewport constraints.
 * Fixed: Identity handshake aligned with session.merchantId.
 */
export default async function BillingPage() {
  // 🛡️ 1. Auth Guard: Synchronized with hardened session protocol
  const session = await requireMerchantSession();
  const realMerchantId = session.merchantId;
  
  const merchant = await MerchantService.getById(realMerchantId);
  const currentPlan = merchant?.planStatus || "Institutional";

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      
      {/* --- HUD HEADER --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-8 md:pb-12">
        <div className="space-y-2 md:space-y-4">
          <div className="flex items-center gap-3 text-primary mb-1">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-3.5 w-3.5 md:h-4 md:w-4 fill-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Resource Allocation Node
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Billing <span className="text-primary">& Plan</span>
          </h1>
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-40 italic">
            Manage institutional capacity and capital epochs.
          </p>
        </div>

        <Badge variant="outline" className="w-fit h-10 md:h-12 border-primary/30 bg-primary/5 px-4 md:px-6 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-inner">
          <Clock className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
          Next Epoch: Feb 08, 2026
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10">
        
        {/* --- LEFT: ACTIVE PROTOCOL CARD --- */}
        <div className="xl:col-span-2 group relative overflow-hidden rounded-3xl md:rounded-[3.5rem] border border-border/40 bg-card/40 p-6 sm:p-10 md:p-12 backdrop-blur-3xl shadow-2xl transition-all hover:border-primary/20">
          
          <div className=\"absolute -top-10 -right-10 opacity-[0.02] pointer-events-none rotate-12 scale-150\">
            <Zap className=\"h-64 w-64 md:h-96 md:w-96 text-primary\" />
          </div>

          <div className=\"relative z-10 flex flex-col justify-between h-full space-y-10 md:space-y-12\">
            <div className=\"flex items-start justify-between\">
              <div className=\"space-y-1 md:space-y-3\">
                <p className=\"text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 italic\">Current Access Tier</p>
                <h2 className=\"text-4xl sm:text-5xl md:text-6xl font-black text-primary italic uppercase tracking-tighter leading-none\">
                  {currentPlan}
                </h2>
              </div>
              <div className=\"h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-[1.5rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-500\">
                <Zap className=\"h-6 w-6 md:h-8 md:w-8 text-primary\" />
              </div>
            </div>

            {/* Capacity Telemetry */}
            <div className=\"grid gap-4 md:gap-6 sm:grid-cols-2\">
              {[
                \"Capacity: 500 Subscribers\",
                \"Unlimited Signal Nodes\",
                \"White-Label Bot Protocol\",
                \"Priority Support Handshake\"
              ].map((feature) => (
                <div key={feature} className=\"flex items-center gap-3 md:gap-4 group/item\">
                  <div className=\"h-6 w-6 shrink-0 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20\">
                     <CheckCircle2 className=\"h-3.5 w-3.5 text-emerald-500\" />
                  </div>
                  <span className=\"text-[10px] md:text-[11px] font-black uppercase tracking-widest text-foreground/80 group-hover/item:text-foreground transition-colors truncate\">{feature}</span>
                </div>
              ))}
            </div>

            <div className=\"flex flex-col sm:flex-row gap-3 md:gap-4 pt-8 md:pt-10 border-t border-border/10\">
              <Button className=\"h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[11px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all\">
                Change Node Plan
              </Button>
              <Button variant=\"outline\" className=\"h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl border-border/40 bg-muted/10 font-black uppercase text-[10px] tracking-widest\">
                Audit Invoices
              </Button>
            </div>
          </div>
        </div>

        {/* --- RIGHT: PAYMENT GATEWAY NODE --- */}
        <div className=\"space-y-6 md:space-y-8\">
          <div className=\"rounded-3xl md:rounded-[3rem] border border-border/40 bg-card/40 p-6 md:p-10 backdrop-blur-3xl shadow-2xl flex flex-col justify-between gap-10 lg:aspect-auto\">
            <div className=\"space-y-6 md:space-y-8\">
              <div className=\"flex items-center gap-3 text-primary\">
                <div className=\"h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center\">
                   <CreditCard className=\"h-4 w-4\" />
                </div>
                <h3 className=\"text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]\">Payment Terminal</h3>
              </div>
              
              <div className=\"rounded-2xl md:rounded-3xl border border-border/40 bg-muted/20 p-6 md:p-8 shadow-inner group cursor-pointer hover:border-primary/30 transition-all\">
                <p className=\"text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-3 opacity-40 italic\">Verified Visa Node</p>
                <div className=\"flex items-center justify-between\">
                   <p className=\"font-mono text-lg md:text-xl font-black tracking-widest leading-none\">•••• 4242</p>
                   <ShieldCheck className=\"h-5 w-5 text-emerald-500\" />
                </div>
              </div>
            </div>

            <Button variant=\"ghost\" className=\"text-primary font-black uppercase italic tracking-[0.2em] text-[10px] p-0 h-auto justify-start hover:bg-transparent hover:text-primary/70 group\">
              Update Identity Card 
              <ChevronRight className=\"ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform\" />
            </Button>
          </div>

          {/* System Compliance Node */}
          <div className=\"p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-muted/10 border border-border/40 space-y-3 md:space-y-4 shadow-sm\">
             <div className=\"flex items-center gap-2 opacity-30\">
                <Terminal className=\"h-3 w-3\" />
                <p className=\"text-[8px] font-black uppercase tracking-[0.4em]\">Compliance Audit</p>
             </div>
             <p className=\"text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest opacity-50\">
               All transactions broadcasted via encrypted SSL/TLS channels. Billing cycles are strictly 30-day epochs. Unauthorized access triggers lockout.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}