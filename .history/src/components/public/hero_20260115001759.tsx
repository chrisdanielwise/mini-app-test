"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Zap, Shield, Cpu, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 HERO_INGRESS_NODE (Institutional v16.16.12)
 * Logic: Mouse-reactive Radiance with 700ms Momentum Ingress.
 * Design: Kinetic Typography + v9.9.2 Hyper-Glass.
 */
export function Hero() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 🌊 RADIANCE TRACKING: Follows user intent with a slight lag (fluidity)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - left, y: e.clientY - top });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 px-6"
    >
      {/* 🔮 SUBSURFACE RADIANCE: The Kinetic Energy Vector */}
      <div 
        className={cn(
          "absolute pointer-events-none size-[600px] blur-[140px] opacity-20 transition-transform duration-1000 ease-out",
          isStaff ? "bg-amber-500" : "bg-primary"
        )}
        style={{
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        }}
      />

      {/* --- INFRASTRUCTURE BADGE --- */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl mb-10">
        <Activity className={cn("size-3.5 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] italic text-muted-foreground/60">
          {isStaff ? "Global_Audit_Node_Live" : "Merchant_Infrastructure_Ready"}
        </span>
      </div>

      {/* --- KINETIC HEADING --- */}
      <div className="relative z-10 text-center space-y-8 max-w-6xl mx-auto">
        <h1 className="text-[clamp(2.5rem,10vw,7.5rem)] font-black uppercase italic tracking-tighter leading-[0.85] text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          Scale Your <br /> 
          <span className={cn(
            "text-transparent bg-clip-text bg-gradient-to-r",
            isStaff ? "from-amber-500 to-amber-200" : "from-primary to-emerald-200"
          )}>
            Signal Node.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-[12px] md:text-[14px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground/40 italic leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          Audit-verified telegram monetization infrastructure. <br className="hidden md:block" />
          Deploy high-frequency liquid clusters in seconds.
        </p>

        {/* --- ACTION HANDSHAKE --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Button
            size="lg"
            onClick={() => impact("medium")}
            className={cn(
              "h-18 px-12 rounded-[1.5rem] font-black uppercase italic tracking-[0.2em] text-[12px] shadow-2xl transition-all duration-700 hover:scale-[1.05] active:scale-95",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/40"
            )}
          >
            {isStaff ? "Access_Audit_Nodes" : "Initialize_Merchant_Node"}
            <Zap className="ml-4 size-5 fill-current" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => impact("light")}
            className="h-18 px-12 rounded-[1.5rem] border-white/10 bg-white/5 backdrop-blur-3xl font-black uppercase italic tracking-[0.2em] text-[12px] hover:bg-white/10 transition-all duration-700"
          >
            View_Protocol
            <ArrowRight className="ml-4 size-5" />
          </Button>
        </div>
      </div>

      {/* --- TECHNICAL SPECS FOOTER (Hero Bottom) --- */}
      <div className="absolute bottom-12 inset-x-0 px-10 hidden lg:flex items-center justify-between opacity-10 animate-in fade-in duration-1000 delay-1000">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">Latency</span>
            <span className="text-[18px] font-black uppercase tracking-tighter italic">{"<"} 240ms</span>
          </div>
          <div className="size-px h-8 bg-white" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">Security</span>
            <span className="text-[18px] font-black uppercase tracking-tighter italic">V3_AES</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] font-black uppercase tracking-widest italic leading-none">System_Core</span>
           <span className="text-[18px] font-black uppercase tracking-tighter italic">v16.16.12_STABLE</span>
        </div>
      </div>

      {/* 🏛️ INSTITUTIONAL GRID: The Subsurface Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:60px_60px] z-[-1]" />
    </section>
  );
}