"use client";

import * as React from "react";
import { ShieldCheck, LogOut, Zap, RefreshCw, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface ActivityLog {
  id: string;
  action: string;
  createdAt: string;
  actor?: {
    firstName: string;
  };
}

/**
 * 🌊 FLUID ACTIVITY LOG (Institutional v16.16.12)
 * Logic: Haptic-synced security scrubbing with organic ingress.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function RecentActivity({ logs }: { logs: ActivityLog[] }) {
  const { impact } = useHaptics();

  const getIcon = (action: string) => {
    switch (action) {
      case "LOGIN":
        return <ShieldCheck className="size-4 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />;
      case "LOGOUT":
        return <LogOut className="size-4 text-muted-foreground/40" />;
      case "REMOTE_WIPE":
        return <Zap className="size-4 text-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.3)]" />;
      default:
        return <RefreshCw className="size-4 text-primary animate-spin-slow" />;
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-[2rem] border border-dashed border-white/5 bg-white/20">
        <Terminal className="size-8 opacity-10 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20 italic">Zero_Telemetry_Logs</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 relative">
      {logs.map((log, index) => (
        <div
          key={log.id}
          onMouseEnter={() => impact("light")}
          style={{ animationDelay: `${index * 50}ms` }}
          className={cn(
            "group flex items-center justify-between p-4",
            "rounded-2xl border border-white/5 bg-card/30 backdrop-blur-3xl",
            "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "hover:bg-white/[0.04] hover:border-white/10 hover:translate-x-1",
            "animate-in fade-in slide-in-from-right-4"
          )}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="size-10 shrink-0 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
              {getIcon(log.action)}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-[11px] font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">
                {log.action}
              </p>
              <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1 truncate">
                {log.actor?.firstName || "System"} <span className="mx-1">•</span> 
                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            <div className="h-px w-4 bg-white/5 hidden md:block" />
            <span className="text-[9px] font-mono font-black text-muted-foreground/20 group-hover:text-primary/40 transition-colors">
              {log.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}