"use client";

import * as React from "react";
import { 
  Users, Zap, Globe, Layers, Activity, 
  Terminal, ShieldAlert, Building2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";

export default function ServicesClientPage({ 
  initialServices = [], 
  isPlatformStaff = false, 
  role = "merchant", 
  realMerchantId, 
  companyName = "PLATFORM_ROOT"
}: any) {
  const { isReady, isMobile, safeArea } = useDeviceContext();

  if (!isReady) return <div className="h-screen bg-black" />;

  return (
    /* 🛡️ FIX: h-full and flex-col are mandatory here to prevent the whole page from scrolling */
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden">
      
      {/* --- 🛡️ FIXED HUD HEADER (Absolute Position) --- */}
      <div 
        className="shrink-0 z-30 bg-black/50 backdrop-blur-xl border-b border-white/5 pb-6 mb-2"
        style={{ paddingTop: isMobile ? `calc(${safeArea.top}px + 1.5rem)` : "1.5rem" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-4">
          <div className="space-y-2 min-w-0"> 
            <div className="flex items-center gap-3 italic opacity-40">
              <Zap className={cn("size-3.5", isPlatformStaff ? "text-amber-500" : "text-primary")} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Fleet_Status</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic truncate">
              Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
            </h1>
          </div>
          <div className="shrink-0 pb-1">
            <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
          </div>
        </div>
      </div>

      {/* --- 🚀 INDEPENDENT SCROLLING VOLUME --- */}
      {/* 🛡️ FIX: flex-1 and overflow-hidden here locks the table to the remaining screen space */}
      <div className="flex-1 min-h-0 w-full relative px-4 pb-10">
        <div className={cn(
          "h-full w-full rounded-[2rem] border overflow-hidden shadow-2xl relative",
          isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
        )}>
          {/* 🛡️ THE ONLY SCROLLABLE AREA */}
          <div className="h-full w-full overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <thead className="bg-white/[0.05] border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
                <tr>
                  <th className="w-[30%] px-8 py-4 text-[9px] font-black uppercase tracking-widest opacity-30">Signal Identity</th>
                  {isPlatformStaff && <th className="w-[18%] px-8 py-4 text-[9px] font-black uppercase tracking-widest text-amber-500/40">Node</th>}
                  <th className="w-[15%] px-8 py-4 text-[9px] font-black uppercase tracking-widest opacity-30">Load</th>
                  <th className="w-[15%] px-8 py-4 text-[9px] font-black uppercase tracking-widest opacity-30">Arch</th>
                  <th className="w-[12%] px-8 py-4 text-[9px] font-black uppercase tracking-widest opacity-30">Status</th>
                  <th className="w-[10%] px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {initialServices.map((service: any) => (
                  <tr key={service.id} className="hover:bg-white/[0.02] border-none group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={cn("size-10 shrink-0 rounded-xl border flex items-center justify-center", isPlatformStaff ? "border-amber-500/20 text-amber-500" : "border-primary/20 text-primary")}>
                          <Activity className="size-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="font-black uppercase italic text-base truncate group-hover:text-primary transition-colors">{service.name}</p>
                          <p className="text-[7px] font-mono opacity-20 truncate">ID: {service.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    {isPlatformStaff && <td className="px-8 py-6 text-[9px] font-black uppercase italic opacity-60 truncate">{service.merchant?.companyName || "ROOT"}</td>}
                    <td className="px-8 py-6 text-xl font-black italic tabular-nums">{(service._count?.subscriptions || 0).toLocaleString()}</td>
                    <td className="px-8 py-6 text-emerald-500/60 font-black italic">{service.tiers?.length || 0} Nodes</td>
                    <td className="px-8 py-6">
                      <div className={cn("inline-flex items-center rounded-lg px-2 py-1 text-[7px] font-black uppercase border", service.isActive ? "text-emerald-500 border-emerald-500/20" : "text-amber-500 border-amber-500/20")}>
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
    </div>
  );
}