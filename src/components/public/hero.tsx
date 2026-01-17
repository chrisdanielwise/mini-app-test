"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ HERO (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 action hub and shrunken typography prevents blowout.
 */
export function Hero() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  const { 
    screenSize, isMobile, viewportWidth, safeArea, isReady 
  } = useDeviceContext();

  const isStaff = flavor === "AMBER";
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isMobile) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - left, y: e.clientY - top });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  if (!isReady) return <div className="min-h-screen bg-black animate-pulse" />;

  const headingSize = screenSize === 'xs' ? "text-4xl" : "text-[clamp(3rem,8vw,6.5rem)]";
  const sectionPadding = `calc(${safeArea.top}px + 2rem)`;

  return (
    <section 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center overflow-hidden px-6 transition-all duration-700"
      style={{ 
        minHeight: `calc(var(--vh, 1vh) * 85)`,
        paddingTop: sectionPadding 
      }}
    >
      {/* 🌫️ TACTICAL RADIANCE */}
      {!isMobile && (
        <div 
          className={cn(
            "absolute pointer-events-none blur-[120px] opacity-5 transition-transform duration-1000",
            isStaff ? "bg-amber-500" : "bg-primary"
          )}
          style={{
            width: `${viewportWidth * 0.3}px`,
            height: `${viewportWidth * 0.3}px`,
            transform: `translate(${mousePos.x - (viewportWidth * 0.15)}px, ${mousePos.y - (viewportWidth * 0.15)}px)`,
          }}
        />
      )}

      {/* --- 🛡️ FIXED HUD: Infrastructure Badge --- */}
      <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/5 bg-zinc-950/40 backdrop-blur-xl mb-6 md:mb-8 leading-none">
        <Activity className={cn("size-3 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
        <span className="text-[7.5px] md:text-[8px] font-black uppercase tracking-[0.3em] italic text-muted-foreground/20">
          {isStaff ? "Global_Audit_Node_Active" : "Merchant_Infra_Ready"}
        </span>
      </div>

      {/* --- KINETIC HEADING: Tactical Scaling --- */}
      <div className="relative z-10 text-center space-y-6 max-w-6xl mx-auto">
        <h1 className={cn(
          "font-black uppercase italic tracking-tighter leading-[0.85] text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700",
          headingSize
        )}>
          Scale Your <br /> 
          <span className={cn(
            "text-transparent bg-clip-text bg-gradient-to-r",
            isStaff ? "from-amber-500 to-amber-200" : "from-primary to-emerald-200"
          )}>
            Signal Node.
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 italic leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Audit-verified monetization infrastructure. <br className="hidden md:block" />
          Deploy high-frequency clusters in seconds.
        </p>

        {/* --- ACTION HANDSHAKE: Tactical Slim Hub --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <Button
            size="lg"
            onClick={() => impact("heavy")}
            className={cn(
              "h-11 md:h-11 px-8 rounded-xl font-black uppercase italic tracking-widest text-[9px] shadow-lg transition-all active:scale-95",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/10" : "bg-primary text-primary-foreground shadow-primary/10"
            )}
          >
            {isStaff ? "Access_Audit" : "Initialize_Node"}
            <Zap className="ml-2.5 size-3.5 fill-current transition-transform group-hover:scale-110" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => impact("medium")}
            className="h-11 px-8 rounded-xl border-white/5 bg-white/[0.01] backdrop-blur-xl font-black uppercase italic tracking-widest text-[9px] hover:bg-white/5 transition-all active:scale-95"
          >
            Protocol
            <ArrowRight className="ml-2.5 size-3.5 opacity-20" />
          </Button>
        </div>
      </div>

      {/* --- TELEMETRY FOOTER: Stationary HUD --- */}
      {!isMobile && (
        <div className="absolute bottom-8 inset-x-8 flex items-center justify-between opacity-10 italic leading-none">
          <div className="flex items-center gap-8">
            <TelemetryBlock label="Latency" value="< 240ms" />
            <div className="h-6 w-px bg-white/5" />
            <TelemetryBlock label="Auth" value="AES_GCM_256" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
             <span className="text-[7px] font-black uppercase tracking-widest opacity-40">System_Core</span>
             <span className="text-lg font-black uppercase tracking-tighter text-foreground">v16.31_APEX</span>
          </div>
        </div>
      )}

      {/* 🏛️ STATIONARY GRID ANCHOR */}
      <div className="absolute inset-0 pointer-events-none z-[-1] opacity-[0.01] bg-[url('/assets/grid.svg')] bg-center" />
    </section>
  );
}

function TelemetryBlock({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[7.5px] font-black uppercase tracking-widest opacity-20">{label}</span>
      <span className="text-base font-black uppercase tracking-tighter text-foreground">{value}</span>
    </div>
  );
}