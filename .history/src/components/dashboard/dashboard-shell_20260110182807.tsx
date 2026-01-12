"use client";

import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/src/lib/telegram/webapp";
import { cn } from "@/src/lib/utils";

/**
 * 🛰️ COMMAND SHELL (Protocol V2)
 * High-resiliency viewport sync for Telegram Bot API 8.0.
 * Fixed: Resolves UI overflow, text cropping, and viewport height bugs.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });
  const [viewHeight, setViewHeight] = useState("100vh");
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        // 🏁 1. INITIALIZATION HANDSHAKE
        WebApp.ready();
        WebApp.expand();

        // 🛡️ 2. SECURITY PROTOCOL
        if (typeof WebApp.enableClosingConfirmation === "function") {
          WebApp.enableClosingConfirmation();
        }

        // 🚀 3. FULLSCREEN OVERRIDE
        if (typeof WebApp.requestFullscreen === "function") {
          WebApp.requestFullscreen();
        }

        /**
         * 📐 THE HARD VIEWPORT SYNC
         * Fixed: Uses WebApp.viewportHeight for precise Telegram viewport calculation.
         */
        const synchronizeViewport = () => {
          const actualHeight = WebApp.viewportHeight || window.innerHeight;
          setViewHeight(`${actualHeight}px`);

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

        // 🔒 4. GESTURE LOCK: Prevents accidental closing during interaction
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
        "relative flex w-screen flex-col bg-background overflow-x-hidden antialiased",
        isInitialized ? "opacity-100" : "opacity-0 transition-opacity duration-1000"
      )}
      style={{
        height: viewHeight,
        maxHeight: viewHeight,
        paddingTop: `${safeArea.top}px`,
        paddingBottom: `${safeArea.bottom}px`,
      }}
    >
      {/* Background Aura */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Main Content Viewport: Added flex-col and overflow-y-auto for internal scrolling */}
      <main className="flex-1 w-full flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar px-4 sm:px-8">
        <div className="w-full max-w-7xl mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * 🏛️ APEX HEADER COMPONENT
 * Fixed: Uses Clamp typography to prevent "MAND CENTER" text cropping on small screens.
 */
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1 mb-10 mt-4">
      <h1 className="text-[clamp(1.8rem,9vw,3.5rem)] font-black uppercase italic tracking-tighter leading-[0.85] break-words">
        {title}
      </h1>
      <p className="text-[clamp(0.65rem,2.2vw,0.8rem)] text-muted-foreground font-black uppercase tracking-[0.25em] opacity-60 mt-2">
        {subtitle}
      </p>
    </div>
  );
}