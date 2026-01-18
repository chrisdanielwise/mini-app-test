"use client";

import * as React from "react";
import Link from "next/link";
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
  Globe,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional UI Nodes
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 🏛️ Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { useTelegramContext } from "../providers/telegram-provider";

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
 * 🛰️ DASHBOARD_HEADER (Institutional v16.16.89)
 * Strategy: Stationary Horizon HUD & Vertical Compression.
 * Mission: Synchronize Identity Telemetry with Hardware Handshake.
 */
export function DashboardHeader({ user, merchant }: HeaderProps) {
  const { flavor } = useLayout();
  const { impact, selectionChange, notification } = useHaptics();
  const { auth } = useTelegramContext();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);
  const themeAmber = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevents layout snap during hardware handshake
  if (!isReady) return (
    <header className="h-14 w-full bg-black/40 border-b border-white/5 animate-pulse" />
  );

  return (
    <header 
      className={cn(
        "sticky top-0 z-[60] flex items-center justify-between w-full transition-all duration-700 backdrop-blur-3xl border-b",
        isMobile ? "h-14 px-4" : "h-16 md:h-20 px-6 md:px-8",
        themeAmber 
          ? "bg-amber-500/[0.04] border-amber-500/10 shadow-sm" 
          : "bg-black/60 border-white/5 shadow-2xl"
      )}
      style={{ 
        // 📐 HARDWARE_CLEARANCE: Syncs with RootLayout's Notch-Sentinel
        marginTop: 0 
      }}
    >
      
      {/* --- LEFT: IDENTITY NODE --- */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex flex-col min-w-0 leading-none">
          <div className="flex items-center gap-2 italic opacity-40 mb-1">
            {themeAmber ? (
              <Globe className="h-2.5 w-2.5 text-amber-500 animate-pulse" />
            ) : (
              <Zap className="h-2.5 w-2.5 text-primary" />
            )}
            <h3 className={cn(
              "text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em]",
              themeAmber ? "text-amber-500" : "text-muted-foreground"
            )}>
              {isStaff ? "Universal_Oversight" : "Node_Active"}
            </h3>
          </div>
          <p className="text-sm md:text-xl font-black uppercase italic tracking-tighter text-foreground truncate leading-none">
            {themeAmber ? "Global Dashboard" : merchant?.companyName || "Zipha Node"}
          </p>
        </div>
      </div>

      {/* --- CENTER: TELEMETRY (Mobile-Aligned) --- */}
      {isMobile ? (
        <div className="flex flex-col items-center leading-none absolute left-1/2 -translate-x-1/2 mt-1">
          <span className="text-[6px] font-black uppercase tracking-[0.4em] opacity-20 italic">Signal</span>
          <div className="flex items-center gap-1 mt-0.5">
            <div className={cn("size-1 rounded-full animate-ping", themeAmber ? "bg-amber-500" : "bg-primary")} />
            <span className="text-[8px] font-black uppercase tracking-tighter text-foreground italic">Sync_OK</span>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex relative group flex-1 max-w-sm mx-10">
          <Search className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 size-3.5 opacity-20 transition-colors",
            themeAmber ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
          )} />
          <input
            type="text"
            onFocus={() => impact("light")}
            placeholder={themeAmber ? "QUERY_INDEX..." : "FILTER_NODE..."}
            className={cn(
              "h-10 w-full rounded-xl border bg-white/[0.01] pl-11 pr-4 text-[9px] font-black uppercase tracking-widest transition-all italic outline-none",
              themeAmber 
                ? "border-amber-500/10 focus:ring-amber-500/5 focus:border-amber-500/20" 
                : "border-white/5 focus:ring-primary/5 focus:border-primary/20"
            )}
          />
        </div>
      )}

      {/* --- RIGHT: ACTIONS --- */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            impact("medium");
            // Handshake for opening the Signal Ledger
          }}
          className={cn(
            "relative size-9 md:size-11 rounded-xl md:rounded-2xl border transition-all active:scale-90",
            themeAmber ? "bg-amber-500/5 border-amber-500/10" : "bg-white/[0.01] border-white/5"
          )}
        >
          <Bell className={cn(
            "size-4 md:size-5 opacity-30 transition-colors",
            themeAmber ? "text-amber-500" : "text-primary"
          )} />
          <span className={cn(
            "absolute top-2.5 right-2.5 size-1.5 rounded-full animate-pulse",
            themeAmber ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-primary shadow-[0_0_8px_#10b981]"
          )} />
        </Button>

        <div className="h-6 w-px bg-white/5 mx-1 hidden sm:block" />

        <DropdownMenu onOpenChange={(val) => val && selectionChange()}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-3 rounded-xl md:rounded-2xl px-2 h-10 md:h-14 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all outline-none"
            >
              <div className="relative shrink-0">
                <div className={cn(
                  "size-8 md:size-10 flex items-center justify-center rounded-lg md:rounded-xl border text-xs font-black italic shadow-inner",
                  themeAmber ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-white/10 text-primary"
                )}>
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-black flex items-center justify-center border border-white/10 shadow-sm">
                  {isStaff ? (
                    <ShieldCheck className="size-2 text-amber-500" />
                  ) : (
                    <Zap className="size-2 text-primary" />
                  )}
                </div>
              </div>
              <ChevronDown className="size-3 text-white/20 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="end" 
            className="w-64 rounded-[1.5rem] md:rounded-[2rem] border-white/5 bg-zinc-950/95 backdrop-blur-3xl p-2 shadow-3xl z-[100]"
          >
            <DropdownMenuLabel className="px-4 py-3 text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
              Identity_Protocol
            </DropdownMenuLabel>
            
            <DropdownMenuItem asChild onClick={() => impact("light")} className="rounded-xl py-3 focus:bg-white/5 cursor-pointer">
              <Link href="/dashboard/profile" className="flex items-center w-full">
                <User className="mr-3 size-4 opacity-30" />
                <span className="text-[9px] font-black uppercase tracking-widest">Profile_Hub</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild onClick={() => impact("light")} className="rounded-xl py-3 focus:bg-white/5 cursor-pointer">
              <Link href="/dashboard/settings" className="flex items-center w-full">
                <Settings className="mr-3 size-4 opacity-30" />
                <span className="text-[9px] font-black uppercase tracking-widest">Config_Node</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/5 my-2 mx-2" />

            <DropdownMenuItem
              className="rounded-xl py-3 focus:bg-rose-500/10 text-rose-500 cursor-pointer"
              onClick={() => { 
                notification("warning"); 
                window.location.href = "/login"; 
              }}
            >
              <LogOut className="mr-3 size-4 opacity-60" />
              <span className="text-[9px] font-black uppercase tracking-widest">Terminate_Session</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}