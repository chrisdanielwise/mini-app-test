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
      // 🛡️ STOP ELASTIC SLIDE: Essential for "Locked" feel
      if (typeof WebApp.disableVerticalSwipes === "function") WebApp.disableVerticalSwipes();
      setIsInitialized(true);
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    /* ⬛ LAYER 0: THE STRETCHED BACKGROUND (Absolute Physical Edges) */
    <div
      className={cn(
        "fixed inset-0 w-full h-full bg-black overflow-hidden touch-none overscroll-none",
        isInitialized ? "opacity-100" : "opacity-0 transition-opacity duration-700"
      )}
    >
      {/* 🚀 LAYER 1: THE STATIONARY HEADER (Pinned to Safe Top) */}
      <header 
        className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-3xl border-b border-white/5"
        style={{ paddingTop: `${safeArea.top}px` }}
      >
        <div className="h-14 flex items-center px-4">
           {/* Your Header Content Here */}
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Merchant_Terminal</span>
        </div>
      </header>

      {/* 🌊 LAYER 2: THE LAMINAR CONTENT (Scrollable between Header and Nav) */}
      <main
        className="absolute inset-0 w-full overflow-y-auto overflow-x-hidden scrollbar-none touch-pan-y"
        style={{
          // Header Height (14) + Safe Top
          paddingTop: `calc(${safeArea.top}px + 3.5rem)`, 
          // Footer Height (Nav) + Safe Bottom
          paddingBottom: `calc(${safeArea.bottom}px + 5.5rem)`, 
        }}
      >
        <div className="w-full max-w-lg mx-auto p-4 flex flex-col">
          {children}
        </div>
      </main>

      {/* 🛰️ LAYER 3: THE STATIONARY NAV (Pinned to Safe Bottom) */}
      <nav 
        className="fixed bottom-0 left-0 w-full z-50 bg-black/40 backdrop-blur-3xl border-t border-white/5"
        style={{ paddingBottom: `${safeArea.bottom}px` }}
      >
        <div className="h-16 flex items-center justify-around px-2">
           {/* Your Navigation Icons Here */}
        </div>
      </nav>
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