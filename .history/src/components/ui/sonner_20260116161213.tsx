"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { useDeviceContext } from "@/components/providers/device-provider";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SONNER_TOASTER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Hardware-Safe Buffering.
 * Fix: Tactical typography and shrunken radii prevent HUD obstruction.
 */
const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();
  const { isMobile, safeArea } = useDeviceContext();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group", className)}
      // 📐 TACTICAL POSITIONING: Clinical anchor points
      position={isMobile ? "bottom-center" : "bottom-right"}
      expand={false}
      richColors
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast",
            // 🌫️ LAMINAR DEPTH: Obsidian depth with backdrop-blur-3xl
            "group-[.toaster]:bg-zinc-950/90 group-[.toaster]:backdrop-blur-3xl",
            "group-[.toaster]:text-foreground group-[.toaster]:border-white/5",
            "group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl",
            "group-[.toaster]:p-3.5 group-[.toaster]:border"
          ),
          // 🏛️ INSTITUTIONAL TYPOGRAPHY
          title: "font-black uppercase italic tracking-[0.2em] text-[10.5px] text-primary/80 leading-none",
          description: "font-black uppercase tracking-[0.1em] text-[8.5px] text-muted-foreground/20 italic leading-tight mt-1",
          actionButton: cn(
            "group-[.toast]:bg-primary/10 group-[.toast]:text-primary font-black uppercase text-[8px] tracking-[0.2em]",
            "rounded-lg px-3 py-1.5 transition-all active:scale-95 border border-primary/20"
          ),
          cancelButton: "group-[.toast]:bg-white/5 group-[.toast]:text-muted-foreground/40 font-black uppercase text-[8px] rounded-lg",
          // 🛡️ LOGIC GATING: Clinical status colors
          error: "group-[.toast]:border-rose-500/20 group-[.toast]:bg-rose-500/5",
          success: "group-[.toast]:border-emerald-500/20 group-[.toast]:bg-emerald-500/5",
          info: "group-[.toast]:border-sky-500/20 group-[.toast]:bg-sky-500/5",
        },
      }}
      // 🛡️ HARDWARE HANDSHAKE: Surgical safe-area clearance
      style={{
        marginBottom: isMobile 
          ? `calc(${safeArea.bottom}px + 5.5rem)` 
          : "1.5rem",
        marginRight: isMobile ? "0px" : "1.5rem",
      } as React.CSSProperties}
      {...props}
    />
  );
};

export { Toaster };