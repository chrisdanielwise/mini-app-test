"use client";

import * as React from "react";
import { Users, Zap, Globe, Layers, Activity, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";

/**
 * 🛰️ TACTICAL_SLIM_LEDGER (Institutional v16.6.2)
 * Strategy: Vertical Compression & Minimalist Alignment.
 * Fix: Forced 'table-fixed' and reduced py-2 for maximum density.
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
      className="w-full h-full flex flex-col min-w-0 bg-black"
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0.5rem",
        paddingLeft: "1rem",
        paddingRight: "1rem"
      }}
    >
      {/* --- 🛡️ MINIMALIST HUD --- */}
      {/* <div className="shrink-0 flex items-center justify-between border-b border-white/5 pb-2 mb-2">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-black tracking-tighter uppercase italic text-foreground">
            Service <span className={isPlatformStaff ? "text-amber-500" : "text-primary"}>Assets</span>
          </h1>
          <div className="hidden md:flex items-center gap-3 opacity-20 border-l border-white/10 pl-3">
            <span className="text-[7px] font-black uppercase tracking-widest flex items-center gap-1">
              <Globe className="size-2.5" /> {companyName}
            </span>
          </div>
        </div>
        <div className="scale-75 origin-right">
          <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div> */}

      {/* --- 🚀 FIXED MINIMALIST DATA GRID --- */}
      <div className="flex-1 min-h-0 w-full rounded-xl border border-white/5 bg-card/40 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto scrollbar-hide">
          {/* 🛡️ table-fixed + min-w-0 stops the bogus stretching */}
          <table className="w-full text-left border-collapse min-w-[850px] table-fixed">
            <thead className="bg-white/[0.03] sticky top-0 z-20 backdrop-blur-md border-b border-white/5">
              <tr>
                {/* 🛡️ TABLE HEADER: Located here. Reduced to py-2 for minimal footprint */}
                <th className="w-[40%] px-4 py-2 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Signal_Identity</th>
                <th className="w-[15%] px-4 py-2 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Load</th>
                <th className="w-[15%] px-4 py-2 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Arch</th>
                <th className="w-[20%] px-4 py-2 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Status</th>
                <th className="w-[10%] px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialServices.map((service: any) => (
                <tr key={service.id} className="hover:bg-white/[0.01] transition-colors border-none group">
                  {/* 🛡️ TACTICAL ROWS: Reduced py-3 for high-density rendering */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Activity className={cn("size-3.5 shrink-0", isPlatformStaff ? "text-amber-500" : "text-primary")} />
                      <div className="flex flex-col min-w-0">
                        <p className="font-black text-foreground uppercase italic tracking-tighter text-[11px] truncate leading-none">
                          {service.name}
                        </p>
                        <p className="text-[6px] font-mono opacity-20 uppercase mt-0.5">ID: {service.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Users className="size-3 opacity-20" />
                      <span className="text-xs font-black italic tabular-nums">{(service._count?.subscriptions || 0)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-black italic text-emerald-500/40">{service.tiers?.length || 0}N</td>
                  <td className="px-4 py-3">
                    <div className={cn(
                      "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[6px] font-black uppercase border tracking-tighter",
                      service.isActive ? "text-emerald-500 border-emerald-500/10" : "text-amber-500 border-amber-500/10"
                    )}>
                      <div className={cn("size-1 rounded-full mr-1", service.isActive ? "bg-emerald-500" : "bg-amber-500")} />
                      {service.isActive ? "Online" : "Paused"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
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