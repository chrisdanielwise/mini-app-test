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
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IdentityBadge } from "@/components/dashboard/identity-badge";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID TOP NAV (Institutional v16.16.12)
 * Logic: Haptic-synced identity horizon with Role-Based Radiance.
 * Design: v9.9.1 Hardened Glassmorphism with Momentum Ingress.
 */
export function DashboardTopNav({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  
  // 🛡️ ROLE DETERMINATION
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

  return (
    <header className={cn(
      "h-18 md:h-22 sticky top-0 z-[60] px-6 md:px-10 flex items-center justify-between w-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] backdrop-blur-3xl",
      themeAmber 
        ? "bg-amber-500/[0.04] border-b border-amber-500/20" 
        : "bg-card/40 border-b border-white/5 shadow-2xl"
    )}>
      
      {/* --- LEFT: NODE IDENTITY & BREADCRUMBS --- */}
      <div className="flex items-center gap-6 min-w-0">
        <div className="flex items-center gap-5 min-w-0">
          <div className={cn(
            "size-10 md:size-12 shrink-0 rounded-2xl flex items-center justify-center font-black italic shadow-2xl transition-all duration-500 active:scale-90",
            themeAmber ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-primary/30"
          )}>
            Z
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black uppercase italic text-[11px] md:text-sm tracking-tighter leading-none truncate text-foreground">
              {config?.companyName || (isPlatformStaff ? "PLATFORM_ROOT" : "ZIPHA_NODE")}
            </span>
            <div className="mt-1.5" onClick={() => impact("light")}>
               <IdentityBadge role={role} />
            </div>
          </div>
        </div>

        {/* --- BREADCRUMB TELEMETRY: Oversight Stream --- */}
        <div className="hidden lg:flex items-center gap-4 ml-4 pl-8 border-l border-white/5">
          {themeAmber ? <Globe className="size-3.5 text-amber-500/40" /> : <Terminal className="size-3.5 text-muted-foreground/30" />}
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
              {isPlatformStaff ? "Oversight" : "Dashboard"}
            </span>
            <ChevronRight className="size-3 text-muted-foreground/10" />
            <span className={cn(
              "text-[10px] font-black uppercase tracking-[0.3em] italic truncate max-w-[140px]",
              themeAmber ? "text-amber-500" : "text-primary"
            )}>
              {activeItem?.name || "TERMINAL"}
            </span>
          </div>
        </div>
      </div>
      
      {/* --- CENTER: GLOBAL SEARCH NODE (Fluid Query) --- */}
      <div className="hidden xl:flex relative group px-14 flex-1 max-w-2xl">
        <Search className={cn(
          "absolute left-18 top-1/2 -translate-y-1/2 size-4 opacity-20 transition-all duration-500",
          themeAmber ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
        )} />
        <input 
          onFocus={() => impact("light")}
          type="text"
          placeholder={isPlatformStaff ? "QUERY_GLOBAL_CLUSTERS..." : "FILTER_TELEMETRY_NODE..."}
          className={cn(
            "w-full h-12 border rounded-2xl pl-12 pr-6 text-[10px] font-black uppercase tracking-[0.25em] focus:outline-none focus:ring-4 transition-all duration-500 placeholder:opacity-20",
            themeAmber 
              ? "bg-amber-500/5 border-amber-500/20 focus:ring-amber-500/10 focus:border-amber-500/40" 
              : "bg-white/5 border-white/5 focus:ring-primary/10 focus:border-primary/40"
          )}
        />
      </div>

      {/* --- RIGHT: SYSTEM ACTIONS --- */}
      <div className="flex items-center gap-4 shrink-0 ml-6">
        
        {/* 🚀 ACTION GATING: Deployment Command */}
        {(isMerchant || role === 'super_admin') && (
          <Link href="/dashboard/services/new" onClick={() => impact("medium")}>
            <Button className={cn(
              "h-12 px-6 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[10px] shadow-2xl transition-all duration-700 group",
              themeAmber 
                ? "bg-amber-500 text-black shadow-amber-500/40 hover:scale-[1.05]" 
                : "bg-primary text-primary-foreground shadow-primary/40 hover:scale-[1.05] active:scale-95"
            )}>
              <Zap className="mr-3 size-4 fill-current transition-transform group-hover:scale-125 group-hover:rotate-12" />
              <span className="hidden sm:inline">Deploy</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        )}

        <div className="hidden sm:block h-8 w-px bg-white/5 mx-2" />

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => impact("light")}
          className={cn(
            "relative size-12 rounded-2xl bg-white/5 border border-white/5 group transition-all duration-500 active:scale-90",
            themeAmber ? "hover:bg-amber-500/10" : "hover:bg-primary/10"
          )}
        >
          <Bell className={cn(
            "size-5 text-muted-foreground/40 transition-colors group-hover:text-foreground",
            themeAmber ? "group-hover:text-amber-500" : "group-hover:text-primary"
          )} />
          <span className={cn(
            "absolute top-3.5 right-3.5 size-2 rounded-full animate-ping ring-2 ring-background",
            themeAmber ? "bg-amber-500" : "bg-primary"
          )} />
        </Button>
      </div>
    </header>
  );
}