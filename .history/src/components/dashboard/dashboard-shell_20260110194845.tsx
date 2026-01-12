"use client";

import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";

/**
 * 🛰️ FULL-IMMERSION COMMAND SHELL (V2.2)
 * Fixed: Uses CSS env variables + WebApp.viewportHeight for zero-latency safe areas.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [viewHeight, setViewHeight] = useState("100dvh");
  const [isInitialized, setIsInitialized] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        WebApp.ready();
        // Expand is essential for the "Full Size" look you prefer
        WebApp.expand();

        const syncHeight = () => {
          // WebApp.viewportHeight is the only reliable way to get 
          // height excluding the native Telegram header
          const h = WebApp.viewportHeight || window.innerHeight;
          setViewHeight(`${h}px`);
        };

        syncHeight();
        WebApp.onEvent("viewportChanged", syncHeight);
        window.addEventListener("resize", syncHeight);

        // API 8.0: Prevent the app from being "pulled down"
        if (typeof WebApp.disableVerticalSwipes === "function") {
          WebApp.disableVerticalSwipes();
        }

        WebApp.setHeaderColor("secondary_bg_color");
        WebApp.setBackgroundColor("bg_color");
        setIsInitialized(true);

        return () => {
          WebApp.offEvent("viewportChanged", syncHeight);
          window.removeEventListener("resize", syncHeight);
        };
      } catch (error) {
        console.error("SHELL_SYNC_FAILURE:", error);
      }
    }
  }, []);

  return (
    <div
      className={cn(
        "relative flex w-screen flex-col bg-background antialiased transition-opacity duration-500",
        isInitialized ? "opacity-100" : "opacity-0"
      )}
      style={{ height: viewHeight }}
    >
      {/* 🌌 Institutional Background Auras */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      {/* 🚀 THE CONTENT ENGINE
          Fixed: We use CSS padding with environment variables. 
          The '24px' fallback ensures your header is NEVER hidden behind the Close button.
      */}
      <main 
        className="flex-1 w-full overflow-y-auto overflow-x-hidden custom-scrollbar px-6 sm:px-10"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 24px) + 32px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 20px) + 80px)",
        }}
      >
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * 🏛️ APEX HEADER COMPONENT
 * Fixed: Reduced margins and added responsive clamping to solve the "MAND" cutoff.
 */
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1 mb-12">
      <h1 className="text-[clamp(1.7rem,8vw,3.2rem)] font-black uppercase italic tracking-tighter leading-[0.8] break-words">
        {title}
      </h1>
      <p className="text-[clamp(0.6rem,2vw,0.75rem)] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-50 mt-3">
        {subtitle}
      </p>
    </div>
  );
}