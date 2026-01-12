"use client";

import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";

/**
 * 🛰️ COMMAND SHELL (Protocol V2.1)
 * Optimized for Bot API 8.0 Safe Area Insets.
 * Resolves: Hidden nav buttons and header overlap.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });
  const [viewHeight, setViewHeight] = useState("100vh");
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        WebApp.ready();
        // WebApp.expand() can sometimes cause height bugs on older Androids; 
        // rely on requestFullscreen for Bot API 8.0.
        WebApp.expand();

        if (typeof WebApp.requestFullscreen === "function") {
          WebApp.requestFullscreen();
        }

        const synchronizeViewport = () => {
          // Use viewportHeight to account for the native Telegram header bar
          const actualHeight = WebApp.viewportHeight || window.innerHeight;
          setViewHeight(`${actualHeight}px`);

          // Fetch the exact safe zone pixels from the native SDK
          if (WebApp.safeAreaInset) {
            setSafeArea({
              top: WebApp.safeAreaInset.top,
              bottom: WebApp.safeAreaInset.bottom,
            });
          }
        };

        synchronizeViewport();
        WebApp.onEvent("safeAreaChanged", synchronizeViewport);
        WebApp.onEvent("viewportChanged", synchronizeViewport);
        window.addEventListener("resize", synchronizeViewport);

        if (typeof WebApp.disableVerticalSwipes === "function") {
          WebApp.disableVerticalSwipes();
        }

        WebApp.setHeaderColor("secondary_bg_color");
        WebApp.setBackgroundColor("bg_color");
        setIsInitialized(true);

        return () => {
          WebApp.offEvent("safeAreaChanged", synchronizeViewport);
          WebApp.offEvent("viewportChanged", synchronizeViewport);
          window.removeEventListener("resize", synchronizeViewport);
        };
      } catch (error) {
        console.error("SHELL_SYNC_FAILURE:", error);
      }
    }
  }, []);

  return (
    <div
      className={cn(
        "relative flex w-screen flex-col bg-background overflow-hidden antialiased",
        isInitialized ? "opacity-100" : "opacity-0 transition-opacity duration-1000"
      )}
      style={{
        height: viewHeight,
        maxHeight: viewHeight,
      }}
    >
      {/* 🏁 TOP SAFE AREA BUFFER: Prevents content from hiding behind 'Close' buttons */}
      <div style={{ height: `${safeArea.top}px` }} className="w-full shrink-0" />

      <main className="flex-1 w-full flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar px-4 sm:px-8">
        <div className="w-full max-w-7xl mx-auto py-4">
          {children}
        </div>
      </main>

      {/* 🏁 BOTTOM SAFE AREA BUFFER: Prevents content from hiding behind gesture bars */}
      <div style={{ height: `${safeArea.bottom}px` }} className="w-full shrink-0" />

      {/* Background Aura */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>
    </div>
  );
}

export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1 mb-8 mt-2">
      <h1 className="text-[clamp(1.8rem,9vw,3.5rem)] font-black uppercase italic tracking-tighter leading-[0.85] break-words">
        {title}
      </h1>
      <p className="text-[clamp(0.65rem,2.2vw,0.8rem)] text-muted-foreground font-black uppercase tracking-[0.25em] opacity-60 mt-2">
        {subtitle}
      </p>
    </div>
  );
}