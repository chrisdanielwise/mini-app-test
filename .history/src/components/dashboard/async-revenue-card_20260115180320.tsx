"use client";

import * as React from "react";
import { StatsCard } from "./stats-card";
import { RevenueChart } from "./revenue-chart";
import { 
  TrendingUp, 
  Zap, 
  Globe, 
  Lock,
  Activity,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ PROPS_INTERFACE: Identity Handshake Fix
 */
interface AsyncRevenueCardProps {
  merchantId: string | null; // ✅ FIXED: Explicitly allow merchantId ingress
  data?: any;
  type?: "stats" | "chart";
  isGlobalOversight?: boolean;
}

/**
 * 🌊 ASYNC_REVENUE_NODE (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Momentum | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
 */
export function AsyncRevenueCard({
  merchantId, // ✅ FIXED: Destructured for local scope usage
  data,
  type = "stats",
  isGlobalOversight = false,
}: AsyncRevenueCardProps) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="h-64 w-full bg-card/20 animate-pulse rounded-[3rem] border border-white/5" />;

  // 🛡️ SECURITY FALLBACK: Identity Node Missing
  if (!data) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[3.5rem] border border-dashed border-white/5 bg-card/10 p-12 text-center backdrop-blur-3xl animate-in fade-in duration-1000">
        <div className="mb-8 size-16 rounded-[2rem] bg-white/[0.03] flex items-center justify-center border border-white/10 shadow-apex transition-transform hover:rotate-12">
          <Lock className="size-8 text-muted-foreground/10" />
        </div>
        <div className="space-y-2">
           <p className="text-[12px] font-black uppercase tracking-[0.5em] text-muted-foreground/20 italic leading-none">
            {merchantId ? `Node_${merchantId.slice(0, 8)}_Isolated` : "Identity_Node_Required"}
          </p>
          <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/10 leading-none">
            Protocol_Handshake_Isolated
          </p>
        </div>
      </div>
    );
  }

  if (type === "chart") {
    const dailyData = data?.dailyData || [];
    
    return (
      <div 
        onPointerEnter={() => impact("light")}
        className={cn(
          "relative group overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-apex",
          "rounded-[3.5rem] border",
          isMobile ? "p-8" : "p-14",
          isGlobalOversight 
            ? "bg-amber-500/[0.04] border-amber-500/20 shadow-apex-amber" 
            : "bg-card/30 border-white/5",
          "animate-in fade-in slide-in-from-bottom-10"
        )}
      >
        <div className={cn(
          "absolute -right-32 -bottom-32 size-80 blur-[140px] opacity-15 transition-all duration-[2000ms] pointer-events-none",
          isGlobalOversight ? "bg-amber-500" : "bg-primary"
        )} />

        <TrendingUp className="absolute -bottom-16 -left-16 size-80 opacity-[0.015] -rotate-12 pointer-events-none group-hover:scale-110 group-hover:rotate-0 transition-transform duration-1000" />
        
        <div className="flex flex-row items-center justify-between mb-16 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4 italic opacity-40">
              {isGlobalOversight 
                 ? <Globe className="size-4 text-amber-500 animate-pulse" /> 
                 : <Zap className="size-4 text-primary animate-pulse" />
              }
              <div className="flex flex-col">
                <h3 className={cn(
                  "text-[10px] font-black uppercase tracking-[0.5em] leading-none",
                  isGlobalOversight ? "text-amber-500" : "text-primary"
                )}>
                  {isGlobalOversight ? "Platform_Global_Vector" : "Cluster_Financial_Vector"}
                </h3>
                <span className="text-[7px] font-black uppercase tracking-widest mt-1">Institutional_Oversight_v16.31</span>
              </div>
            </div>
            <p className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground">
              {isGlobalOversight ? "Global" : "Revenue"} <span className={isGlobalOversight ? "text-amber-500" : "text-primary"}>Trend</span>
            </p>
          </div>
          
          <div className={cn(
            "size-16 md:size-20 rounded-[1.8rem] md:rounded-[2.2rem] border flex items-center justify-center shrink-0 shadow-inner transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110",
            isGlobalOversight 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
              : "bg-primary/10 border-primary/20 text-primary"
          )}>
             <TrendingUp className="size-8 md:size-10" />
          </div>
        </div>

        <div className="h-[300px] md:h-[400px] w-full relative z-10">
          <RevenueChart 
            data={dailyData} 
            theme={isGlobalOversight ? "amber" : "emerald"} 
          />
        </div>

        {!isMobile && (
          <div className="mt-10 flex items-center justify-between opacity-10 italic border-t border-white/5 pt-8">
            <div className="flex items-center gap-4">
               <Cpu className="size-4" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Mesh_Processing_Active</span>
            </div>
            <div className="flex items-center gap-3">
               <Activity className="size-3 animate-pulse" />
               <span className="text-[8px] font-mono tabular-nums">[TX_NODE_v16_STABLE]</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  const totalRev = parseFloat(data?.total || "0");
  const transCount = data?.transactionCount || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 w-full animate-in slide-in-from-bottom-8 duration-1000">
      <StatsCard
        title={isGlobalOversight ? "Global Gross Revenue" : "Gross Revenue"}
        value={`$${totalRev.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        change={0.0}
        iconType="revenue"
        iconColor={isGlobalOversight ? "text-amber-500" : "text-emerald-500"}
      />
      <StatsCard
        title={isGlobalOversight ? "Global Tx Volume" : "Transaction Volume"}
        value={transCount.toLocaleString()}
        change={0.0}
        iconType="payments"
        iconColor={isGlobalOversight ? "text-amber-400" : "text-violet-500"}
      />
    </div>
  );
}