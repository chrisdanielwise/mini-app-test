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
 * 🛰️ GLOBAL_TOASTER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density padding (p-3.5) and h-11 profile prevents layout blowout.
 */
export function GlobalToaster() {
  const { isReady, isMobile, safeArea } = useDeviceContext();

  if (!isReady) return null;

  /**
   * 🛡️ PLACEMENT LOGIC
   * Top-Center for mobile to clear one-handed thumb arcs.
   * Bottom-Right for desktop to maintain a stationary system tray feel.
   */
  const placement = isMobile ? "top-center" : "bottom-right";

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position={placement}
      expand={false} // 🛡️ Institutional standard: stack for density
      visibleToasts={4}
      closeButton
      duration={3500}
      style={{
        marginTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0px",
        marginBottom: !isMobile ? `calc(${safeArea.bottom}px + 1rem)` : "0px",
      }}
      icons={{
        success: <ShieldCheck className="size-3.5 text-emerald-500" />,
        info: <Activity className="size-3.5 text-primary" />,
        warning: <AlertTriangle className="size-3.5 text-amber-500" />,
        error: <Zap className="size-3.5 text-rose-500 animate-pulse" />,
        loading: <BellRing className="size-3.5 text-muted-foreground animate-spin-slow" />
      }}
      toastOptions={{
        className: cn(
          "group toast transition-all duration-500 ease-out",
          "bg-zinc-950/80 backdrop-blur-xl border-white/5 shadow-2xl",
          "rounded-xl md:rounded-2xl p-3.5 border border-white/5", // Reduced p-6 -> p-3.5
          "text-[9px] md:text-[10px] font-black uppercase italic tracking-widest text-foreground"
        ),
        descriptionClassName: cn(
          "text-[7.5px] font-black opacity-20 not-italic tracking-[0.1em] mt-1 leading-tight"
        ),
        actionButtonStyle: {
          background: "rgba(255, 255, 255, 0.05)",
          color: "white",
          borderRadius: "8px",
          fontSize: "8px",
          fontWeight: "900",
          textTransform: "uppercase",
          height: "24px",
        },
        cancelButtonStyle: {
          background: "transparent",
          borderRadius: "8px",
          fontSize: "8px",
          fontWeight: "900",
          textTransform: "uppercase",
          height: "24px",
        },
      }}
    />
  );
}