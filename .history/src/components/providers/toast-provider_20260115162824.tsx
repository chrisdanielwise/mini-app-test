"use client";

import { Toaster as Sonner } from "sonner";
import { useDeviceContext } from "@/components/providers/device-provider";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, ShieldCheck, Zap, X } from "lucide-react";

/**
 * 🌊 GLOBAL_NOTIFICATION_SYSTEM (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware toast placement based on hardware tier.
 */
export function GlobalToaster() {
  const { isMobile, screenSize } = useDeviceContext();

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      // 🕵️ MORPHOLOGY RESOLUTION: Bottom-center for mobile thumb-safety
      position={isMobile ? "top-center" : "bottom-right"}
      expand={true}
      visibleToasts={5}
      closeButton
      // Custom Vapour Icons
      icons={{
        success: <ShieldCheck className="size-4 text-emerald-500" />,
        info: <Zap className="size-4 text-primary" />,
        warning: <AlertTriangle className="size-4 text-amber-500" />,
        error: <AlertTriangle className="size-4 text-rose-500" />,
      }}
      toastOptions={{
        className: cn(
          "group toast transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "bg-card/90 backdrop-blur-3xl border-white/5 shadow-apex",
          "rounded-[1.5rem] md:rounded-[2rem] p-5",
          "text-foreground font-black uppercase italic tracking-widest"
        ),
        descriptionClassName: "text-[9px] font-bold opacity-40 not-italic tracking-[0.2em] mt-1",
        actionButtonStyle: {
          backgroundColor: "var(--primary)",
          borderRadius: "1rem",
          fontSize: "10px",
          fontWeight: "900",
        },
      }}
    />
  );
}