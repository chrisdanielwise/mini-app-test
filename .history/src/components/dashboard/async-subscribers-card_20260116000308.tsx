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

/**
 * 🛰️ PROPS_INTERFACE: Identity Handshake Fix
 */
interface AsyncSubscribersProps {
  merchantId: string | null; 
  growth?: any;
  stats?: any;
  type?: "stats" | "chart";
  isGlobalOversight?: boolean;
}

/**
 * 🌊 ASYNC_SUBSCRIBERS_NODE (Institutional Apex v2026.1.15)
 * Strategy: Clamped high-density data ingress to prevent "bogus" scaling.
 * Aesthetics: Obsidian-OLED Depth | Tactical Minimums.
 */
export default function AsyncSubscribersCard({
  merchantId, 
  growth,
  stats,
  type = "stats",
  isGlobalOversight = false,
}: AsyncSubscribersProps) {
  const { impact } = useHaptics();
  const { isReady, screenSize, isMobile, isPortrait } = useDeviceContext();

  // 🛡️ HYDRATION SHIELD: Prevents the "Bogus" layout snap during mount
  if (!isReady) return (
    <div className="h-48 md:h-64 w-full bg-card/10 animate-pulse rounded-[2rem] md:rounded-[2.8rem] border border-white/5" />
  );

  // 🛡️ SECURITY FALLBACK: Identity Node Missing
  if (!stats && !growth) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[2.8rem] border border-dashed border-white/5 bg-black/40 p-8 text-center backdrop-blur-3xl animate-in fade-in duration-1000">
        <div className="mb-6 size-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-apex transition-transform hover:rotate-6">
          <Lock className="size-5 text-muted-foreground/10" />
        </div>
        <div className="space-y-1.5">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic leading-none">
            {merchantId ? `Node_${merchantId.slice(0, 8).toUpperCase()}_Isolated` : "Identity_Required"}
          </p>
          <p className="text-[7px] font-mono uppercase tracking-widest text-muted-foreground/10 leading-none">
            PROTOCOL_HANDSHAKE_PENDING
          </p>
        </div>
      </div>
    );
  }

  if (type === "chart") {
    if (!growth) {
      return (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[2.8rem] border border-white/5 bg-black/40 backdrop-blur-3xl">
          <div className="relative">
            <Loader2 className="size-8 animate-spin text-primary opacity-40" />
            <Activity className="absolute inset-0 size-8 animate-pulse opacity-10" />
          </div>
          <p className="mt-6 text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">
            Syncing_Growth_Mesh...
          </p>
        </div>
      );
    }

    const dailyData = growth?.dailyData || [];
    const chartHeight = screenSize === 'xs' ? 240 : 340;

    return (
      <div 
        onPointerEnter={() => impact("light")}
        className={cn(
          "relative group overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-apex",
          "rounded-[2.8rem] md:rounded-[3.5rem] border",
          isMobile ? "p-8" : "p-12",
          isGlobalOversight 
            ? "bg-amber-500/[0.02] border-amber-500/10" 
            : "bg-card/40 border-white/5",
          "animate-in fade-in slide-in-from-bottom-8"
        )}
      >
        {/* Vapour depth radiants */}
        <div className={cn(
          "absolute -left-32 -top-32 size-64 blur-[120px] opacity-10 pointer-events-none",
          isGlobalOversight ? "bg-amber-500" : "bg-primary"
        )} />

        <div className="flex flex-row items-center justify-between mb-12 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3 italic opacity-40">
              {isGlobalOversight 
                ? <Globe className="size-3 text-amber-500 animate-pulse" /> 
                : <Users className="size-3 text-primary" />
              }
              <div className="flex flex-col">
                <h3 className={cn(
                  "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
                  isGlobalOversight ? "text-amber-500" : "text-primary"
                )}>
                  {isGlobalOversight ? "Global_Growth_Vector" : "Node_Expansion_Vector"}
                </h3>
                <span className="text-[7px] font-mono uppercase tracking-widest mt-1 opacity-50">v16.31_Apex</span>
              </div>
            </div>
            <p className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none text-foreground">
              {isGlobalOversight ? "Total" : "User"} <span className={isGlobalOversight ? "text-amber-500" : "text-primary"}>Growth</span>
            </p>
          </div>
          <div className={cn(
            "size-12 md:size-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-inner transition-all duration-700 group-hover:rotate-6 group-hover:scale-110",
            isGlobalOversight 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
              : "bg-primary/10 border-primary/20 text-primary"
          )}>
            <Zap className="size-6 md:size-7" />
          </div>
        </div>

        {/* --- GROWTH CHART ENGINE --- */}
        <div 
          className="w-full relative z-10 animate-in fade-in duration-1000 delay-300" 
          style={{ height: `${chartHeight}px` }}
        >
          <SubscribersChart data={dailyData} theme={isGlobalOversight ? "amber" : "emerald"} />
        </div>

        {/* --- TACTICAL TELEMETRY FOOTER --- */}
        {!isMobile && (
          <div className="mt-8 flex items-center justify-between opacity-10 italic border-t border-white/5 pt-6">
            <div className="flex items-center gap-4">
               <Cpu className="size-3" />
               <span className="text-[8px] font-black uppercase tracking-[0.4em]">Mesh_Processing_Active</span>
            </div>
            <div className="flex items-center gap-3">
               <ShieldCheck className="size-3 text-primary" />
               <span className="text-[8px] font-mono tabular-nums">[TX_NODE_v16_STABLE]</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Identity extraction for Stat Nodes
  const activeCount = stats?.activeSubscribers || 0;
  const ticketCount = stats?.openTickets || 0;

  return (
    <div className={cn(
      "grid gap-4 md:gap-6 w-full animate-in slide-in-from-bottom-6 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
      isMobile && isPortrait ? "grid-cols-1" : "grid-cols-2"
    )}>
      <StatsCard
        title={isGlobalOversight ? "Global Platform Users" : "Active Subscribers"}
        value={activeCount.toLocaleString()}
        change={0.0}
        iconType="users"
        iconColor={isGlobalOversight ? "text-amber-500" : "text-blue-500"}
      />
      <StatsCard
        title={isGlobalOversight ? "System-Wide Tickets" : "Open Tickets"}
        value={ticketCount.toString()}
        iconType="tickets"
        iconColor={isGlobalOversight ? "text-amber-600" : "text-orange-500"}
        changeLabel={isGlobalOversight ? "Oversight Required" : "Attention Required"}
        className={cn(
          ticketCount > 0 && "border-rose-500/20 shadow-apex-rose"
        )}
      />
    </div>
  );
}