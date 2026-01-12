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
  Zap
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

interface HeaderProps {
  user: {
    telegramId: string; 
    fullName: string;
    username?: string;
  };
  merchant: {
    companyName: string;
  };
}

/**
 * 🛰️ DASHBOARD HEADER (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive safe-zones and institutional touch-targets for command parity.
 */
export function DashboardHeader({ user, merchant }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 md:h-20 w-full items-center justify-between border-b border-border/40 bg-background/60 px-4 sm:px-6 md:px-8 backdrop-blur-2xl transition-all duration-500">
      
      {/* --- LEFT: IDENTITY & SEARCH NODE --- */}
      <div className="flex items-center gap-3 sm:gap-6 md:gap-8 min-w-0 flex-1">
        {/* Merchant Branding (Visible on Tablets/Desktop) */}
        <div className="hidden lg:flex flex-col shrink-0 min-w-0">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary fill-current animate-pulse" />
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary">
              Active Node
            </p>
          </div>
          <p className="text-sm font-black uppercase italic tracking-tighter leading-none mt-1 truncate max-w-[120px] xl:max-w-none">
            {merchant.companyName}
          </p>
        </div>

        {/* Fluid Search Protocol */}
        <div className="relative group flex-1 max-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <div className="hidden md:block h-3 w-px bg-border/40" />
          </div>
          <input
            type="text"
            placeholder="FILTER..."
            className="h-10 md:h-12 w-full rounded-xl md:rounded-2xl border border-border/40 bg-card/40 pl-10 md:pl-12 pr-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:opacity-30 shadow-inner"
          />
        </div>
      </div>

      {/* --- RIGHT: ACTIONS & PROTOCOLS --- */}
      <div className="flex items-center gap-2 sm:gap-4 ml-3 sm:ml-4 shrink-0">
        {/* Notification Hub */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => hapticFeedback("light")}
          className="relative h-10 w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-muted/20 border border-border/10 hover:bg-primary/5 group transition-all active:scale-90"
        >
          <Bell className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute right-2.5 top-2.5 md:right-3 md:top-3 h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-500 animate-pulse ring-2 md:ring-4 ring-background" />
        </Button>

        <div className="hidden sm:block h-6 md:h-8 w-px bg-border/40 mx-1 md:mx-2" />

        {/* User Command Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              onClick={() => hapticFeedback("light")}
              className="flex items-center gap-2 md:gap-4 rounded-xl md:rounded-[1.25rem] px-2 md:px-3 h-10 md:h-14 hover:bg-muted/30 transition-all border border-transparent hover:border-border/40 active:scale-95"
            >
              <div className="relative shrink-0">
                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-primary/10 border border-primary/20 text-xs md:text-sm font-black text-primary italic shadow-inner">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 md:h-4 md:w-4 rounded-full bg-background flex items-center justify-center border border-border/10 shadow-sm">
                  <ShieldCheck className="h-2.5 w-2.5 md:h-3 md:w-3 text-emerald-500" />
                </div>
              </div>
              
              <div className="hidden flex-col items-start lg:flex min-w-0">
                <span className="text-xs font-black uppercase italic tracking-tighter leading-none truncate max-w-[100px]">{user.fullName}</span>
                {user.username && (
                  <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60 truncate">
                    @{user.username}
                  </span>
                )}
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
              className="rounded-lg md:rounded-xl py-3 md:py-4 cursor-pointer focus:bg-primary/10 transition-colors" 
              asChild
            >
              <Link href="/dashboard/profile" className="flex items-center w-full">
                <User className="mr-3 h-4 w-4 opacity-60" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Profile Hub</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => hapticFeedback("light")}
              className="rounded-lg md:rounded-xl py-3 md:py-4 cursor-pointer focus:bg-primary/10 transition-colors" 
              asChild
            >
              <Link href="/dashboard/settings" className="flex items-center w-full">
                <Settings className="mr-3 h-4 w-4 opacity-60" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">System Config</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border/20 my-1 md:my-2 mx-1 md:mx-2" />

            <DropdownMenuItem
              className="rounded-lg md:rounded-xl py-3 md:py-4 cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 transition-all"
              onClick={() => { hapticFeedback("warning"); window.location.href = "/dashboard/login"; }}
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