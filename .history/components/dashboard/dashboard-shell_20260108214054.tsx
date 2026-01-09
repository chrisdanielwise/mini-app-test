"use client";

import { useEffect, useState } from "react";
import { WebApp } from "@/lib/telegram/webapp";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  // State to handle dynamic safe area padding for resizing
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });

  useEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        WebApp.ready();
        WebApp.expand();
        
        /**
         * 🚀 TRIGGER NATIVE FULLSCREEN
         * This removes the Telegram 'drawer' and makes the app standalone.
         */
        if (typeof WebApp.requestFullscreen === 'function') {
          WebApp.requestFullscreen();
        }

        /**
         * 🏁 NATIVE RESIZING LOGIC
         * We listen for 'safeAreaChanged' to ensure the dashboard resizes 
         * and fits the screen when entering/exiting fullscreen.
         */
        const handleResize = () => {
          if (WebApp.safeAreaInset) {
            setSafeArea({
              top: WebApp.safeAreaInset.top,
              bottom: WebApp.safeAreaInset.bottom
            });
          }
        };

        // Initialize padding and bind the resize event
        handleResize();
        WebApp.onEvent('safeAreaChanged', handleResize);
        WebApp.onEvent('viewportChanged', handleResize);

        if (typeof WebApp.disableVerticalSwipes === 'function') {
          WebApp.disableVerticalSwipes();
        }

        WebApp.setHeaderColor('secondary_bg_color');

        // Cleanup events on unmount
        return () => {
          WebApp.offEvent('safeAreaChanged', handleResize);
          WebApp.offEvent('viewportChanged', handleResize);
        };
      } catch (e) {
        console.warn("Native immersion initialization failed:", e);
      }
    }
  }, []);

  return (
    /**
     * 🏁 FULLSCREEN WRAPPER
     * 'w-screen' and 'min-h-screen' ensure the background fills 
     * the entire device display during resizing.
     */
    <div 
      className="relative flex min-h-screen w-screen flex-col bg-background overflow-x-hidden antialiased transition-all duration-300"
      style={{
        paddingTop: `${safeArea.top}px`,
        paddingBottom: `${safeArea.bottom}px`
      }}
    >
      {/* 🚀 Native Fullscreen UI Indicator */}
      <div className="absolute top-2 right-4 z-50">
        <div className="h-1 w-8 rounded-full bg-muted/20" />
      </div>

      <main className="flex-1 w-full animate-in fade-in duration-700">
        {children}
      </main>
    </div>
  );
}