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
        
        // 🛡️ TACTICAL FIX: Only disable swipe if the content is not scrollable
        // This prevents the "stuck" feeling on mobile views.
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
    <div
      className={cn(
        "fixed inset-0 flex w-full min-w-0 flex-col bg-background antialiased overflow-hidden",
        "transition-all duration-700",
        isInitialized ? "opacity-100" : "opacity-0"
      )}
      style={{ 
        // 🛡️ STATIONARY HEIGHT LOCK: Uses direct hardware telemetry
        height: `${viewportHeight}px`,
        maxHeight: `${viewportHeight}px`,
        top: 0,
        left: 0
      }}
    >
      {/* 🌫️ ATMOSPHERIC DEPTH (Stationary) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={cn(
            "absolute -top-1/4 left-1/4 size-[100vw] rounded-full blur-[140px] opacity-[0.04]",
            isStaffFlavor ? "bg-amber-500" : "bg-primary"
          )}
        />
      </div>

      {/* 🚀 LAMINAR CONTENT ENGINE: Independent Scroll Volume */}
      <main
        id="main-scroll-root"
        className={cn(
          "flex-1 w-full min-w-0 overflow-y-auto overflow-x-hidden relative z-10",
          "scrollbar-none touch-pan-y", // Ensures smooth TMA scrolling
          isMobile ? "px-4" : "px-8 lg:px-12"
        )}
        style={{
          // 📏 SURGICAL SAFE-AREA CLAMPING
          paddingTop: `${safeArea.top}px`, 
          // 🚀 TMA BUFFER: 80px clears the Telegram 'MainButton' and Nav zones
          paddingBottom: `calc(${safeArea.bottom}px + 80px)`,
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto flex flex-col pt-4">
          {children}
        </div>
      </main>
    </div>
  );
}

export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string; }) {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <div className="flex flex-col gap-1.5 mb-6 animate-in fade-in slide-in-from-left-2 duration-500 min-w-0">
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-center gap-2 opacity-20 italic leading-none">
          <Terminal className="size-2.5" />
          <span className="text-[7px] font-black uppercase tracking-[0.4em]">Mesh_Ingress_v16.31</span>
        </div>
        
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