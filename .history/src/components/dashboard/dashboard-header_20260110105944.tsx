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
 * 🛰️ DASHBOARD HEADER (Tier 2)
 * High-resiliency Command Strip for institutional node management.
 */
export function DashboardHeader({ user, merchant }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-border/40 bg-background/60 px-6 backdrop-blur-2xl transition-all duration-500">
      
      {/* --- LEFT: IDENTITY & SEARCH NODE --- */}
      <div className="flex items-center gap-8">
        <div className="hidden xl:flex flex-col">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary fill-current" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Active Node
            </p>
          </div>
          <p className="text-sm font-black uppercase italic tracking-tighter leading-none mt-1">
            {merchant.companyName}
          </p>
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <div className="h-3 w-px bg-border/40" />
          </div>
          <input
            type="text"
            placeholder="FILTER TELEMETRY..."
            className="h-12 w-64 rounded-2xl border border-border/40 bg-card/40 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 lg:w-96 placeholder:opacity-30 shadow-inner"
          />
        </div>
      </div>

      {/* --- RIGHT: ACTIONS & PROTOCOLS --- */}
      <div className="flex items-center gap-4">
        {/* Notification Hub */}
        <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-2xl bg-muted/20 border border-border/10 hover:bg-primary/5 group transition-all">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-background" />
        </Button>

        <div className="hidden sm:block h-8 w-px bg-border/40 mx-2" />

        {/* User Command Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-4 rounded-[1.25rem] px-3 py-6 hover:bg-muted/30 transition-all border border-transparent hover:border-border/40">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-sm font-black text-primary italic shadow-inner">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-background flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                </div>
              </div>
              
              <div className="hidden flex-col items-start lg:flex">
                <span className="text-xs font-black uppercase italic tracking-tighter leading-none">{user.fullName}</span>
                {user.username && (
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                    @{user.username}
                  </span>
                )}
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground opacity-40" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-3xl p-3 shadow-2xl animate-in zoom-in-95 duration-300">
            <DropdownMenuLabel className="px-3 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">
              Identity Protocol
            </DropdownMenuLabel>

            <DropdownMenuItem className="rounded-xl py-4 cursor-pointer focus:bg-primary/10 transition-colors" asChild>
              <Link href="/dashboard/profile" className="flex items-center w-full">
                <User className="mr-3 h-4 w-4 opacity-60" />
                <span className="text-[10px] font-black uppercase tracking-widest">Profile Hub</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="rounded-xl py-4 cursor-pointer focus:bg-primary/10 transition-colors" asChild>
              <Link href="/dashboard/settings" className="flex items-center w-full">
                <Settings className="mr-3 h-4 w-4 opacity-60" />
                <span className="text-[10px] font-black uppercase tracking-widest">System Config</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border/40 my-2 mx-2" />

            <DropdownMenuItem
              className="rounded-xl py-4 cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 transition-all"
              onClick={() => { window.location.href = "/dashboard/login"; }}
            >
              <LogOut className="mr-3 h-4 w-4 opacity-60" />
              <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}