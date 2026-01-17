"use client";

import * as React from "react";
import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID MOBILE SHELL (v16.16.12)
 * Logic: Haptic-synced viewport anchoring for Telegram 8.0.
 * Design: OLED-optimized Obsidian Depth.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [viewHeight, setViewHeight] = useState("100dvh");
  const [isInitialized, setIsInitialized] = useState(false);
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const isStaffFlavor = flavor === "AMBER";

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        WebApp.ready();
        WebApp.expand();

        const syncMobileViewport = () => {
          // 🏛️ VIEWPORT ANCHORING: Precision height lock for 1M+ user devices
          const h = WebApp.viewportHeight || window.innerHeight;
          setViewHeight(`${h}px`);
        };

        syncMobileViewport();
        WebApp.onEvent("viewportChanged", syncMobileViewport);
        window.addEventListener("resize", syncMobileViewport);

        // 🛡️ API 8.0: ANTI-SWIPE PROTOCOL
        if (typeof WebApp.disableVerticalSwipes === "function") {
          WebApp.disableVerticalSwipes();
        }

        // 🎨 NATIVE RADIANCE: Hardware-level branding sync
        WebApp.setHeaderColor(isStaffFlavor ? "#f59e0b" : "#10b981");
        WebApp.setBackgroundColor("#000000"); // Obsidian OLED depth
        
        setIsInitialized(true);
        impact("light");

        return () => {
          WebApp.offEvent("viewportChanged", syncMobileViewport);
          window.removeEventListener("resize", syncMobileViewport);
        };
      } catch (error) {
        console.error("SHELL_SYNC_FAILURE:", error);
      }
    }
  }, [isStaffFlavor, impact]);

  return (
    <div
      className={cn(
        "relative flex w-screen flex-col bg-background overflow-hidden antialiased",
        "transition-opacity duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isInitialized ? "opacity-100" : "opacity-0"
      )}
      style={{ height: viewHeight }}
    >
      {/* 🌌 ATMOSPHERIC DEPTH: Role-Based Aura */}
      <div className="fixed inset-0 pointer-events-none z-[-1] select-none">
        <div className={cn(
          "absolute -top-10 left-1/4 size-[500px] rounded-full blur-[140px] transition-all duration-1000",
          isStaffFlavor ? "bg-amber-500/5" : "bg-primary/5"
        )} />
        <div className={cn(
          "absolute -bottom-10 right-1/4 size-[400px] rounded-full blur-[120px] transition-all duration-1000",
          isStaffFlavor ? "bg-amber-600/10" : "bg-primary/5"
        )} />
      </div>

      {/* 🚀 KINETIC CONTENT ENGINE */}
      <main 
        className="flex-1 w-full overflow-y-auto overflow-x-hidden px-6 sm:px-10 scrollbar-hide overscroll-none"
        style={{
          paddingTop: "84px", // Hardware Safe-Zone
          paddingBottom: "150px", // Nav Clearance
        }}
      >
        <div className="w-full max-w-7xl mx-auto py-2 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * 🏛️ INSTITUTIONAL HEADER (v16.16.12)
 * Logic: Typographic "Rising Tide" ingress.
 */
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <div className="flex flex-col gap-3 mb-10 md:mb-14">
      <h1 className="text-[clamp(2.2rem,10vw,4.5rem)] font-black uppercase italic tracking-tighter leading-[0.8] text-foreground">
        {title.split(' ').map((word, i) => (
          <React.Fragment key={i}>
            <span className={cn(
              "transition-colors duration-700",
              i === 1 && (isStaff ? "text-amber-500" : "text-primary")
            )}>
              {word}
            </span>
            {' '}
          </React.Fragment>
        ))}
      </h1>
      <div className="flex items-center gap-4 mt-2">
        <div className={cn(
          "h-px w-8 transition-all duration-700", 
          isStaff ? "bg-amber-500" : "bg-primary"
        )} />
        <p className="text-[10px] md:text-[11px] text-muted-foreground/40 font-black uppercase tracking-[0.4em] italic">
          {subtitle}
        </p>
      </div>
    </div>
  );
}