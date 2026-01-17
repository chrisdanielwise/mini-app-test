"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search, ChevronDown, LogOut, User, Settings,
  ShieldCheck, Zap, Globe, Activity, Terminal,
  Cpu, Bell, Command
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 🌊 DASHBOARD_HEADER (Institutional Apex v2026.1.15)
 * Strategy: High-density, low-profile tactical shell.
 * Behavior: Morphology-aware visibility logic based on device-ingress.
 */
export function DashboardHeader({ user, merchant }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();
  const { isStaff } = useInstitutionalAuth();

  const isStaffTheme = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevent "Bogus" Layout Snapping
  if (!isReady) return (
    <div className="h-16 w-full bg-black/40 border-b border-white/5 animate-pulse" />
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] flex w-full items-center justify-between border-b backdrop-blur-3xl transition-all duration-700",
        // 🏛️ TACTICAL SCALING: Clamped height to 64px (Mobile) - 72px (Desktop)
        isMobile ? "h-16 px-5" : "h-18 px-10", 
        isStaffTheme ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-white/5 bg-black/60"
      )}
      style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
    >
      {/* 🌫️ SUBSURFACE RADIANCE: Ambient Identity Wash */}
      <div className={cn(
        "absolute inset-0 opacity-5 pointer-events-none transition-colors duration-[2000ms]",
        isStaffTheme ? "bg-amber-500/10" : "bg-primary/5"
      )} />

      {/* --- LEFT: IDENTITY NODE (Clamped for Professionalism) --- */}
      <div className="flex items-center gap-8 min-w-0 flex-1 relative z-10">
        
        <div className="hidden lg:flex flex-col shrink-0">
          <div className="flex items-center gap-2.5 opacity-30 italic">
            {isStaffTheme ? (
              <Globe className="size-3 text-amber-500" />
            ) : (
              <Activity className="size-3 text-primary" />
            )}
            <span className="text-[8px] font-black uppercase tracking-[0.4em] leading-none">
              {isStaffTheme ? "Global_Oversight" : "Node_Ingress"}
            </span>
          </div>
          <h2 className="text-[14px] font-black uppercase italic tracking-tighter mt-1 truncate max-w-[200px] text-foreground/90">
            {isStaffTheme ? "Master Hub" : merchant?.companyName || "Zipha_Station"}
          </h2>
        </div>

        {/* 🌊 CENTER: SEARCH MEMBRANE (Tactical Filter) */}
        <div className={cn(
          "relative group transition-all duration-700",
          isMobile ? "w-full mr-4" : "w-72 lg:w-[400px]"
        )}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/20 group-focus-within:text-primary transition-colors duration-500" />
          <input
            type="text"
            onFocus={() => impact("light")}
            placeholder="CMD_QUERY..."
            className="h-10 w-full rounded-xl border border-white/5 bg-white/[0.02] pl-11 pr-4 text-[10px] font-bold uppercase tracking-widest italic transition-all focus:outline-none focus:bg-white/[0.05] focus:border-primary/20 placeholder:opacity-20"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 opacity-10 group-focus-within:opacity-0 transition-opacity">
            <Command className="size-2.5" />
            <span className="text-[8px] font-black uppercase">K</span>
          </div>
        </div>
      </div>

      {/* --- RIGHT: PROTOCOL CONTROLS --- */}
      <div className="flex items-center gap-4 md:gap-7 shrink-0 relative z-10">
        
        {/* 🛰️ NOTIFICATIONS (Institutional Size) */}
        <div className="relative group">
           <NotificationGroup />
           <div className="absolute -top-1 -right-1 size-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
        </div>

        <div className="hidden sm:block h-6 w-px bg-white/5" />

        {/* 👤 IDENTITY DROPCONTROL */}
        <DropdownMenu onOpenChange={() => selectionChange()}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-xl px-2 h-12 hover:bg-white/[0.03] transition-all border border-transparent active:scale-95"
            >
              <div className="relative">
                <div className={cn(
                    "flex size-9 items-center justify-center rounded-lg border text-[12px] font-black italic shadow-inner transition-all duration-700",
                    isStaffTheme ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                {/* Protocol badge shrunk to tactical scale */}
                <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-black flex items-center justify-center border border-white/10 shadow-apex">
                  {isStaff ? <ShieldCheck className="size-2 text-amber-500" /> : <Zap className="size-2 text-primary" />}
                </div>
              </div>

              {/* 🛡️ Hide Label on Tablets/Mobile for Precision */}
              <div className="hidden xl:flex flex-col items-start min-w-0">
                <span className="text-[12px] font-black uppercase italic tracking-tight leading-none truncate max-w-[120px] text-foreground">
                  {user.fullName.split(' ')[0]}
                </span>
                <span className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mt-1.5">
                  {isStaff ? "STAFF_ROOT" : "NODE_OPS"}
                </span>
              </div>
              <ChevronDown className="size-3 opacity-20 hidden md:block group-hover:translate-y-0.5 transition-transform" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 rounded-2xl border-white/5 bg-zinc-950 p-2 shadow-2xl backdrop-blur-3xl animate-in zoom-in-95 duration-500">
             <DropdownMenuLabel className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.4em] opacity-20 italic">
               Identity_Protocol_v16.31
             </DropdownMenuLabel>
             
             <DropdownMenuItem className="rounded-lg py-3 cursor-pointer focus:bg-white/5" asChild>
                <Link href="/profile" className="flex items-center px-4">
                  <User className="mr-3 size-4 opacity-40" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Identity_Node</span>
                </Link>
             </DropdownMenuItem>

             <DropdownMenuItem className="rounded-lg py-3 cursor-pointer focus:bg-white/5" asChild>
                <Link href="/settings" className="flex items-center px-4">
                  <Settings className="mr-3 size-4 opacity-40" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">System_Config</span>
                </Link>
             </DropdownMenuItem>

             <DropdownMenuSeparator className="bg-white/5 my-2" />

             <DropdownMenuItem 
               className="rounded-lg py-4 cursor-pointer text-rose-500 focus:bg-rose-500/10 px-4" 
               onClick={() => {
                 impact("heavy");
                 window.location.href = "/";
               }}
             >
                <LogOut className="mr-3 size-4 opacity-60" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Terminate_Session</span>
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}