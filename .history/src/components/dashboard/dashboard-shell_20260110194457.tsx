"use client";

import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";

/**
 * 🛰️ STABLE IMMERSION SHELL (Reverted & Refined)
 * This version restores the "Full Size" feel you liked while
 * strictly fixing the button overlap issue.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        WebApp.ready();
        WebApp.expand(); // Restore the full-screen expansion

        const synchronizeViewport = () => {
          // Detect native Telegram safe zones
          if (WebApp.safeAreaInset) {
            setSafeArea({
              top: WebApp.safeAreaInset.top,
              bottom: WebApp.safeAreaInset.bottom,
            });
          }
        };

        synchronizeViewport();
        WebApp.onEvent("safeAreaChanged", synchronizeViewport);

        // Ensure header color matches your premium dark theme
        WebApp.setHeaderColor("secondary_bg_color");
        WebApp.setBackgroundColor("bg_color");

        setIsInitialized(true);

        return () => {
          WebApp.offEvent("safeAreaChanged", synchronizeViewport);
        };
      } catch (error) {
        console.error("SHELL_SYNC_FAILURE:", error);
      }
    }
  }, []);

  return (
    <div
      className={cn(
        "relative flex min-h-[100dvh] w-screen flex-col bg-background antialiased",
        isInitialized
          ? "opacity-100"
          : "opacity-0 transition-opacity duration-700"
      )}
    >
      {/* 🌌 FULL-SIZE BACKGROUND: This stays behind everything */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      {/* 🚀 THE CONTENT LAYER
          We use padding instead of margin to keep the background fluid.
          paddingTop: Ensures 'X Close' button doesn't cover your header.
          paddingBottom: Ensures nav buttons aren't hidden by gesture bars.
      */}
      <main
        className="flex-1 w-full overflow-x-hidden px-4 sm:px-8"
        style={{
          paddingTop: `${safeArea.top > 0 ? safeArea.top : 20}px`,
          paddingBottom: `${
            safeArea.bottom > 0 ? safeArea.bottom + 40 : 100
          }px`,
        }}
      >
        <div className="w-full max-w-7xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
