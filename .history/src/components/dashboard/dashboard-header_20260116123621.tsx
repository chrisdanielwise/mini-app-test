"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search, ChevronDown, LogOut, User,
  Globe, Activity, Command, Bell
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
 * 🛰️ DASHBOARD_HEADER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon Lock.
 * Fix: Standardized h-14/h-16 profile prevents vertical blowout.
 */
export function DashboardHeader({ user, merchant }: any) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const { isStaff } = useInstitutionalAuth();

  const isStaffTheme = flavor === "AMBER";

  if (!isReady) return (
    <div className="h-14 w-full bg-black/40 border-b border-white/5 animate-pulse" />
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] flex w-full items-center justify-between border-b backdrop-blur-xl transition-all duration-700",
        // 🛡️ TACTICAL SLIM: Compressed height profile
        isMobile ? "h-14 px-4" : "h-14 md:h-16 px-6 lg:px-8", 
        isStaffTheme 
          ? "border-amber-500/10 bg-black/60 shadow-[0_0_20px_rgba(245,158,11,0.03)]" 
          : "border-white/5 bg-black/40 shadow-sm"
      )}
      style={{ paddingTop: isMobile ? `calc(${safeArea.top}px * 0.5)` : "0px" }}
    >
      {/* --- STATIONARY BRAND HUB --- */}
      <div className="flex items-center gap-6 min-w-0 flex-1 relative z-10">
        <div className="hidden md:flex flex-col shrink-0 leading-none">
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

        {/* --- SEARCH INGRESS: Compressed h-9 --- */}
        <div className={cn(
          "relative group transition-all duration-500",
          isMobile ? "w-full" : "w-64 lg:w-80 xl:w-[420px]"
        )}>
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 size-3 transition-colors opacity-20",
            isStaffTheme ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
          )} />
          <input
            type="text"
            onFocus={() => impact("light")}
            placeholder="INDEX_SEARCH..."
            className={cn(
              "h-8 md:h-9 w-full rounded-lg border bg-white/[0.02] pl-9 pr-3 text-[9px] font-black uppercase tracking-widest italic transition-all focus:outline-none placeholder:opacity-10",
              isStaffTheme 
                ? "border-amber-500/10 focus:border-amber-500/20" 
                : "border-white/5 focus:border-primary/20"
            )}
          />
        </div>
      </div>

      {/* --- OPERATOR CONTROLS --- */}
      <div className="flex items-center gap-3 md:gap-5 shrink-0 relative z-10 ml-4">
        <div className="relative group">
           <NotificationGroup />
           <div className={cn(
             "absolute top-0.5 right-0.5 size-1.5 rounded-full",
             isStaffTheme ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : "bg-emerald-500 shadow-[0_0_8px_#10b981]"
           )} />
        </div>

        <div className="hidden sm:block h-5 w-px bg-white/5" />

        <DropdownMenu onOpenChange={() => selectionChange()}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2.5 rounded-lg px-1.5 h-9 hover:bg-white/[0.02] active:scale-95 transition-all"
            >
              <div className={cn(
                  "flex size-7 items-center justify-center rounded-md border text-[9px] font-black italic shadow-inner transition-all",
                  isStaffTheme 
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                    : "bg-primary/10 border-primary/20 text-primary"
              )}>
                {user?.fullName?.charAt(0).toUpperCase() || "?"}
              </div>

              <div className="hidden lg:flex flex-col items-start leading-none">
                <span className="text-[10px] font-black uppercase italic tracking-tight truncate max-w-[80px]">
                  {user?.fullName?.split(' ')[0] || "OP_NODE"}
                </span>
                <span className={cn(
                  "text-[6px] font-black uppercase tracking-[0.1em] mt-1",
                  isStaffTheme ? "text-amber-500/30" : "text-primary/30"
                )}>
                  {isStaff ? "ROOT" : "NODE_OPS"}
                </span>
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