"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "./sidebar"; 
import { 
  Settings, 
  Search, 
  Zap, 
  ChevronRight, 
  Terminal, 
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * 🛰️ DASHBOARD TOP NAV (Apex Tier)
 * Normalized: World-standard fluid typography and responsive horizontal constraints.
 * Optimized: Adaptive safe-zones and institutional haptics for command parity.
 */
export function DashboardTopNav({ merchant }: { merchant: any }) {
  const pathname = usePathname();

  // Find the active protocol label for the breadcrumb
  const activeItem = navigation.find(item => 
    item.href === "/dashboard" 
      ? pathname === "/dashboard" 
      : pathname.startsWith(item.href)
  );

  return (
    <header className="h-16 md:h-20 border-b border-border/40 bg-card/40 backdrop-blur-3xl sticky top-0 z-[60] px-4 sm:px-6 md:px-8 flex items-center justify-between w-full transition-all duration-500">
      
      {/* --- LEFT: NODE IDENTITY --- */}
      <div className="flex items-center gap-3 md:gap-6 min-w-0">
        <Link 
          href="/dashboard" 
          onClick={() => hapticFeedback("light")}
          className="flex items-center gap-3 md:gap-4 group min-w-0"
        >
          <div className="h-9 w-9 md:h-11 md:w-11 shrink-0 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center font-black italic text-primary-foreground shadow-2xl shadow-primary/20 transition-transform group-hover:scale-105 active:scale-90">
            Z
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black uppercase italic text-[10px] md:text-xs tracking-tighter leading-none truncate">
              {merchant.companyName}
            </span>
            <div className="flex items-center gap-1.5 mt-1 md:mt-1.5 opacity-40">
               <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.2em]">Node_Stable</span>
            </div>
          </div>
        </Link>

        {/* --- BREADCRUMB TELEMETRY --- */}
        <div className="hidden lg:flex items-center gap-3 ml-2 pl-6 border-l border-border/40">
          <Terminal className="h-3 w-3 text-muted-foreground opacity-30" />
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
              Dashboard
            </span>
            <ChevronRight className="h-2.5 w-2.5 text-muted-foreground/20" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary italic truncate max-w-[120px]">
              {activeItem?.name || "Initializing..."}
            </span>
          </div>
        </div>
      </div>
      
      {/* --- CENTER: GLOBAL SEARCH NODE --- */}
      <div className="hidden xl:flex relative group px-12 flex-1 max-w-2xl">
        <Search className="absolute left-16 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text"
          placeholder="FILTER SYSTEM TELEMETRY..."
          className="w-full h-10 md:h-11 bg-muted/10 border border-border/40 rounded-xl md:rounded-2xl pl-12 pr-4 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:opacity-30 shadow-inner"
        />
      </div>

      {/* --- RIGHT: SYSTEM ACTIONS --- */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-4">
        {/* Notification Hub */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => hapticFeedback("light")}
          className="relative h-10 w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-muted/20 border border-border/10 hover:bg-primary/5 group active:scale-90"
        >
          <Bell className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute top-2.5 right-2.5 md:top-3 md:right-3 h-1.5 w-1.5 rounded-full bg-primary animate-pulse ring-2 ring-background" />
        </Button>

        <div className="hidden sm:block h-6 md:h-8 w-px bg-border/40 mx-1" />

        <Link href="/dashboard/settings" onClick={() => hapticFeedback("light")}>
          <Button 
            variant="ghost" 
            className="h-10 md:h-11 px-3 md:px-5 rounded-xl md:rounded-2xl bg-muted/20 border border-border/10 hover:border-primary/20 hover:bg-primary/5 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group active:scale-95"
          >
            <Settings className="md:mr-2 h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-500" />
            <span className="hidden md:inline">Config</span>
          </Button>
        </Link>

        {/* Action Trigger */}
        <Link href="/dashboard/services/new" onClick={() => hapticFeedback("light")}>
          <Button className="h-10 md:h-11 px-4 md:px-6 rounded-xl md:rounded-2xl font-black uppercase italic tracking-widest text-[8px] md:text-[9px] shadow-2xl shadow-primary/20 bg-primary text-primary-foreground hover:scale-[1.02] active:scale-95 transition-all">
            <Zap className="md:mr-2 h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Deploy</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}