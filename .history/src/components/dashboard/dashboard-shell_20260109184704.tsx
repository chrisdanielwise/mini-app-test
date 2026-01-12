"use client";

import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/src/lib/telegram/webapp";

/**
 * 🚀 DASHBOARD SHELL (Bot API 8.0 Ready)
 * Changed to NAMED EXPORT to fix the 'Export doesn't exist' error.
 * Added Hard Viewport Sync to fix the 'Stocked Mobile View' issue.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });
  const [viewHeight, setViewHeight] = useState("100vh");

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        // 1. Core Initialization
        WebApp.ready();
        WebApp.expand();
        
        // 2. Request Native Fullscreen (Fixes the Drawer/BottomSheet look)
        if (typeof WebApp.requestFullscreen === 'function') {
          WebApp.requestFullscreen();
        }

        /**
         * 🏁 THE HARD SYNC FIX
         * We manually calculate the height to ensure the 'Mobile View' 
         * doesn't stay small/stocked.
         */
        const forceResize = () => {
          // Use the stable height provided by the SDK or fallback to window
          const actualHeight = WebApp.viewportStableHeight || window.innerHeight;
          setViewHeight(`${actualHeight}px`);
          
          if (WebApp.safeAreaInset) {
            setSafeArea({
              top: WebApp.safeAreaInset.top,
              bottom: WebApp.safeAreaInset.bottom
            });
          }
        };

        // Initialize and bind events
        forceResize();
        WebApp.onEvent('safeAreaChanged', forceResize);
        WebApp.onEvent('viewportChanged', forceResize);
        window.addEventListener('resize', forceResize);

        if (typeof WebApp.disableVerticalSwipes === 'function') {
          WebApp.disableVerticalSwipes();
        }

        WebApp.setHeaderColor('secondary_bg_color');

        return () => {
          WebApp.offEvent('safeAreaChanged', forceResize);
          WebApp.offEvent('viewportChanged', forceResize);
          window.removeEventListener('resize', forceResize);
        };
      } catch (e) {
        console.warn("Fullscreen sync error:", e);
      }
    }
  }, []);

  return (
    /**
     * 🏁 VIEWPORT OVERRIDE
     * Setting 'minHeight' via JS style object overrides buggy CSS '100vh' in Telegram.
     */
    <div 
      className="relative flex w-screen flex-col bg-background overflow-x-hidden antialiased transition-all duration-300"
      style={{
        minHeight: viewHeight,
        paddingTop: `${safeArea.top}px`,
        paddingBottom: `${safeArea.bottom}px`
      }}
    >
      <main className="flex-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </main>
    </div>
  );
}