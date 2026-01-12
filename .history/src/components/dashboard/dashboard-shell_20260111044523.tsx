"use client";

import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";

/**
 * 🛰️ APEX MOBILE SHELL (Apex Tier)
 * Normalized: Fixed pixel-height synchronization for Telegram viewports.
 * Optimized: Adaptive safe-zones and anti-bounce protocol for high-resiliency UI.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [viewHeight, setViewHeight] = useState("100dvh");
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        WebApp.ready();
        WebApp.expand(); // Forces Telegram to take up the maximum allowed mobile height

        const syncMobileViewport = () => {
          // WebApp.viewportHeight is the only reliable property for mobile headers
          const h = WebApp.viewportHeight || window.innerHeight;
          setViewHeight(`${h}px`);
        };

        syncMobileViewport();
        WebApp.onEvent("viewportChanged", syncMobileViewport);
        window.addEventListener("resize", syncMobileViewport);

        // API 8.0: Stops the "Elastic Bounce" that hides bottom buttons
        if (typeof WebApp.disableVerticalSwipes === "function") {
          WebApp.disableVerticalSwipes();
        }

        WebApp.setHeaderColor("secondary_bg_color");
        WebApp.setBackgroundColor("bg_color");
        setIsInitialized(true);

        return () => {
          WebApp.offEvent("viewportChanged", syncMobileViewport);
          window.removeEventListener("resize", syncMobileViewport);
        };
      } catch (error) {
        console.error("SHELL_SYNC_FAILURE:", error);
      }
    }
  }, []);

  return (
    <div
      className={cn(
        "relative flex w-screen flex-col bg-background overflow-hidden antialiased selection:bg-primary/30",
        isInitialized ? "opacity-100" : "opacity-0 transition-opacity duration-500"
      )}
      style={{ height: viewHeight }}
    >
      {/* 🌌 FULL-SIZE BACKGROUND AURA */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      {/* 🚀 THE MOBILE CONTENT ENGINE */}
      <main 
        className="flex-1 w-full overflow-y-auto overflow-x-hidden px-5 sm:px-8 custom-scrollbar"
        style={{
          paddingTop: "64px", // Forces content below native Telegram 'X'
          paddingBottom: "120px", // Pushes content above BottomNav safe zone
        }}
      >
        <div className="w-full max-w-7xl mx-auto py-2 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * 🏛️ APEX HEADER COMPONENT
 * Fixed: Fluid typography prevents "MAND" clipping on mobile nodes.
 */
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1 mb-8 md:mb-12">
      <h1 className="text-[clamp(1.6rem,7vw,3.2rem)] font-black uppercase italic tracking-tighter leading-[0.9] break-words">
        {title}
      </h1>
      <div className="flex items-center gap-2 mt-2 opacity-50">
        <div className="h-px w-4 bg-primary/50" />
        <p className="text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}