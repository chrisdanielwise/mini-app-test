"use client";

import * as React from "react";
import { 
  User, 
  ShieldCheck, 
  Activity, 
  Zap, 
  History, 
  Ban, 
  Clock,
  ChevronRight,
  Globe,
  Waves
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 🏛️ Institutional Contexts
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 IDENTITY_NODE_DETAIL (Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, safeArea).
 * Logic: Subscriber telemetry with Hardware-Fluid Interpolation.
 */
export function IdentityNodeDetail({ subscriber }: { subscriber: any }) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Consuming the full interface physics
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    screenSize, 
    isPortrait, 
    isReady,
    viewportWidth,
    viewportHeight
  } = useDeviceContext();

  const isStaff = flavor === "AMBER";

  // 🛡️ HYDRATION GUARD: Prevents morphology flickering during hardware sync
  if (!isReady) return (
    <div className="space-y-8 animate-pulse opacity-20">
      <div className="h-64 rounded-[3rem] bg-card" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6"><div className="h-32 rounded-2xl bg-card" /></div>
    </div>
  );

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Calculating tactical gravity based on 6-tier logic and orientation.
   */
  const gridCols = screenSize === 'xs' ? "grid-cols-1" : 
                   screenSize === 'sm' ? "grid-cols-2" : 
                   (isTablet && isPortrait) ? "grid-cols-2" : "grid-cols-4";

  const headerPadding = screenSize === 'xs' ? "p-6" : "p-10 md:p-14";
  const avatarSize = isDesktop ? "size-32 md:size-40" : "size-24 md:size-32";

  return (
    <div className="space-y-[var(--fluid-gap)] animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[var(--ease-institutional)]">
      
      {/* --- TOP: KINETIC IDENTITY HEADER --- */}
      <div className={cn(
        "relative overflow-hidden border transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        headerPadding,
        "rounded-[2.5rem] md:rounded-[4rem]",
        isStaff ? "bg-amber-500/[0.04] border-amber-500/20 shadow-amber-500/10" : "bg-card/40 border-white/5 shadow-apex"
      )}>
        
        {/* 🌊 RADIANCE FLOW: Scales with viewportWidth */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" 
             style={{ transform: `scale(${viewportWidth > 1200 ? 1.5 : 1})` }} />

        <div className={cn(
          "flex items-center gap-6 md:gap-12 relative z-10",
          (isMobile || isPortrait) ? "flex-col text-center" : "flex-row text-left"
        )}>
          
          {/* USER AVATAR NODE: Kinetic Rotation */}
          <div className="relative group">
            <div className={cn(
              "rounded-[2.2rem] md:rounded-[3rem] flex items-center justify-center border shadow-2xl transition-all duration-1000 group-hover:rotate-[8deg] group-hover:scale-105",
              avatarSize,
              isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              <User className={isDesktop ? "size-20" : "size-14"} />
            </div>
            <div className="absolute -bottom-2 -right-2 size-12 rounded-2xl bg-background border border-white/5 flex items-center justify-center shadow-inner">
               <ShieldCheck className="size-6 text-emerald-500 animate-pulse" />
            </div>
          </div>

          <div className="flex-1 space-y-4 min-w-0 w-full">
            <div className={cn("flex flex-wrap items-center gap-3", (isMobile || isPortrait) && "justify-center")}>
              <h2 className="text-[var(--fluid-h1)] font-black uppercase italic tracking-tighter text-foreground leading-none">
                {subscriber.username || "NODE_IDENTITY_NULL"}
              </h2>
              {screenSize !== 'xs' && (
                <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                  VERIFIED_NODE
                </Badge>
              )}
            </div>
            
            <div className={cn("flex items-center gap-4 opacity-30 italic", (isMobile || isPortrait) && "justify-center")}>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] truncate">ID_{subscriber.id?.slice(0, 12)}</span>
               <div className="size-1 rounded-full bg-white/20" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] truncate">EPOCH_{subscriber.joinedDate}</span>
            </div>
          </div>

          {/* ACTION CLUSTER: Morphology-aware buttons */}
          <div className={cn("flex gap-4", (isMobile || isPortrait) ? "w-full" : "shrink-0")}>
            <Button 
              variant="outline" 
              onClick={() => { impact("light"); selectionChange(); }}
              className="h-16 w-16 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 transition-all active:scale-90"
            >
              <History className="size-6 opacity-40" />
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => impact("heavy")}
              className={cn(
                "h-16 px-10 rounded-2xl font-black uppercase italic tracking-widest text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all",
                (isMobile || isPortrait) && "flex-1"
              )}
            >
              <Ban className="mr-3 size-4" /> Terminate_Node
            </Button>
          </div>
        </div>
      </div>

      {/* --- TELEMETRY HUD: FLUID GRID --- */}
      <div className={cn("grid gap-4 md:gap-8", gridCols)}>
        {[
          { label: "Lifetime_Value", value: `$${subscriber.ltv}`, icon: Zap, color: "text-primary" },
          { label: "Signal_Reach", value: "98.4%", icon: Activity, color: "text-emerald-500" },
          { label: "Renewal_Rate", value: "x14", icon: Clock, color: "text-amber-500" },
          { label: "Global_Rank", value: "#42", icon: Globe, color: "text-blue-500" }
        ].map((stat, idx) => (
          <div 
            key={stat.label} 
            style={{ animationDelay: `${idx * 100}ms` }}
            className="p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-card/30 backdrop-blur-3xl space-y-4 group hover:border-white/20 transition-all duration-1000 animate-in fade-in zoom-in-95"
          >
             <div className="flex items-center justify-between">
                <stat.icon className={cn("size-6 transition-transform duration-700 group-hover:scale-125", stat.color)} />
                <Waves className="size-4 opacity-10 animate-pulse" />
             </div>
             <div className="space-y-1">
                <p className="text-3xl font-black italic tracking-tighter text-foreground">{stat.value}</p>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-30 italic">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* --- ACTIVITY LEDGER: STREAMING VIEW --- */}
      <div className="rounded-[3rem] border border-white/5 bg-card/40 backdrop-blur-3xl overflow-hidden shadow-apex">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] italic text-foreground/40">Recent_Node_Activity</h4>
           <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-primary italic hover:bg-transparent group">
             {screenSize === 'xs' ? 'FULL_VIEW' : 'View_Full_Ledger'} <ChevronRight className="ml-2 size-3 transition-transform group-hover:translate-x-1" />
           </Button>
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-10 py-6 md:py-8 flex items-center justify-between group hover:bg-white/[0.03] transition-all duration-500 cursor-pointer">
               <div className="flex items-center gap-6">
                  <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all duration-1000">
                    <Zap className="size-5 opacity-40 group-hover:text-primary transition-all" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] md:text-sm font-black uppercase italic tracking-tighter truncate leading-none mb-1.5">Signal_Propagated // SYNC_COMPLETE</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Epoch_74829 • 12:40:01</p>
                  </div>
               </div>
               {screenSize !== 'xs' && (
                 <Badge className="bg-white/5 text-foreground/40 border-none font-black italic text-[8px] shrink-0">+0.00ms</Badge>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}