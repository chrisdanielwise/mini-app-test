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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface AsyncActivityFeedProps {
  activities: any[];
  isStaffOversight?: boolean;
}

/**
 * 🌊 FLUID ACTIVITY FEED (Institutional v16.16.12)
 * Logic: Momentum-based log stream with haptic-ready nodes.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function AsyncActivityFeed({
  activities,
  isStaffOversight = false,
}: AsyncActivityFeedProps) {
  const { impact } = useHaptics();

  if (!activities || activities.length === 0) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[3rem] border border-white/5 bg-card/20 p-12 text-center backdrop-blur-3xl">
        <div className="mb-8 rounded-[2rem] bg-white/5 p-6 border border-white/10 animate-pulse">
          <Activity className="size-10 text-muted-foreground/20" />
        </div>
        <h3 className="text-[12px] font-black uppercase italic tracking-[0.4em] opacity-40">
          Zero_Telemetry_Detected
        </h3>
        <p className="max-w-[240px] text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest leading-relaxed mt-4">
          {isStaffOversight 
            ? "Global network logs will manifest once nodes process transactions." 
            : "Transaction logs will manifest once users synchronize with your nodes."}
        </p>
      </div>
    );
  }

  return (
    <div className="group/feed relative flex flex-col h-full min-h-[500px] rounded-[3rem] border border-white/5 bg-card/30 p-8 shadow-2xl backdrop-blur-3xl overflow-hidden">
      {/* 🌊 AMBIENT RADIANCE: Oversight Glow */}
      <div className={cn(
        "absolute -top-24 -right-24 size-64 blur-[120px] opacity-20 transition-colors duration-1000",
        isStaffOversight ? "bg-amber-500" : "bg-primary"
      )} />

      {/* Blueprint Subliminal Branding */}
      <Terminal className="absolute -bottom-12 -left-12 size-64 opacity-[0.02] -rotate-12 pointer-events-none text-primary transition-transform duration-1000 group-hover/feed:rotate-0" />

      <div className="flex flex-row items-center justify-between mb-10 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
              Node_Operations
            </h3>
            {isStaffOversight && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px]">
                GLOBAL_SYNC
              </Badge>
            )}
          </div>
          <p className="text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">
            Recent <span className={cn(isStaffOversight ? "text-amber-500" : "text-primary")}>Activity</span>
          </p>
        </div>
        <a
          href="/dashboard/payouts"
          onPointerEnter={() => impact("light")}
          className={cn(
            "group/link text-[10px] font-black uppercase italic tracking-widest transition-all flex items-center gap-2",
            isStaffOversight ? "text-amber-500" : "text-primary"
          )}
        >
          Full Ledger
          <ArrowUpRight className="size-4 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
        </a>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10 flex-1 scrollbar-hide">
        {activities.map((item: any, index: number) => (
          <div
            key={item.id}
            onPointerEnter={() => impact("light")}
            style={{ animationDelay: `${index * 50}ms` }}
            className="group/item flex items-center justify-between p-5 rounded-[2rem] border border-transparent hover:border-white/10 hover:bg-white/[0.02] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="flex items-center gap-5 min-w-0">
              <div
                className={cn(
                  "flex size-12 md:size-14 shrink-0 items-center justify-center rounded-[1.25rem] shadow-inner transition-all duration-700 group-hover/item:scale-110 group-hover/item:rotate-3",
                  getStatusColor(item.status || "PENDING")
                )}
              >
                {getStatusIcon(item.status || "PENDING")}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm md:text-base font-black uppercase italic tracking-tighter leading-none group-hover/item:text-primary transition-colors truncate">
                  {item.user?.fullName || "Anonymous Node"}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.15em] mt-2 italic truncate">
                  {item.merchant?.companyName ? `[${item.merchant.companyName}] ` : ""}
                  {item.service?.name || "Digital Service"} •{" "}
                  {item.createdAt
                    ? format(new Date(item.createdAt), "HH:mm, MMM dd")
                    : "Just now"}
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2 shrink-0">
              <span className="text-base md:text-lg font-black italic tracking-tighter leading-none text-foreground">
                +${parseFloat(String(item.serviceTier?.price || "0")).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[8px] tracking-[0.2em] font-black px-3 py-1",
                  getStatusBadgeStyles(item.status || "PENDING")
                )}
              >
                {item.status || "PENDING"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 🏛️ UI HELPERS (Hardened Standard)
 */
function getStatusIcon(status: string) {
  switch (status) {
    case "SUCCESS":
    case "ACTIVE":
      return <CheckCircle2 className="size-5" />;
    case "PENDING":
      return <Clock className="size-5" />;
    default:
      return <XCircle className="size-5" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "SUCCESS":
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
    case "PENDING":
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]";
    default:
      return "bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]";
  }
}

function getStatusBadgeStyles(status: string) {
  switch (status) {
    case "SUCCESS":
    case "ACTIVE":
      return "bg-emerald-500/5 text-emerald-500 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/5 text-amber-500 border-amber-500/20";
    default:
      return "bg-rose-500/5 text-rose-500 border-rose-500/20";
  }
}