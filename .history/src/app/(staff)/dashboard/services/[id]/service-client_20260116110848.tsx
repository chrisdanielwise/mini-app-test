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
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className="w-full h-full flex flex-col max-w-[1600px] mx-auto min-w-0 animate-in fade-in duration-700"
      style={{ 
        paddingTop: isMobile ? `calc(${safeArea.top}px + 0.5rem)` : "0.5rem",
        paddingBottom: "2rem",
        paddingLeft: isMobile ? "1rem" : "2rem",
        paddingRight: isMobile ? "1rem" : "2rem"
      }}
    >
      {/* --- 🛡️ COMPRESSED COMMAND HUD --- */}
      <div className="shrink-0 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/5 pb-4 mb-2 min-w-0">
        <div className="space-y-1 flex-1 min-w-0"> 
          <div className="flex items-center gap-2.5 italic opacity-30">
            <Zap className={cn(
              "size-3 animate-pulse", 
              isPlatformStaff ? "text-amber-500 fill-amber-500" : "text-primary fill-primary"
            )} />
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">
              {isPlatformStaff ? "Global_Fleet_Oversight" : "Local_Asset_Control"}
            </span>
          </div>
          
          <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-black tracking-tighter uppercase italic leading-none text-foreground truncate max-w-full">
            Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 opacity-20 italic">
            <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <Globe className="size-3" />
              Node: <span className="text-foreground truncate max-w-[120px]">{companyName}</span>
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <Terminal className="size-3" />
              Identity: <span className="text-foreground uppercase truncate max-w-[80px]">{role}</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 relative z-20 pb-0.5">
          <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- 🚀 HIGH-DENSITY FLEET DATA GRID --- */}
      <div className={cn(
        "flex-1 min-h-0 rounded-[1.8rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10 w-full min-w-0 flex flex-col",
        isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        <div className="flex-1 overflow-auto scrollbar-hide w-full">
          <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
            <thead className="bg-white/[0.04] border-b border-white/5 sticky top-0 z-20 backdrop-blur-md">
              <tr>
                <th className="w-[30%] px-6 py-3 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Signal Identity</th>
                {isPlatformStaff && <th className="w-[18%] px-6 py-3 text-[8px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin Node</th>}
                <th className="w-[15%] px-6 py-3 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Network Load</th>
                <th className="w-[15%] px-6 py-3 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Architecture</th>
                <th className="w-[12%] px-6 py-3 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                <th className="w-[10%] px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialServices.map((service: any) => (
                <tr 
                  key={service.id} 
                  onMouseEnter={() => impact("light")}
                  className="hover:bg-white/[0.02] transition-all duration-300 group border-none"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "size-9 shrink-0 rounded-lg flex items-center justify-center border transition-transform group-hover:rotate-12",
                        isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                      )}>
                        <Activity className="size-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-black text-foreground uppercase italic tracking-tighter text-sm md:text-md leading-none group-hover:text-primary transition-colors truncate">
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
                        {service.merchant?.companyName || "PLATFORM"}
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-3.5">
                    <div className="flex flex-col gap-0">
                      <div className="flex items-center gap-2">
                        <Users className="size-3 text-muted-foreground/30" />
                        <span className="text-md font-black italic text-foreground leading-none tabular-nums">
                          {(service._count?.subscriptions || 0).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[6px] font-black uppercase text-muted-foreground/20 italic ml-5">Subs</span>
                    </div>
                  </td>

                  <td className="px-6 py-3.5">
                    <div className="flex flex-col gap-0">
                      <div className="flex items-center gap-2 text-emerald-500/60">
                        <Layers className="size-3 opacity-40" />
                        <span className="text-md font-black italic tabular-nums leading-none">
                          {service.tiers?.length || 0} Nodes
                        </span>
                      </div>
                      <span className="text-[6px] font-black uppercase text-muted-foreground/20 italic ml-5">Tiers</span>
                    </div>
                  </td>

                  <td className="px-6 py-3.5">
                    <div className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-[6px] font-black uppercase tracking-[0.2em] border shadow-sm italic",
                      service.isActive ? "text-emerald-500 border-emerald-500/20" : "text-amber-500 border-amber-500/20"
                    )}>
                      <div className={cn("size-1 rounded-full mr-1.5", service.isActive ? "bg-emerald-500" : "bg-amber-500")} />
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
  );
}