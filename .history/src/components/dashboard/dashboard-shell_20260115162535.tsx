"use client";

import * as React from "react";
import { useState, useLayoutEffect, useEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 DASHBOARD_SHELL (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Ingress | OLED-optimized Obsidian Depth.
 * Logic: morphology-aware safe-area clamping for Telegram 8.0+.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware-state consumption
  const { isReady, screenSize, isMobile, safeArea, viewportHeight } = useDeviceContext();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const isStaffFlavor = flavor === "AMBER";

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp && isReady) {
      try {
        WebApp.ready();
        WebApp.expand();

        // 🛡️ API 8.0: ANTI-SWIPE & FEEDBACK
        if (typeof WebApp.disableVerticalSwipes === "function") {
          WebApp.disableVerticalSwipes();
        }

        // 🎨 NATIVE RADIANCE: Hardware-level branding sync
        WebApp.setHeaderColor(isStaffFlavor ? "#f59e0b" : "#10b981");
        WebApp.setBackgroundColor("#000000"); // Obsidian OLED depth
        
        setIsInitialized(true);
        impact("light");
      } catch (error) {
        console.error("🛰️ [Shell_Sync_Fault]: Hardware link isolated.");
      }
    }
  }, [isStaffFlavor, impact, isReady]);

  // 🛡️ HYDRATION GUARD
  if (!isReady) return null;

  return (
    <div
      className={cn(
        "relative flex w-screen flex-col bg-background overflow-hidden antialiased",
        "transition-opacity duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        isInitialized ? "opacity-100" : "opacity-0"
      )}
      style={{ height: `${viewportHeight}px` }}
    >
      {/* 🌫️ VAPOUR RADIANCE: Subsurface Role-Based Depth */}
      <div className="fixed inset-0 pointer-events-none z-[-1] select-none overflow-hidden">
        <div className={cn(
          "absolute -top-10 left-1/4 size-[500px] rounded-full blur-[140px] opacity-10 transition-all duration-1000",
          isStaffFlavor ? "bg-amber-500" : "bg-primary"
        )} />
        <div className={cn(
          "absolute -bottom-10 right-1/4 size-[400px] rounded-full blur-[120px] opacity-10 transition-all duration-1000",
          isStaffFlavor ? "bg-amber-600" : "bg-primary"
        )} />
      </div>

      {/* 🚀 KINETIC CONTENT ENGINE: Private Scroll Containment */}
      <main 
        className={cn(
          "flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-none",
          screenSize === 'xs' ? "px-6" : "px-10"
        )}
        style={{
          paddingTop: `calc(${safeArea.top}px + 1.5rem)`,
          paddingBottom: `calc(${safeArea.bottom}px + 100px)`, // Dynamic Nav Clearance
        }}
      >
        <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * 🏛️ INSTITUTIONAL HEADER (v16.16.31)
 * Logic: Typographic "Rising Tide" ingress with morphology scaling.
 */
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { flavor } = useLayout();
  const { screenSize } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  return (
    <div className={cn(
      "flex flex-col gap-4 mb-12 md:mb-20 animate-in fade-in slide-in-from-left-8 duration-1000",
      screenSize === 'xs' ? "px-2" : "px-0"
    )}>
      <h1 className="text-[clamp(2.4rem,12vw,6rem)] font-black uppercase italic tracking-tighter leading-[0.75] text-foreground">
        {title.split(' ').map((word, i) => (
          <React.Fragment key={i}>
            <span className={cn(
              "transition-colors duration-1000",
              i === 1 && (isStaff ? "text-amber-500" : "text-primary")
            )}>
              {word}
            </span>
            {' '}
          </React.Fragment>
        ))}
      </h1>
      <div className="flex items-center gap-5 mt-4">
        <div className={cn(
          "h-1.5 w-12 transition-all duration-1000", 
          isStaff ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]" : "bg-primary shadow-[0_0_10px_#10b981]"
        )} />
        <p className="text-[10px] md:text-[12px] text-muted-foreground/30 font-black uppercase tracking-[0.5em] italic leading-none">
          {subtitle}
        </p>
      </div>
    </div>
  );
}