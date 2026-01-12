"use client";

import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/src/lib/telegram/webapp";
import { cn } from "@/src/lib/utils";

/**
 * 🛰️ COMMAND SHELL (Protocol V2)
 * High-resiliency viewport sync for Telegram Bot API 8.0.
 * Eliminates "Stocked/Drawer" look and forces institutional fullscreen.
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
        
        // 🛡️ 2. SECURITY PROTOCOL: Prevent accidental closing
        if (typeof WebApp.enableClosingConfirmation === 'function') {
          WebApp.enableClosingConfirmation();
        }

        // 🚀 3. FULLSCREEN OVERRIDE (Bot API 8.0 Standard)
        if (typeof WebApp.requestFullscreen === 'function') {
          WebApp.requestFullscreen();
        }

        /**
         * 📐 THE HARD VIEWPORT SYNC
         * Manually overrides buggy mobile '100vh' by calculating stable height
         * from the native Telegram SDK properties.
         */
        const synchronizeViewport = () => {
          const actualHeight = WebApp.viewportStableHeight || window.innerHeight;
          setViewHeight(`${actualHeight}px`);
          
          if (WebApp.safeAreaInset) {
            setSafeArea({
              top: WebApp.safeAreaInset.top,
              bottom: WebApp.safeAreaInset.bottom
            });
          }
        };

        // Bind Telemetry Events
        synchronizeViewport();
        WebApp.onEvent('safeAreaChanged', synchronizeViewport);
        WebApp.onEvent('viewportChanged', synchronizeViewport);
        window.addEventListener('resize', synchronizeViewport);

        // 🔒 4. GESTURE LOCK
        if (typeof WebApp.disableVerticalSwipes === 'function') {
          WebApp.disableVerticalSwipes();
        }

        WebApp.setHeaderColor('secondary_bg_color');
        WebApp.setBackgroundColor('bg_color');
        
        setIsInitialized(true);

        return () => {
          WebApp.offEvent('safeAreaChanged', synchronizeViewport);
          WebApp.offEvent('viewportChanged', synchronizeViewport);
          window.removeEventListener('resize', synchronizeViewport);
        };
      } catch (error) {
        console.error("SHELL_SYNC_FAILURE:", error);
      }
    }
  }, []);

  return (
    <div 
      className={cn(
        "relative flex w-screen flex-col bg-background overflow-x-hidden antialiased transition-opacity duration-1000",
        isInitialized ? "opacity-100" : "opacity-0"
      )}
      style={{
        minHeight: viewHeight,
        paddingTop: `${safeArea.top}px`,
        paddingBottom: `${safeArea.bottom}px`
      }}
    >
      {/* Institutional Background Aura */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <main className="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </main>

      {/* Grid Pattern Overlay for institutional feel */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    </div>
  );
}