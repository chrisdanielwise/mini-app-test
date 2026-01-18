"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search, ChevronDown, LogOut, User,
  Globe, Activity, Command, Bell, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";
import { NotificationGroup } from "./notification-group";

// 🛠️ Atomic UI Components
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 🛰️ DASHBOARD_HEADER (Institutional Apex v2026.1.20)
 * Strategy: Stationary Horizon HUD with Tactical Mobile Trigger.
 * Fix: World Standard organization (Hamburger Left | Telemetry Center | Identity Right).
 * Safe-Area: Preserved exact padding logic from user layout.
 */
export function DashboardHeader({ user, merchant, dashboardContext }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const { isStaff } = useInstitutionalAuth();

  const isStaffTheme = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Standardized Pulse
  if (!isReady) return (
    <header className="h-14 w-full bg-black/40 border-b border-white/5 animate-pulse" />
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex w-full items-center justify-between border-b backdrop-blur-xl transition-all duration-700",
        // 🛡️ TACTICAL SLIM: Compressed height profile (UNTOUCHED)
        isMobile ? "h-14 px-4" : "h-14 md:h-16 px-6 lg:px-8", 
        isStaffTheme 
          ? "border-amber-500/10 bg-black/60 shadow-[0_0_20px_rgba(245,158,11,0.03)]" 
          : "border-white/5 bg-black/40 shadow-sm"
      )}
      style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }} // (UNTOUCHED)
    >
      {/* --- 🍔 LEFT: MOBILE HAMBURGER / DESKTOP BRANDING --- */}
      <div className="flex items-center gap-4 min-w-0">
        {isMobile ? (
          /* 📱 MOBILE: Tactical Trigger for Sidebar Drawer */
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => impact("medium")}
                className="size-9 rounded-lg bg-white/5 border border-white/10 active:scale-95"
              >
                <Menu className={cn("size-4", isStaffTheme ? "text-amber-500" : "text-primary")} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-zinc-950 border-r border-white/5">
              <DashboardSidebar context={dashboardContext} />
            </SheetContent>
          </Sheet>
        ) : (
          /* 💻 DESKTOP: Identity Hub */
          <div className="flex flex-col shrink-0 leading-none">
            <div className="flex items-center gap-2 opacity-30 italic">
              {isStaffTheme ? (
                <Globe className="size-2.5 text-amber-500 animate-pulse" />
              ) : (
                <Activity className="size-2.5 text-primary animate-pulse" />
              )}
              <span className={cn(
                "text-[7px] font-black uppercase tracking-[0.3em]",
                isStaffTheme ? "text-amber-500" : "text-primary"
              )}>
                {isStaffTheme ? "Global_Oversight" : "Node_Ingress"}
              </span>
            </div>
            <h2 className="text-[11px] font-black uppercase italic tracking-tighter mt-1 truncate max-w-[160px] text-foreground">
              {isStaffTheme ? "Master_Hub" : merchant?.companyName || "Station_Alpha"}
            </h2>
          </div>
        )}
      </div>

      {/* --- 🛰️ CENTER: MOBILE TELEMETRY / DESKTOP SEARCH --- */}
      {isMobile ? (
        <div className="flex flex-col items-center leading-none">
          <span className="text-[6.5px] font-black uppercase tracking-[0.4em] opacity-20 italic">Node_Status</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={cn("size-1 rounded-full animate-pulse", isStaffTheme ? "bg-amber-500" : "bg-primary")} />
            <span className="text-[9px] font-black uppercase tracking-tighter text-foreground italic">SYNC_OK</span>
          </div>
        </div>
      ) : (
        /* 💻 DESKTOP: Full Index Search */
        <div className={cn("relative group transition-all duration-500 w-64 lg:w-80 xl:w-[420px]")}>
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 size-3 opacity-20 transition-colors",
            isStaffTheme ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
          )} />
          <input
            type="text"
            onFocus={() => impact("light")}
            placeholder="INDEX_SEARCH..."
            className={cn(
              "h-9 w-full rounded-lg border bg-white/[0.02] pl-9 pr-3 text-[9px] font-black uppercase tracking-widest italic transition-all focus:outline-none placeholder:opacity-10",
              isStaffTheme ? "border-amber-500/10 focus:border-amber-500/20" : "border-white/5 focus:border-primary/20"
            )}
          />
        </div>
      )}

      {/* --- 🕹️ RIGHT: OPERATOR CONTROLS --- */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        
        {/* 📱 MOBILE-ONLY SEARCH: Compressed Trigger */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-9 rounded-lg bg-white/5 border border-white/10 active:scale-95" 
            onClick={() => impact("light")}
          >
            <Search className="size-3.5 opacity-40" />
          </Button>
        )}

        <NotificationGroup />

        <div className="hidden sm:block h-5 w-px bg-white/5" />

        <DropdownMenu onOpenChange={() => selectionChange()}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-lg px-1 h-9 hover:bg-white/[0.02] active:scale-95 transition-all"
            >
              <div className={cn(
                  "flex size-7 md:size-8 items-center justify-center rounded-md border text-[9px] font-black italic shadow-inner transition-all",
                  isStaffTheme 
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                    : "bg-primary/10 border-primary/20 text-primary"
              )}>
                {user?.fullName?.charAt(0).toUpperCase() || "?"}
              </div>
              <ChevronDown className="size-2.5 opacity-20 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-xl border-white/5 bg-zinc-950 p-1.5 shadow-3xl backdrop-blur-2xl">
             <DropdownMenuLabel className="px-3 py-2 text-[7px] font-black uppercase tracking-[0.4em] opacity-10 italic">
               Identity_v16.31
             </DropdownMenuLabel>
             
             <DropdownMenuItem className="rounded-lg py-2.5 cursor-pointer focus:bg-white/5" asChild>
                <Link href="/profile" className="flex items-center px-3">
                  <User className={cn("mr-2.5 size-3.5", isStaffTheme ? "text-amber-500" : "text-primary")} />
                  <span className="text-[9px] font-black uppercase tracking-widest italic">Identity_Node</span>
                </Link>
             </DropdownMenuItem>

             <DropdownMenuSeparator className="bg-white/5 my-1" />

             <DropdownMenuItem 
               className="rounded-lg py-3 cursor-pointer text-rose-500 focus:bg-rose-500/10 px-3" 
               onClick={() => {
                 impact("heavy");
                 window.location.href = "/";
               }}
             >
                <LogOut className="mr-2.5 size-3.5 opacity-40" />
                <span className="text-[9px] font-black uppercase tracking-widest italic">Revoke_Session</span>
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}