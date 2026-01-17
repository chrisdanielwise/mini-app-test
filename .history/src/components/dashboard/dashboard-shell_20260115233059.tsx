"use client";

import { useState, useLayoutEffect } from "react";
import { WebApp } from "@/lib/telegram/webapp";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ APEX MOBILE SHELL
 * Logic: Synchronized with Telegram API 8.0 + Universal Identity Flavors.
 * Feature: Automatic native header color shifting (Amber/Emerald).
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [viewHeight, setViewHeight] = useState("100dvh");
  const [isInitialized, setIsInitialized] = useState(false);
  const { flavor } = useLayout();
  const isStaffFlavor = flavor === "AMBER";

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      try {
        WebApp.ready();
        WebApp.expand();

        const syncMobileViewport = () => {
          // Precise sync for Telegram's non-standard mobile browser height
          const h = WebApp.viewportHeight || window.innerHeight;
          setViewHeight(`${h}px`);
        };

        syncMobileViewport();
        WebApp.onEvent("viewportChanged", syncMobileViewport);
        window.addEventListener("resize", syncMobileViewport);

        // API 8.0: Blocks the elastic drag-to-close behavior on bottom navigation
        if (typeof WebApp.disableVerticalSwipes === "function") {
          WebApp.disableVerticalSwipes();
        }

        // Native Branding Sync
        WebApp.setHeaderColor(isStaffFlavor ? "#f59e0b" : "#10b981");
        WebApp.setBackgroundColor("#000000"); // Hard black for 2026 OLED aesthetic
        
        setIsInitialized(true);

        return () => {
          WebApp.offEvent("viewportChanged", syncMobileViewport);
          window.removeEventListener("resize", syncMobileViewport);
        };
      } catch (error) {
        console.error("SHELL_SYNC_FAILURE:", error);
      }
    }
  }, [isStaffFlavor]);

  return (
    <div
      className={cn(
        "relative flex w-screen flex-col bg-background overflow-hidden antialiased",
        isInitialized ? "opacity-100" : "opacity-0 transition-opacity duration-500"
      )}
      style={{ height: viewHeight }}
    >
      {/* 🌌 ROLE-AWARE BACKGROUND AURA */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-20">
        <div className={cn(
          "absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full blur-[120px] transition-colors duration-1000",
          isStaffFlavor ? "bg-amber-500/10" : "bg-primary/5"
        )} />
        <div className={cn(
          "absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full blur-[100px] transition-colors duration-1000",
          isStaffFlavor ? "bg-amber-600/15" : "bg-primary/10"
        )} />
      </div>

      {/* 🚀 THE MOBILE CONTENT ENGINE */}
      <main 
        className="flex-1 w-full overflow-y-auto overflow-x-hidden px-5 sm:px-8 custom-scrollbar scroll-smooth"
        style={{
          paddingTop: "72px", // Safe space for Telegram's native Close/More buttons
          paddingBottom: "140px", // High-clearance zone for Floating BottomNav
        }}
      >
        <div className="w-full max-max-w-7xl mx-auto py-2 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * 🏛️ APEX HEADER COMPONENT
 * Feature: Role-based accent colors for typography.
 */
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <div className="flex flex-col gap-1 mb-8 md:mb-12">
      <h1 className="text-[clamp(1.8rem,8vw,3.5rem)] font-black uppercase italic tracking-tighter leading-[0.85] break-words text-foreground">
        {title.split(' ').map((word, i) => (
          <span key={i} className={i === 1 ? (isStaff ? "text-amber-500" : "text-primary") : ""}>
            {word}{' '}
          </span>
        ))}
      </h1>
      <div className="flex items-center gap-2 mt-4 opacity-40">
        <div className={cn("h-px w-6", isStaff ? "bg-amber-500" : "bg-primary")} />
        <p className="text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}