"use client";

import * as React from "react";
import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 DASHBOARD_SHELL (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Ingress | Obsidian-OLED Depth.
 * Logic: morphology-aware safe-area clamping for Telegram 8.0+.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state interpolation
  const { 
    isReady, 
    screenSize, 
    isMobile, 
    safeArea, 
    viewportHeight,
    orientation 
  } = useDeviceContext();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const isStaffFlavor = flavor === "AMBER";

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp && isReady) {
      try {
        WebApp.ready();
        WebApp.expand();

        // 🛡️ API 8.0: ANTI-SWIPE & GESTURE CLAMPING
        if (typeof WebApp.disableVerticalSwipes === "function") {
          WebApp.disableVerticalSwipes();
        }

        // 🎨 NATIVE RADIANCE: Native hardware bar synchronization
        WebApp.setHeaderColor(isStaffFlavor ? "#f59e0b" : "#10b981");
        WebApp.setBackgroundColor("#000000"); 
        
        setIsInitialized(true);
        impact("medium");
      } catch (error) {
        console.warn("🛰️ [Shell_Sync_Isolated]: Hardware handshake failed.");
      }
    }
  }, [isStaffFlavor, impact, isReady]);

  // 🛡️ HYDRATION SHIELD: Prevent Layout Shifting
  if (!isReady) return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="size-12 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div
      className={cn(
        "relative flex w-screen flex-col bg-background selection:bg-primary/20",
        "transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        isInitialized ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
      )}
      style={{ height: `${viewportHeight}px` }}
    >
      {/* 🌫️ VAPOUR DEPTH: Role-Based Subsurface Radiances */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={cn(
          "absolute -top-1/4 left-1/4 size-[120vw] md:size-[600px] rounded-full blur-[160px] opacity-[0.07] transition-all duration-[2000ms]",
          isStaffFlavor ? "bg-amber-500" : "bg-primary"
        )} />
        <div className={cn(
          "absolute -bottom-1/4 right-1/4 size-[100vw] md:size-[500px] rounded-full blur-[140px] opacity-[0.05] transition-all duration-[2000ms]",
          isStaffFlavor ? "bg-amber-600" : "bg-primary/60"
        )} />
        
        {/* Institutional Grid Grain */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('/assets/grid.svg')] bg-[length:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      </div>

      {/* 🚀 LAMINAR CONTENT ENGINE: Kinetic Scroll Volume */}
      <main 
        className={cn(
          "flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-none relative z-10",
          isMobile ? "px-6" : "px-12 lg:px-20"
        )}
        style={{
          paddingTop: `calc(${safeArea.top}px + 2rem)`,
          paddingBottom: `calc(${safeArea.bottom}px + 120px)`, // Elevated Clearance for Bottom HUD
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      {/* 🛡️ HARDWARE SAFE-ZONE INDICATORS (Developer HUD Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 right-2 text-[7px] font-mono opacity-20 pointer-events-none z-[999] bg-black p-1 rounded uppercase">
          {screenSize}_{orientation}_{viewportHeight}px
        </div>
      )}
    </div>
  );
}

/**
 * 🏛️ INSTITUTIONAL HEADER (v2026.1.15)
 * Logic: Adaptive scale-interpolation with role-aware accentuation.
 */
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { flavor } = useLayout();
  const { screenSize } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  return (
    <div className={cn(
      "flex flex-col gap-6 mb-16 md:mb-28 animate-in fade-in slide-in-from-left-12 duration-1000",
      screenSize === 'xs' ? "px-1" : "px-0"
    )}>
      <div className="space-y-1">
        <div className="flex items-center gap-3 opacity-30 mb-2 italic">
          <Terminal className="size-3" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">Node_Ingress_v16.31</span>
        </div>
        <h1 className="text-[clamp(2.8rem,14vw,7.5rem)] font-black uppercase italic tracking-tighter leading-[0.75] text-foreground">
          {title.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              <span className={cn(
                "transition-all duration-1000",
                i === 1 && (isStaff ? "text-amber-500 drop-shadow-[0_0_20px_#f59e0b44]" : "text-primary drop-shadow-[0_0_20px_#10b98144]")
              )}>
                {word}
              </span>
              {' '}
            </React.Fragment>
          ))}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className={cn(
          "h-px w-16 md:w-24 transition-all duration-1000", 
          isStaff ? "bg-amber-500/40" : "bg-primary/40"
        )} />
        <p className="text-[10px] md:text-[13px] text-muted-foreground/30 font-black uppercase tracking-[0.6em] italic leading-none whitespace-nowrap">
          {subtitle}
        </p>
        <div className="h-px flex-1 bg-white/[0.03]" />
      </div>
    </div>
  );
}