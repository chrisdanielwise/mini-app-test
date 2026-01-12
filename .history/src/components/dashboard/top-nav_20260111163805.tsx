"use client";

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
import { hapticFeedback } from "@/lib/telegram/webapp";
import { IdentityBadge } from "@/components/dashboard/identity-badge";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ DASHBOARD TOP NAV
 * Logic: Role-Aware network oversight.
 * Adaptive: Flavor-shifts (Amber/Emerald) based on operator context.
 */
export function DashboardTopNav({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  
  // 🛡️ ROLE DETERMINATION
  const role = context?.role || "merchant";
  const config = context?.config || {};
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);
  const isMerchant = role === "merchant";
  const themeAmber = flavor === "AMBER";

  // Breadcrumb mapping
  const activeItem = NAVIGATION_CONFIG.find(item => 
    item.href === "/dashboard" 
      ? pathname === "/dashboard" 
      : pathname.startsWith(item.href)
  );

  return (
    <header className={cn(
      "h-16 md:h-20 border-b sticky top-0 z-[60] px-4 sm:px-6 md:px-8 flex items-center justify-between w-full transition-all duration-500 backdrop-blur-3xl",
      themeAmber 
        ? "bg-amber-500/[0.02] border-amber-500/10" 
        : "bg-card/40 border-border/40"
    )}>
      
      {/* --- LEFT: NODE IDENTITY & BREADCRUMBS --- */}
      <div className="flex items-center gap-3 md:gap-6 min-w-0">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className={cn(
            "h-9 w-9 md:h-11 md:w-11 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center font-black italic shadow-2xl transition-transform active:scale-90",
            themeAmber ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-primary-foreground shadow-primary/20"
          )}>
            Z
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black uppercase italic text-[10px] md:text-xs tracking-tighter leading-none truncate text-foreground">
              {config?.companyName || (isPlatformStaff ? "PLATFORM_ROOT" : "ZIPHA_NODE")}
            </span>
            <div className="mt-1 md:mt-1.5">
               <IdentityBadge role={role} />
            </div>
          </div>
        </div>

        {/* --- BREADCRUMB TELEMETRY --- */}
        <div className="hidden lg:flex items-center gap-3 ml-2 pl-6 border-l border-border/40">
          {themeAmber ? <Globe className="h-3 w-3 text-amber-500/40" /> : <Terminal className="h-3 w-3 text-muted-foreground opacity-30" />}
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
              {isPlatformStaff ? "Oversight" : "Dashboard"}
            </span>
            <ChevronRight className="h-2.5 w-2.5 text-muted-foreground/20" />
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.2em] italic truncate max-w-[120px]",
              themeAmber ? "text-amber-500" : "text-primary"
            )}>
              {activeItem?.name || "TERMINAL"}
            </span>
          </div>
        </div>
      </div>
      
      {/* --- CENTER: GLOBAL SEARCH NODE --- */}
      <div className="hidden xl:flex relative group px-12 flex-1 max-w-2xl">
        <Search className={cn(
          "absolute left-16 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors",
          themeAmber ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
        )} />
        <input 
          type="text"
          placeholder={isPlatformStaff ? "QUERY GLOBAL CLUSTERS..." : "FILTER TELEMETRY..."}
          className={cn(
            "w-full h-10 md:h-11 border rounded-xl md:rounded-2xl pl-12 pr-4 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-2 transition-all placeholder:opacity-30 shadow-inner",
            themeAmber 
              ? "bg-amber-500/5 border-amber-500/20 focus:ring-amber-500/20" 
              : "bg-muted/10 border-border/40 focus:ring-primary/20"
          )}
        />
      </div>

      {/* --- RIGHT: SYSTEM ACTIONS --- */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-4">
        
        {/* Status Indicator (Staff Only) */}
        {isPlatformStaff && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
             <Activity className="h-3 w-3 text-amber-500 animate-pulse" />
             <span className="text-[7px] font-black uppercase text-amber-500 tracking-widest">Global_Live</span>
          </div>
        )}

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => hapticFeedback("light")}
          className={cn(
            "relative h-10 w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-muted/20 border border-border/10 group active:scale-90",
            themeAmber ? "hover:bg-amber-500/10" : "hover:bg-primary/5"
          )}
        >
          <Bell className={cn(
            "h-4 w-4 text-muted-foreground transition-colors",
            themeAmber ? "group-hover:text-amber-500" : "group-hover:text-primary"
          )} />
          <span className={cn(
            "absolute top-2.5 right-2.5 md:top-3 md:right-3 h-1.5 w-1.5 rounded-full animate-pulse ring-2 ring-background",
            themeAmber ? "bg-amber-500" : "bg-primary"
          )} />
        </Button>

        <div className="hidden sm:block h-6 md:h-8 w-px bg-border/40 mx-1" />

        {/* 🚀 ACTION GATING: Only merchants and super admins can 'Deploy' */}
        {(isMerchant || role === 'super_admin') && (
          <Link href="/dashboard/services/new" onClick={() => hapticFeedback("light")}>
            <Button className={cn(
              "h-10 md:h-11 px-4 md:px-6 rounded-xl md:rounded-2xl font-black uppercase italic tracking-widest text-[8px] md:text-[9px] shadow-2xl transition-all group",
              themeAmber 
                ? "bg-amber-500 text-black shadow-amber-500/20 hover:scale-[1.02]" 
                : "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.02] active:scale-95"
            )}>
              <Zap className="md:mr-2 h-3.5 w-3.5 fill-current transition-transform group-hover:scale-125" />
              <span className="hidden sm:inline">Deploy</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}