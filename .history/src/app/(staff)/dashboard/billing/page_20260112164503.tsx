import { requireStaff } from "@/lib/auth/session";
import { getMerchantById } from "@/lib/services/merchant.service";
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
  Globe,
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * 🏛️ BILLING & RESOURCE TERMINAL (Institutional v9.3.8)
 * Fix: RBAC-Aware logic prevents 'null.slice' crash for Super Admins.
 * Fix: Dynamic content rendering for Platform Staff vs. Merchant Nodes.
 */
export default async function BillingPage() {
  // 🛡️ 1. Auth Guard: Verify administrative credentials
  const session = await requireStaff();
  const realMerchantId = session.merchantId;
  const isSuperAdmin = session.user.role === "super_admin";

  // 🛰️ 2. Fetch data only if a merchant context exists
  const merchant = realMerchantId ? await getMerchantById(realMerchantId) : null;
  const currentPlan = isSuperAdmin ? "System Master" : (merchant?.planStatus || "Institutional");

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 px-4 text-foreground">
      
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-6 w-full border-b border-border/40 pb-6">
        <div className="flex flex-col gap-3 min-w-fit flex-1">
          <div className="flex items-center gap-2 text-primary/60">
            <Layers className="h-4 w-4 shrink-0 fill-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-80 whitespace-nowrap">
              {isSuperAdmin ? "Global Resource Allocation" : "Merchant Resource Node"}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase italic leading-none">
              Billing <span className="text-primary">& Plan</span>
            </h1>
            <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 opacity-40 italic">
              {/* 🚀 FIXED: Null-safe Node ID Check */}
              Node ID: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "PLATFORM_ROOT"} // Epoch_Sync: Stable
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Badge
            variant="outline"
            className="h-9 px-4 border-primary/20 bg-primary/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary shadow-sm"
          >
            <Clock className="mr-2 h-3.5 w-3.5" />
            Next Epoch: {format(new Date(2026, 1, 8), "MMM dd, yyyy")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* --- LEFT: ACTIVE PROTOCOL CARD --- */}
        <div className={cn(
          "xl:col-span-2 group relative overflow-hidden rounded-2xl border p-6 md:p-10 backdrop-blur-3xl shadow-xl transition-all",
          isSuperAdmin ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-border/40 bg-card/40 hover:border-primary/20"
        )}>
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none rotate-12">
            {isSuperAdmin ? <ShieldCheck className="h-48 w-48 md:h-64 md:w-64 text-amber-500" /> : <Zap className="h-48 w-48 md:h-64 md:w-64 text-primary" />}
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full space-y-8 md:space-y-10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 italic leading-none">
                  {isSuperAdmin ? "Authority Clearance" : "Current Access Tier"}
                </p>
                <h2 className={cn(
                  "text-3xl sm:text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none",
                  isSuperAdmin ? "text-amber-500" : "text-primary"
                )}>
                  {currentPlan}
                </h2>
              </div>
              <div className={cn(
                "h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl flex items-center justify-center border shadow-inner",
                isSuperAdmin ? "bg-amber-500/10 border-amber-500/10" : "bg-primary/5 border-primary/10"
              )}>
                {isSuperAdmin ? <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-amber-500" /> : <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary" />}
              </div>
            </div>

            {/* Capacity Telemetry */}
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {(isSuperAdmin ? [
                "Unlimited Platform Sovereignty",
                "Full Database Access Keys",
                "Infrastructure Oversight",
                "Root-Level Configuration"
              ] : [
                "Capacity: 500 Subscribers",
                "Unlimited Signal Nodes",
                "White-Label Bot Protocol",
                "Priority Support Handshake",
              ]).map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <div className={cn(
                    "h-5 w-5 shrink-0 rounded-md flex items-center justify-center border",
                    isSuperAdmin ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                  )}>
                    <CheckCircle2 className={cn("h-3 w-3", isSuperAdmin ? "text-amber-500" : "text-emerald-500")} />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-foreground/70 truncate">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {!isSuperAdmin && (
              <div className="flex flex-col sm:flex-row gap-2.5 pt-6 border-t border-border/10">
                <Button className="h-11 md:h-12 px-6 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                  Upgrade Node Plan
                </Button>
                <Button variant="outline" className="h-11 md:h-12 px-6 rounded-xl border-border/40 bg-muted/10 font-bold uppercase text-[9px] tracking-widest text-foreground">
                  Audit Invoices
                </Button>
              </div>
            )}
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

              {isSuperAdmin ? (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-inner">
                  <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-2 italic">
                    Administrative Override
                  </p>
                  <p className="text-[10px] font-bold text-foreground/60 uppercase leading-tight italic">
                    Platform root accounts bypass standard payment processing gateways.
                  </p>
                </div>
              ) : (
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
              )}
            </div>

            {!isSuperAdmin && (
              <Button variant="ghost" className="text-primary font-black uppercase italic tracking-widest text-[9px] p-0 h-auto justify-start hover:bg-transparent hover:text-primary/70 group">
                Update Identity Card
                <ChevronRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-muted/5 border border-border/10 space-y-2 opacity-40">
            <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3" />
              <p className="text-[8px] font-black uppercase tracking-widest leading-none">Compliance Audit</p>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground leading-relaxed uppercase tracking-widest">
              SSL/TLS Node verified. Syncing with Platform Epoch {isSuperAdmin ? "ROOT" : "V2"}.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div className="flex items-center justify-center gap-3 opacity-20 py-6">
        <Globe className="h-3 w-3 text-muted-foreground" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground italic text-center leading-none">
          Administrative Core Synchronized // Node_Ref_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "PLATFORM_ROOT"}
        </p>
      </div>
    </div>
  );
}