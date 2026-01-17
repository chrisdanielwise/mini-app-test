"use client";

import { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { hapticFeedback } from "@/lib/telegram/webapp";

interface TacticalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "amber" | "destructive" | "ghost";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const TacticalButton = memo(({ 
  children, 
  variant = "primary", 
  isLoading, 
  icon, 
  className, 
  onClick,
  ...props 
}: TacticalButtonProps) => {

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    hapticFeedback("light"); // Institutional Touch Protocol
    if (onClick) onClick(e);
  }, [onClick]);

  const theme = useMemo(() => {
    const base = "relative flex items-center justify-center gap-2 rounded-xl font-black uppercase italic tracking-widest transition-all active:scale-95 disabled:opacity-50";
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90",
      amber: "bg-amber-500 text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400",
      destructive: "bg-rose-600 text-white hover:bg-rose-500",
      ghost: "bg-transparent border border-border/40 text-muted-foreground hover:bg-muted/10"
    };
    return cn(base, variants[variant], className);
  }, [variant, className]);

  return (
    <button className={theme} onClick={handleClick} disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      <span className="truncate">{children}</span>
    </button>
  );
});