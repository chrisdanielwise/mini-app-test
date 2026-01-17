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
 * 🌊 DASHBOARD_SHELL (Institutional Apex v2026.1.18)
 * Strategy: High-density data volume with surgical safe-area clamping.
 * Fix: Added min-w-0 to prevent "greedy" child elements (tables/headers) 
 * from expanding the container horizontally and causing cropping.
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

  // 🛡️ HYDRATION GUARD
  if (!isReady)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
      </div>
    );

  return (
    <div
      className={cn(
        // 🛡️ FIX: Added min-w-0 to ensure the master wrapper respects the viewport width
        "relative flex w-full min-w-0 flex-col bg-background antialiased",
        "transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        isInitialized ? "opacity-100 scale-100" : "opacity-0 scale-[0.99]"
      )}
      style={{ height: `${viewportHeight}px`, overflow: "clip" }}
    >
      {/* 🌫️ VAPOUR DEPTH */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={cn(
            "absolute -top-1/4 left-1/4 size-[100vw] md:size-[600px] rounded-full blur-[140px] opacity-[0.06] transition-all duration-[2000ms]",
            isStaffFlavor ? "bg-amber-500" : "bg-primary"
          )}
        />
        <div className="absolute inset-0 opacity-[0.01] bg-[url('/assets/grid.svg')] bg-[length:32px_32px]" />
      </div>

      {/* 🚀 LAMINAR CONTENT ENGINE: Independent Tactical Scroll */}
      <main
        className={cn(
          // 🛡️ FIX: Added min-w-0 and min-h-0 to unlock responsive shrinking for children
          "flex-1 w-full min-w-0 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-10",
          isMobile ? "px-5" : "px-8 lg:px-16"
        )}
        style={{
          paddingTop: `calc(${safeArea.top}px + 0.25rem)`, 
          paddingBottom: `calc(${safeArea.bottom}px + 60px)`,
        }}
      >
        {/* 🛡️ FIX: Inner wrapper with min-w-0 to ensure headers/tables calculate width correctly */}
        <div className="w-full max-w-[1400px] mx-auto min-h-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * 🏛️ INSTITUTIONAL HEADER (Tactical v2026.1.18)
 * Fix: Added min-w-0 to prevent the title text from breaking the layout bounds.
 */
export function DashboardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { flavor } = useLayout();
  const { screenSize } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  return (
    <div
      className={cn(
        // 🛡️ FIX: Added min-w-0 to allow truncation within the header
        "flex flex-col gap-3 mb-6 md:mb-8 animate-in fade-in slide-in-from-left-4 duration-700 min-w-0",
        screenSize === "xs" ? "px-1" : "px-0"
      )}
    >
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2.5 opacity-20 mb-1 italic">
          <Terminal className="size-3" />
          <span className="text-[7px] font-black uppercase tracking-[0.5em]">
            Mesh_Ingress_v16.31
          </span>
        </div>
        {/* 🛡️ FIX: Added truncate to ensure long titles (like Analysis names) fit without overflow */}
        <h1 className="text-[clamp(1.75rem,5vw,3.5rem)] font-black uppercase italic tracking-tighter leading-[0.9] text-foreground truncate">
          {(title || "").split(" ").map((word, i) => (
            <React.Fragment key={i}>
              <span
                className={cn(
                  "transition-all duration-700",
                  i === 1 && (isStaff ? "text-amber-500" : "text-primary")
                )}
              >
                {word}
              </span>{" "}
            </React.Fragment>
          ))}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={cn(
            "h-px w-8 md:w-12",
            isStaff ? "bg-amber-500/30" : "bg-primary/30"
          )}
        />
        <p className="text-[8px] md:text-[9px] text-muted-foreground/30 font-black uppercase tracking-[0.4em] italic leading-none whitespace-nowrap">
          {subtitle || "PROTOCOL_STABLE"}
        </p>
        <div className="h-px flex-1 bg-white/[0.02]" />
      </div>
    </div>
  );
}