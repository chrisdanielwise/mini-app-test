"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { useDeviceContext } from "@/components/providers/device-provider";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SONNER TOASTER (Institutional v16.16.12)
 * Logic: Stacked Notification Node with Viewport Buffering.
 * Design: v9.5.0 Institutional Typography & v9.9.1 Glassmorphism.
 */
const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();
  const { isMobile } = useDeviceContext();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group", className)}
      // 🚀 TACTICAL POSITIONING: Clears the Telegram Navigation Hub
      position={isMobile ? "bottom-center" : "bottom-right"}
      expand={false}
      richColors
      toastOptions={{
        classNames: {
          toast: cn(
            "group toast",
            "group-[.toaster]:bg-card/95 group-[.toaster]:backdrop-blur-2xl",
            "group-[.toaster]:text-foreground group-[.toaster]:border-border/10",
            "group-[.toaster]:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-[.toaster]:rounded-2xl",
            "group-[.toaster]:p-4 group-[.toaster]:border"
          ),
          title: "font-black uppercase italic tracking-[0.1em] text-[11px] text-primary",
          description: "font-bold text-[10px] opacity-60 leading-relaxed",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-black uppercase text-[10px] tracking-widest rounded-xl px-4",
          cancelButton: "group-[.toast]:bg-muted/20 group-[.toast]:text-muted-foreground font-bold rounded-xl",
          error: "group-[.toast]:border-rose-500/30 group-[.toast]:bg-rose-500/10",
          success: "group-[.toast]:border-emerald-500/30 group-[.toast]:bg-emerald-500/10",
        },
      }}
      // 🚀 Viewport Offset logic
      style={{
        "--safe-area-bottom": "var(--tg-safe-bottom, 0px)",
        marginBottom: isMobile ? "calc(var(--safe-area-bottom) + 5rem)" : "0px",
      } as React.CSSProperties}
      {...props}
    />
  );
};

export { Toaster };