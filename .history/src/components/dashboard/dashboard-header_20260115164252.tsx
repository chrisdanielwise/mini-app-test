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

// 📡 Notification Subsystem
import { NotificationGroup } from "./notification-group";

interface HeaderProps {
  user: {
    telegramId: string;
    fullName: string;
    username?: string;
  };
  merchant?: {
    companyName: string;
  };
}

/**
 * 🌊 DASHBOARD_HEADER (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with Role-Based Radiance.
 */
export function DashboardHeader({ user, merchant }: HeaderProps) {
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();

  // 🛰️ DEVICE & AUTH INGRESS
  const { isReady, screenSize, isMobile, safeArea } = useDeviceContext();
  const { isStaff } = useInstitutionalAuth();

  const themeAmber = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady)
    return (
      <div className="h-20 md:h-24 w-full bg-card/20 animate-pulse border-b border-white/5" />
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] flex w-full items-center justify-between border-b backdrop-blur-3xl transition-all duration-1000",
        screenSize === "xs" ? "h-20 px-6" : "h-24 px-10",
        themeAmber
          ? "border-amber-500/20 bg-amber-500/[0.04]"
          : "border-white/5 bg-card/60 shadow-apex"
      )}
      style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
    >
      {/* 🌫️ SUBSURFACE RADIANCE: Identity Wash */}
      <div
        className={cn(
          "absolute inset-0 opacity-10 pointer-events-none transition-colors duration-[2000ms]",
          themeAmber
            ? "bg-[radial-gradient(circle_at_0%_0%,#f59e0b,transparent_50%)]"
            : "bg-[radial-gradient(circle_at_0%_0%,var(--primary),transparent_50%)]"
        )}
      />

      {/* --- LEFT: IDENTITY & SEARCH --- */}
      <div className="flex items-center gap-8 md:gap-12 min-w-0 flex-1 relative z-10">
        
        {/* 🏛️ INSTITUTIONAL BRANDING */}
        <div className="hidden lg:flex flex-col shrink-0">
          <div className="flex items-center gap-3 italic">
            {themeAmber ? (
              <Globe className="size-4 text-amber-500 animate-pulse" />
            ) : (
              <Activity className="size-4 text-primary animate-pulse" />
            )}
            <h3 className={cn(
              "text-[10px] font-black uppercase tracking-[0.5em]",
              themeAmber ? "text-amber-500" : "text-primary"
            )}>
              {themeAmber ? "Universal_Oversight" : "Node_Ingress"}
            </h3>
          </div>
          <p className="text-xl font-black uppercase italic tracking-tighter leading-none mt-2 text-foreground">
            {themeAmber ? "Global Dashboard" : merchant?.companyName || "Zipha Node"}
          </p>
        </div>

        {/* 🌊 FLUID SEARCH MEMBRANE */}
        <div className="relative group flex-1 max-w-lg">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4 z-10 pointer-events-none">
            <Search className={cn(
              "size-4 md:size-5 text-muted-foreground/30 transition-colors duration-700",
              themeAmber ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
            )} />
            <div className="hidden md:block h-5 w-px bg-white/5" />
          </div>
          <input
            type="text"
            onFocus={() => impact("light")}
            placeholder={themeAmber ? "GLOBAL_QUERY..." : "FILTER_TELEMETRY..."}
            className={cn(
              "h-12 md:h-16 w-full rounded-2xl md:rounded-[1.8rem] border bg-white/[0.03] pl-16 pr-8 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] italic",
              "transition-all duration-700 focus:outline-none focus:bg-white/[0.08] placeholder:opacity-10",
              themeAmber 
                ? "border-amber-500/10 focus:border-amber-500/40" 
                : "border-white/5 focus:border-primary/40"
            )}
          />
        </div>
      </div>

      {/* --- RIGHT: ACTIONS & PROTOCOLS --- */}
      <div className="flex items-center gap-4 md:gap-8 ml-8 shrink-0 relative z-10">
        
        {/* 🛰️ NOTIFICATION NODE: Integrated State Controller */}
        <NotificationGroup />

        <div className="hidden sm:block h-10 w-px bg-white/5 mx-2" />

        {/* 👤 IDENTITY DROPCONTROL */}
        <DropdownMenu onOpenChange={() => selectionChange()}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-4 rounded-2xl md:rounded-[1.5rem] px-3 h-14 md:h-16 hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 active:scale-95"
            >
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "flex size-11 md:size-12 items-center justify-center rounded-xl md:rounded-2xl border text-lg font-black italic shadow-inner transition-all duration-1000",
                    themeAmber
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                      : "bg-primary/10 border-primary/30 text-primary"
                  )}
                >
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-background flex items-center justify-center border border-white/10 shadow-apex">
                  {isStaff ? (
                    <ShieldCheck className="size-3.5 text-amber-500" />
                  ) : (
                    <Zap className="size-3.5 text-primary fill-current" />
                  )}
                </div>
              </div>

              <div className="hidden flex-col items-start lg:flex min-w-0">
                <span className="text-base font-black uppercase italic tracking-tighter leading-none truncate max-w-[140px] text-foreground">
                  {user.fullName}
                </span>
                <span className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.3em] mt-1.5 italic">
                  {isStaff ? "STAFF_OVERSIGHT" : `NODE_@${user.username || "OPERATOR"}`}
                </span>
              </div>
              <ChevronDown className="size-4 text-muted-foreground/20 shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={15}
            className="w-72 rounded-[2.5rem] border-white/10 bg-card/90 backdrop-blur-3xl p-4 shadow-apex animate-in zoom-in-95 duration-700"
          >
            <DropdownMenuLabel className="px-5 py-4 text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">
              Identity_Protocol_v16.31
            </DropdownMenuLabel>

            <DropdownMenuItem className="rounded-2xl py-5 cursor-pointer focus:bg-white/5" asChild>
              <Link href="/profile" className="flex items-center w-full px-5">
                <User className="mr-4 size-5 opacity-40" />
                <span className="text-[11px] font-black uppercase tracking-widest italic">Identity_Hub</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="rounded-2xl py-5 cursor-pointer focus:bg-white/5" asChild>
              <Link href="/settings" className="flex items-center w-full px-5">
                <Settings className="mr-4 size-5 opacity-40" />
                <span className="text-[11px] font-black uppercase tracking-widest italic">System_Config</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/5 my-3 mx-2" />

            <DropdownMenuItem
              className="rounded-2xl py-5 cursor-pointer text-destructive focus:bg-destructive/10 transition-all px-5"
              onClick={() => {
                impact("heavy");
                window.location.href = "/";
              }}
            >
              <LogOut className="mr-4 size-5 opacity-60" />
              <span className="text-[11px] font-black uppercase tracking-widest italic">Terminate_Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}