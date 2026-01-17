"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation"; 
import { 
  Search, 
  Zap, 
  ChevronRight, 
  Terminal, 
  Bell,
  Activity,
  Globe,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { Button } from "@/components/ui/button";
import { IdentityBadge } from "@/components/dashboard/identity-badge";

/**
 * 🌊 DASHBOARD_TOP_NAV (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Momentum | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with Role-Based Radiance.
 */
export function DashboardTopNav({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Hardware physics integration
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();
  
  const role = context?.role || "merchant";
  const config = context?.config || {};
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);
  const isMerchant = role === "merchant";
  const themeAmber = flavor === "AMBER";

  const activeItem = NAVIGATION_CONFIG.find(item => 
    item.href === "/dashboard" 
      ? pathname === "/dashboard" 
      : pathname.startsWith(item.href)
  );

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <header className="h-20 w-full bg-card/20 animate-pulse border-b border-white/5" />;

  return (
    <header 
      className={cn(
        "sticky top-0 z-[60] flex items-center justify-between w-full transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] backdrop-blur-3xl",
        "h-20 md:h-24 px-6 md:px-12 border-b",
        themeAmber 
          ? "bg-amber-500/[0.04] border-amber-500/20 shadow-apex-amber" 
          : "bg-background/60 border-white/5 shadow-apex"
      )}
      style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
    >
      
      {/* --- LEFT: IDENTITY HORIZON & BREADCRUMBS --- */}
      <div className="flex items-center gap-6 md:gap-8 min-w-0">
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          <div className={cn(
            "size-12 md:size-14 shrink-0 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center font-black italic shadow-apex transition-all duration-1000 active:scale-75",
            themeAmber ? "bg-amber-500 text-black" : "bg-primary text-white"
          )}>
            Z
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black uppercase italic text-xs md:text-lg tracking-tighter leading-none truncate text-foreground">
              {config?.companyName || (isPlatformStaff ? "PLATFORM_ROOT" : "NODE_v16")}
            </span>
            <div className="mt-2" onClick={() => impact("light")}>
               <IdentityBadge role={role} />
            </div>
          </div>
        </div>

        {/* --- BREADCRUMB TELEMETRY (Desktop XXL/XL) --- */}
        {!isMobile && (
          <div className="hidden lg:flex items-center gap-5 ml-4 pl-10 border-l border-white/10">
            {themeAmber ? <Globe className="size-4 text-amber-500/40 animate-pulse" /> : <Terminal className="size-4 text-primary/40" />}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                {isPlatformStaff ? "Oversight" : "Terminal"}
              </span>
              <ChevronRight className="size-3.5 text-white/5" />
              <div className="flex flex-col">
                <span className={cn(
                  "text-[11px] font-black uppercase tracking-[0.3em] italic truncate max-w-[180px]",
                  themeAmber ? "text-amber-500" : "text-primary"
                )}>
                  {activeItem?.name || "ROOT_NODE"}
                </span>
                <span className="text-[7px] font-black opacity-10 uppercase tracking-widest mt-1">Laminar_Flow_Active</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* --- CENTER: GLOBAL QUERY NODE --- */}
      <div className="hidden xl:flex relative group px-14 flex-1 max-w-2xl transition-all duration-1000">
        <Search className={cn(
          "absolute left-20 top-1/2 -translate-y-1/2 size-5 transition-all duration-700",
          themeAmber ? "group-focus-within:text-amber-500 text-muted-foreground/20" : "group-focus-within:text-primary text-muted-foreground/20"
        )} />
        <input 
          onFocus={() => impact("light")}
          type="text"
          placeholder={isPlatformStaff ? "QUERY_GLOBAL_CLUSTERS..." : "FILTER_TELEMETRY_NODE..."}
          className={cn(
            "w-full h-14 border rounded-[1.4rem] pl-14 pr-8 text-[11px] font-black uppercase tracking-[0.3em] focus:outline-none focus:ring-8 transition-all duration-700 placeholder:opacity-10 italic",
            themeAmber 
              ? "bg-amber-500/[0.03] border-amber-500/10 focus:ring-amber-500/5 focus:border-amber-500/40" 
              : "bg-white/[0.02] border-white/5 focus:ring-primary/5 focus:border-primary/40"
          )}
        />
      </div>

      {/* --- RIGHT: SYSTEM ACTIONS --- */}
      <div className="flex items-center gap-5 md:gap-6 shrink-0 ml-6">
        
        {/* 🚀 ACTION GATING: Deployment Command */}
        {(isMerchant || role === 'super_admin') && (
          <Link href="/dashboard/services/new" onClick={() => impact("medium")}>
            <Button className={cn(
              "h-14 md:h-16 px-8 rounded-2xl md:rounded-[1.4rem] font-black uppercase italic tracking-[0.3em] text-[11px] shadow-apex transition-all duration-1000 group",
              themeAmber 
                ? "bg-amber-500 text-black shadow-amber-500/30 hover:scale-105" 
                : "bg-primary text-white shadow-primary/30 hover:scale-105 active:scale-95"
            )}>
              <Zap className="mr-3 size-5 fill-current transition-transform group-hover:rotate-12 group-hover:scale-110" />
              <span className="hidden sm:inline">Deploy_Node</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        )}

        <div className="hidden sm:block h-10 w-px bg-white/5 mx-2" />

        {/* --- NOTIFICATION TRIGGER --- */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => impact("light")}
          className={cn(
            "relative size-14 md:size-16 rounded-2xl md:rounded-[1.4rem] border transition-all duration-1000 active:scale-75 group",
            themeAmber ? "bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10" : "bg-white/[0.02] border-white/5 hover:bg-primary/5"
          )}
        >
          <Bell className={cn(
            "size-6 transition-colors duration-700",
            themeAmber ? "text-amber-500/40 group-hover:text-amber-500" : "text-white/20 group-hover:text-primary"
          )} />
          <span className={cn(
            "absolute top-4 right-4 size-2.5 rounded-full animate-ping shadow-lg",
            themeAmber ? "bg-amber-500" : "bg-primary"
          )} />
          
          {/* Hardware Telemetry (Desktop) */}
          {!isMobile && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-20 transition-opacity duration-1000">
               <Cpu className="size-3" />
            </div>
          )}
        </Button>
      </div>
    </header>
  );
}