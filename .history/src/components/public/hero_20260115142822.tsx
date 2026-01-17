"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Zap, Cpu, Activity, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ HERO_INGRESS_NODE (Institutional Apex v16.16.30)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: morphology-aware kinetic ingress with hardware-fluid radiance.
 */
export function Hero() {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE PHYSICS: Hardware Ingress
  const { 
    screenSize, isMobile, isTablet, isDesktop, 
    viewportWidth, viewportHeight, safeArea, isReady 
  } = useDeviceContext();

  const isStaff = flavor === "AMBER";
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 🌊 RADIANCE TRACKING: Device-Aware fluid lag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isMobile) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - left, y: e.clientY - top });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // 🛡️ HYDRATION GUARD
  if (!isReady) return <div className="min-h-screen bg-background animate-pulse" />;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating layout gravity for the primary brand message.
   */
  const headingSize = screenSize === 'xs' ? "text-5xl" : "text-[clamp(3.5rem,10vw,8.5rem)]";
  const sectionPadding = `calc(${safeArea.top}px + 4rem)`;

  return (
    <section 
      ref={containerRef}
      className="relative flex flex-col items-center justify-center overflow-hidden px-6 transition-all duration-1000"
      style={{ 
        minHeight: `calc(var(--vh, 1vh) * 100)`,
        paddingTop: sectionPadding 
      }}
    >
      {/* 🔮 SUBSURFACE RADIANCE: Hardware-Fluid Kinetic Energy */}
      {!isMobile && (
        <div 
          className={cn(
            "absolute pointer-events-none blur-[140px] opacity-10 transition-transform duration-1000 ease-out",
            isStaff ? "bg-amber-500" : "bg-primary"
          )}
          style={{
            width: `${viewportWidth * 0.4}px`,
            height: `${viewportWidth * 0.4}px`,
            transform: `translate(${mousePos.x - (viewportWidth * 0.2)}px, ${mousePos.y - (viewportWidth * 0.2)}px)`,
          }}
        />
      )}

      {/* --- INFRASTRUCTURE BADGE --- */}
      <div className="animate-in fade-in slide-in-from-top-6 duration-1000 flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-3xl mb-10">
        <Activity className={cn("size-3.5 animate-pulse", isStaff ? "text-amber-500" : "text-primary")} />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] italic text-muted-foreground/30">
          {isStaff ? "Global_Audit_Node_Live" : "Merchant_Infrastructure_Ready"}
        </span>
      </div>

      {/* --- KINETIC HEADING: LIQUID SCALING --- */}
      <div className="relative z-10 text-center space-y-8 max-w-7xl mx-auto">
        <h1 className={cn(
          "font-black uppercase italic tracking-tighter leading-[0.82] text-foreground animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200",
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

        <p className="max-w-2xl mx-auto text-[11px] md:text-[13px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-relaxed animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400">
          Audit-verified telegram monetization infrastructure. <br className="hidden md:block" />
          Deploy high-frequency liquid clusters in seconds.
        </p>

        {/* --- ACTION HANDSHAKE: TACTICAL STACK --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-10 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-600">
          <Button
            size="lg"
            onClick={() => impact("heavy")}
            className={cn(
              "h-20 px-12 rounded-[1.8rem] font-black uppercase italic tracking-[0.2em] text-[11px] shadow-apex transition-all duration-1000 hover:scale-[1.02] active:scale-95",
              isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-primary-foreground shadow-primary/30"
            )}
          >
            {isStaff ? "Access_Audit_Nodes" : "Initialize_Merchant_Node"}
            <Zap className="ml-4 size-5 fill-current animate-pulse" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => impact("medium")}
            className="h-20 px-12 rounded-[1.8rem] border-white/5 bg-white/[0.03] backdrop-blur-3xl font-black uppercase italic tracking-[0.2em] text-[11px] hover:bg-white/10 transition-all duration-1000 active:scale-95"
          >
            View_Protocol
            <ArrowRight className="ml-4 size-5 opacity-40" />
          </Button>
        </div>
      </div>

      {/* --- TECHNICAL SPECS FOOTER: Hardware Telemetry --- */}
      <div 
        className="absolute bottom-10 inset-x-0 px-12 hidden lg:flex items-center justify-between opacity-20 animate-in fade-in duration-1000 delay-1000"
      >
        <div className="flex items-center gap-10">
          <TelemetryBlock label="Latency" value="< 240ms" />
          <div className="h-8 w-px bg-white/10" />
          <TelemetryBlock label="Security" value="AES_GCM_256" />
        </div>
        <div className="flex flex-col items-end gap-1">
           <span className="text-[10px] font-black uppercase tracking-widest italic leading-none opacity-40">System_Core</span>
           <span className="text-xl font-black uppercase tracking-tighter italic text-foreground">v16.30_APEX</span>
        </div>
      </div>

      {/* 🏛️ BACKGROUND GRID: Hardware-Aware Flow */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('/assets/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        <Waves className="absolute bottom-0 left-0 w-full h-40 opacity-[0.05] text-primary animate-pulse" />
      </div>
    </section>
  );
}

function TelemetryBlock({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black uppercase tracking-widest italic leading-none opacity-40">{label}</span>
      <span className="text-xl font-black uppercase tracking-tighter italic text-foreground">{value}</span>
    </div>
  );
}