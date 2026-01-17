"use client";

import * as React from "react";
import { format } from "date-fns";
import { 
  CreditCard, CheckCircle2, Zap, Clock, Terminal, 
  Layers, ShieldCheck, ChevronRight, Globe, ShieldAlert,
  ArrowUpRight, Cpu, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * 🏛️ BILLING_TERMINAL (Institutional Apex v16.31.20)
 * Strategy: RBAC-Aware Resource Allocation with Restored Chroma.
 * Fix: Standardized tactical clamping to prevent oversized UI distortion.
 */
export default function BillingPage({ merchant: initialMerchant }: any) {
  const { flavor } = useLayout();
  const { user } = useInstitutionalAuth();
  const { 
    isReady, isMobile, screenSize, safeArea, viewportHeight 
  } = useDeviceContext();

  // 🛡️ IDENTITY & COLOR RESOLUTION
  const isSuperAdmin = flavor === "AMBER";
  const realMerchantId = user?.merchantId;
  const merchant = initialMerchant || {};
  const currentPlan = isSuperAdmin ? "System Master" : (merchant?.planStatus || "Institutional");

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto transition-all duration-1000",
        "animate-in fade-in slide-in-from-bottom-12",
        viewportHeight < 700 ? "space-y-6" : "space-y-10 md:space-y-14"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0px",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: isMobile ? "1.25rem" : "2rem",
        paddingRight: isMobile ? "1.25rem" : "2rem"
      }}
    >
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8 relative group">
        <div className="space-y-4">
          <div className="flex items-center gap-3 italic opacity-40">
            <Layers className={cn("size-3.5", isSuperAdmin ? "text-amber-500 animate-pulse" : "text-primary")} />
            <div className="flex flex-col">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
                isSuperAdmin ? "text-amber-500" : "text-primary"
              )}>
                {isSuperAdmin ? "Global_Resource_Allocation" : "Merchant_Resource_Node"}
              </span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2rem,8vw,4rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Billing <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>& Plan</span>
          </h1>
          
          <div className="flex items-center gap-2 text-[8px] font-black text-muted-foreground/30 italic uppercase tracking-[0.2em]">
            <Terminal className="size-3" />
            <span>NODE ID: {realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "PLATFORM_ROOT"} // Epoch_Sync</span>
          </div>
        </div>

        <div className="shrink-0">
          <Badge className={cn(
            "h-10 px-5 border rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg italic transition-all",
            isSuperAdmin ? "border-amber-500/20 bg-amber-500/5 text-amber-500 shadow-amber-500/5" : "border-primary/20 bg-primary/5 text-primary shadow-primary/5"
          )}>
            <Clock className="mr-2 size-3.5" />
            Next Epoch: {format(new Date(2026, 1, 8), "MMM dd, yyyy")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* --- LEFT: ACTIVE PROTOCOL CARD --- */}
        <div className={cn(
          "xl:col-span-2 group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border p-8 md:p-12 backdrop-blur-3xl shadow-2xl transition-all duration-700",
          isSuperAdmin ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-white/5 bg-black/40 hover:border-primary/20"
        )}>
          {/* Vapour Highlight Radiance */}
          <div className={cn(
            "absolute -right-20 -top-20 size-64 blur-[100px] opacity-10 pointer-events-none transition-opacity duration-1000",
            isSuperAdmin ? "bg-amber-500" : "bg-primary"
          )} />

          <div className="relative z-10 space-y-10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic leading-none">
                  {isSuperAdmin ? "Authority Clearance" : "Current Access Tier"}
                </p>
                <h2 className={cn(
                  "text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none",
                  isSuperAdmin ? "text-amber-500" : "text-primary"
                )}>
                  {currentPlan}
                </h2>
              </div>
              <div className={cn(
                "size-12 md:size-14 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner group-hover:rotate-6 transition-all duration-700",
                isSuperAdmin ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                {isSuperAdmin ? <ShieldCheck className="size-6 md:size-7" /> : <Zap className="size-6 md:size-7" />}
              </div>
            </div>

            {/* Capacity Telemetry Grid */}
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
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
                <div key={feature} className="flex items-center gap-3">
                  <div className={cn(
                    "size-5 shrink-0 rounded-md flex items-center justify-center border",
                    isSuperAdmin ? "bg-amber-500/10 border-amber-500/30" : "bg-emerald-500/10 border-emerald-500/30"
                  )}>
                    <CheckCircle2 className={cn("size-3", isSuperAdmin ? "text-amber-500" : "text-emerald-500")} />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-foreground/60 italic">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {!isSuperAdmin && (
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
                <Button className="h-14 px-8 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                  Upgrade Node Plan
                </Button>
                <Button variant="outline" className="h-14 px-8 rounded-xl border-white/5 bg-white/[0.02] font-black uppercase italic tracking-widest text-[9px] text-foreground hover:bg-white/5">
                  Audit Invoices
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: PAYMENT GATEWAY NODE --- */}
        <div className="space-y-6">
          <div className={cn(
            "rounded-[2.5rem] border p-8 backdrop-blur-3xl shadow-2xl flex flex-col gap-8 transition-all duration-700",
            isSuperAdmin ? "bg-amber-500/[0.02] border-amber-500/10 shadow-amber-500/5" : "bg-black/40 border-white/5"
          )}>
            <div className="space-y-6">
              <div className="flex items-center gap-3 opacity-30">
                <CreditCard className={cn("size-4", isSuperAdmin ? "text-amber-500" : "text-primary")} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                  Payment Terminal
                </h3>
              </div>

              {isSuperAdmin ? (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-inner space-y-2">
                  <p className="text-[8px] font-black text-amber-500 uppercase tracking-[0.4em] italic">
                    Administrative Override
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase leading-relaxed italic">
                    Platform root accounts bypass standard payment processing gateways for system-wide stability.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 shadow-inner group cursor-pointer hover:border-primary/30 transition-all">
                  <p className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] mb-4 italic">
                    Verified Visa Node
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-lg font-bold tracking-widest leading-none text-foreground/80">
                      •••• 4242
                    </p>
                    <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <ShieldCheck className="size-4 text-emerald-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isSuperAdmin && (
              <Button variant="ghost" className="text-primary font-black uppercase italic tracking-[0.3em] text-[9px] p-0 h-auto justify-start hover:bg-transparent hover:text-primary/70 group">
                Update Identity Card
                <ChevronRight className="ml-2 size-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>

          {/* Compliance Audit Signal */}
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-3 opacity-20 italic">
            <div className="flex items-center gap-3">
              <Terminal className="size-3.5" />
              <p className="text-[8px] font-black uppercase tracking-[0.4em]">Compliance_Audit_Sync</p>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-widest">
              SSL/TLS Node verified. Syncing with Platform Epoch {isSuperAdmin ? "ROOT_OVERRIDE" : "V2_OPTIMAL"}.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER SIGNAL */}
      <div className="flex items-center justify-center gap-5 opacity-10 py-12 border-t border-white/5">
        <Activity className={cn("size-3", isSuperAdmin ? "text-amber-500" : "text-primary")} />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-foreground italic">
          Resource synchronization complete // Epoch: 2026.01.16
        </p>
      </div>
    </div>
  );
}