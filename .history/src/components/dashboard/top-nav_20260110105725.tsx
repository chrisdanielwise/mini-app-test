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
  Bell,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * 🛰️ DASHBOARD TOP NAV (Tier 2)
 * High-resiliency Command Strip for horizontal management layouts.
 * Synchronized with the global Navigation Protocol.
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
    <header className="h-20 border-b border-border/40 bg-card/40 backdrop-blur-3xl sticky top-0 z-[60] px-8 flex items-center justify-between w-full transition-all duration-500">
      
      {/* --- LEFT: NODE IDENTITY --- */}
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="h-11 w-11 rounded-2xl bg-primary flex items-center justify-center font-black italic text-primary-foreground shadow-2xl shadow-primary/20 transition-transform group-hover:scale-105">
            Z
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase italic text-xs tracking-tighter leading-none">
              {merchant.companyName}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5 opacity-40">
               <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[7px] font-black uppercase tracking-[0.2em]">Node_Stable</span>
            </div>
          </div>
        </Link>

        {/* --- BREADCRUMB TELEMETRY --- */}
        <div className="hidden md:flex items-center gap-3 ml-4 pl-6 border-l border-border/40">
          <Terminal className="h-3 w-3 text-muted-foreground opacity-30" />
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
              Dashboard
            </span>
            <ChevronRight className="h-2.5 w-2.5 text-muted-foreground/20" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary italic">
              {activeItem?.name || "Initializing..."}
            </span>
          </div>
        </div>
      </div>
      
      {/* --- CENTER: GLOBAL SEARCH NODE --- */}
      <div className="hidden lg:flex relative group px-12 flex-1 max-w-2xl">
        <Search className="absolute left-16 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input 
          type="text"
          placeholder="FILTER SYSTEM TELEMETRY..."
          className="w-full h-11 bg-muted/10 border border-border/40 rounded-2xl pl-12 pr-4 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:opacity-30"
        />
      </div>

      {/* --- RIGHT: SYSTEM ACTIONS --- */}
      <div className="flex items-center gap-3">
        {/* Quick Hub Toggle */}
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-muted/20 border border-border/10 hover:bg-primary/5 group">
          <Bell className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </Button>

        <div className="h-8 w-px bg-border/40 mx-1" />

        <Link href="/dashboard/settings">
          <Button 
            variant="ghost" 
            className="h-11 px-5 rounded-2xl bg-muted/20 border border-border/10 hover:border-primary/20 hover:bg-primary/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group"
          >
            <Settings className="mr-2 h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-500" />
            Config
          </Button>
        </Link>

        {/* Action Trigger */}
        <Link href="/dashboard/services/new">
          <Button className="h-11 px-6 rounded-2xl font-black uppercase italic tracking-widest text-[9px] shadow-2xl shadow-primary/20 bg-primary text-primary-foreground">
            <Zap className="mr-2 h-3.5 w-3.5 fill-current" />
            Deploy
          </Button>
        </Link>
      </div>
    </header>
  );
}