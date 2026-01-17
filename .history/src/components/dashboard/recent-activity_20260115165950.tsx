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
 * 🌊 RECENT_ACTIVITY_STREAM (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Ingress | Vapour-Glass depth.
 * Logic: morphology-aware log retrieval with hardware-haptic ticks.
 */
export function RecentActivity({ logs }: { logs: ActivityLog[] }) {
  const { impact } = useHaptics();
  const { isReady, isMobile, screenSize } = useDeviceContext();

  const getIcon = (action: string) => {
    switch (action) {
      case "LOGIN":
        return <ShieldCheck className="size-4 text-emerald-500 shadow-apex-emerald" />;
      case "LOGOUT":
        return <LogOut className="size-4 text-muted-foreground/30" />;
      case "REMOTE_WIPE":
        return <Zap className="size-4 text-rose-500 animate-pulse shadow-apex-rose" />;
      default:
        return <RefreshCw className="size-4 text-primary animate-spin-slow shadow-apex" />;
    }
  };

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="h-40 w-full bg-card/20 animate-pulse rounded-[2rem]" />;

  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 rounded-[3rem] border border-dashed border-white/5 bg-card/10 backdrop-blur-xl">
        <div className="relative">
          <Terminal className="size-10 opacity-5 mb-4" />
          <Activity className="absolute -top-2 -right-2 size-4 text-primary/20 animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20 italic">Zero_Telemetry_Logs</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative z-10">
      {logs.map((log, index) => (
        <div
          key={log.id}
          onMouseEnter={() => impact("light")}
          style={{ animationDelay: `${index * 60}ms` }}
          className={cn(
            "group flex items-center justify-between transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            "rounded-[1.8rem] border border-white/5 bg-card/40 backdrop-blur-3xl shadow-apex",
            "hover:bg-white/[0.05] hover:border-white/10 hover:translate-x-1.5",
            "animate-in fade-in slide-in-from-right-8",
            screenSize === 'xs' ? "p-4" : "p-6"
          )}
        >
          <div className="flex items-center gap-5 min-w-0">
            {/* --- ICON NODE --- */}
            <div className="size-12 md:size-14 shrink-0 flex items-center justify-center rounded-[1.2rem] md:rounded-[1.4rem] bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.08] transition-all duration-700">
              {getIcon(log.action)}
            </div>

            {/* --- DATA CLUSTER --- */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-3">
                <p className="text-[12px] md:text-[14px] font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">
                  {log.action}
                </p>
                {index === 0 && (
                  <span className="flex size-1.5 rounded-full bg-primary animate-ping" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5 opacity-30 italic">
                <span className="text-[9px] font-black uppercase tracking-widest truncate">
                  {log.actor?.firstName || "System_Node"}
                </span>
                <span className="size-1 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5 tabular-nums">
                  <Wifi className="size-2.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- TERMINAL HASH --- */}
          {!isMobile && (
            <div className="flex items-center gap-4 shrink-0 ml-6">
              <div className="h-px w-8 bg-white/5" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono font-black text-muted-foreground/20 group-hover:text-primary/40 transition-colors">
                  LOG_{log.id.slice(0, 8).toUpperCase()}
                </span>
                <span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-10 mt-1">Audit_Protocol_v16.31</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}