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
 * Aesthetics: Momentum-Stream | Vapour-Glass depth.
 * Logic: morphology-aware staggered ingress for real-time telemetry.
 */
export function AsyncActivityFeed({
  activities,
  isStaffOversight = false,
}: AsyncActivityFeedProps) {
  const { impact } = useHaptics();
  const { isReady, isMobile, screenSize } = useDeviceContext();

  if (!isReady) return <div className="min-h-[500px] w-full bg-card/20 animate-pulse rounded-[3rem]" />;

  if (!activities || activities.length === 0) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[3rem] md:rounded-[4rem] border border-white/5 bg-card/20 p-12 text-center backdrop-blur-3xl transition-all duration-1000">
        <div className="mb-8 rounded-[2rem] bg-white/5 p-8 border border-white/10 animate-pulse">
          <Activity className="size-12 text-muted-foreground/10" />
        </div>
        <h3 className="text-[12px] font-black uppercase italic tracking-[0.5em] opacity-30">
          Zero_Telemetry_Detected
        </h3>
        <p className="max-w-[280px] text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em] leading-relaxed mt-6 italic">
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
      "rounded-[3rem] md:rounded-[4rem]",
      screenSize === 'xs' ? "p-6" : "p-10"
    )}>
      {/* 🌫️ VAPOUR RADIANCE: Oversight Glow */}
      <div className={cn(
        "absolute -top-32 -right-32 size-80 blur-[140px] opacity-10 transition-colors duration-[2000ms] pointer-events-none",
        isStaffOversight ? "bg-amber-500" : "bg-primary"
      )} />

      {/* Blueprint Subsurface Watermark */}
      <Terminal className="absolute -bottom-16 -left-16 size-80 opacity-[0.01] -rotate-12 pointer-events-none text-primary transition-transform duration-1000 group-hover/feed:rotate-0" />

      {/* --- FEED HEADER --- */}
      <div className="flex flex-row items-center justify-between mb-10 relative z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Zap className={cn("size-3 animate-pulse", isStaffOversight ? "text-amber-500" : "text-primary")} />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 italic leading-none">
              Node_Operations_v16.31
            </h3>
            {isStaffOversight && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] px-2">
                GLOBAL_SYNC
              </Badge>
            )}
          </div>
          <p className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Recent <span className={cn(isStaffOversight ? "text-amber-500" : "text-primary")}>Activity</span>
          </p>
        </div>
        
        <a
          href="/dashboard/payouts"
          onPointerEnter={() => impact("light")}
          className={cn(
            "group/link text-[10px] font-black uppercase italic tracking-widest transition-all flex items-center gap-2",
            isStaffOversight ? "text-amber-500/60 hover:text-amber-500" : "text-primary/60 hover:text-primary"
          )}
        >
          {isMobile ? "Audit" : "Full Ledger"}
          <ArrowUpRight className="size-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
        </a>
      </div>

      {/* --- LOG STREAM --- */}
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10 flex-1 scrollbar-hide">
        {activities.map((item: any, index: number) => (
          <div
            key={item.id}
            onPointerEnter={() => impact("light")}
            style={{ animationDelay: `${index * 80}ms` }}
            className="group/item flex items-center justify-between p-5 rounded-[2.2rem] border border-white/[0.03] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] transition-all duration-700 animate-in fade-in slide-in-from-bottom-6"
          >
            <div className="flex items-center gap-5 min-w-0">
              <div
                className={cn(
                  "flex size-12 md:size-16 shrink-0 items-center justify-center rounded-2xl md:rounded-[1.4rem] shadow-inner transition-all duration-1000 group-hover/item:scale-110 group-hover/item:rotate-3",
                  getStatusStyles(item.status || "PENDING").container
                )}
              >
                {getStatusIcon(item.status || "PENDING")}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base md:text-lg font-black uppercase italic tracking-tighter leading-none text-foreground/80 group-hover/item:text-foreground transition-colors truncate">
                  {item.user?.fullName || "Anonymous_Node"}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mt-2 italic truncate flex items-center gap-2">
                  {item.merchant?.companyName && (
                    <span className="text-primary/40">[{item.merchant.companyName}]</span>
                  )}
                  {item.service?.name || "Service_Inquiry"} •{" "}
                  {item.createdAt
                    ? format(new Date(item.createdAt), "HH:mm, MMM dd")
                    : "Just now"}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-3 shrink-0">
              <span className="text-lg md:text-xl font-black italic tracking-tighter leading-none text-foreground/90 tabular-nums">
                +${parseFloat(String(item.serviceTier?.price || "0")).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8px] tracking-[0.3em] font-black px-3 py-1 rounded-lg",
                  getStatusStyles(item.status || "PENDING").badge
                )}
              >
                {item.status || "PENDING"}
              </Badge>
            </div>
          </div>
        ))}
        
        {/* Kinetic Floor: Fade out effect */}
        <div className="h-20 bg-gradient-to-t from-background/40 to-transparent absolute bottom-0 left-0 right-0 pointer-events-none" />
      </div>
    </div>
  );
}

/** 🏛️ HELPERS: STATUS MORPHOLOGY */
function getStatusIcon(status: string) {
  switch (status.toUpperCase()) {
    case "SUCCESS":
    case "ACTIVE":
      return <CheckCircle2 className="size-6" />;
    case "PENDING":
      return <Clock className="size-6 animate-pulse" />;
    default:
      return <XCircle className="size-6" />;
  }
}

function getStatusStyles(status: string) {
  const s = status.toUpperCase();
  switch (s) {
    case "SUCCESS":
    case "ACTIVE":
      return {
        container: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
        badge: "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
      };
    case "PENDING":
      return {
        container: "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        badge: "bg-amber-500/5 text-amber-500 border-amber-500/20"
      };
    default:
      return {
        container: "bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]",
        badge: "bg-rose-500/5 text-rose-500 border-rose-500/20"
      };
  }
}