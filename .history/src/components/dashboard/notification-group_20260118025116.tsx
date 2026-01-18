"use client";

import * as React from "react";
import { Bell, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceContext } from "@/components/providers/device-provider";

// 🛡️ INTERFACE DEFENSE
interface NotificationBellProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function NotificationBell({ onClick }: NotificationBellProps) {
  const { isReady, isMobile } = useDeviceContext();
  const [hasNew] = React.useState(true); // Logic can be linked to global signal

  if (!isReady) return <div className="size-9 md:size-10 rounded-xl bg-white/5 animate-pulse border border-white/5" />;

  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center border transition-all duration-500 active:scale-90 group",
        "rounded-xl bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 shadow-sm",
        isMobile ? "size-9" : "size-10"
      )}
    >
      <div className={cn(
        "absolute inset-0 rounded-xl transition-opacity pointer-events-none",
        hasNew ? "bg-primary/5 opacity-100" : "bg-transparent opacity-0"
      )} />

      <Bell className={cn(
        "size-4.5 transition-all duration-700 group-hover:rotate-12",
        hasNew ? "text-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "text-muted-foreground/20"
      )} />

      {hasNew && (
        <span className="absolute top-2.5 right-2.5 flex size-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-30" />
          <span className="relative inline-flex rounded-full size-1.5 bg-primary shadow-[0_0_8px_#10b981]" />
        </span>
      )}
    </button>
  );
}