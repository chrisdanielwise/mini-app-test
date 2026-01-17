"use client";

import * as React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Activity,
  Terminal,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface AsyncActivityFeedProps {
  activities: any[];
  isStaffOversight?: boolean;
}

/**
 * 🛰️ ASYNC_ACTIVITY_FEED (Institutional Apex v2026.1.20)
 * Strategy: Stationary HUD & Independent Tactical Scroll.
 * Fix: High-density row compression (py-2.5) maximizes log visibility.
 */
export function AsyncActivityFeed({
  activities,
  isStaffOversight = false,
}: AsyncActivityFeedProps) {
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();

  // 🛡️ HYDRATION SHIELD
  if (!isReady) return <div className="h-full w-full bg-card/10 animate-pulse rounded-2xl" />;

  if (!activities || activities.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-white/5 bg-card/20 p-8 text-center backdrop-blur-3xl">
        <Activity className="size-6 text-muted-foreground/10 mb-4 animate-pulse" />
        <h3 className="text-[9px] font-black uppercase italic tracking-[0.4em] opacity-30">
          Zero_Telemetry
        </h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      {/* 🌫️ VAPOUR RADIANCE */}
      <div className={cn(
        "absolute -top-16 -right-16 size-48 blur-[80px] opacity-10 transition-colors pointer-events-none",
        isStaffOversight ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- 🛡️ FIXED HUD: Stationary Feed Header --- */}
      <div className="shrink-0 px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative z-20">
        <div className="space-y-1 leading-none">
          <div className="flex items-center gap-2 opacity-30">
            <Zap className={cn("size-2.5 animate-pulse", isStaffOversight ? "text-amber-500" : "text-primary")} />
            <h3 className="text-[7.5px] font-black uppercase tracking-[0.4em] italic">Log_Ingress</h3>
          </div>
          <p className="text-lg font-black uppercase italic tracking-tighter text-foreground">
            Identity <span className={cn(isStaffOversight ? "text-amber-500" : "text-primary")}>Pulse</span>
          </p>
        </div>
        
        <a
          href="/dashboard/payouts"
          onPointerEnter={() => impact("light")}
          className={cn(
            "group/link text-[8px] font-black uppercase italic tracking-widest transition-all flex items-center gap-1.5",
            isStaffOversight ? "text-amber-500/40 hover:text-amber-500" : "text-primary/40 hover:text-primary"
          )}
        >
          {isMobile ? "Audit" : "Ledger"}
          <ArrowUpRight className="size-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
      </div>

      {/* --- 🚀 INTERNAL SCROLL: Log Stream --- */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-5 py-4 space-y-2.5 relative z-10 scrollbar-hide">
        {activities.map((item: any, index: number) => (
          <div
            key={item.id}
            onPointerEnter={() => impact("light")}
            style={{ animationDelay: `${index * 40}ms` }}
            className="group/item flex items-center justify-between p-2.5 px-3.5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg shadow-inner transition-all",
                  getStatusStyles(item.status || "PENDING").container
                )}
              >
                {getStatusIcon(item.status || "PENDING", "size-4")}
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-sm font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors truncate">
                  {item.user?.fullName || "Anon_Node"}
                </span>
                <span className="text-[7px] font-bold text-muted-foreground/20 uppercase tracking-[0.1em] mt-0.5 italic truncate">
                  {item.service?.name || "Sync"} • {item.createdAt ? format(new Date(item.createdAt), "HH:mm") : "Syncing"}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end shrink-0 ml-4 leading-none">
              <span className="text-base font-black italic tracking-tighter text-foreground tabular-nums">
                +${parseFloat(String(item.serviceTier?.price || "0")).toFixed(2)}
              </span>
              <div className={cn(
                "text-[6px] tracking-[0.2em] font-black px-1.5 py-0.5 rounded border mt-1",
                getStatusStyles(item.status || "PENDING").badge
              )}>
                {item.status || "WAITING"}
              </div>
            </div>
          </div>
        ))}
        
        {/* Visual Fade Anchor */}
        <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

/** 🏛️ HELPERS: STATUS MORPHOLOGY */
function getStatusIcon(status: string, className: string) {
  const s = status.toUpperCase();
  if (s === "SUCCESS" || s === "ACTIVE") return <CheckCircle2 className={className} />;
  if (s === "PENDING") return <Clock className={cn(className, "animate-pulse")} />;
  return <XCircle className={className} />;
}

function getStatusStyles(status: string) {
  const s = status.toUpperCase();
  if (s === "SUCCESS" || s === "ACTIVE") return {
    container: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    badge: "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
  };
  if (s === "PENDING") return {
    container: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    badge: "bg-amber-500/5 text-amber-500 border-amber-500/10"
  };
  return {
    container: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    badge: "bg-rose-500/5 text-rose-500 border-rose-500/10"
  };
}