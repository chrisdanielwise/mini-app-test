"use client";

import * as React from "react";
import { 
  Users, Zap, Globe, Layers, Activity, 
  Terminal, ShieldAlert, Building2,
  ArrowUpRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";

/**
 * 🛰️ SERVICE_FLEET_CLIENT (v16.3.5)
 * Fix: Prop evaluation safety for 'role.toUpperCase'.
 * Fix: Horizontal overflow guards for long service names.
 */
export default function ServicesClientPage({ 
  initialServices = [], 
  isPlatformStaff = false, 
  role = "merchant", // 🛡️ Default value prevents evaluation crash
  realMerchantId, 
  companyName = "PLATFORM_ROOT" 
}: any) {
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea, viewportHeight } = useDeviceContext();

  // 🛡️ Prevent layout snapping before telemetry ingress
  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000",
        viewportHeight < 700 ? "space-y-6" : "space-y-10 md:space-y-14"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0px",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "4rem",
        paddingLeft: isMobile ? "1.25rem" : "2rem",
        paddingRight: isMobile ? "1.25rem" : "2rem"
      }}
    >
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8 relative group">
        <div className="space-y-4 flex-1 min-w-0">
          <div className="flex items-center gap-3 italic opacity-40">
            <Zap className={cn(
              "size-3.5 animate-pulse", 
              isPlatformStaff ? "text-amber-500 fill-amber-500" : "text-primary fill-primary"
            )} />
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.4em] leading-none",
              isPlatformStaff ? "text-amber-500" : "text-primary"
            )}>
              {isPlatformStaff ? "Global_Fleet_Oversight" : "Local_Asset_Control"}
            </span>
          </div>
          
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground truncate max-w-full">
            Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 opacity-30 italic">
            <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Globe className="size-3.5" />
              Node: <span className="text-foreground">{companyName}</span>
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Terminal className="size-3.5" />
              {/* 🛡️ Evaluates safely even if role is transiently null */}
              Identity: <span className="text-foreground">{(role || "USER").toUpperCase()}</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 relative z-20">
          <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- FLEET DATA GRID --- */}
      <div className={cn(
        "rounded-[2.8rem] md:rounded-[3rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10",
        isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Signal Identity</th>
                {isPlatformStaff && <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin Node</th>}
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Network Load</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Architecture</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialServices.length === 0 ? (
                <tr>
                  <td colSpan={isPlatformStaff ? 6 : 5} className="py-40 text-center opacity-10">
                    <div className="flex flex-col items-center gap-8">
                      <ShieldAlert className="size-16 animate-pulse" />
                      <p className="text-[12px] font-black uppercase tracking-[0.5em] italic">No_Active_Nodes_Detected</p>
                      <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
                    </div>
                  </td>
                </tr>
              ) : (
                initialServices.map((service: any) => (
                  <tr 
                    key={service.id} 
                    onMouseEnter={() => impact("light")}
                    className="hover:bg-white/[0.02] transition-all duration-500 group border-none"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6 min-w-0">
                        <div className={cn(
                          "size-12 md:size-14 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12",
                          isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          <Activity className="size-6" />
                        </div>
                        {/* 🛡️ FIX: min-w-0 and max-width + truncate to fix horizontal overflow */}
                        <div className="flex flex-col min-w-0 max-w-[280px]">
                          <p className="font-black text-foreground uppercase italic tracking-tighter text-lg leading-none group-hover:text-primary transition-colors truncate">
                            {service.name}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[8px] font-black uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5 tracking-widest text-muted-foreground/60">
                              {service.categoryTag || "GENERAL"}
                            </span>
                            <p className="text-[8px] font-mono font-bold text-muted-foreground/20 uppercase">
                              ID: {service.id.slice(0, 10).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    {isPlatformStaff && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest leading-none truncate max-w-[150px]">
                          <Building2 className="size-4 shrink-0" />
                          {service.merchant?.companyName || "PLATFORM"}
                        </div>
                      </td>
                    )}

                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-muted-foreground/30" />
                          <span className="text-xl font-black italic tracking-tighter text-foreground leading-none tabular-nums">
                            {(service._count?.subscriptions || 0).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-muted-foreground/20 tracking-widest italic ml-6">Subscribers</span>
                      </div>
                    </td>

                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-emerald-500/60">
                          <Layers className="size-4 opacity-40" />
                          <span className="text-lg font-black italic tracking-tighter tabular-nums leading-none">
                            {service.tiers?.length || 0} Nodes
                          </span>
                        </div>
                        <span className="text-[8px] font-black uppercase text-muted-foreground/20 tracking-widest italic ml-6">Tier_Map</span>
                      </div>
                    </td>

                    <td className="px-10 py-8">
                      <div className={cn(
                        "inline-flex items-center rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm italic",
                        service.isActive 
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                      )}>
                        <div className={cn("size-1.5 rounded-full mr-2 animate-pulse", service.isActive ? "bg-emerald-500" : "bg-amber-500")} />
                        {service.isActive ? "Online" : "Paused"}
                      </div>
                    </td>

                    <td className="px-10 py-8 text-right">
                      <ServiceActionWrapper serviceId={service.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div className="flex items-center justify-center gap-5 opacity-10 py-12">
        <Terminal className="size-4" />
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-foreground italic">
           Fleet identity verification: {isPlatformStaff ? "ROOT_MASTER" : "NODE_LOCAL"} // Sync_Ok
        </p>
      </div>
    </div>
  );
}