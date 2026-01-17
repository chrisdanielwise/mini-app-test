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
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 IDENTITY_NODE_DETAIL (v16.16.12)
 * Logic: Subscriber telemetry with Relationship Heatmap.
 * Design: v9.9.2 Hyper-Glass with Hardware Morphology.
 */
export function IdentityNodeDetail({ subscriber }: { subscriber: any }) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const isStaff = flavor === "AMBER";

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      
      {/* --- TOP: IDENTITY HEADER --- */}
      <div className={cn(
        "relative overflow-hidden rounded-[3rem] border p-8 md:p-12 transition-all duration-700",
        isStaff ? "bg-amber-500/[0.04] border-amber-500/20" : "bg-card/40 border-white/5 shadow-2xl"
      )}>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* USER AVATAR NODE */}
          <div className="relative group">
            <div className={cn(
              "size-24 md:size-32 rounded-[2.5rem] flex items-center justify-center border shadow-2xl transition-transform duration-700 group-hover:rotate-6",
              isStaff ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              <User className="size-12 md:size-16" />
            </div>
            <div className="absolute -bottom-2 -right-2 size-10 rounded-2xl bg-background border border-white/5 flex items-center justify-center shadow-xl">
               <ShieldCheck className="size-5 text-emerald-500" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-foreground">
                {subscriber.username || "NODE_IDENTITY_NULL"}
              </h2>
              <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl px-3 py-1 font-black text-[9px] uppercase italic tracking-widest">
                VERIFIED_NODE
              </Badge>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 opacity-30 italic">
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">ID: {subscriber.id?.slice(0, 12)}</span>
               <div className="size-1 rounded-full bg-white/20" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Joined: {subscriber.joinedDate}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => { impact("light"); selectionChange(); }}
              className="h-14 w-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 transition-all"
            >
              <History className="size-5 opacity-40" />
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => impact("heavy")}
              className="h-14 px-8 rounded-2xl font-black uppercase italic tracking-widest text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
            >
              <Ban className="mr-3 size-4" /> Terminate_Node
            </Button>
          </div>
        </div>
      </div>

      {/* --- TELEMETRY HUD: METRICS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Lifetime_Value", value: `$${subscriber.ltv}`, icon: Zap, color: "text-primary" },
          { label: "Signal_Reach", value: "98.4%", icon: Activity, color: "text-emerald-500" },
          { label: "Renewal_Rate", value: "x14", icon: Clock, color: "text-amber-500" },
          { label: "Global_Rank", value: "#42", icon: Globe, color: "text-blue-500" }
        ].map((stat) => (
          <div key={stat.label} className="p-8 rounded-[2.5rem] border border-white/5 bg-card/30 backdrop-blur-3xl space-y-4 group hover:border-white/10 transition-all">
             <div className="flex items-center justify-between">
                <stat.icon className={cn("size-5", stat.color)} />
                <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-20 italic">Node_Metric</span>
             </div>
             <div className="space-y-1">
                <p className="text-2xl font-black italic tracking-tighter text-foreground">{stat.value}</p>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-30">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* --- ACTIVITY LEDGER PREVIEW --- */}
      <div className="rounded-[3rem] border border-white/5 bg-card/40 backdrop-blur-3xl overflow-hidden">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
           <h4 className="text-[11px] font-black uppercase tracking-[0.4em] italic text-foreground/40">Recent_Node_Activity</h4>
           <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-primary italic">View_Full_Ledger <ChevronRight className="ml-2 size-3" /></Button>
        </div>
        <div className="divide-y divide-white/5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-10 py-6 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
               <div className="flex items-center gap-5">
                  <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20">
                    <Zap className="size-4 opacity-40" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase italic tracking-tighter">Signal_Propagated // GOLD_NODE</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Epoch_74829 • 12:40:01</p>
                  </div>
               </div>
               <Badge className="bg-white/5 text-foreground/40 border-none font-black italic text-[8px]">+0.00ms</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}