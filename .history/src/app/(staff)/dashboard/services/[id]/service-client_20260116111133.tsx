"use client";

import * as React from "react";
import { 
  Users, Zap, Globe, Layers, Activity, 
  Terminal, Building2 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & UI Components
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
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();

  if (!isReady) return <div className="h-screen bg-black" />;

  return (
    <div 
      className="w-full h-full flex flex-col max-w-[1600px] mx-auto min-w-0"
      style={{ 
        paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0rem",
        paddingBottom: "1.5rem",
        paddingLeft: isMobile ? "0.75rem" : "1.5rem",
        paddingRight: isMobile ? "0.75rem" : "1.5rem"
      }}
    >
      {/* --- 🛡️ MINIMALIST COMMAND HUD --- */}
      <div className="shrink-0 flex items-center justify-between border-b border-white/5 pb-3 mb-2 min-w-0">
        <div className="flex items-center gap-4 min-w-0">
           <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none text-foreground truncate shrink-0">
            Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
          </h1>
          <div className="hidden md:flex items-center gap-4 opacity-20 italic border-l border-white/10 pl-4">
            <p className="text-[7px] font-black uppercase tracking-[0.3em] flex items-center gap-1.5">
              <Globe className="size-2.5" /> Node: {companyName}
            </p>
            <p className="text-[7px] font-black uppercase tracking-[0.3em] flex items-center gap-1.5">
              <Terminal className="size-2.5" /> ID: {role}
            </p>
          </div>
        </div>

        <div className="shrink-0 scale-90">
          <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- 🚀 TERMINAL-GRADE DATA GRID --- */}
      <div className={cn(
        "flex-1 min-h-0 rounded-2xl border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10 w-full min-w-0 flex flex-col",
        isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        <div className="flex-1 overflow-auto scrollbar-hide w-full">
          <table className="w-full text-left border-collapse min-w-[900px] table-fixed">
            <thead className="bg-white/[0.03] border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
              <tr className="divide-x divide-white/5">
                {/* 🛡️ MINIMALIST Header: Reduced py-5 to py-2 */}
                <th className="w-[35%] px-4 py-2 text-[7px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Identity_Signal</th>
                {isPlatformStaff && <th className="w-[15%] px-4 py-2 text-[7px] font-black uppercase tracking-[0.5em] text-amber-500/30 italic">Node</th>}
                <th className="w-[12%] px-4 py-2 text-[7px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Load</th>
                <th className="w-[12%] px-4 py-2 text-[7px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Arch</th>
                <th className="w-[15%] px-4 py-2 text-[7px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 italic">Status</th>
                <th className="w-[8%] px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialServices.map((service: any) => (
                <tr 
                  key={service.id} 
                  onMouseEnter={() => impact("light")}
                  className="hover:bg-white/[0.02] transition-colors border-none group"
                >
                  {/* 🛡️ TERMINAL Rows: Reduced py-8 to py-2.5 */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <Activity className={cn("size-3.5 shrink-0", isPlatformStaff ? "text-amber-500" : "text-primary")} />
                      <div className="flex flex-col min-w-0 leading-tight">
                        <p className="font-black text-foreground uppercase italic tracking-tighter text-[11px] truncate leading-none">
                          {service.name}
                        </p>
                        <p className="text-[6px] font-mono text-muted-foreground/20 uppercase tracking-tighter mt-0.5">
                          ID: {service.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>

                  {isPlatformStaff && (
                    <td className="px-4 py-2.5 text-[8px] font-black uppercase italic opacity-40 truncate">
                      {service.merchant?.companyName || "ROOT"}
                    </td>
                  )}

                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Users className="size-3 text-muted-foreground/20" />
                      <span className="text-sm font-black italic tabular-nums leading-none">
                        {(service._count?.subscriptions || 0).toLocaleString()}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-2.5">
                    <span className="text-xs font-black italic text-emerald-500/50 leading-none">
                      {service.tiers?.length || 0}N
                    </span>
                  </td>

                  <td className="px-4 py-2.5">
                    <div className={cn(
                      "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[6px] font-black uppercase border tracking-widest",
                      service.isActive ? "text-emerald-500 border-emerald-500/20" : "text-amber-500 border-amber-500/20"
                    )}>
                      <div className={cn("size-1 rounded-full mr-1", service.isActive ? "bg-emerald-500" : "bg-amber-500")} />
                      {service.isActive ? "Online" : "Paused"}
                    </div>
                  </td>

                  <td className="px-4 py-2.5 text-right">
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