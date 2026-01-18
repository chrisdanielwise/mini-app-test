"use client";

import * as React from "react";
import { 
  Users, Zap, Globe, Layers, Activity, 
  Terminal, Building2, Cpu, ChevronLeft, ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";

/**
 * 🛰️ TACTICAL_SLIM_LEDGER (v16.8.5 - FINAL RESTORE)
 * Strategy: High-Density Etched Grid + Baseline Pagination.
 * Fix: Forced 'border-r' for guaranteed white vertical etched lines.
 * Fix: Added Safe-Area bottom spacer to prevent BottomNav overlap.
 */
export default function ServicesClientPage({ 
  initialServices = [], 
  isPlatformStaff = false, 
  role = "merchant", 
  realMerchantId, 
  companyName = "PLATFORM_ROOT"
}: any) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  if (!isReady) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
      <Cpu className="size-8 text-primary/20 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Establishing_Fleet_Link...</p>
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col min-w-0 overflow-hidden bg-black text-foreground">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Horizon --- */}
      <div className="shrink-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 pb-4 pt-2">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 w-full px-6">
          <div className="flex flex-col gap-2 min-w-fit flex-1">
            <div className="flex items-center gap-2">
              <Zap className={cn(
                "h-3 w-3 shrink-0 animate-pulse transition-colors", 
                isPlatformStaff ? "text-amber-500 fill-amber-500" : "text-primary fill-primary"
              )} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.4em] italic opacity-60",
                isPlatformStaff ? "text-amber-500" : "text-primary"
              )}>
                {isPlatformStaff ? "Global Fleet Oversight" : "Local Asset Control"}
              </span>
            </div>

            <div className="space-y-0.5">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none">
                Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
              </h1>
              <div className="flex items-center gap-x-4 pt-1 opacity-20 italic">
                <p className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Globe className="h-3 w-3" /> Node: <span className="text-foreground uppercase">{companyName}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="shrink-0 scale-90 origin-bottom-right pb-1">
            <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME --- */}
      <div className="flex-1 min-h-0 w-full relative p-3 flex flex-col">
        <div className={cn(
          "flex-1 min-h-0 w-full rounded-[1.5rem] border backdrop-blur-3xl bg-card/40 flex flex-col overflow-hidden shadow-2xl",
          isPlatformStaff ? "border-amber-500/10" : "border-white/5"
        )}>
          {/* 🌊 THE SCROLL ENGINE */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar overscroll-contain">
            <table className="w-full text-left border-collapse min-w-[900px] table-fixed">
              <thead className="bg-white/[0.04] border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
                <tr className="divide-x divide-white/5">
                  <th className="w-[35%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">Signal_Identity</th>
                  {isPlatformStaff && <th className="w-[15%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-amber-500/30 italic">Node</th>}
                  <th className="w-[12%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">Load</th>
                  <th className="w-[12%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">Arch</th>
                  <th className="w-[15%] px-6 py-3 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">Status</th>
                  <th className="w-[11%] px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {initialServices.map((service: any) => (
                  <tr key={service.id} className="hover:bg-white/[0.01] transition-colors group">
                    {/* 🏁 WHITE ETCHED LINES: Forced via border-r */}
                    <td className="px-6 py-3.5 border-r border-white/5">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={cn(
                          "size-9 shrink-0 rounded-lg flex items-center justify-center border",
                          isPlatformStaff ? "border-amber-500/20 text-amber-500" : "border-primary/20 text-primary"
                        )}>
                          <Activity className="size-4" />
                        </div>
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-sm truncate">{service.name}</p>
                          <p className="text-[6px] font-mono text-muted-foreground/20 mt-0.5 truncate">ID: {service.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    {isPlatformStaff && (
                      <td className="px-6 py-3.5 border-r border-white/5">
                        <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[9px] truncate">
                          <Building2 className="size-3 shrink-0" />
                          <span className="truncate">{service.merchant?.companyName || "ROOT"}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-3.5 border-r border-white/5">
                      <div className="flex items-center gap-2">
                        <Users className="size-3 text-muted-foreground/20" />
                        <span className="text-lg font-black italic tabular-nums">{(service._count?.subscriptions || 0).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 border-r border-white/5">
                      <span className="text-md font-black italic text-emerald-500/40">{service.tiers?.length || 0}N</span>
                    </td>
                    <td className="px-6 py-3.5 border-r border-white/5">
                      <div className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[6px] font-black uppercase border tracking-widest",
                        service.isActive ? "text-emerald-500 border-emerald-500/20" : "text-amber-500 border-amber-500/20"
                      )}>
                        <div className={cn("size-1 rounded-full mr-1", service.isActive ? "bg-emerald-500" : "bg-amber-500")} />
                        {service.isActive ? "Online" : "Paused"}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <ServiceActionWrapper serviceId={service.id} compact={true} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- 🕹️ BASELINE PAGINATION HUD --- */}
          <div className="shrink-0 h-14 border-t border-white/10 bg-zinc-950 flex items-center justify-between px-6 z-10 relative">
            <div className="flex items-center gap-6">
              <div className="flex flex-col leading-none">
                <span className="text-[6px] font-black uppercase tracking-[0.3em] opacity-20 italic">Total_Assets</span>
                <span className="text-[10px] font-black italic tracking-tighter mt-1">{initialServices.length} Nodes</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-500/60 italic">Stream_OK</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3">
                <span className="text-[9px] font-black italic text-foreground">01</span>
                <span className="text-[7px] font-black opacity-20">/</span>
                <span className="text-[7px] font-black opacity-20 uppercase tracking-widest italic">Page</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => impact("light")} className="size-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 active:scale-90 transition-all">
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </button>
                <button onClick={() => impact("light")} className="size-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 active:scale-90 transition-all">
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🌫️ MOBILE CLEARANCE: Prevents BottomNav from hiding the Pagination Bar */}
        {isMobile && (
          <div 
            style={{ height: `calc(${safeArea.bottom}px + 5.5rem)` }} 
            className="shrink-0 w-full" 
          />
        )}
      </div>
    </div>
  );
}