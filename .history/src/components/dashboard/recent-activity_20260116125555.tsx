"use client";

import * as React from "react";
import { ShieldCheck, LogOut, Zap, RefreshCw, Terminal, Activity, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface ActivityLog {
  id: string;
  action: string;
  createdAt: string;
  actor?: {
    firstName: string;
  };
}

/**
 * 🛰️ RECENT_ACTIVITY (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density rows (py-2.5) and icon scaling (size-9) prevents blowout.
 */
export function RecentActivity({ logs }: { logs: ActivityLog[] }) {
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  const getIcon = (action: string) => {
    switch (action) {
      case "LOGIN":
        return <ShieldCheck className="size-3.5 text-emerald-500" />;
      case "LOGOUT":
        return <LogOut className="size-3.5 text-muted-foreground/20" />;
      case "REMOTE_WIPE":
        return <Zap className="size-3.5 text-rose-500 animate-pulse" />;
      default:
        return <RefreshCw className="size-3.5 text-primary animate-spin-slow" />;
    }
  };

  if (!isReady) return <div className="h-40 w-full bg-card/10 animate-pulse rounded-2xl" />;

  if (!logs || logs.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-white/5 bg-black/40 p-6 opacity-20">
        <Terminal className="size-6 mb-2" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] italic">Zero_Telemetry</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 relative z-10 w-full">
      {logs.map((log, index) => (
        <div
          key={log.id}
          onMouseEnter={() => impact("light")}
          style={{ animationDelay: `${index * 40}ms` }}
          className={cn(
            "group flex items-center justify-between transition-all duration-500",
            "rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 px-4 py-2.5",
            "animate-in fade-in slide-in-from-right-2"
          )}
        >
          <div className="flex items-center gap-4 min-w-0">
            {/* --- 🛡️ COMPRESSED ICON NODE --- */}
            <div className="size-9 shrink-0 flex items-center justify-center rounded-lg bg-white/[0.02] border border-white/5 shadow-inner transition-all group-hover:scale-110">
              {getIcon(log.action)}
            </div>

            {/* --- DATA CLUSTER --- */}
            <div className="flex flex-col min-w-0 leading-none">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors truncate">
                  {log.action}
                </p>
                {index === 0 && (
                  <span className="size-1 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5 opacity-20 italic">
                <span className="text-[7.5px] font-black uppercase tracking-widest truncate">
                  {log.actor?.firstName || "System_Node"}
                </span>
                <div className="flex items-center gap-1 tabular-nums">
                  <Wifi className="size-2" />
                  <span className="text-[7px] font-black uppercase tracking-widest">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- TERMINAL HASH --- */}
          {!isMobile && (
            <div className="flex items-center gap-3 shrink-0 ml-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <div className="h-px w-4 bg-white/5" />
              <div className="flex flex-col items-end leading-none">
                <span className="text-[8px] font-mono font-black tabular-nums">
                  ID_{log.id.slice(0, 6).toUpperCase()}
                </span>
                <span className="text-[6px] font-black uppercase tracking-[0.2em] mt-1">Audit_Protocol</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}