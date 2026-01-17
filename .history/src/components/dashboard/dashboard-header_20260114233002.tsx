"use client";

import * as React from "react";
import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Terminal,
  ShieldCheck,
  Zap,
  Globe
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
import { useLayout } from "@/context/layout-provider";
import { useTelegramContext } from "@/components/providers/telegram-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

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
 * 🌊 FLUID DASHBOARD HEADER (v16.16.12)
 * Logic: Haptic-synced identity horizon with Role-Based Radiance.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function DashboardHeader({ user, merchant }: HeaderProps) {
  const { flavor } = useLayout();
  const { auth } = useTelegramContext();
  const { impact, selectionChange } = useHaptics();
  
  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);
  const themeAmber = flavor === "AMBER";

  return (
    <header className={cn(
      "sticky top-0 z-50 flex h-18 md:h-22 w-full items-center justify-between border-b px-6 md:px-10 backdrop-blur-3xl",
      "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
      themeAmber ? "border-amber-500/20 bg-amber-500/[0.03]" : "border-white/5 bg-card/60 shadow-2xl"
    )}>
      
      {/* --- LEFT: IDENTITY & SEARCH NODE --- */}
      <div className="flex items-center gap-6 md:gap-10 min-w-0 flex-1">
        {/* Merchant Branding: Institutional Vector */}
        <div className="hidden lg:flex flex-col shrink-0">
          <div className="flex items-center gap-3">
            {themeAmber ? (
              <Globe className="size-4 text-amber-500 animate-pulse" />
            ) : (
              <Zap className="size-4 text-primary fill-current animate-pulse" />
            )}
            <h3 className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em] italic",
              themeAmber ? "text-amber-500" : "text-primary"
            )}>
              {themeAmber ? "Platform_Oversight" : "Active_Node"}
            </h3>
          </div>
          <p className="text-lg font-black uppercase italic tracking-tighter leading-none mt-1 text-foreground">
            {themeAmber ? "Global Dashboard" : merchant?.companyName || "Zipha Node"}
          </p>
        </div>

        {/* 🌊 FLUID SEARCH PROTOCOL */}
        <div className="relative group flex-1 max-w-md">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-4 z-10 pointer-events-none">
            <Search className={cn(
              "size-4 text-muted-foreground/30 transition-colors",
              themeAmber ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
            )} />
            <div className="hidden md:block h-4 w-px bg-white/5" />
          </div>
          <input
            type="text"
            onFocus={() => impact("light")}
            placeholder={themeAmber ? "GLOBAL_QUERY..." : "FILTER_TELEMETRY..."}
            className={cn(
              "h-12 md:h-14 w-full rounded-2xl border bg-white/5 pl-14 pr-6 text-[10px] font-black uppercase tracking-[0.2em]",
              "transition-all duration-500 focus:outline-none focus:ring-4 focus:bg-white/[0.08] placeholder:opacity-20",
              themeAmber 
                ? "border-amber-500/20 focus:ring-amber-500/10 focus:border-amber-500/40" 
                : "border-white/5 focus:ring-primary/10 focus:border-primary/40"
            )}
          />
        </div>
      </div>

      {/* --- RIGHT: ACTIONS & PROTOCOLS --- */}
      <div className="flex items-center gap-4 md:gap-6 ml-6 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => impact("light")}
          className={cn(
            "relative size-12 rounded-2xl bg-white/5 border border-white/5 group transition-all active:scale-90",
            themeAmber ? "hover:bg-amber-500/10" : "hover:bg-primary/10"
          )}
        >
          <Bell className={cn(
            "size-5 text-muted-foreground/40 transition-colors group-hover:text-foreground",
            themeAmber ? "group-hover:text-amber-500" : "group-hover:text-primary"
          )} />
          <span className={cn(
            "absolute right-3 top-3 size-2 rounded-full animate-ping",
            themeAmber ? "bg-amber-500" : "bg-primary"
          )} />
        </Button>

        <div className="hidden sm:block h-8 w-px bg-white/5 mx-2" />

        <DropdownMenu onOpenChange={() => selectionChange()}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-4 rounded-2xl px-3 h-14 hover:bg-white/5 transition-all border border-transparent hover:border-white/10 active:scale-95"
            >
              <div className="relative shrink-0">
                <div className={cn(
                  "flex size-11 items-center justify-center rounded-[1.25rem] border text-base font-black italic shadow-inner",
                  themeAmber ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-primary/10 border-primary/30 text-primary"
                )}>
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-background flex items-center justify-center border border-white/10 shadow-2xl">
                  {isStaff ? (
                    <ShieldCheck className="size-3.5 text-amber-500" />
                  ) : (
                    <Zap className="size-3.5 text-primary fill-current" />
                  )}
                </div>
              </div>
              
              <div className="hidden flex-col items-start lg:flex min-w-0">
                <span className="text-sm font-black uppercase italic tracking-tighter leading-none truncate max-w-[120px] text-foreground">
                  {user.fullName}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mt-1.5 italic">
                  {isStaff ? "🛡️ SYSTEM_STAFF" : `@${user.username || "user"}`}
                </span>
              </div>
              <ChevronDown className="size-3.5 text-muted-foreground/20 shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 rounded-[2rem] border-white/10 bg-card/90 backdrop-blur-3xl p-3 shadow-2xl animate-in zoom-in-95 duration-500">
            <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
              Identity_Protocol
            </DropdownMenuLabel>

            <DropdownMenuItem 
              className={cn("rounded-xl py-4 cursor-pointer focus:bg-white/5", themeAmber && "focus:text-amber-500")} 
              asChild
            >
              <Link href="/profile" className="flex items-center w-full px-4">
                <User className="mr-3 size-4 opacity-40" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">Profile_Hub</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className={cn("rounded-xl py-4 cursor-pointer focus:bg-white/5", themeAmber && "focus:text-amber-500")} 
              asChild
            >
              <Link href="/settings" className="flex items-center w-full px-4">
                <Settings className="mr-3 size-4 opacity-40" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">System_Config</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/5 my-2 mx-2" />

            <DropdownMenuItem
              className="rounded-xl py-4 cursor-pointer text-destructive focus:bg-destructive/10 transition-all px-4"
              onClick={() => { impact("heavy"); window.location.href = "/"; }}
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