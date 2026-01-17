"use client";

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
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";
import { useTelegramContext } from "@/components/providers/telegram-provider";

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
 * 🛰️ DASHBOARD HEADER
 * Logic: Synchronized with Universal Identity. 
 * Adaptive: Shifts flavor (Amber/Emerald) based on Staff/Merchant context.
 */
export function DashboardHeader({ user, merchant }: HeaderProps) {
  const { flavor } = useLayout();
  const { auth } = useTelegramContext();
  
  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);
  const themeAmber = flavor === "AMBER";

  return (
    <header className={cn(
      "sticky top-0 z-50 flex h-16 md:h-20 w-full items-center justify-between border-b px-4 sm:px-6 md:px-8 backdrop-blur-2xl transition-all duration-500",
      themeAmber ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-border/40 bg-background/60"
    )}>
      
      {/* --- LEFT: IDENTITY & SEARCH NODE --- */}
      <div className="flex items-center gap-3 sm:gap-6 md:gap-8 min-w-0 flex-1">
        {/* Merchant Branding / Platform Status */}
        <div className="hidden lg:flex flex-col shrink-0 min-w-0">
          <div className="flex items-center gap-2">
            {themeAmber ? (
              <Globe className="h-3 w-3 text-amber-500 animate-pulse" />
            ) : (
              <Zap className="h-3 w-3 text-primary fill-current animate-pulse" />
            )}
            <p className={cn(
              "text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]",
              themeAmber ? "text-amber-500" : "text-primary"
            )}>
              {themeAmber ? "Platform_Oversight" : "Active Node"}
            </p>
          </div>
          <p className="text-sm font-black uppercase italic tracking-tighter leading-none mt-1 truncate max-w-[120px] xl:max-w-none text-foreground">
            {themeAmber ? "Global Dashboard" : merchant?.companyName || "Zipha Node"}
          </p>
        </div>

        {/* Fluid Search Protocol */}
        <div className="relative group flex-1 max-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <Search className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-colors",
              themeAmber ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
            )} />
            <div className="hidden md:block h-3 w-px bg-border/40" />
          </div>
          <input
            type="text"
            placeholder={themeAmber ? "GLOBAL_SEARCH..." : "FILTER..."}
            className={cn(
              "h-10 md:h-12 w-full rounded-xl md:rounded-2xl border bg-card/40 pl-10 md:pl-12 pr-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 placeholder:opacity-30 shadow-inner",
              themeAmber 
                ? "border-amber-500/20 focus:ring-amber-500/20 focus:border-amber-500/40" 
                : "border-border/40 focus:ring-primary/20 focus:border-primary/40"
            )}
          />
        </div>
      </div>

      {/* --- RIGHT: ACTIONS & PROTOCOLS --- */}
      <div className="flex items-center gap-2 sm:gap-4 ml-3 sm:ml-4 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => hapticFeedback("light")}
          className={cn(
            "relative h-10 w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-muted/20 border border-border/10 group transition-all active:scale-90",
            themeAmber ? "hover:bg-amber-500/10" : "hover:bg-primary/5"
          )}
        >
          <Bell className={cn(
            "h-4 w-4 md:h-5 md:w-5 text-muted-foreground transition-colors",
            themeAmber ? "group-hover:text-amber-500" : "group-hover:text-primary"
          )} />
          <span className={cn(
            "absolute right-2.5 top-2.5 md:right-3 md:top-3 h-1.5 w-1.5 md:h-2 md:w-2 rounded-full animate-pulse ring-2 md:ring-4 ring-background",
            themeAmber ? "bg-amber-500" : "bg-emerald-500"
          )} />
        </Button>

        <div className="hidden sm:block h-6 md:h-8 w-px bg-border/40 mx-1 md:mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              onClick={() => hapticFeedback("light")}
              className="flex items-center gap-2 md:gap-4 rounded-xl md:rounded-[1.25rem] px-2 md:px-3 h-10 md:h-14 hover:bg-muted/30 transition-all border border-transparent hover:border-border/40 active:scale-95"
            >
              <div className="relative shrink-0">
                <div className={cn(
                  "flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl border text-xs md:text-sm font-black italic shadow-inner",
                  themeAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 md:h-4 md:w-4 rounded-full bg-background flex items-center justify-center border border-border/10 shadow-sm">
                  {isStaff ? (
                    <ShieldCheck className="h-2.5 w-2.5 md:h-3 md:w-3 text-amber-500" />
                  ) : (
                    <Zap className="h-2.5 w-2.5 md:h-3 md:w-3 text-emerald-500" />
                  )}
                </div>
              </div>
              
              <div className="hidden flex-col items-start lg:flex min-w-0">
                <span className="text-xs font-black uppercase italic tracking-tighter leading-none truncate max-w-[100px] text-foreground">
                  {user.fullName}
                </span>
                <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60 truncate">
                  {isStaff ? "🛡️ SYSTEM_STAFF" : `@${user.username || "user"}`}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground opacity-40 shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 md:w-64 rounded-2xl md:rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-3xl p-2 md:p-3 shadow-2xl animate-in zoom-in-95 duration-300">
            <DropdownMenuLabel className="px-3 py-2 md:py-3 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground opacity-50">
              Identity Protocol
            </DropdownMenuLabel>

            <DropdownMenuItem 
              onClick={() => hapticFeedback("light")}
              className={cn(
                "rounded-lg md:rounded-xl py-3 md:py-4 cursor-pointer transition-colors",
                themeAmber ? "focus:bg-amber-500/10" : "focus:bg-primary/10"
              )} 
              asChild
            >
              <Link href="/profile" className="flex items-center w-full">
                <User className="mr-3 h-4 w-4 opacity-60" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Profile Hub</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => hapticFeedback("light")}
              className={cn(
                "rounded-lg md:rounded-xl py-3 md:py-4 cursor-pointer transition-colors",
                themeAmber ? "focus:bg-amber-500/10" : "focus:bg-primary/10"
              )} 
              asChild
            >
              <Link href="/settings" className="flex items-center w-full">
                <Settings className="mr-3 h-4 w-4 opacity-60" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">System Config</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border/20 my-1 md:my-2 mx-1 md:mx-2" />

            <DropdownMenuItem
              className="rounded-lg md:rounded-xl py-3 md:py-4 cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 transition-all"
              onClick={() => { hapticFeedback("warning"); window.location.href = "/"; }}
            >
              <LogOut className="mr-3 h-4 w-4 opacity-60" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}