"use client";

import * as React from "react";
import { StatsCard } from "./stats-card";
import { SubscribersChart } from "./subscribers-chart";
import {
  Loader2,
  Users,
  Zap,
  Activity,
  Globe,
  Lock,
  Terminal,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface AsyncSubscribersProps {
  merchantId: string | null; 
  growth?: any;
  stats?: any;
  type?: "stats" | "chart";
  isGlobalOversight?: boolean;
}

/**
 * 🛰️ ASYNC_SUBSCRIBERS_NODE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density padding (p-7) and shrunken chart volume prevents blowout.
 */
export default function AsyncSubscribersCard({
  merchantId, 
  growth,
  stats,
  type = "stats",
  isGlobalOversight = false,
}: AsyncSubscribersProps) {
  const { impact } = useHaptics();
  const { isReady, isMobile, isPortrait } = useDeviceContext();

  // 🛡️ HYDRATION SHIELD: Prevents the "Bogus" layout snap
  if (!isReady) return (
    <div className="h-40 md:h-56 w-full bg-card/10 animate-pulse rounded-2xl border border-white/5" />
  );

  // 🛡️ SECURITY FALLBACK: Identity Node Missing
  if (!stats && !growth) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/5 bg-black/40 p-6 text-center backdrop-blur-3xl animate-in fade-in duration-700">
        <div className="mb-4 size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
          <Lock className="size-4 text-muted-foreground/10" />
        </div>
        <div className="space-y-1">
           <p className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">
            {merchantId ? `Node_${merchantId.slice(0, 8).toUpperCase()}_Isolated` : "Identity_Required"}
          </p>
          <p className="text-[6.5px] font-mono uppercase tracking-widest text-muted-foreground/10 leading-none">
            HANDSHAKE_PENDING
          </p>
        </div>
      </div>
    );
  }

  if (type === "chart") {
    if (!growth) {
      return (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-black/40 backdrop-blur-3xl">
          <Loader2 className="size-6 animate-spin text-primary opacity-20" />
          <p className="mt-4 text-[8px] font-black uppercase tracking-[0.3em] opacity-20 italic">
            Syncing_Growth...
          </p>
        </div>
      );
    }

    const dailyData = growth?.dailyData || [];
    
    return (
      <div 
        onPointerEnter={() => impact("light")}
        className={cn(
          "relative group overflow-hidden transition-all duration-700 shadow-2xl",
          "rounded-3xl border",
          "p-6 md:p-7", // Reduced p-12 -> p-7
          isGlobalOversight 
            ? "bg-amber-500/[0.01] border-amber-500/10" 
            : "bg-card/40 border-white/5",
          "animate-in fade-in slide-in-from-bottom-4"
        )}
      >
        {/* Vapour depth radiants */}
        <div className={cn(
          "absolute -left-24 -top-24 size-48 blur-[100px] opacity-10 pointer-events-none",
          isGlobalOversight ? "bg-amber-500" : "bg-primary"
        )} />

        <div className="flex flex-row items-center justify-between mb-6 relative z-10">
          <div className="space-y-1.5 leading-none">
            <div className="flex items-center gap-2.5 italic opacity-30">
              {isGlobalOversight 
                ? <Globe className="size-2.5 text-amber-500 animate-pulse" /> 
                : <Users className="size-2.5 text-primary" />
              }
              <div className="flex flex-col">
                <h3 className={cn(
                  "text-[7.5px] font-black uppercase tracking-[0.4em] leading-none",
                  isGlobalOversight ? "text-amber-500" : "text-primary"
                )}>
                  {isGlobalOversight ? "Global_Growth" : "Expansion_Vector"}
                </h3>
              </div>
            </div>
            <p className="text-lg md:text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground">
              {isGlobalOversight ? "Total" : "User"} <span className={isGlobalOversight ? "text-amber-500" : "text-primary"}>Growth</span>
            </p>
          </div>
          <div className={cn(
            "size-9 md:size-10 rounded-xl border flex items-center justify-center shrink-0 shadow-inner transition-all",
            isGlobalOversight 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
              : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <Zap className="size-5" />
          </div>
        </div>

        {/* --- GROWTH CHART ENGINE: Compressed Volume --- */}
        <div className="h-[220px] md:h-[280px] w-full relative z-10">
          <SubscribersChart data={dailyData} theme={isGlobalOversight ? "amber" : "emerald"} />
        </div>

        {/* --- TACTICAL TELEMETRY FOOTER --- */}
        {!isMobile && (
          <div className="mt-6 flex items-center justify-between opacity-10 italic border-t border-white/5 pt-4">
            <div className="flex items-center gap-3">
               <Cpu className="size-2.5" />
               <span className="text-[7px] font-black uppercase tracking-[0.4em]">Mesh_Processing_Ok</span>
            </div>
            <div className="flex items-center gap-2">
               <ShieldCheck className="size-2.5 text-primary" />
               <span className="text-[7.5px] font-mono tabular-nums">[TX_NODE_v16_STABLE]</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  const activeCount = stats?.activeSubscribers || 0;
  const ticketCount = stats?.openTickets || 0;

  return (
    <div className={cn(
      "grid gap-4 w-full animate-in slide-in-from-bottom-4 duration-700",
      isMobile && isPortrait ? "grid-cols-1" : "grid-cols-2"
    )}>
      <StatsCard
        title={isGlobalOversight ? "Global Users" : "Active Subscribers"}
        value={activeCount.toLocaleString()}
        change={0.0}
        iconType="users"
        iconColor={isGlobalOversight ? "text-amber-500" : "text-blue-500"}
      />
      <StatsCard
        title={isGlobalOversight ? "System Tickets" : "Open Tickets"}
        value={ticketCount.toString()}
        iconType="tickets"
        iconColor={isGlobalOversight ? "text-amber-600" : "text-orange-500"}
        changeLabel={isGlobalOversight ? "Oversight" : "Attention"}
        className={cn(
          ticketCount > 0 && "border-rose-500/10 shadow-apex-rose"
        )}
      />
    </div>
  );
}