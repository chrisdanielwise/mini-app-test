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
 * 🛰️ BILLING_PAGE (Institutional Apex v2026.1.20)
 * Strategy: De-stacked Independent Scroll Volume.
 * Fix: Stationary HUD prevents header cropping; compressed nodes maximize data density.
 */
export default function BillingPage({ session, merchant }: any) {
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isSuperAdmin = flavor === "AMBER";
  const realMerchantId = session?.merchantId;
  const currentPlan = isSuperAdmin ? "System Master" : (merchant?.planStatus || "Institutional");

  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden text-foreground">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Header --- */}
      <div 
        className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 px-6">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-3 italic opacity-30">
              <Layers className={cn("size-3.5", isSuperAdmin ? "text-amber-500" : "text-primary")} />
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">Resource_Allocation</span>
            </div>
            
            {/* 🛡️ TIGHTENED typography scale from 5rem to 3xl */}
            <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate">
              Billing <span className={cn(isSuperAdmin ? "text-amber-500" : "text-primary")}>& Plan</span>
            </h1>
            
            <div className="flex items-center gap-3 text-[7px] font-black text-muted-foreground/20 italic uppercase tracking-[0.2em]">
              <Terminal className="size-3" />
              <span className="truncate">NODE_{realMerchantId ? realMerchantId.slice(0, 8).toUpperCase() : "ROOT"} // Protocol_Sync: Stable</span>
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "h-9 px-4 border-white/5 bg-white/[0.02] rounded-xl text-[8px] font-black uppercase tracking-[0.2em] italic scale-90 origin-bottom-right",
              isSuperAdmin ? "text-amber-500" : "text-primary"
            )}
          >
            <Clock className="mr-2 size-3.5" />
            Next Epoch: {format(new Date(2026, 1, 8), "MMM dd, yyyy")}
          </Badge>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: Only the cards move --- */}
      <div className="flex-1 min-h-0 w-full relative overflow-y-auto custom-scrollbar px-6 py-6 space-y-8">
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* --- LEFT: ACTIVE PROTOCOL CARD (COMPRESSED) --- */}
          <div className={cn(
            "xl:col-span-2 group relative overflow-hidden rounded-[2rem] border p-8 backdrop-blur-3xl shadow-2xl transition-all duration-700",
            isSuperAdmin ? "border-amber-500/20 bg-amber-500/[0.03]" : "border-white/5 bg-card/30"
          )}>
            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                    {isSuperAdmin ? "Authority_Clearance" : "Active_Node_Tier"}
                  </p>
                  <h2 className={cn(
                    "text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none",
                    isSuperAdmin ? "text-amber-500" : "text-primary"
                  )}>
                    {currentPlan}
                  </h2>
                </div>
                <div className={cn(
                  "size-12 md:size-14 shrink-0 rounded-xl flex items-center justify-center border shadow-inner transition-all",
                  isSuperAdmin ? "bg-amber-500/10 border-amber-500/10" : "bg-primary/5 border-primary/10"
                )}>
                  {isSuperAdmin ? <ShieldCheck className="size-6 text-amber-500" /> : <Zap className="size-6 text-primary" />}
                </div>
              </div>

              {/* Telemetry Grid */}
              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
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
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className={cn("size-3", isSuperAdmin ? "text-amber-500" : "text-emerald-500")} />
                    <span className="text-[7px] font-black uppercase tracking-[0.15em] text-foreground/40 italic">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!isSuperAdmin && (
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                  <Button className="h-12 px-8 rounded-xl bg-primary text-white font-black uppercase italic tracking-[0.2em] text-[10px]">
                    Upgrade_Node_Capacity
                  </Button>
                  <Button variant="outline" className="h-12 px-8 rounded-xl border-white/5 bg-white/5 font-black uppercase italic text-[9px] tracking-[0.2em]">
                    Audit_Logs
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT: PAYMENT GATEWAY NODE --- */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/5 bg-card/30 p-8 backdrop-blur-3xl shadow-2xl flex flex-col gap-6">
              <div className="flex items-center gap-3 text-primary/40">
                <CreditCard className="size-4" />
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] italic">Terminal</h3>
              </div>

              {isSuperAdmin ? (
                <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-5 shadow-inner relative overflow-hidden">
                  <p className="text-[8px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2 italic">Admin_Override</p>
                  <p className="text-[9px] text-foreground/30 uppercase leading-relaxed italic">Root accounts bypass gateway protocols.</p>
                  <Lock className="absolute -bottom-2 -right-2 size-12 text-amber-500 opacity-10" />
                </div>
              ) : (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 shadow-inner hover:border-primary/20 transition-all cursor-pointer">
                  <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] mb-4 italic">Verified_Visa</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-lg font-bold tracking-[0.2em] text-foreground/70">•••• 4242</p>
                    <ShieldCheck className="size-5 text-emerald-500/40" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 rounded-[1.5rem] bg-white/[0.01] border border-white/5 space-y-3 opacity-20 italic">
              <div className="flex items-center gap-3">
                <Terminal className="size-3.5" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Security_v16.31</p>
              </div>
              <p className="text-[8px] font-bold text-muted-foreground leading-relaxed uppercase tracking-[0.1em]">
                Multi-Layer encryption active. Node synced with Platform Epoch {isSuperAdmin ? "ROOT" : "V2"}.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER SIGNAL */}
        <div className="flex items-center justify-center gap-4 opacity-10 pt-8 pb-12">
          <Activity className="size-3 animate-pulse" />
          <p className="text-[7px] font-black uppercase tracking-[0.5em] italic">
            Billing Core Synchronized // [v16.31_STABLE]
          </p>
        </div>
      </div>
    </div>
  );
}