"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Cpu, Globe, Activity, Waves, Zap } from "lucide-react";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ BENTO_INFRASTRUCTURE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: Reduced row heights and high-density typography prevents blowout.
 */
export function BentoInfrastructure() {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";
  const { screenSize, isMobile, isTablet, isDesktop, isPortrait, isReady } = useDeviceContext();

  if (!isReady) return (
    <section className="py-10 px-6 animate-pulse">
      <div className="h-64 rounded-2xl bg-card/10" />
    </section>
  );

  const mainGridCols = (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-3" : "grid-cols-1";
  const bentoPadding = screenSize === 'xs' ? "p-5" : "p-6 md:p-8"; // Reduced p-12 -> p-8
  const telemetrySpan = (isDesktop || (isTablet && !isPortrait)) ? "md:col-span-2" : "col-span-1";

  return (
    <section className={cn(
      "relative py-8 md:py-12 px-6 md:px-8 max-w-7xl mx-auto w-full transition-all duration-700",
      "animate-in fade-in slide-in-from-bottom-4"
    )}>
      
      <div className={cn("grid gap-3 md:gap-4 auto-rows-auto md:auto-rows-[180px]", mainGridCols)}>
        
        {/* --- LIVE TELEMETRY NODE --- */}
        <div className={cn(
          "relative overflow-hidden rounded-2xl md:rounded-3xl border backdrop-blur-3xl flex flex-col justify-between transition-all group",
          bentoPadding,
          isStaff ? "bg-amber-500/[0.01] border-amber-500/10 shadow-sm" : "bg-card/40 border-white/5 shadow-2xl",
          telemetrySpan
        )}>
           <div className="flex justify-between items-start relative z-10 leading-none">
              <div className="space-y-1.5">
                <span className="text-[7.5px] font-black uppercase tracking-[0.3em] opacity-30 italic">Live_Network_Pulse</span>
                <div className="flex items-center gap-2">
                  <Activity className="size-3 text-emerald-500 animate-pulse" />
                  <span className="text-[6.5px] font-black text-emerald-500/60 italic uppercase tracking-widest">Optimal_Signal</span>
                </div>
              </div>
              <Zap className={cn("size-4", isStaff ? "text-amber-500" : "text-primary/20")} />
           </div>
           
           <div className={cn(
             "flex items-baseline relative z-10",
             screenSize === 'xs' ? "flex-col gap-4" : "gap-8 md:gap-16"
           )}>
              <div className="flex flex-col">
                 <span className="text-4xl md:text-5xl font-black italic tracking-tighter tabular-nums group-hover:text-primary transition-colors">1,240+</span>
                 <span className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-10 mt-1">Clusters</span>
              </div>
              <div className="flex flex-col">
                 <span className={cn(
                   "text-4xl md:text-5xl font-black italic tracking-tighter tabular-nums",
                   isStaff ? "text-amber-500" : "text-primary"
                 )}>240ms</span>
                 <span className="text-[7.5px] font-black uppercase tracking-[0.2em] opacity-10 mt-1">Latency</span>
              </div>
           </div>
        </div>

        {/* --- SECURITY ENCLAVE --- */}
        <div className={cn(
          "relative overflow-hidden rounded-2xl md:rounded-3xl border bg-zinc-950/40 flex flex-col justify-center gap-4 transition-all",
          bentoPadding,
          isStaff ? "border-amber-500/10" : "border-white/5"
        )}>
           <div className={cn(
             "size-10 rounded-xl flex items-center justify-center border shadow-inner",
             isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
           )}>
             <ShieldCheck className="size-5" />
           </div>
           <div className="space-y-1 leading-none">
             <h3 className="font-black uppercase italic text-sm tracking-tighter text-foreground">Audit_Vault</h3>
             <p className="text-[7.5px] opacity-20 leading-relaxed font-bold uppercase italic max-w-[160px]">
               AES-256 Zero-Knowledge Encrypted handshake protocol synchronized across mesh.
             </p>
           </div>
        </div>

        {/* --- FLUID SPECS ROW --- */}
        <div className={cn(
          "grid gap-3 md:gap-4 md:col-span-3",
          (isMobile && isPortrait) ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"
        )}>
           <SpecItem icon={Cpu} title="Processing" value="v4.2_STABLE" isStaff={isStaff} />
           <SpecItem icon={Globe} title="Geo_Zones" value="12_ACTIVE" isStaff={isStaff} />
           <SpecItem icon={Activity} title="Sync_Rate" value="99.9%_UP" isStaff={isStaff} />
           <SpecItem icon={ShieldCheck} title="Audit" value="L4_TIER" isStaff={isStaff} />
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
        "rounded-xl border bg-white/[0.005] p-4 flex items-center gap-4 transition-all group cursor-pointer",
        isStaff ? "border-amber-500/5 hover:border-amber-500/10" : "border-white/5 hover:bg-white/[0.01] hover:border-white/10"
      )}
    >
       <div className={cn(
         "size-9 rounded-lg flex items-center justify-center border transition-all shadow-inner",
         isStaff ? "bg-amber-500/5 border-amber-500/10 text-amber-500/20" : "bg-white/5 border-white/5 text-primary/20 group-hover:text-primary"
       )}>
          <Icon className="size-4 transition-transform group-hover:scale-110" />
       </div>
       <div className="flex flex-col leading-none">
          <span className="text-[6.5px] font-black uppercase tracking-widest opacity-10 italic">{title}</span>
          <span className="text-[10px] font-black italic tracking-tighter uppercase text-foreground/60 group-hover:text-foreground mt-1.5">{value}</span>
       </div>
    </div>
  );
}