"use client";

import React, { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface TacticalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "amber" | "destructive" | "ghost" | "glass";
  isLoading?: boolean;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

/**
 * 🛰️ TACTICAL_BUTTON (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Trigger.
 * Fix: Tactical h-10 footprint and 9px typography prevents layout blowout.
 */
export const TacticalButton = memo(({ 
  children, 
  variant = "primary", 
  isLoading, 
  icon, 
  className, 
  onClick,
  size = "md",
  type = "button",
  ...props 
}: TacticalButtonProps) => {
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return;
    
    // 🛡️ HARDWARE HANDSHAKE: verify stability before pulse
    if (isReady) {
      impact(variant === "destructive" ? "heavy" : "light");
    }
    
    if (onClick) onClick(e);
  }, [onClick, isLoading, variant, impact, isReady]);

  const theme = useMemo(() => {
    const base = cn(
      "relative flex items-center justify-center gap-2 transition-all outline-none select-none",
      "text-[9px] md:text-[10.5px] font-black uppercase italic tracking-[0.2em]", // 🏛️ Apex Typography
      "active:scale-95 disabled:opacity-10 disabled:grayscale disabled:pointer-events-none",
      "border border-white/5"
    );

    const sizes = {
      sm: "h-8 px-3 rounded-lg",
      md: isMobile ? "h-10 px-4 rounded-xl" : "h-11 px-5 rounded-xl",
      lg: "h-12 px-8 rounded-2xl",
    };

    const variants = {
      primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/5 hover:bg-primary/90",
      amber: "bg-amber-500 text-black shadow-lg shadow-amber-500/5 hover:bg-amber-400",
      destructive: "bg-rose-600 text-white shadow-lg shadow-rose-600/5 hover:bg-rose-500",
      ghost: "bg-transparent border-white/5 text-muted-foreground/40 hover:bg-white/5 hover:text-foreground",
      glass: "bg-zinc-950/20 backdrop-blur-3xl border-white/5 text-foreground hover:bg-zinc-950/40",
    };

    return cn(base, sizes[size], variants[variant], className);
  }, [variant, size, className, isMobile]);

  return (
    <button 
      type={type}
      className={theme} 
      onClick={handleClick} 
      disabled={isLoading} 
      {...props}
    >
      {isLoading ? (
        <Loader2 className="size-3.5 animate-spin opacity-40" />
      ) : (
        <>
          {icon && <span className="shrink-0 size-3.5 flex items-center justify-center">{icon}</span>}
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
});

TacticalButton.displayName = "TacticalButton";