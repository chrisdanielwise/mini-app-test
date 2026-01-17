"use client";

import * as React from "react";
import { Toaster as Sonner } from "sonner";
import { useDeviceContext } from "@/components/providers/device-provider";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Activity,
  BellRing
} from "lucide-react";

/**
 * 🌊 GLOBAL_NOTIFICATION_SYSTEM (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
 */
export function GlobalToaster() {
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Top-Center for mobile to avoid one-handed navigation interference.
   * Bottom-Right for desktop to align with the Status Horizon.
   */
  const placement = isMobile ? "top-center" : "bottom-right";

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position={placement}
      expand={true}
      visibleToasts={6}
      closeButton
      // 🧪 LAMINAR TIMING: Adjusts based on information density
      duration={4000}
      style={{
        marginTop: isMobile ? `${safeArea.top}px` : "0px",
        marginBottom: !isMobile ? `${safeArea.bottom}px` : "0px",
      }}
      icons={{
        success: <ShieldCheck className="size-4 text-emerald-500 shadow-apex-emerald" />,
        info: <Activity className="size-4 text-primary shadow-apex" />,
        warning: <AlertTriangle className="size-4 text-amber-500 shadow-apex-amber" />,
        error: <Zap className="size-4 text-rose-500 animate-pulse shadow-apex-rose" />,
        loading: <BellRing className="size-4 text-muted-foreground animate-spin-slow" />
      }}
      toastOptions={{
        className: cn(
          "group toast transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "bg-background/60 backdrop-blur-3xl border-white/5 shadow-apex",
          "rounded-[2rem] md:rounded-[2.5rem] p-6 border border-white/5",
          "text-[10px] md:text-[11px] font-black uppercase italic tracking-[0.3em] text-foreground"
        ),
        descriptionClassName: cn(
          "text-[9px] font-bold opacity-30 not-italic tracking-[0.15em] mt-2 leading-relaxed"
        ),
        actionButtonStyle: {
          background: "rgba(var(--primary-rgb), 0.1)",
          color: "var(--primary)",
          border: "1px solid rgba(var(--primary-rgb), 0.2)",
          borderRadius: "1.2rem",
          fontSize: "9px",
          fontWeight: "900",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
        },
        cancelButtonStyle: {
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "1.2rem",
          fontSize: "9px",
          fontWeight: "900",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
        },
      }}
    />
  );
}