"use client";

import React, { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useHaptics } from "@/lib/hooks/use-haptics"; // 🚀 Merged Hook

interface TacticalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "amber" | "destructive" | "ghost" | "glass";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

/**
 * 🛰️ TACTICAL BUTTON (Institutional v16.16.12)
 * Logic: Haptic-Synced Interaction Node with Atomic Loading Gating.
 * Design: v9.5.0 Institutional Italic branding.
 */
export const TacticalButton = memo(({ 
  children, 
  variant = "primary", 
  isLoading, 
  icon, 
  className, 
  onClick,
  type = "button", // 🛡️ Security: Prevents accidental form submissions
  ...props 
}: TacticalButtonProps) => {
  const { impact } = useHaptics();

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return;
    
    // 🏁 TACTILE SYNC: Institutional Standard v9.5.0
    impact(variant === "destructive" ? "heavy" : "light");
    
    if (onClick) onClick(e);
  }, [onClick, isLoading, variant, impact]);

  const theme = useMemo(() => {
    const base = cn(
      "relative flex items-center justify-center gap-2 rounded-xl transition-all outline-none",
      "text-[11px] font-black uppercase italic tracking-[0.15em]", // 🏛️ Institutional Branding
      "active:scale-95 disabled:opacity-40 disabled:pointer-events-none",
      "border border-white/5" // v9.9.1 Hardened Edge
    );

    const variants = {
      primary: "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:bg-primary/90",
      amber: "bg-amber-500 text-black shadow-2xl shadow-amber-500/20 hover:bg-amber-400",
      destructive: "bg-rose-600 text-white shadow-2xl shadow-rose-600/20 hover:bg-rose-500",
      ghost: "bg-transparent border-border/40 text-muted-foreground hover:bg-muted/10",
      glass: "bg-card/40 backdrop-blur-xl border-white/10 text-foreground hover:bg-card/60",
    };

    return cn(base, variants[variant], className);
  }, [variant, className]);

  return (
    <button 
      type={type}
      className={theme} 
      onClick={handleClick} 
      disabled={isLoading} 
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin opacity-70" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
});

TacticalButton.displayName = "TacticalButton";