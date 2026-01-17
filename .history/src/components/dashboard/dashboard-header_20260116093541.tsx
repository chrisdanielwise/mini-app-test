"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search, ChevronDown, LogOut, User, Settings,
  ShieldCheck, Zap, Globe, Activity, Command
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
        "sticky top-0 z-[100] flex w-full outline items-center justify-between border-b backdrop-blur-3xl transition-all duration-700",
        // 🏛️ TIGHTENED: Reduced height from 16/18 to 14/16 for more screen real estate
        isMobile ? "h-14 px-5" : "h-16 px-10", 
        isStaffTheme 
          ? "border-amber-500/20 bg-amber-500/[0.04] shadow-[0_0_30px_rgba(245,158,11,0.05)]" 
          : "border-primary/20 bg-primary/[0.02] shadow-[0_0_30px_rgba(16,185,129,0.05)]"
      )}
      style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
    >
      <div className={cn(
        "absolute inset-0 opacity-10 pointer-events-none transition-colors duration-[2000ms]",
        isStaffTheme ? "bg-amber-500/10" : "bg-primary/5"
      )} />

      <div className="flex items-center gap-8 min-w-0 flex-1 relative z-10">
        <div className="hidden lg:flex flex-col shrink-0">
          <div className="flex items-center gap-2.5 opacity-40 italic">
            {isStaffTheme ? (
              <Globe className="size-3 text-amber-500 animate-pulse" />
            ) : (
              <Activity className="size-3 text-primary animate-pulse" />
            )}
            <span className={cn(
              "text-[8px] font-black uppercase tracking-[0.4em] leading-none",
              isStaffTheme ? "text-amber-500" : "text-primary"
            )}>
              {isStaffTheme ? "Global_Oversight" : "Node_Ingress"}
            </span>
          </div>
          <h2 className="text-[13px] font-black uppercase italic tracking-tighter mt-1 truncate max-w-[200px] text-foreground">
            {isStaffTheme ? "Master Hub" : merchant?.companyName || "Zipha_Station"}
          </h2>
        </div>

        <div className={cn(
          "relative group transition-all duration-700",
          isMobile ? "w-full mr-4" : "w-72 lg:w-[400px]"
        )}>
          <Search className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 size-3.5 transition-colors duration-500",
            isStaffTheme ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
          )} />
          <input
            type="text"
            onFocus={() => impact("light")}
            placeholder="CMD_QUERY..."
            className={cn(
              "h-9 w-full rounded-xl border bg-black/40 pl-11 pr-4 text-[10px] font-bold uppercase tracking-widest italic transition-all focus:outline-none placeholder:opacity-20",
              isStaffTheme 
                ? "border-amber-500/10 focus:border-amber-500/30" 
                : "border-white/5 focus:border-primary/30"
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-7 shrink-0 relative z-10">
        <div className="relative group">
           <NotificationGroup />
           <div className={cn(
             "absolute top-1 right-1 size-1.5 rounded-full animate-pulse",
             isStaffTheme ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]" : "bg-primary shadow-[0_0_10px_#10b981]"
           )} />
        </div>

        <div className="hidden sm:block h-6 w-px bg-white/5" />

        <DropdownMenu onOpenChange={() => selectionChange()}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-xl px-2 h-10 hover:bg-white/[0.03] transition-all border border-transparent active:scale-95"
            >
              <div className="relative">
                <div className={cn(
                    "flex size-8 items-center justify-center rounded-lg border text-[11px] font-black italic shadow-inner transition-all duration-700",
                    isStaffTheme 
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-500" 
                      : "bg-primary/20 border-primary/40 text-primary"
                )}>
                  {user?.fullName?.charAt(0).toUpperCase() || "?"}
                </div>
              </div>

              <div className="hidden xl:flex flex-col items-start min-w-0">
                <span className="text-[11px] font-black uppercase italic tracking-tight leading-none truncate max-w-[100px] text-foreground">
                  {user?.fullName?.split(' ')[0] || "OPERATOR"}
                </span>
                <span className={cn(
                  "text-[7px] font-bold uppercase tracking-[0.2em] mt-1",
                  isStaffTheme ? "text-amber-500/40" : "text-primary/40"
                )}>
                  {isStaff ? "STAFF_ROOT" : "NODE_OPS"}
                </span>
              </div>
              <ChevronDown className="size-3 opacity-20 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 rounded-2xl border-white/5 bg-zinc-950 p-2 shadow-2xl backdrop-blur-3xl animate-in zoom-in-95 duration-500">
             <DropdownMenuLabel className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.4em] opacity-20 italic">
               Identity_Protocol_v16.31
             </DropdownMenuLabel>
             
             <DropdownMenuItem className="rounded-lg py-3 cursor-pointer focus:bg-white/5" asChild>
                <Link href="/profile" className="flex items-center px-4">
                  <User className={cn("mr-3 size-4", isStaffTheme ? "text-amber-500" : "text-primary")} />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Identity_Node</span>
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