"use client";

import * as React from "react";
import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp"; // Ensure this safely returns the window.Telegram.WebApp or null
import { cn } from "@/lib/utils";
import { Terminal, ShieldCheck, Zap } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🛰️ DASHBOARD_SHELL (Institutional Apex v2026.1.20)
 * Strategy: Synchronized Viewport Engine & Stationary HUD.
 * Fix: Resolved TS18048 and TS2339 by hardening WebApp API access.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, safeArea } = useDeviceContext();

  const [viewHeight, setViewHeight] = useState("100dvh");
  const [isInitialized, setIsInitialized] = useState(false);
  const isStaffFlavor = flavor === "AMBER";

  useLayoutEffect(() => {
    // ✅ FIX: Strict guard for WebApp availability
    if (typeof window !== "undefined" && WebApp && isReady) {
      try {
        WebApp.ready();
        WebApp.expand();
        
        // 🔄 Precise Viewport Sync
        const syncMobileViewport = () => {
          // ✅ FIX: Use optional chaining to resolve TS18048
          const h = WebApp?.viewportHeight || window.innerHeight;
          setViewHeight(`${h}px`);
        };

        syncMobileViewport();

        // ✅ FIX: Check for event registration methods (API 6.0+)
        if (typeof WebApp.onEvent === 'function') {
          WebApp.onEvent("viewportChanged", syncMobileViewport);
        }
        
        // 🛡️ API 8.0: Prevent Elastic Swiping
        if (typeof WebApp.disableVerticalSwipes === "function") {
          WebApp.disableVerticalSwipes();
        }
        
        // 🎨 Native Branding Sync
        if (typeof WebApp.setHeaderColor === 'function') {
          WebApp.setHeaderColor(isStaffFlavor ? "#f59e0b" : "#000000");
          WebApp.setBackgroundColor("#000000");
        }

        setIsInitialized(true);
        impact("medium");

        return () => {
          // ✅ FIX: Safe cleanup check
          if (typeof WebApp.offEvent === 'function') {
            WebApp.offEvent("viewportChanged", syncMobileViewport);
          }
        };
      } catch (error) {
        console.warn("🛰️ [Shell_Sync_Fault]: Hardware handshake isolated.");
      }
    }
  }, [isReady, impact, isStaffFlavor]);

  // Prevent flash of un-hydrated content
  if (!isReady) return null;

  return (
    <div
      className={cn(
        "flex flex-col w-full min-w-0 relative bg-black overflow-hidden selection:bg-primary/30",
        isInitialized ? "opacity-100" : "opacity-0 transition-opacity duration-1000"
      )}
      style={{ height: viewHeight }} // 📐 Viewport-Locked Height
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
             <div className="flex items-center gap-3">
               <div className={cn(
                  "size-8 rounded-lg flex items-center justify-center border",
                  isStaffFlavor ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  {isStaffFlavor ? <ShieldCheck className="size-4" /> : <Zap className="size-4 fill-current" />}
                </div>
             </div>
          </div>
        </div>
      </header>

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

        {/* 📐 BOTTOM_SPACER: Clears native Home Indicator and navigation nodes */}
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

/** 📊 DASHBOARD_HEADER (Institutional Typography) */
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