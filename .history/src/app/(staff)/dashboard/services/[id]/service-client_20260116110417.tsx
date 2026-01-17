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
      // 🛡️ CRITICAL: Added min-w-0 and changed to w-full. This stops the "greedy" 
      // table from expanding the parent container beyond the screen edge.
      className="w-full max-w-[1600px] mx-auto space-y-6 min-w-0 animate-in fade-in duration-700"
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "0rem",
        paddingBottom: "4rem",
        paddingLeft: isMobile ? "1rem" : "2rem",
        paddingRight: isMobile ? "1rem" : "2rem"
      }}
    >
      {/* --- COMMAND HUD HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/5 pb-6 min-w-0">
        <div className="space-y-3 flex-1 min-w-0"> 
          <div className="flex items-center gap-3 italic opacity-40">
            <Zap className={cn(
              "size-3.5 animate-pulse", 
              isPlatformStaff ? "text-amber-500 fill-amber-500" : "text-primary fill-primary"
            )} />
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">
              {isPlatformStaff ? "Global_Fleet_Oversight" : "Local_Asset_Control"}
            </span>
          </div>
          
          {/* 🛡️ FIX: Added 'truncate' to the title. If this isn't here, a long title 
              will physically push the right side of your dashboard off-screen. */}
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground truncate max-w-full">
            Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 opacity-30 italic">
            <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Globe className="size-3.5" />
              Node: <span className="text-foreground truncate max-w-[150px]">{companyName}</span>
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Terminal className="size-3.5" />
              Identity: <span className="text-foreground uppercase truncate max-w-[100px]">{role}</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 relative z-20 pb-1">
          <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- FLEET DATA GRID --- */}
      {/* 🛡️ FIX: Wrapper with min-w-0 and overflow-hidden is mandatory for table fitting. */}
      <div className={cn(
        "rounded-[2.2rem] border backdrop-blur-3xl overflow-hidden shadow-2xl relative z-10 w-full min-w-0",
        isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/40 border-white/5"
      )}>
        <div className="overflow-x-auto scrollbar-hide w-full">
          {/* 🛡️ CRITICAL FIX: 'table-fixed' forces columns to respect % widths.
              'min-w-[1000px]' ensures it doesn't get too squashed on mobile. */}
          <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="w-[30%] px-8 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Signal Identity</th>
                {isPlatformStaff && <th className="w-[18%] px-8 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin Node</th>}
                <th className="w-[15%] px-8 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Network Load</th>
                <th className="w-[15%] px-8 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Architecture</th>
                <th className="w-[12%] px-8 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                <th className="w-[10%] px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialServices.map((service: any) => (
                <tr key={service.id} className="hover:bg-white/[0.02] transition-all duration-300 group border-none">
                  <td className="px-8 py-6">
                    {/* 🛡️ FIX: Added min-w-0 to flex child so 'truncate' works on names. */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={cn(
                        "size-10 shrink-0 rounded-xl flex items-center justify-center border",
                        isPlatformStaff ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                      )}>
                        <Activity className="size-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-black text-foreground uppercase italic tracking-tighter text-base leading-none truncate">
                          {service.name}
                        </p>
                        <p className="text-[7px] font-mono text-muted-foreground/20 mt-1 truncate">
                          ID: {service.id.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>

                  {isPlatformStaff && (
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-amber-500/60 font-black uppercase italic text-[9px] truncate">
                        <Building2 className="size-3.5 shrink-0" />
                        {service.merchant?.companyName || "PLATFORM"}
                      </div>
                    </td>
                  )}

                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Users className="size-3.5 text-muted-foreground/30" />
                        <span className="text-xl font-black italic text-foreground leading-none tabular-nums">
                          {(service._count?.subscriptions || 0).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[7px] font-black uppercase text-muted-foreground/20 italic ml-5">Subscribers</span>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 text-emerald-500/60">
                        <Layers className="size-3.5 opacity-40" />
                        <span className="text-lg font-black italic tabular-nums leading-none">
                          {service.tiers?.length || 0} Nodes
                        </span>
                      </div>
                      <span className="text-[7px] font-black uppercase text-muted-foreground/20 italic ml-5">Tier_Map</span>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center rounded-lg px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.2em] border",
                      service.isActive ? "text-emerald-500 border-emerald-500/20" : "text-amber-500 border-amber-500/20"
                    )}>
                      <div className={cn("size-1 rounded-full mr-1.5", service.isActive ? "bg-emerald-500" : "bg-amber-500")} />
                      {service.isActive ? "Online" : "Paused"}
                    </div>
                  </td>

                  <td className="px-8 py-6 text-right">
                    <ServiceActionWrapper serviceId={service.id} />
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