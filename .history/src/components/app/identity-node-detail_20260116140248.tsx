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
 * 🛰️ IDENTITY_NODE_DETAIL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-11 buttons and shrunken telemetry cells prevent layout blowout.
 */
export function IdentityNodeDetail({ subscriber }: { subscriber: any }) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  
  const { 
    isMobile, 
    screenSize, 
    isPortrait, 
    isReady 
  } = useDeviceContext();

  const isStaff = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevents "Bogus" layout snap
  if (!isReady) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-40 rounded-2xl bg-white/5" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="h-24 rounded-xl bg-white/5" />
      </div>
    </div>
  );

  const gridCols = screenSize === 'xs' ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* --- 🛡️ FIXED HUD: Stationary Identity Header --- */}
      <div className={cn(
        "relative overflow-hidden border p-5 md:p-6 rounded-2xl md:rounded-3xl",
        isStaff ? "bg-amber-500/[0.01] border-amber-500/10 shadow-sm" : "bg-card/40 border-white/5 shadow-2xl"
      )}>
        <div className={cn(
          "flex items-center gap-5 md:gap-8 relative z-10",
          (isMobile || isPortrait) ? "flex-col text-center" : "flex-row text-left"
        )}>
          
          {/* USER AVATAR: Shrunken Tactical Geometry */}
          <div className="relative group shrink-0">
            <div className={cn(
              "size-20 md:size-24 rounded-xl md:rounded-2xl flex items-center justify-center border shadow-xl transition-all",
              isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              <User className="size-10 md:size-12" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-8 rounded-lg bg-black border border-white/5 flex items-center justify-center shadow-inner">
               <ShieldCheck className="size-4 text-emerald-500" />
            </div>
          </div>

          <div className="flex-1 space-y-2 min-w-0 leading-none">
            <div className={cn("flex flex-wrap items-center gap-2.5", (isMobile || isPortrait) && "justify-center")}>
              <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
                {subscriber.username || "NODE_IDENTITY_NULL"}
              </h2>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/10 rounded px-2 py-0.5 font-black text-[7px] uppercase tracking-widest">
                VERIFIED
              </Badge>
            </div>
            
            <div className={cn("flex items-center gap-3 opacity-20 italic", (isMobile || isPortrait) && "justify-center")}>
               <span className="text-[8px] font-black uppercase tracking-[0.2em]">ID_{subscriber.id?.slice(0, 8)}</span>
               <span className="text-[8px] font-black uppercase tracking-[0.2em]">EPOCH_{subscriber.joinedDate}</span>
            </div>
          </div>

          {/* ACTION CLUSTER: Tactical h-11 standard */}
          <div className={cn("flex gap-2", (isMobile || isPortrait) ? "w-full" : "shrink-0")}>
            <Button 
              variant="outline" 
              onClick={() => { impact("light"); selectionChange(); }}
              className="h-11 w-11 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 transition-all"
            >
              <History className="size-4 opacity-40" />
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => impact("heavy")}
              className={cn(
                "h-11 px-6 rounded-xl font-black uppercase italic tracking-widest text-[9px] bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all",
                (isMobile || isPortrait) && "flex-1"
              )}
            >
              <Ban className="mr-2 size-3.5" /> Terminate_Node
            </Button>
          </div>
        </div>
      </div>

      {/* --- 🚀 TELEMETRY HUD: High-Density Tape --- */}
      <div className={cn("grid gap-3", gridCols)}>
        {[
          { label: "Lifetime_Value", value: `$${subscriber.ltv}`, icon: Zap, color: "text-primary" },
          { label: "Signal_Reach", value: "98.4%", icon: Activity, color: "text-emerald-500" },
          { label: "Renewal_Rate", value: "x14", icon: Clock, color: "text-amber-500" },
          { label: "Global_Rank", value: "#42", icon: Globe, color: "text-blue-500" }
        ].map((stat) => (
          <div 
            key={stat.label} 
            className="p-5 rounded-2xl border border-white/5 bg-zinc-950/40 space-y-2 group transition-all"
          >
             <stat.icon className={cn("size-4 transition-all group-hover:scale-110", stat.color)} />
             <div className="leading-none">
                <p className="text-xl font-black italic tracking-tighter text-foreground">{stat.value}</p>
                <p className="text-[7.5px] font-black uppercase tracking-widest opacity-10 italic mt-1">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* --- 📊 ACTIVITY LEDGER: Independent Tactical Scroll --- */}
      <div className="rounded-2xl border border-white/5 bg-zinc-950/40 overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between bg-white/[0.01] leading-none">
           <div className="flex items-center gap-2 opacity-20">
             <Activity className="size-3" />
             <h4 className="text-[7.5px] font-black uppercase tracking-[0.3em]">Node_Activity</h4>
           </div>
           <Button variant="ghost" className="h-6 px-2 text-[7.5px] font-black uppercase tracking-widest text-primary hover:bg-transparent">
             {screenSize === 'xs' ? 'VIEW' : 'View_Full_Ledger'}
           </Button>
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-5 py-3.5 flex items-center justify-between group hover:bg-white/[0.01] transition-all cursor-pointer leading-none">
               <div className="flex items-center gap-4 min-w-0">
                  <div className="size-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                    <Zap className="size-4 opacity-40 group-hover:text-primary transition-all" />
                  </div>
                  <div className="min-w-0 flex flex-col gap-1.5">
                    <p className="text-xs font-black uppercase italic tracking-tighter text-foreground truncate">Signal_Propagated // SYNC</p>
                    <p className="text-[7.5px] font-black uppercase tracking-widest opacity-10">Epoch_74829 • 12:40:01</p>
                  </div>
               </div>
               {screenSize !== 'xs' && (
                 <Badge className="bg-white/5 text-foreground/20 border-none font-black italic text-[7px] shrink-0">+0.00ms</Badge>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}