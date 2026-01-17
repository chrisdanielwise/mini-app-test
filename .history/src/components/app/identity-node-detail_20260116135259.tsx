"use client";

import * as React from "react";
import { User, ShieldCheck, Activity, Zap, History, Ban, Clock, ChevronRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

export function IdentityNodeDetail({ subscriber }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isMobile, isTablet, isDesktop, screenSize, isPortrait, isReady } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  if (!isReady) return <div className="h-64 w-full bg-white/5 animate-pulse rounded-2xl" />;

  const gridCols = screenSize === 'xs' ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* IDENTITY HEADER: Tactical Slim */}
      <div className={cn(
        "relative overflow-hidden border p-6 rounded-2xl md:rounded-3xl",
        isStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-card/40 border-white/5 shadow-2xl"
      )}>
        <div className={cn("flex items-center gap-6 relative z-10", (isMobile || isPortrait) ? "flex-col text-center" : "flex-row text-left")}>
          <div className="relative group">
            <div className={cn(
              "size-20 md:size-24 rounded-xl md:rounded-2xl flex items-center justify-center border shadow-xl transition-all group-hover:rotate-3",
              isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              <User className="size-10 md:size-12" />
            </div>
            <div className="absolute -bottom-1 -right-1 size-8 rounded-lg bg-black border border-white/5 flex items-center justify-center shadow-inner">
               <ShieldCheck className="size-4 text-emerald-500" />
            </div>
          </div>

          <div className="flex-1 space-y-2 min-w-0 leading-none">
            <div className={cn("flex flex-wrap items-center gap-2", (isMobile || isPortrait) && "justify-center")}>
              <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-foreground">
                {subscriber.username || "IDENTITY_NULL"}
              </h2>
              <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest">
                VERIFIED
              </div>
            </div>
            <div className={cn("flex items-center gap-3 opacity-20 italic", (isMobile || isPortrait) && "justify-center")}>
               <span className="text-[8px] font-black uppercase tracking-[0.2em]">ID_{subscriber.id?.slice(0, 8)}</span>
               <span className="text-[8px] font-black uppercase tracking-[0.2em]">EPOCH_{subscriber.joinedDate}</span>
            </div>
          </div>

          <div className={cn("flex gap-2", (isMobile || isPortrait) ? "w-full" : "shrink-0")}>
            <Button variant="destructive" onClick={() => impact("heavy")} className="h-11 px-6 rounded-xl font-black uppercase italic tracking-widest text-[8px] bg-rose-500/10 border-rose-500/20 text-rose-500 flex-1 lg:flex-none">
              <Ban className="mr-2 size-3.5" /> Terminate_Node
            </Button>
          </div>
        </div>
      </div>

      {/* TELEMETRY HUD: Compressed Grid */}
      <div className={cn("grid gap-3", gridCols)}>
        {[
          { label: "Lifetime_Value", value: `$${subscriber.ltv}`, icon: Zap, color: "text-primary" },
          { label: "Signal_Reach", value: "98.4%", icon: Activity, color: "text-emerald-500" },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-2xl border border-white/5 bg-zinc-950/40 space-y-2 group transition-all">
             <stat.icon className={cn("size-4", stat.color)} />
             <div className="leading-none">
                <p className="text-lg font-black italic tracking-tighter text-foreground">{stat.value}</p>
                <p className="text-[7.5px] font-black uppercase tracking-widest opacity-10 italic mt-1">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}