"use client";

import * as React from "react";
import { 
  Users, Zap, Globe, Layers, Activity, 
  Terminal, Building2, Cpu 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";

/**
 * 🛰️ TACTICAL_SLIM_LEDGER (Institutional v16.6.2 - APEX RESTORED)
 * Strategy: Stationary HUD HUD + Independent Scroll Engine.
 * Fix: Removed 'h-screen' to prevent double-scroll traps.
 * Fix: Re-implemented 'absolute inset-0' to fill the Server Layout slot perfectly.
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

  // 🛡️ HYDRATION_SHIELD: Hardware-Synced loading state
  if (!isReady) return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black gap-4">
      <Cpu className="size-8 text-primary/20 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Establishing_Fleet_Link...</p>
    </div>
  );

  return (
    /* 🏛️ PRIMARY_CHASSIS: Absolute fill of the dashboard reservoir */
    <div className="absolute inset-0 flex flex-col min-w-0 overflow-hidden bg-black text-foreground  outline-8 outline-red-800">
      
      {/* --- 🛡️ FIXED COMMAND HUD: Stationary Horizon (shrink-0) --- */}
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
                  <Globe className="h-3 w-3" /> Node: <span className="text-foreground">{companyName}</span>
                </p>
                <p className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Terminal className="h-3 w-3" /> Protocol: <span className="text-foreground uppercase">{role}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="shrink-0 scale-90 origin-bottom-right pb-1">
            <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
          </div>
        </div>
      </div>

      {/* --- 🚀 INTERNAL SCROLL VOLUME: flex-1 + min-h-0 Captures Table Scroll --- */}
      <div className="flex-1 min-h-0 w-full relative p-3 pb-6">
        <div className={cn(
          "h-full w-full rounded-[1.5rem] border backdrop-blur-3xl bg-card/40 flex flex-col overflow-hidden",
          isPlatformStaff ? "border-amber-500/10" : "border-white/5"
        )}>
          {/* 🌊 THE SCROLL ENGINE: Standard internal scroll reservoir */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar overscroll-contain">
            <table className="w-full text-left border-collapse min-w-[900px] table-fixed">
              {/* 🏁 STICKY HEAD: Pins columns to the top of the reservoir */}
              <thead className="bg-white/[0.04] border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
                <tr>
                  <th className="w-[35%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">Signal_Identity</th>
                  {isPlatformStaff && <th className="w-[15%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-amber-500/30 italic">Node</th>}
                  <th className="w-[12%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">Load</th>
                  <th className="w-[12%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">Arch</th>
                  <th className="w-[15%] px-6 py-2.5 text-[7.5px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">Status</th>
                  <th className="w-[11%] px-6 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {initialServices.map((service: any) => (
                  <tr key={service.id} className="hover:bg-white/[0.01] transition-colors border-none group">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={cn(
                          "size-9 shrink-0 rounded-lg flex items-center justify-center border transition-transform group-hover:rotate-12",
                          isPlatformStaff ? "border-amber-500/20 text-amber-500" : "border-primary/20 text-primary"
                        )}>
                          <Activity className="size-4" />
                        </div>
                        <div className="flex flex-col min-w-0 leading-tight">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-sm truncate group-hover:text-primary transition-colors">
                            {service.name}
                          </p>
                          <p className="text-[6px] font-mono text-muted-foreground/20 mt-0.5 truncate uppercase">
                            ID: {service.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    {isPlatformStaff && (
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[9px] truncate">
                          <Building2 className="size-3 shrink-0" />
                          <span className="truncate">{service.merchant?.companyName || "ROOT"}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <Users className="size-3 text-muted-foreground/20" />
                        <span className="text-lg font-black italic text-foreground leading-none tabular-nums">
                          {(service._count?.subscriptions || 0).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-md font-black italic text-emerald-500/40">
                        {service.tiers?.length || 0}N
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
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
        </div>
      </div>
    </div>
  );
}