"use client";

import * as React from "react";
import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";

// 🏛️ INSTITUTIONAL ASSETS
import { Terminal } from "lucide-react";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ DASHBOARD_SHELL (Institutional Apex v2026.1.20)
 * Strategy: Stationary Membrane & Independent Tactical Scroll.
 * Fix: Absolute viewport lock with 'min-w-0' flex-resolution logic.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea, viewportHeight } = useDeviceContext();

  const [isInitialized, setIsInitialized] = useState(false);
  const isStaffFlavor = flavor === "AMBER";

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp && isReady) {
      try {
        WebApp.ready();
        WebApp.expand();
        if (typeof WebApp.disableVerticalSwipes === "function") WebApp.disableVerticalSwipes();
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
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="size-8 rounded-lg border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div
      className={cn(
        "relative flex w-full min-w-0 flex-col bg-background antialiased selection:bg-primary/20",
        "transition-all duration-700",
        isInitialized ? "opacity-100" : "opacity-0"
      )}
      style={{ height: `${viewportHeight}px`, overflow: "clip" }}
    >
      {/* 🌫️ ATMOSPHERIC DEPTH */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={cn(
            "absolute -top-1/4 left-1/4 size-[100vw] md:size-[600px] rounded-full blur-[140px] opacity-[0.04] transition-all",
            isStaffFlavor ? "bg-amber-500" : "bg-primary"
          )}
        />
        <div className="absolute inset-0 opacity-[0.01] bg-[url('/assets/grid.svg')] bg-[length:32px_32px]" />
      </div>

      {/* 🚀 LAMINAR CONTENT ENGINE: Isolated Volume */}
      <main
        className={cn(
          "flex-1 w-full min-w-0 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10",
          isMobile ? "px-4" : "px-8 lg:px-12"
        )}
        style={{
          paddingTop: `calc(${safeArea.top}px + 0.5rem)`, 
          paddingBottom: `calc(${safeArea.bottom}px + 72px)`,
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto min-h-full min-w-0 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * 🏛️ INSTITUTIONAL HEADER (Tactical v2026.1.20)
 * Strategy: Vertical Compression & Title Truncation Protocol.
 */
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string; }) {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <div className="flex flex-col gap-2 mb-4 md:mb-6 animate-in fade-in slide-in-from-left-2 duration-500 min-w-0">
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-center gap-2 opacity-30 italic leading-none">
          <Terminal className="size-2.5" />
          <span className="text-[7px] font-black uppercase tracking-[0.4em]">Mesh_Ingress_v16.31</span>
        </div>
        
        <h1 className="text-xl md:text-3xl lg:text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground truncate">
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
        <div className={cn("h-px w-6 md:w-10", isStaff ? "bg-amber-500/20" : "bg-primary/20")} />
        <p className="text-[7.5px] md:text-[8px] text-muted-foreground/20 font-black uppercase tracking-[0.3em] italic leading-none whitespace-nowrap">
          {subtitle || "STATUS_OPTIMAL"}
        </p>
        <div className="h-px flex-1 bg-white/[0.01]" />
      </div>
    </div>
  );
}