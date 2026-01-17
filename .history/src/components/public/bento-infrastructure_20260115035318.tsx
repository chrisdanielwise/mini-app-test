"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck, Cpu, Globe, Activity } from "lucide-react";

/**
 * 🛰️ BENTO_INFRASTRUCTURE (Institutional v16.16.14)
 * Logic: Merged Telemetry + Hardware Specs.
 * Refactor: Vertical compression & normalized bento geometry (v9.9.5).
 */
export function BentoInfrastructure() {
  return (
    <section className="py-[clamp(4rem,10vh,6rem)] px-6 md:px-10 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-[minmax(180px,auto)] md:auto-rows-[200px]">
        
        {/* LIVE TELEMETRY NODE (High-Density) */}
        <div className="md:col-span-2 row-span-1 rounded-[1.5rem] bg-white/[0.01] border border-white/5 p-6 md:p-8 flex flex-col justify-between backdrop-blur-3xl overflow-hidden relative group">
           <div className="flex justify-between items-start">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20 italic">Live_Network_Pulse</span>
              <Activity className="size-3.5 text-emerald-500 animate-pulse" />
           </div>
           
           <div className="flex gap-10 md:gap-16 items-baseline relative z-10">
              <div className="flex flex-col">
                 <span className="text-4xl md:text-5xl font-black italic tracking-tighter tabular-nums">1,240+</span>
                 <span className="text-[8px] font-bold uppercase tracking-widest opacity-20 mt-1">Active_Clusters</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-4xl md:text-5xl font-black italic tracking-tighter text-primary tabular-nums">240ms</span>
                 <span className="text-[8px] font-bold uppercase tracking-widest opacity-20 mt-1">Global_Latency</span>
              </div>
           </div>

           {/* 🧪 SUBSURFACE TACTICAL RADIANCE */}
           <div className="absolute inset-0 bg-primary/[0.03] blur-[80px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>

        {/* SECURITY ENCLAVE (Compressed) */}
        <div className="rounded-[1.5rem] bg-white/[0.01] border border-white/5 p-6 md:p-8 flex flex-col justify-center gap-3 backdrop-blur-3xl hover:border-primary/20 transition-all duration-500">
           <ShieldCheck className="size-6 text-primary/60" />
           <div className="space-y-1">
             <h3 className="font-black uppercase italic text-xs tracking-tight">Audit_Vault</h3>
             <p className="text-[9px] opacity-30 leading-relaxed font-bold uppercase italic max-w-[180px]">
               AES-256 Zero-Knowledge Encrypted Handshake.
             </p>
           </div>
        </div>

        {/* ADDITIONAL SPECS (Normalized Row) */}
        <div className="grid grid-cols-2 gap-4 md:gap-5 md:col-span-3">
           <SpecItem icon={Cpu} title="AI_Processing" value="v4.2_STABLE" />
           <SpecItem icon={Globe} title="Geo_Zones" value="12_ACTIVE" />
        </div>
      </div>
    </section>
  );
}

function SpecItem({ icon: Icon, title, value }: any) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.005] p-5 flex items-center gap-4 hover:bg-white/[0.02] hover:border-white/10 transition-all group">
       <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-colors">
          <Icon className="size-4 text-primary/40 group-hover:text-primary transition-colors" />
       </div>
       <div className="flex flex-col">
          <span className="text-[7px] font-black uppercase tracking-widest opacity-20">{title}</span>
          <span className="text-[11px] font-black italic tracking-tighter uppercase">{value}</span>
       </div>
    </div>
  );
}