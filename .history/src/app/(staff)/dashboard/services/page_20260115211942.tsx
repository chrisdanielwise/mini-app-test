"use client";

import * as React from "react";
import { 
  Users, Zap, Globe, Layers, Activity, Terminal, 
  ShieldAlert, Building2, Cpu, CheckCircle2, 
  Plus, Search, Filter, MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateServiceModal } from "@/components/dashboard/create-service-modal";
import { ServiceActionWrapper } from "@/components/dashboard/service-action-wrapper";

/**
 * 🌊 SERVICE_FLEET_COMMAND (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Ingress | Obsidian-OLED Depth.
 * Logic: morphology-aware safe-area clamping with RBAC-Aware Radiance.
 */
export default function ServicesPage({ services, session }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { 
    isReady, 
    isMobile, 
    screenSize, 
    safeArea 
  } = useDeviceContext();

  // 🛡️ IDENTITY RESOLUTION
  const isPlatformStaff = flavor === "AMBER";
  const realMerchantId = session?.merchantId;

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-screen bg-background animate-pulse" />;

  return (
    <div 
      className={cn(
        "max-w-[1600px] mx-auto space-y-10 md:space-y-16 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.5rem" : "0px",
        paddingRight: isMobile ? "1.5rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <div className="flex items-center gap-4 italic opacity-40">
            <Zap className={cn(
              "size-4 transition-all duration-700",
              isPlatformStaff ? "text-amber-500 animate-pulse" : "text-primary"
            )} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">
                {isPlatformStaff ? "Global_Fleet_Oversight" : "Local_Asset_Control"}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest mt-1 opacity-50">v16.31_STABLE</span>
            </div>
          </div>
          
          <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
            Service <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Assets</span>
          </h1>
          
          <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/30 italic">
            <Globe className="size-3.5" />
            <span className="tracking-[0.2em]">NODE: {session.config?.companyName || "PLATFORM_ROOT"}</span>
            <div className="h-px w-8 bg-white/5" />
            <span className="tracking-[0.1em]">{services.length} Nodes Hydrated</span>
          </div>
        </div>

        {/* --- TACTICAL COMMAND HUB --- */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto shrink-0 relative z-20">
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
            <Input 
              onFocus={() => impact("light")}
              placeholder="QUERY_ASSET_NAME..."
              className="h-14 pl-12 pr-6 rounded-2xl border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest italic focus:ring-primary/10 transition-all"
            />
          </div>
          <CreateServiceModal merchantId={realMerchantId || "PLATFORM_ROOT"} />
        </div>
      </div>

      {/* --- DATA GRID NODE: Fluid Asset Ledger --- */}
      <div className={cn(
        "rounded-[3rem] border border-white/5 bg-card/30 backdrop-blur-3xl overflow-hidden shadow-apex relative z-10",
        isPlatformStaff ? "bg-amber-500/[0.01] border-amber-500/10" : ""
      )}>
        {isMobile ? (
          /* 📱 MOBILE PROTOCOL: Kinetic Identity Cards */
          <div className="p-6 space-y-6">
            {services.length === 0 ? <NoData /> : services.map((service: any, i: number) => (
              <ServiceCard key={service.id} service={service} isPlatformStaff={isPlatformStaff} index={i} onClick={selectionChange} />
            ))}
          </div>
        ) : (
          /* 🖥️ DESKTOP PROTOCOL: Institutional Oversight Ledger */
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Signal_Identity</th>
                  {isPlatformStaff && <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">Origin</th>}
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Network_Load</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Architecture</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Status</th>
                  <th className="px-10 py-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services.length === 0 ? <tr><td colSpan={6}><NoData /></td></tr> : services.map((service: any, index: number) => (
                  <tr 
                    key={service.id} 
                    onClick={() => selectionChange()}
                    className="hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer animate-in fade-in slide-in-from-bottom-4" 
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "size-12 shrink-0 rounded-2xl flex items-center justify-center border shadow-inner transition-all duration-700 group-hover:rotate-12 group-hover:scale-110",
                          isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                        )}>
                          <Activity className="size-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">{service.name}</span>
                          <div className="flex items-center gap-3 mt-2">
                             <span className="text-[7px] font-black uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5 tracking-widest text-muted-foreground/60">{service.categoryTag || "GENERAL"}</span>
                             <span className="text-[8px] font-mono text-muted-foreground/20 uppercase tracking-widest">ID_{service.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    {isPlatformStaff && (
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3 text-amber-500/60 font-black uppercase italic text-[11px] tracking-widest">
                          <Building2 className="size-4" />
                          {service.merchant?.companyName || "PLATFORM"}
                        </div>
                      </td>
                    )}
                    <td className="px-10 py-8">
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <Users className="size-4 text-muted-foreground/40" />
                            <span className="text-xl font-black italic tracking-tighter text-foreground tabular-nums">{(service._count?.subscriptions || 0).toLocaleString()}</span>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/10">Active_Connections</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 text-emerald-500/80">
                          <Layers className="size-4 opacity-40" />
                          <span className="text-lg font-black italic tracking-tighter tabular-nums">{service.tiers?.length || 0} Layers</span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/10">Architecture_Nodes</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <StatusBadge isActive={service.isActive} />
                    </td>
                    <td className="px-10 py-8 text-right">
                      <ServiceActionWrapper serviceId={service.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER SIGNAL */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <div className="flex items-center gap-4">
           <Cpu className="size-4 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Fleet_Identity_Verified: {isPlatformStaff ? "ROOT_MASTER" : "NODE_LOCAL"} // Sync_Ok
           </p>
        </div>
        {!isMobile && <div className="size-1 rounded-full bg-foreground" />}
        <span className="text-[8px] font-mono tabular-nums opacity-60">[v16.31_STABLE]</span>
      </div>
    </div>
  );
}

/** 📱 MOBILE ATOMIC: Service Fleet Card */
function ServiceCard({ service, isPlatformStaff, index, onClick }: { service: any, isPlatformStaff: boolean, index: number, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      style={{ animationDelay: `${index * 80}ms` }}
      className={cn(
        "p-8 rounded-[2.8rem] border border-white/5 bg-white/[0.02] space-y-8 shadow-apex animate-in fade-in slide-in-from-bottom-8",
        isPlatformStaff ? "bg-amber-500/[0.02] border-amber-500/10" : ""
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-5">
          <div className={cn(
              "size-14 rounded-2xl flex items-center justify-center border shadow-inner",
              isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
          )}>
            <Activity className="size-7" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground leading-none truncate">{service.name}</h3>
            <p className="text-[10px] font-black text-muted-foreground/30 uppercase mt-3 italic tracking-[0.2em]">{service.categoryTag || "GENERAL_NODE"}</p>
          </div>
        </div>
        <StatusBadge isActive={service.isActive} />
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
        <div className="space-y-2">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Connections</p>
           <p className="text-2xl font-black italic tracking-tighter text-foreground tabular-nums">
              {(service._count?.subscriptions || 0).toLocaleString()}
           </p>
        </div>
        <div className="text-right space-y-2">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">Architecture</p>
           <p className="text-lg font-black uppercase italic tracking-widest text-emerald-500 truncate">{service.tiers?.length || 0} Layers</p>
        </div>
      </div>
      
      <div className="pt-2">
         <ServiceActionWrapper serviceId={service.id} />
      </div>
    </div>
  );
}

/** --- ATOMIC COMPONENTS --- */
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border shadow-apex italic",
      isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
    )}>
      <div className={cn(
        "h-1.5 w-1.5 rounded-full mr-2.5 animate-pulse",
        isActive ? "bg-emerald-500 shadow-apex-emerald" : "bg-amber-500 shadow-apex-amber"
      )} />
      {isActive ? "Online" : "Paused"}
    </div>
  );
}

function NoData() {
  return (
    <div className="py-32 flex flex-col items-center gap-8 opacity-20">
      <ShieldAlert className="size-20" />
      <div className="text-center space-y-3">
        <p className="text-[14px] font-black uppercase tracking-[0.5em] italic">Zero_Active_Fleet_Nodes</p>
        <p className="text-[9px] font-black uppercase tracking-widest italic opacity-40">Protocol_Handshake_Isolated</p>
      </div>
    </div>
  );
}