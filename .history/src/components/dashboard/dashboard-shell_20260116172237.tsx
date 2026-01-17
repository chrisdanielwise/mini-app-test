"use client";

import * as React from "react";
import { useState, useLayoutEffect, memo } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ DASHBOARD_SHELL (Apex v2026.1.20)
 * Strategy: Absolute Hardware Lock & Laminar Scroll Volume.
 * Fix: Background stretches 100% top-to-bottom; Header stays below Safe Area.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, safeArea, viewportHeight } = useDeviceContext();

  const [isInitialized, setIsInitialized] = useState(false);
  const isStaffFlavor = flavor === "AMBER";

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp && isReady) {
      try {
        WebApp.ready();
        WebApp.expand();
        
        // 🛡️ HARDWARE LOCK: Disables native elastic bounce that causes the "Space"
        if (typeof WebApp.disableVerticalSwipes === "function") {
          WebApp.disableVerticalSwipes();
        }
        
        WebApp.setHeaderColor(isStaffFlavor ? "#f59e0b" : "#10b981");
        WebApp.setBackgroundColor("#000000");
        setIsInitialized(true);
        impact("medium");
      } catch (error) {
        console.warn("🛰️ [Shell_Sync_Isolated]: Hardware handshake failed.");
      }
    }
  }, [isStaffFlavor, impact, isReady]);

  if (!isReady) return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
      <div className="size-8 rounded-lg border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    /**
     * ⬛ LAYER 0: THE STRETCHED_BACKGROUND
     * Pins to absolute physical edges (0px top/bottom) to prevent sliding.
     */
    <div
      className={cn(
        "fixed inset-0 w-full bg-black antialiased overflow-hidden select-none touch-none overscroll-none",
        "transition-all duration-700",
        isInitialized ? "opacity-100" : "opacity-0"
      )}
      style={{ 
        height: `${viewportHeight}px`,
        maxHeight: `${viewportHeight}px`
      }}
    >
      {/* 🌫️ ATMOSPHERIC DEPTH (Fixed Background Layer) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={cn(
            "absolute -top-1/4 left-1/4 size-[100vw] rounded-full blur-[140px] opacity-[0.04]",
            isStaffFlavor ? "bg-amber-500" : "bg-primary"
          )}
        />
      </div>

      {/* 🚀 LAYER 1: STATIONARY_HUD_HEADER
          Background blur stretches to top; Content starts BELOW safe area. */}
      <header 
        className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5"
        style={{ paddingTop: `${safeArea.top}px` }}
      >
        <div className="h-14 flex items-center px-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 opacity-30 italic leading-none">
              <Terminal className="size-2.5" />
              <span className="text-[7px] font-black uppercase tracking-[0.4em]">Mesh_Ingress_v16.31</span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary italic">
              Merchant_Terminal
            </span>
          </div>
        </div>
      </header>

      {/* 🌊 LAYER 2: LAMINAR_CONTENT_ENGINE
          The ONLY volume allowed to move vertically. */}
      <main
        id="main-scroll-root"
        className={cn(
          "absolute inset-0 w-full overflow-y-auto overflow-x-hidden relative z-10",
          "scrollbar-none"
        )}
        style={{
          // touchAction: pan-y re-enables internal scroll while parent is locked
          touchAction: "pan-y",
          WebkitOverflowScrolling: "touch",
          // PaddingTop: Header (3.5rem) + Safe Area
          paddingTop: `calc(${safeArea.top}px + 3.5rem)`, 
          // PaddingBottom: Nav Buffer + Safe Area
          paddingBottom: `calc(${safeArea.bottom}px + 6rem)`,
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto flex flex-col p-4 min-h-full">
          {children}
        </div>
      </main>

      {/* 🛰️ LAYER 3: STATIONARY_HUD_NAV (Static Bottom Anchor) */}
      <nav 
        className="fixed bottom-0 left-0 w-full z-50 bg-black/40 backdrop-blur-3xl border-t border-white/5"
        style={{ paddingBottom: `${safeArea.bottom}px` }}
      >
        <div className="h-16 flex items-center justify-around px-2">
           {/* Navigation content remains stationary */}
        </div>
      </nav>
    </div>
  );
}

/**
 * 🏛️ DASHBOARD_HEADER (Institutional Apex v2026.1.20)
 * Logic: Page-level title and metadata metadata.
 */
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string; }) {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <div className="flex flex-col gap-1.5 mb-6 animate-in fade-in slide-in-from-left-2 duration-500 min-w-0">
      <div className="space-y-0.5 min-w-0">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground truncate">
          {(title || "").split(" ").map((word, i) => (
            <React.Fragment key={i}>
              <span className={cn(i === 1 && (isStaff ? "text-amber-500" : "text-primary"))}>
                {word}
              </span>{" "}
            </React.Fragment>
          ))}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className={cn("h-[0.5px] w-8", isStaff ? "bg-amber-500/20" : "bg-primary/20")} />
        <p className="text-[7.5px] text-muted-foreground/30 font-black uppercase tracking-[0.3em] italic leading-none whitespace-nowrap">
          {subtitle || "STATUS_OPTIMAL"}
        </p>
      </div>
    </div>
  );
}