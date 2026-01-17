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
      
      // 🛡️ TACTICAL LOCK: Prevents the "Sliding Space" seen in your photos
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
        "fixed inset-0 w-full overflow-hidden bg-black antialiased",
        // 🚀 OVERSCROLL LOCK: Essential for TMA 
        "touch-none overscroll-none", 
        isInitialized ? "opacity-100" : "opacity-0"
      )}
      style={{ height: `${viewportHeight}px` }}
    >
      {/* 🚀 LAMINAR CONTENT ENGINE: Independent Scroll Volume */}
      <main
        className={cn(
          "h-full w-full overflow-y-auto overflow-x-hidden relative z-10",
          "scrollbar-none touch-pan-y" // touch-pan-y re-enables content scrolling only
        )}
        style={{
          // 📏 SURGICAL SAFE-AREA CLAMPING
          paddingTop: `${safeArea.top}px`, 
          // 🛰️ BOTTOM BUFFER: Clears the 'Home/Identity' nav bar and OS indicator
          paddingBottom: `calc(${safeArea.bottom}px + 90px)`, 
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto flex flex-col p-4">
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