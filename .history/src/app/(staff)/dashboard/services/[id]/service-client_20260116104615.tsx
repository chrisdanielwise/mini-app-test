"use client";

import * as React from "react";
import { 
  Users, Zap, Globe, Layers, Activity, 
  Terminal, ShieldAlert, Building2 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & UI Components
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";

/**
 * 🛰️ SERVICE_FLEET_LEDGER (Institutional v16.4.8)
 * Strategy: Sticky HUD Orchestration.
 * Fix: Pinned the Command HUD using 'sticky top-0' and high z-index.
 * Fix: Isolated the table scroll to prevent header cropping.
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

  if (!isReady) return <div className="h-screen bg-black" />;

  return (
    <div 
      className="w-full max-w-full mx-auto flex flex-col min-w-0"
      style={{ 
        height: '100%', 
        paddingLeft: isMobile ? "1rem" : "1.5rem",
        paddingRight: isMobile ? "1rem" : "1.5rem",
        paddingBottom: "2rem"
      }}
    >
      {/* --- 🛡️ FIXED COMMAND HUD HEADER --- */}
      <div 
        className="sticky top-0 z-[40] bg-background/80 backdrop-blur-xl border-b border-white/5 pt-6 pb-6 mb-2"
        style={{ marginTop: isMobile ? `${safeArea.top}px` : "0rem" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 min-w-0">
          <div className="space-y-3 flex-1 min-w-0"> 
            <div className="flex items-center gap-3 italic opacity-40">
              <Zap className={cn("size-3.5 animate-pulse", isPlatformStaff ? "text-amber-500" : "text-primary")} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                {isPlatformStaff ? "Global_Fleet_Oversight" : "Local_Asset_Control"}
              </span>
            </div>
            
            <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-tighter uppercase italic leading-none text-foreground truncate">
              Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 opacity-30 italic">
              <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <Globe className="size-3" /> {companyName}
              </p>
              <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <Terminal className="size-3" /> Identity: {(role || "USER").toUpperCase()}
              </p>
            </div>
          </div>

          <div className="shrink-0 relative z-20 pb-1">
            <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
          </div>
        </div>
      </div>

      {/* --- 🚀 INDEPENDENT SCROLLING FLEET GRID --- */}
      <div className={cn(
        "flex-1 min-h-0 rounded-[2.2rem] border backdrop-blur-3xl shadow-2xl relative z-10 w-full min-w-0 overflow-hidden",
        isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        {/* 🛡️ INTERNAL SCROLL CONTAINER */}
        <div className="overflow-x-auto overflow-y-auto h-full custom-scrollbar w-full">
          <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
            <thead className="bg-white/[0.04] border-b border-white/5 sticky top-0 z-[30] backdrop-blur-md">
              <tr>
                <th className="w-[30%] px-8 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Signal Identity</th>
                {isPlatformStaff && <th className="w-[18%] px-8 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin Node</th>}
                <th className="w-[15%] px-8 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Network Load</th>
                <th className="w-[15%] px-8 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Architecture</th>
                <th className="w-[12%] px-8 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                <th className="w-[10%] px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialServices.map((service: any) => (
                <tr key={service.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={cn("size-10 shrink-0 rounded-xl border flex items-center justify-center", isPlatformStaff ? "text-amber-500 border-amber-500/20" : "text-primary border-primary/20")}>
                        <Activity className="size-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-black text-foreground uppercase italic tracking-tighter text-base leading-none truncate group-hover:text-primary transition-colors">
                          {service.name}
                        </p>
                        <p className="text-[7px] font-mono text-muted-foreground/20 mt-1">ID: {service.id.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  {isPlatformStaff && (
                    <td className="px-8 py-6 text-[9px] font-black uppercase italic truncate text-amber-500/60">
                      {service.merchant?.companyName || "PLATFORM"}
                    </td>
                  )}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Users className="size-3.5 text-muted-foreground/30" />
                       <span className="text-xl font-black italic text-foreground leading-none tabular-nums">
                         {(service._count?.subscriptions || 0).toLocaleString()}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-emerald-500/60 font-black italic text-lg leading-none">
                    {service.tiers?.length || 0} Nodes
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn("inline-flex items-center rounded-lg px-2.5 py-1 text-[7px] font-black uppercase border", service.isActive ? "text-emerald-500 border-emerald-500/20" : "text-amber-500 border-amber-500/20")}>
                      <div className={cn("size-1 rounded-full mr-1.5", service.isActive ? "bg-emerald-500" : "bg-amber-500")} />
                      {service.isActive ? "Online" : "Paused"}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <ServiceActionWrapper serviceId={service.id} compact={true} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}