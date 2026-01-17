"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Zap, Cpu, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 HERO_INGRESS_NODE (Institutional v16.16.14)
 * Logic: Mouse-reactive Radiance with 700ms Momentum Ingress.
 * Refactor: Vertical compression & liquid scaling (v9.9.5).
 */
export function Hero() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaff = flavor === "AMBER";
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 🌊 RADIANCE TRACKING: Follows user intent with fluid lag
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
      className="relative min-h-[clamp(80vh,100dvh,100vh)] flex flex-col items-center justify-center overflow-hidden py-[clamp(4rem,10vh,8rem)] px-6"
    >
      {/* 🔮 SUBSURFACE RADIANCE: Kinetic Energy Vector */}
      <div 
        className={cn(
          "absolute pointer-events-none size-[clamp(300px,60vw,600px)] blur-[120px] opacity-10 transition-transform duration-1000 ease-out",
          isStaff ? "bg-amber-500" : "bg-primary"
        )}
        style={{
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        }}
      />

      {/* --- INFRASTRUCTURE BADGE: COMPRESSED --- */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-1000 flex items-center gap-2.5 px-5 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl mb-8">
        <Activity className={cn("size-3 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
        <span className="text-[9px] font-black uppercase tracking-[0.4em] italic text-muted-foreground/40">
          {isStaff ? "Global_Audit_Node_Live" : "Merchant_Infrastructure_Ready"}
        </span>
      </div>

      {/* --- KINETIC HEADING: LIQUID SCALING --- */}
      <div className="relative z-10 text-center space-y-6 max-w-6xl mx-auto">
        <h1 className="text-[clamp(3rem,12vw,7.5rem)] font-black uppercase italic tracking-tighter leading-[0.85] text-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          Scale Your <br /> 
          <span className={cn(
            "text-transparent bg-clip-text bg-gradient-to-r",
            isStaff ? "from-amber-500 to-amber-200" : "from-primary to-emerald-200"
          )}>
            Signal Node.
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-[10px] md:text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30 italic leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          Audit-verified telegram monetization infrastructure. <br className="hidden md:block" />
          Deploy high-frequency liquid clusters in seconds.
        </p>

        {/* --- ACTION HANDSHAKE: TACTICAL STACK --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Button
            size="lg"
            onClick={() => impact("medium")}
            className={cn(
              "h-16 px-10 rounded-xl font-black uppercase italic tracking-[0.2em] text-[11px] shadow-2xl transition-all duration-700 hover:scale-[1.02] active:scale-95",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-primary-foreground shadow-primary/30"
            )}
          >
            {isStaff ? "Access_Audit_Nodes" : "Initialize_Merchant_Node"}
            <Zap className="ml-3 size-4 fill-current" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => impact("light")}
            className="h-16 px-10 rounded-xl border-white/5 bg-white/5 backdrop-blur-3xl font-black uppercase italic tracking-[0.2em] text-[11px] hover:bg-white/10 transition-all duration-700"
          >
            View_Protocol
            <ArrowRight className="ml-3 size-4" />
          </Button>
        </div>
      </div>

      {/* --- TECHNICAL SPECS FOOTER: NORMALIZED --- */}
      <div className="absolute bottom-8 inset-x-0 px-8 hidden lg:flex items-center justify-between opacity-20 animate-in fade-in duration-1000 delay-1000">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest italic leading-none">Latency</span>
            <span className="text-[16px] font-black uppercase tracking-tighter italic text-foreground">{"<"} 240ms</span>
          </div>
          <div className="size-px h-6 bg-white/20" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest italic leading-none">Security</span>
            <span className="text-[16px] font-black uppercase tracking-tighter italic text-foreground">V3_AES</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[9px] font-black uppercase tracking-widest italic leading-none">System_Core</span>
           <span className="text-[16px] font-black uppercase tracking-tighter italic text-foreground">v16.16.14_STABLE</span>
        </div>
      </div>

      {/* 🏛️ BACKGROUND GRID: NORMALISED */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[grid-white_40px] md:bg-[grid-white_60px] z-[-1]" />
    </section>
  );
}