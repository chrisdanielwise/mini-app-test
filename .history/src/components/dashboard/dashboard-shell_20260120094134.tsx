"use client";

import * as React from "react";
import { useState, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import { Terminal, ShieldCheck, Zap } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ DASHBOARD_SHELL (Institutional Apex v2026.1.20)
 * Strategy: Synchronized Viewport Engine & Stationary HUD.
 * Fix: Resolved TS2339 by implementing safe hardware bridges.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, safeArea } = useDeviceContext();

  const [viewHeight, setViewHeight] = useState("100dvh");
  const [isInitialized, setIsInitialized] = useState(false);
  const isStaffFlavor = flavor === "AMBER";

  useLayoutEffect(() => {
    // ✅ FIX: Resolve TS2339/TS18048 via global object safe-access
    const tg = typeof window !== "undefined" ? (window as any).Telegram?.WebApp : null;

    if (tg && isReady) {
      try {
        // Trigger native handshake
        if (typeof tg.ready === 'function') tg.ready();
        if (typeof tg.expand === 'function') tg.expand();
        
        const syncMobileViewport = () => {
          // ✅ FIX: Safe-fallback for viewport height calculation
          const h = tg.viewportHeight || window.innerHeight;
          setViewHeight(`${h}px`);
        };

        syncMobileViewport();

        // ✅ FIX: Defensive event registration
        if (typeof tg.onEvent === 'function') {
          tg.onEvent("viewportChanged", syncMobileViewport);
        }
        
        // 🛡️ API 8.0: Prevent "Rubber-banding" on mobile gestures
        if (typeof tg.disableVerticalSwipes === "function") {
          tg.disableVerticalSwipes();
        }
        
        // 🎨 NATIVE BRANDING SYNC
        if (typeof tg.setHeaderColor === 'function') {
          tg.setHeaderColor(isStaffFlavor ? "#f59e0b" : "#000000");
        }
        if (typeof tg.setBackgroundColor === 'function') {
          tg.setBackgroundColor("#000000");
        }

        setIsInitialized(true);
        if (impact) impact("medium");

        return () => {
          if (typeof tg.offEvent === 'function') {
            tg.offEvent("viewportChanged", syncMobileViewport);
          }
        };
      } catch (error) {
        console.warn("🛰️ [Shell_Sync_Fault]: Hardware handshake interrupted.", error);
      }
    } else if (isReady) {
      // Browser fallback for development
      setIsInitialized(true);
    }
  }, [isReady, impact, isStaffFlavor]);

  if (!isReady) return null;

  return (
    <div
      className={cn(
        "flex flex-col w-full min-w-0 relative bg-black overflow-hidden selection:bg-primary/30",
        isInitialized ? "opacity-100" : "opacity-0 transition-opacity duration-1000"
      )}
      style={{ height: viewHeight }}
    >
      {/* 🚀 LAYER 1: HUD_HEADER */}
      <header className={cn(
        "shrink-0 h-14 flex flex-col justify-center px-4 backdrop-blur-3xl border-b z-50",
        isStaffFlavor ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-black/60 border-white/5"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 opacity-20 italic leading-none mb-1">
              <Terminal className="size-2.5" />
              <span className="text-[7px] font-black uppercase tracking-[0.4em]">Mesh_Ingress_v16.53</span>
            </div>
            <h1 className={cn(
              "text-xs font-black uppercase tracking-[0.2em] italic leading-none",
              isStaffFlavor ? "text-amber-500" : "text-primary"
            )}>
              Terminal Overdrive
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className={cn(
                "size-8 rounded-lg flex items-center justify-center border",
                isStaffFlavor ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
              )}>
                {isStaffFlavor ? <ShieldCheck className="size-4" /> : <Zap className="size-4 fill-current" />}
              </div>
          </div>
        </div>
      </header>

      {/* 🌊 LAYER 2: CONTENT_ENGINE */}
      {/* <main
        className="flex-1 w-full overflow-y-auto overscroll-y-contain relative z-10 scrollbar-hide"
        style={{ 
          WebkitOverflowScrolling: "touch",
          paddingTop: "0.5rem" 
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-10">
          {children}
        </div>

        {/* 📐 BOTTOM_SPACER: Tactical clearance for native UI bars */}
        <div style={{ height: `calc(${safeArea.bottom}px + 7rem)` }} className="shrink-0" />
      {/* </main> */} */}

      {/* 🌊 LAYER 2: CONTENT_ENGINE */}
<main
  className="flex-1 w-full overflow-y-auto overscroll-y-contain relative z-10 scrollbar-hide"
  style={{ 
    WebkitOverflowScrolling: "touch",
    paddingTop: "0.5rem" 
  }}
>
  <div className="w-full max-w-[1600px] mx-auto p-4 md:p-10">
    {children}
  </div>

  {/* 📐 BOTTOM_SPACER: Tactical clearance for native UI bars */}
  <div style={{ height: `calc(${safeArea.bottom}px + 7rem)` }} className="shrink-0" />
</main>

      {/* 🌌 ATMOSPHERIC RADIANCE */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={cn(
          "absolute -top-1/4 -left-1/4 size-[100%] rounded-full blur-[140px] opacity-[0.08] transition-all duration-1000",
          isStaffFlavor ? "bg-amber-500" : "bg-primary"
        )} />
      </div>
    </div>
  );
}

/**
 * 🛰️ DASHBOARD_HEADER (Institutional Apex v2026.1.20)
 * Strategy: Typographic Scale Anchoring.
 */
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string; }) {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <div className="flex flex-col gap-1.5 mb-8 animate-in fade-in slide-in-from-left-2 duration-500">
      <h1 className="text-[clamp(1.5rem,7vw,3rem)] font-black uppercase italic tracking-tighter leading-none text-foreground">
        {(title || "").split(" ").map((word, i) => (
          <React.Fragment key={i}>
            <span className={cn(i === 1 && (isStaff ? "text-amber-500" : "text-primary"))}>
              {word}
            </span>{" "}
          </React.Fragment>
        ))}
      </h1>
      <div className="flex items-center gap-3 mt-2">
        <div className={cn("h-[1px] w-8", isStaff ? "bg-amber-500/20" : "bg-primary/20")} />
        <p className="text-[7.5px] md:text-[9px] text-muted-foreground/30 font-black uppercase tracking-[0.4em] italic leading-none">
          {subtitle || "SYSTEM_OPTIMAL_STABLE"}
        </p>
      </div>
    </div>
  );
}