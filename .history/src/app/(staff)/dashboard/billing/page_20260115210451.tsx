"use client";

import * as React from "react";
import { format } from "date-fns";
import { 
  CreditCard, CheckCircle2, Zap, Clock, Terminal, 
  Layers, ShieldCheck, ChevronRight, Globe, ShieldAlert,
  Cpu, Activity, Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";

/**
 * 🌊 BILLING_TERMINAL (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Momentum | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with RBAC-Aware Radiance.
 */
export default function BillingPage({ session, merchant }: any) {
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();
  
  // 🛡️ IDENTITY RESOLUTION
  const isSuperAdmin = flavor === "AMBER";
  const realMerchantId = session?.merchantId;
  const currentPlan = isSuperAdmin ? "System Master" : (merchant?.planStatus || "Institutional");

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-screen bg-background animate-pulse" />;

  return (
    <div 
      className={cn(
        "max-w-[1400px] mx-auto space-y-10 md:space-y-16 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.5rem" : "0px",
        paddingRight: isMobile ? "1.5rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <Layers className={cn("size-4", isSuperAdmin ? "text-amber-500" : "text-primary")} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                {isSuperAdmin ? "Global_Resource_Allocation" : "Merchant_Resource_Node"}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-50">v16.31_STABLE</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Billing <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>& Plan</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Terminal className="size-3.5" />
            <span className="tracking-[0.2em]">NODE_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}</span>
            <div className="h-px w-8 bg-white/5" />
            <span className="tracking-[0.1em]">Protocol_Sync: Stable</span>
          </div>
        </div>

        <Badge
          variant="outline"
          className={cn(
            "h-12 px-6 border-white/5 bg-white/[0.02] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic shadow-apex",
            isSuperAdmin ? "text-amber-500" : "text-primary"
          )}
        >
          <Clock className="mr-3 size-4" />
          Next Epoch: {format(new Date(2026, 1, 8), "MMM dd, yyyy")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
        
        {/* --- LEFT: ACTIVE PROTOCOL CARD --- */}
        <div className={cn(
          "xl:col-span-2 group relative overflow-hidden rounded-[3.5rem] border p-8 md:p-14 backdrop-blur-3xl shadow-apex transition-all duration-1000",
          isSuperAdmin ? "border-amber-500/20 bg-amber-500/[0.04]" : "border-white/5 bg-card/30 hover:border-primary/20"
        )}>
          {/* Vapour Highlight */}
          <div className={cn(
            "absolute -top-24 -right-24 size-80 blur-[120px] opacity-10 pointer-events-none transition-all duration-1000 group-hover:scale-110",
            isSuperAdmin ? "bg-amber-500" : "bg-primary"
          )} />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-12">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic leading-none">
                  {isSuperAdmin ? "Authority_Clearance" : "Active_Node_Tier"}
                </p>
                <h2 className={cn(
                  "text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none",
                  isSuperAdmin ? "text-amber-500" : "text-primary"
                )}>
                  {currentPlan}
                </h2>
              </div>
              <div className={cn(
                "size-16 md:size-20 shrink-0 rounded-[1.8rem] flex items-center justify-center border shadow-inner transition-all duration-1000 group-hover:rotate-12",
                isSuperAdmin ? "bg-amber-500/10 border-amber-500/10" : "bg-primary/5 border-primary/10"
              )}>
                {isSuperAdmin ? <ShieldCheck className="size-8 md:size-10 text-amber-500" /> : <Zap className="size-8 md:size-10 text-primary" />}
              </div>
            </div>

            {/* Capacity Telemetry */}
            <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {(isSuperAdmin ? [
                "Universal Platform Sovereignty",
                "Root Database Access Keys",
                "Global Infrastructure Oversight",
                "Epoch Lifecycle Control"
              ] : [
                "Capacity: 500 Sub-Nodes",
                "Unlimited Signal Streams",
                "White-Label Identity Protocol",
                "Priority Support Handshake",
              ]).map((feature) => (
                <div key={feature} className="flex items-center gap-4 group/item">
                  <div className={cn(
                    "size-6 shrink-0 rounded-lg flex items-center justify-center border transition-all duration-500 group-hover/item:scale-110",
                    isSuperAdmin ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                  )}>
                    <CheckCircle2 className={cn("size-3.5", isSuperAdmin ? "text-amber-500" : "text-emerald-500")} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 italic group-hover/item:text-foreground transition-colors">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {!isSuperAdmin && (
              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5">
                <Button className="h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase italic tracking-[0.3em] text-[11px] shadow-apex-primary hover:scale-[1.02] transition-all">
                  Upgrade_Node_Capacity
                </Button>
                <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 font-black uppercase italic text-[10px] tracking-[0.3em] text-foreground hover:bg-white/10">
                  Audit_Invoice_Logs
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: PAYMENT GATEWAY NODE --- */}
        <div className="space-y-8">
          <div className="rounded-[3rem] border border-white/5 bg-card/30 p-10 backdrop-blur-3xl shadow-apex flex flex-col gap-10">
            <div className="space-y-8">
              <div className="flex items-center gap-4 text-primary/40">
                <CreditCard className="size-5" />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] italic">
                  Payment_Terminal
                </h3>
              </div>

              {isSuperAdmin ? (
                <div className="rounded-[2rem] border border-amber-500/10 bg-amber-500/[0.03] p-6 shadow-inner relative overflow-hidden">
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4 italic leading-none">
                    Admin_Override
                  </p>
                  <p className="text-[10px] font-bold text-foreground/40 uppercase leading-relaxed italic">
                    Platform root accounts bypass standard epoch-based payment gateways.
                  </p>
                  <Lock className="absolute -bottom-4 -right-4 size-16 text-amber-500 opacity-10 -rotate-12" />
                </div>
              ) : (
                <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-8 shadow-inner group cursor-pointer hover:border-primary/20 transition-all duration-700">
                  <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.4em] mb-6 italic">
                    Verified_Visa_Node
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xl md:text-2xl font-bold tracking-[0.2em] leading-none text-foreground/80 group-hover:text-foreground transition-colors">
                      •••• 4242
                    </p>
                    <ShieldCheck className="size-6 text-emerald-500 animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            {!isSuperAdmin && (
              <Button variant="ghost" className="text-primary font-black uppercase italic tracking-[0.4em] text-[10px] p-0 h-auto justify-start hover:bg-transparent hover:text-primary/70 group">
                Update_Identity_Card
                <ChevronRight className="ml-3 size-4 group-hover:translate-x-2 transition-transform duration-700" />
              </Button>
            )}
          </div>

          {/* Compliance Telemetry */}
          <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 space-y-4 opacity-30 italic">
            <div className="flex items-center gap-4">
              <Terminal className="size-4" />
              <p className="text-[9px] font-black uppercase tracking-[0.5em] leading-none">Security_Audit_v16.31</p>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-[0.2em]">
              SSL/TLS Multi-Layer encryption active. Node synced with Platform Epoch {isSuperAdmin ? "ROOT" : "V2"}.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <div className="flex items-center gap-4">
           <Activity className="size-4 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Admin_Core_Synchronized // Node_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"}
           </p>
        </div>
        {!isMobile && <div className="size-1 rounded-full bg-foreground" />}
        <span className="text-[8px] font-mono tabular-nums opacity-60">[v16.31_STABLE]</span>
      </div>
    </div>
  );
}