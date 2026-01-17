"use client";

import { cn } from "@/lib/utils";
import { Zap, ShieldCheck, Cpu, Globe, Activity, BarChart3 } from "lucide-react";

/**
 * 🛰️ BENTO_INFRASTRUCTURE (Institutional v16.16.14)
 * Logic: Merged Telemetry + Hardware Specs.
 * Design: Liquid Bento Grid (v9.9.5 Standards).
 */
export function BentoInfrastructure() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]">
        
        {/* LIVE TELEMETRY NODE (Large) */}
        <div className="md:col-span-2 row-span-1 rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-between backdrop-blur-3xl overflow-hidden relative group">
           <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 italic">Live_Network_Pulse</span>
              <Activity className="size-4 text-emerald-500 animate-pulse" />
           </div>
           <div className="flex gap-12 items-baseline">
              <div className="flex flex-col">
                 <span className="text-5xl font-black italic tracking-tighter">1,240+</span>
                 <span className="text-[9px] font-bold uppercase tracking-widest opacity-20">Active_Clusters</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-5xl font-black italic tracking-tighter text-primary">240ms</span>
                 <span className="text-[9px] font-bold uppercase tracking-widest opacity-20">Global_Latency</span>
              </div>
           </div>
           <div className="absolute inset-0 bg-primary/5 blur-[80px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* SECURITY ENCLAVE (Small) */}
        <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 p-8 flex flex-col gap-4 backdrop-blur-3xl hover:border-primary/20 transition-all">
           <ShieldCheck className="size-8 text-primary" />
           <h3 className="font-black uppercase italic text-sm">Audit_Vault</h3>
           <p className="text-[10px] opacity-40 leading-relaxed font-bold uppercase italic">AES-256 Zero-Knowledge Encrypted Handshake Logic.</p>
        </div>

        {/* ADDITIONAL SPECS (Iterative Grid) */}
        <div className="grid grid-cols-2 gap-6 md:col-span-3">
           <SpecItem icon={Cpu} title="AI_Processing" value="v4.2" />
           <SpecItem icon={Globe} title="Geo_Zones" value="12" />
        </div>
      </div>
    </section>
  );
}

function SpecItem({ icon: Icon, title, value }: any) {
  return (
    <div className="rounded-[2rem] border border-white/5 bg-white/[0.01] p-6 flex items-center gap-4 hover:bg-white/5 transition-all">
       <Icon className="size-5 text-primary/40" />
       <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-20">{title}</span>
          <span className="text-xs font-black italic tracking-tighter">{value}</span>
       </div>
    </div>
  );
}