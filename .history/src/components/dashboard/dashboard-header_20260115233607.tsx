"use client";

import * as React from "react";
import {
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  ShieldCheck,
  Zap,
  Globe,
  Activity,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useInstitutionalAuth } from "@/lib/hooks/use-institutional-auth";
import { NotificationGroup } from "./notification-group";

/**
 * 🛰️ DASHBOARD_HEADER (Tactical Refactor v16.31)
 * Strategy: High-density, low-profile navigation shell.
 * Behavior: Hide/Show logic based on standard device breakpoint (1024px).
 */
export function DashboardHeader({ user, merchant }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();
  const { isStaff } = useInstitutionalAuth();

  const isStaffTheme = flavor === "AMBER";

  if (!isReady) return <div className="h-16 w-full bg-black/40 border-b border-white/5 animate-pulse" />;

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] flex w-full items-center justify-between border-b backdrop-blur-3xl transition-all duration-700",
        // 🏛️ Tactical Scaling: Clamp height to 64px-72px max
        isMobile ? "h-16 px-5" : "h-18 px-10", 
        isStaffTheme ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-white/5 bg-black/60"
      )}
      style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
    >
      {/* --- LEFT: IDENTITY NODE (Hidden on XS/Mobile to save space) --- */}
      <div className="flex items-center gap-6 min-w-0 flex-1 relative z-10">
        
        <div className="hidden lg:flex flex-col shrink-0">
          <div className="flex items-center gap-2.5 opacity-40">
            {isStaffTheme ? (
              <Globe className="size-3 text-amber-500" />
            ) : (
              <Activity className="size-3 text-primary" />
            )}
            <span className="text-[8px] font-black uppercase tracking-[0.4em] italic">
              {isStaffTheme ? "Global_Oversight" : "Node_Ingress"}
            </span>
          </div>
          <h2 className="text-[13px] font-black uppercase italic tracking-tighter mt-1 truncate max-w-[180px]">
            {isStaffTheme ? "Master Hub" : merchant?.companyName || "Zipha Station"}
          </h2>
        </div>

        {/* 🌊 CENTER: SEARCH MEMBRANE (Adaptive Width) */}
        <div className={cn(
          "relative group transition-all duration-700",
          isMobile ? "w-full mr-4" : "w-80 lg:w-[450px]"
        )}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            onFocus={() => impact("light")}
            placeholder="CMD_QUERY..."
            className="h-10 w-full rounded-xl border border-white/5 bg-white/[0.02] pl-12 pr-4 text-[9px] font-black uppercase tracking-widest italic transition-all focus:outline-none focus:bg-white/[0.05] focus:border-primary/20"
          />
        </div>
      </div>

      {/* --- RIGHT: PROTOCOL CONTROLS --- */}
      <div className="flex items-center gap-3 md:gap-6 shrink-0 relative z-10">
        
        {/* 🛰️ NOTIFICATIONS (Tactical Size) */}
        <NotificationGroup />

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
                    "flex size-9 items-center justify-center rounded-lg border text-[11px] font-black italic shadow-inner",
                    isStaffTheme ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                {/* Protocol badge shrunk to tactical scale */}
                <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-black flex items-center justify-center border border-white/10">
                  {isStaff ? <ShieldCheck className="size-2 text-amber-500" /> : <Zap className="size-2 text-primary" />}
                </div>
              </div>

              {/* 🛡️ Hide Label on Tablets/Mobile */}
              <div className="hidden xl:flex flex-col items-start min-w-0">
                <span className="text-[11px] font-black uppercase italic tracking-tight leading-none truncate max-w-[100px]">
                  {user.fullName.split(' ')[0]}
                </span>
                <span className="text-[7px] font-bold text-muted-foreground/30 uppercase tracking-widest mt-1">
                  {isStaff ? "MASTER" : "NODE"}
                </span>
              </div>
              <ChevronDown className="size-3 opacity-20 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 rounded-2xl border-white/5 bg-zinc-950 p-2 shadow-2xl backdrop-blur-3xl">
             <DropdownMenuLabel className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.4em] opacity-20 italic">
               Protocol_v16.31
             </DropdownMenuLabel>
             <DropdownMenuItem className="rounded-lg py-3 cursor-pointer focus:bg-white/5" asChild>
                <Link href="/profile" className="flex items-center px-4">
                  <Terminal className="mr-3 size-3.5 opacity-40" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Identity_Node</span>
                </Link>
             </DropdownMenuItem>
             <DropdownMenuItem className="rounded-lg py-3 cursor-pointer focus:bg-white/5" asChild>
                <Link href="/settings" className="flex items-center px-4">
                  <Settings className="mr-3 size-3.5 opacity-40" />
                  <span className="text-[10px] font-black uppercase tracking-widest">System_Config</span>
                </Link>
             </DropdownMenuItem>
             <DropdownMenuSeparator className="bg-white/5 my-2" />
             <DropdownMenuItem className="rounded-lg py-3 cursor-pointer text-rose-500 focus:bg-rose-500/10 px-4" onClick={() => (window.location.href = "/")}>
                <LogOut className="mr-3 size-3.5 opacity-60" />
                <span className="text-[10px] font-black uppercase tracking-widest">Terminate</span>
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}