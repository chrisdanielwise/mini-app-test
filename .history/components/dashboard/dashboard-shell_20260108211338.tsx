"use client";

import { useEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        // 1. Mark as ready
        WebApp.ready();
        
        // 2. Expand viewport to max height
        WebApp.expand();
        
        // 3. 🚀 BOT API 8.0 FULLSCREEN
        // This removes the Telegram header/bottom bars entirely
        if (typeof WebApp.requestFullscreen === 'function') {
          WebApp.requestFullscreen();
        }

        // 4. Disable swipes to prevent accidental app closure during resizing
        if (typeof WebApp.disableVerticalSwipes === 'function') {
          WebApp.disableVerticalSwipes();
        }

        // 5. Lock orientation if needed for a stable dashboard UI
        if (typeof WebApp.lockOrientation === 'function') {
          WebApp.lockOrientation();
        }

        WebApp.setHeaderColor('secondary_bg_color');
      } catch (e) {
        console.warn("Fullscreen initialization failed", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      {children}
    </div>
  );
}