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
      WebApp.ready();
      WebApp.expand();
      
      // 🛡️ STOP TELEGRAM BOUNCE: This prevents the window from moving at all
      if (typeof WebApp.disableVerticalSwipes === "function") {
         WebApp.disableVerticalSwipes();
      }
      
      setIsInitialized(true);
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 w-screen overflow-hidden bg-black antialiased",
        "touch-none overscroll-none", // 🚀 Kills the rubber-band effect at the source
        isInitialized ? "opacity-100" : "opacity-0"
      )}
      style={{ 
        height: `${viewportHeight}px`,
        maxHeight: `${viewportHeight}px`,
      }}
    >
      {/* 🚀 LAMINAR CONTENT ENGINE: Locked Container */}
      <main
        className={cn(
          "absolute inset-0 w-full overflow-y-auto overflow-x-hidden z-10",
          "scrollbar-none touch-pan-y flex flex-col" // 🚀 Allows internal scroll only
        )}
      >
        {/* 📐 TOP_BUFFER: Instead of padding, we use a spacer that doesn't allow 'movement' */}
        <div style={{ height: `${safeArea.top}px` }} className="shrink-0 w-full" />

        {/* 🏛️ CONTENT_VIEWPORT */}
        <div className="flex-1 w-full max-w-[1600px] mx-auto p-4">
          {children}
        </div>

        {/* 📐 BOTTOM_BUFFER: Snaps content perfectly above the Nav Bar */}
        <div style={{ height: `calc(${safeArea.bottom}px + 75px)` }} className="shrink-0 w-full" />
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