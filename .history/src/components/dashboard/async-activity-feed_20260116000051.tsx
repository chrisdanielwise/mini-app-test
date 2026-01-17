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
 * 🌊 FLUID_ACTIVITY_FEED (Institutional Apex v16.16.31)
 * Strategy: Staggered ingress with morphology-aware safe-area clamping.
 * Fix: Clamped font sizes and high-density padding to prevent "bogus" scaling.
 */
export function AsyncActivityFeed({
  activities,
  isStaffOversight = false,
}: AsyncActivityFeedProps) {
  const { impact } = useHaptics();
  const { isReady, isMobile, screenSize } = useDeviceContext();

  // 🛡️ HYDRATION SHIELD: Prevents layout snapping during hardware handshake
  if (!isReady) return <div className="min-h-[400px] w-full bg-card/10 animate-pulse rounded-[2.5rem]" />;

  if (!activities || activities.length === 0) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-card/20 p-12 text-center backdrop-blur-3xl transition-all duration-1000">
        <div className="mb-6 rounded-2xl bg-white/5 p-6 border border-white/10 animate-pulse">
          <Activity className="size-8 text-muted-foreground/10" />
        </div>
        <h3 className="text-[10px] font-black uppercase italic tracking-[0.5em] opacity-30">
          Zero_Telemetry_Detected
        </h3>
        <p className="max-w-[240px] text-[8px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em] leading-relaxed mt-4 italic">
          {isStaffOversight 
            ? "Global network logs will manifest once nodes process transactions." 
            : "Transaction logs will manifest once users synchronize with your nodes."}
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "group/feed relative flex flex-col h-full border border-white/5 bg-card/30 shadow-apex backdrop-blur-3xl overflow-hidden transition-all duration-1000",
      "rounded-[2.8rem] md:rounded-[3rem]",
      screenSize === 'xs' ? "p-5" : "p-8 md:p-10"
    )}>
      {/* 🌫️ VAPOUR RADIANCE: Institutional Atmosphere */}
      <div className={cn(
        "absolute -top-32 -right-32 size-64 blur-[120px] opacity-10 transition-colors duration-[2000ms] pointer-events-none",
        isStaffOversight ? "bg-amber-500" : "bg-primary"
      )} />

      {/* --- FEED HEADER --- */}
      <div className="flex flex-row items-center justify-between mb-8 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Zap className={cn("size-3 animate-pulse", isStaffOversight ? "text-amber-500" : "text-primary")} />
            <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/30 italic leading-none">
              Log_Ingress_v16.31
            </h3>
          </div>
          <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Identity <span className={cn(isStaffOversight ? "text-amber-500" : "text-primary")}>Pulse</span>
          </p>
        </div>
        
        <a
          href="/dashboard/payouts"
          onPointerEnter={() => impact("light")}
          className={cn(
            "group/link text-[9px] font-black uppercase italic tracking-widest transition-all flex items-center gap-2",
            isStaffOversight ? "text-amber-500/60 hover:text-amber-500" : "text-primary/60 hover:text-primary"
          )}
        >
          {isMobile ? "Audit" : "Ledger_Full"}
          <ArrowUpRight className="size-3.5 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
        </a>
      </div>

      {/* --- LOG STREAM --- */}
      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar relative z-10 flex-1 scrollbar-hide">
        {activities.map((item: any, index: number) => (
          <div
            key={item.id}
            onPointerEnter={() => impact("light")}
            style={{ animationDelay: `${index * 60}ms` }}
            className="group/item flex items-center justify-between p-4 rounded-[1.8rem] border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div
                className={cn(
                  "flex size-10 md:size-12 shrink-0 items-center justify-center rounded-xl shadow-inner transition-all duration-700",
                  getStatusStyles(item.status || "PENDING").container
                )}
              >
                {getStatusIcon(item.status || "PENDING")}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm md:text-base font-black uppercase italic tracking-tighter leading-none text-foreground/80 truncate">
                  {item.user?.fullName || "Anonymous_Node"}
                </span>
                <span className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em] mt-1.5 italic truncate">
                  {item.service?.name || "Handshake"} •{" "}
                  {item.createdAt ? format(new Date(item.createdAt), "HH:mm, MMM dd") : "Syncing..."}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2 shrink-0 ml-4">
              <span className="text-base md:text-lg font-black italic tracking-tighter leading-none text-foreground/90 tabular-nums">
                +${parseFloat(String(item.serviceTier?.price || "0")).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <div className={cn(
                "text-[7px] tracking-[0.3em] font-black px-2 py-0.5 rounded-md border",
                getStatusStyles(item.status || "PENDING").badge
              )}>
                {item.status || "PENDING"}
              </div>
            </div>
          </div>
        ))}
        
        <div className="h-12 bg-gradient-to-t from-background/40 to-transparent absolute bottom-0 left-0 right-0 pointer-events-none" />
      </div>
    </div>
  );
}

/** 🏛️ HELPERS: STATUS MORPHOLOGY */
function getStatusIcon(status: string) {
  const s = status.toUpperCase();
  if (s === "SUCCESS" || s === "ACTIVE") return <CheckCircle2 className="size-5" />;
  if (s === "PENDING") return <Clock className="size-5 animate-pulse" />;
  return <XCircle className="size-5" />;
}

function getStatusStyles(status: string) {
  const s = status.toUpperCase();
  if (s === "SUCCESS" || s === "ACTIVE") return {
    container: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    badge: "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
  };
  if (s === "PENDING") return {
    container: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    badge: "bg-amber-500/5 text-amber-500 border-amber-500/20"
  };
  return {
    container: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    badge: "bg-rose-500/5 text-rose-500 border-rose-500/20"
  };
}