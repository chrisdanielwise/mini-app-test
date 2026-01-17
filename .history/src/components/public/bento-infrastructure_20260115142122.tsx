"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Cpu, Globe, Activity, Waves, Zap } from "lucide-react";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";

/**
 * 🌊 BENTO_INFRASTRUCTURE (Institutional Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, safeArea).
 * Logic: morphology-aware grid resolution with kinetic water-ease motion.
 */
export function BentoInfrastructure() {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  // 🛰️ DEVICE INGRESS: Consuming full morphology physics
  const { 
    screenSize, 
    isMobile, 
    isTablet, 
    isDesktop, 
    isPortrait, 
    viewportWidth,
    isReady 
  } = useDeviceContext();

  // 🛡️ HYDRATION GUARD
  if (!isReady) return (
    <section className="py-20 px-6 animate-pulse">
      <div className="h-96 rounded-[2.5rem] bg-card/20" />
    </section>
  );

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating grid geometry based on the 6-tier system.
   */
  const mainGridCols = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-3" : "grid-cols-1";
  const bentoPadding = screenSize === 'xs' ? "p-6" : "p-8 md:p-12";
  const telemetrySpan = (isDesktop || (isTablet && !isPortrait)) ? "md:col-span-2" : "col-span-1";

  return (
    <section className={cn(
      "relative py-[clamp(4rem,10vh,8rem)] px-6 md:px-10 max-w-7xl mx-auto w-full transition-all duration-1000",
      "animate-in fade-in slide-in-from-bottom-12"
    )}>
      
      <div className={cn("grid gap-4 md:gap-6 auto-rows-auto md:auto-rows-[240px]", mainGridCols)}>
        
        {/* --- LIVE TELEMETRY NODE: Kinetic Ingress --- */}
        <div className={cn(
          "relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border backdrop-blur-3xl flex flex-col justify-between transition-all duration-1000 group",
          bentoPadding,
          isStaff ? "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5" : "bg-white/[0.01] border-white/5 shadow-apex",
          telemetrySpan
        )}>
           {/* Subsurface Flow (Scales with viewportWidth) */}
           <Waves className="absolute -bottom-10 left-0 w-full opacity-[0.03] text-primary pointer-events-none" 
                  style={{ height: `${Math.max(60, viewportWidth * 0.1)}px` }} />
           
           <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 italic">Live_Network_Pulse</span>
                <div className="flex items-center gap-2">
                  <Activity className="size-3.5 text-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500/60 italic uppercase tracking-widest">Global_Status_Optimal</span>
                </div>
              </div>
              <Zap className={cn("size-5", isStaff ? "text-amber-500" : "text-primary/40")} />
           </div>
           
           <div className={cn(
             "flex items-baseline relative z-10",
             screenSize === 'xs' ? "flex-col gap-6" : "gap-12 md:gap-24"
           )}>
              <div className="flex flex-col group/stat">
                 <span className="text-5xl md:text-7xl font-black italic tracking-tighter tabular-nums group-hover:text-primary transition-colors duration-700">1,240+</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20 mt-1">Active_Clusters</span>
              </div>
              <div className="flex flex-col group/stat">
                 <span className={cn(
                   "text-5xl md:text-7xl font-black italic tracking-tighter tabular-nums transition-colors duration-700",
                   isStaff ? "text-amber-500" : "text-primary"
                 )}>240ms</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20 mt-1">Global_Latency</span>
              </div>
           </div>

           {/* 🧪 RADIANCE OVERLAY */}
           <div className={cn(
             "absolute inset-0 blur-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000",
             isStaff ? "bg-amber-500/10" : "bg-primary/5"
           )} />
        </div>

        {/* --- SECURITY ENCLAVE: Morphology Shield --- */}
        <div className={cn(
          "relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border bg-white/[0.01] flex flex-col justify-center gap-6 transition-all duration-1000",
          bentoPadding,
          isStaff ? "border-amber-500/20 hover:bg-amber-500/5" : "border-white/5 hover:border-primary/30"
        )}>
           <div className={cn(
             "size-16 rounded-3xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-6",
             isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/5 border-primary/20 text-primary"
           )}>
             <ShieldCheck className="size-8" />
           </div>
           <div className="space-y-2">
             <h3 className="font-black uppercase italic text-lg tracking-tighter text-foreground">Audit_Vault</h3>
             <p className="text-[10px] opacity-30 leading-relaxed font-bold uppercase italic max-w-[200px]">
               AES-256 Zero-Knowledge Encrypted Handshake protocol synchronized across all nodes.
             </p>
           </div>
           <LockWatermark />
        </div>

        {/* --- ADDITIONAL SPECS: Fluid Flow Row --- */}
        <div className={cn(
          "grid gap-4 md:gap-6 md:col-span-3",
          (isMobile && isPortrait) ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
        )}>
           <SpecItem icon={Cpu} title="AI_Processing" value="v4.2_STABLE" isStaff={isStaff} />
           <SpecItem icon={Globe} title="Geo_Zones" value="12_ACTIVE" isStaff={isStaff} />
           <SpecItem icon={Activity} title="Sync_Rate" value="99.99%_UP" isStaff={isStaff} />
           <SpecItem icon={ShieldCheck} title="Audit_Level" value="L4_TIER" isStaff={isStaff} />
        </div>
      </div>
    </section>
  );
}

function SpecItem({ icon: Icon, title, value, isStaff }: any) {
  const { impact } = useHaptics();
  return (
    <div 
      onClick={() => impact("light")}
      className={cn(
        "rounded-2xl border bg-white/[0.005] p-6 flex items-center gap-5 transition-all duration-700 group cursor-pointer",
        isStaff ? "border-amber-500/5 hover:border-amber-500/20 hover:bg-amber-500/5" : "border-white/5 hover:bg-white/[0.02] hover:border-white/10"
      )}
    >
       <div className={cn(
         "size-12 rounded-2xl flex items-center justify-center border transition-all duration-700 shadow-inner",
         isStaff ? "bg-amber-500/5 border-amber-500/10 text-amber-500/40" : "bg-white/5 border-white/5 text-primary/40 group-hover:text-primary"
       )}>
          <Icon className="size-5 transition-transform group-hover:scale-110" />
       </div>
       <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-20 italic">{title}</span>
          <span className="text-[13px] font-black italic tracking-tighter uppercase text-foreground/80 group-hover:text-foreground">{value}</span>
       </div>
    </div>
  );
}

function LockWatermark() {
  return (
    <ShieldCheck className="absolute -bottom-8 -right-8 size-40 opacity-[0.02] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" />
  );
}