"use client";

import { useEffect, useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });
  const [viewHeight, setViewHeight] = useState("100vh");

  // 🚀 useLayoutEffect ensures the resize happens before the paint
  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        WebApp.ready();
        
        /**
         * 🏁 THE HARD RESIZE FIX
         * Forces the dashboard to ignore parent constraints and fill the screen.
         */
        const syncViewport = () => {
          // Use viewportStableHeight if available for better reliability
          const height = WebApp.viewportStableHeight || window.innerHeight;
          setViewHeight(`${height}px`);
          
          if (WebApp.safeAreaInset) {
            setSafeArea({
              top: WebApp.safeAreaInset.top,
              bottom: WebApp.safeAreaInset.bottom
            });
          }
        };

        // 1. Initial expand
        WebApp.expand();
        
        // 2. Request v8.0 Fullscreen (Removes the 'Drawer' handle)
        if (typeof WebApp.requestFullscreen === 'function') {
          WebApp.requestFullscreen();
        }

        // 3. Bind events for dynamic resizing
        syncViewport();
        WebApp.onEvent('safeAreaChanged', syncViewport);
        WebApp.onEvent('viewportChanged', syncViewport);
        window.addEventListener('resize', syncViewport);

        if (typeof WebApp.disableVerticalSwipes === 'function') {
          WebApp.disableVerticalSwipes();
        }

        WebApp.setHeaderColor('secondary_bg_color');

        return () => {
          WebApp.offEvent('safeAreaChanged', syncViewport);
          WebApp.offEvent('viewportChanged', syncViewport);
          window.removeEventListener('resize', syncViewport);
        };
      } catch (e) {
        console.warn("Fullscreen sync failed:", e);
      }
    }
  }, []);

  return (
    /**
     * 🏁 VIEWPORT OVERRIDE
     * We use a style object to override '100vh' which can be buggy in Telegram.
     */
    <div 
      className="relative flex w-screen flex-col bg-background overflow-x-hidden antialiased transition-[padding] duration-300"
      style={{
        minHeight: viewHeight,
        paddingTop: `${safeArea.top}px`,
        paddingBottom: `${safeArea.bottom}px`
      }}
    >
      {/* 🚀 Active Fullscreen Status Indicator */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-safe-top" />

      <main className="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </main>
    </div>
  );
}