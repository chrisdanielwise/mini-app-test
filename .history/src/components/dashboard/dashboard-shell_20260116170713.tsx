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
  const { isReady, safeArea, viewportHeight } = useDeviceContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp && isReady) {
      // 🏛️ TELEGRAM CORE HANDSHAKE
      WebApp.ready();
      WebApp.expand();
      
      // 🛡️ CRITICAL LOCK: Kills the elastic "bounce" that causes the space
      if (typeof WebApp.disableVerticalSwipes === "function") {
         WebApp.disableVerticalSwipes();
      }
      
      setIsInitialized(true);
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    /**
     * ⬛ LAYER 0: THE HARDWARE_LOCK
     * This container is STRETCHED to the absolute physical screen.
     * It is impossible to scroll this layer.
     */
    <div
      className={cn(
        "fixed inset-0 w-full h-full bg-black select-none overflow-hidden touch-none overscroll-none",
        isInitialized ? "opacity-100" : "opacity-0"
      )}
      style={{ height: `${viewportHeight}px` }}
    >
      /**
       * 🌊 LAYER 1: THE LAMINAR_SCROLL_ROOT
       * This is the ONLY element allowed to move. 
       * It is trapped within Layer 0 so it can't leave "spaces" around it.
       */
      <main
        className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none"
        style={{
          // touch-pan-y allows internal content scrolling while parent is locked
          touchAction: "pan-y", 
          WebkitOverflowScrolling: "touch"
        }}
      >
        {/* 📐 TOP_ANCHOR: Pushes content exactly where the status bar ends */}
        <div style={{ height: `${safeArea.top}px` }} className="shrink-0" />

        {/* 🏛️ HUD_CONTENT: Your dashboard nodes */}
        <div className="flex-1 w-full max-w-lg mx-auto p-4 flex flex-col min-h-full">
          {children}
        </div>

        {/* 📐 BOTTOM_ANCHOR: Clears the Nav Bar + Safe Area */}
        <div style={{ height: `calc(${safeArea.bottom}px + 80px)` }} className="shrink-0" />
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