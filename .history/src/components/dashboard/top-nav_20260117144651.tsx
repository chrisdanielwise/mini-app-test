"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation";
import { Search, Zap, ChevronRight, Bell, Activity, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { Button } from "@/components/ui/button";
import { IdentityBadge } from "@/components/dashboard/identity-badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

/**
 * 🛰️ DASHBOARD_TOP_NAV (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Horizon HUD.
 * Fix: Synchronized mt-[6px] alignment to match Sheet Close trigger.
 * Fix: Center-anchored telemetry for world-standard balance.
 */
export function DashboardTopNav({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact } = useHaptics();

  const { isReady, isMobile } = useDeviceContext();

  const role = context?.role || "merchant";
  const config = context?.config || {};
  const isPlatformStaff = [
    "super_admin",
    "platform_manager",
    "platform_support",
  ].includes(role);
  const themeAmber = flavor === "AMBER";

  const activeItem = NAVIGATION_CONFIG.find((item) =>
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href)
  );

  // 🛡️ HYDRATION SHIELD
  if (!isReady)
    return (
      <header className="h-14 w-full bg-black/40 border-b border-white/5 animate-pulse" />
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-[60] flex items-center justify-between w-full transition-all duration-700 backdrop-blur-xl border-b",
        // 🛡️ TACTICAL COMPRESSION: h-14 footprint aligned with RootLayout
        isMobile ? "h-14 px-4" : "h-14 md:h-16 px-6 md:px-8",
        themeAmber
          ? "bg-amber-500/[0.01] border-amber-500/10 shadow-sm"
          : "bg-black/60 border-white/5 shadow-2xl"
      )}
    >
      {/* --- LEFT: MOBILE HAMBURGER / DESKTOP IDENTITY --- */}
      <div className="flex items-center gap-4 min-w-0">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => impact("medium")}
                className={cn(
                  "size-9 rounded-xl bg-white/5 border border-white/10 active:scale-95",
                  /* 🏁 THE SYNC: Buffer (18px) + mt-[6px] = 24px total offset */
                  "mt-[6px] ml-1"
                )}
              >
                <Menu
                  className={cn(
                    "size-4.5",
                    themeAmber ? "text-amber-500" : "text-primary"
                  )}
                />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] p-0 bg-zinc-950 border-r border-white/5"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Terminal_Navigation</SheetTitle>
              </SheetHeader>
              <DashboardSidebar context={context} />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <div
              className={cn(
                "size-9 md:size-10 shrink-0 rounded-xl flex items-center justify-center font-black italic shadow-inner transition-all active:scale-90",
                themeAmber ? "bg-amber-500 text-black" : "bg-primary text-white"
              )}
            >
              Z
            </div>
            <div className="flex flex-col min-w-0 leading-none">
              <span className="font-black uppercase italic text-[11px] md:text-sm tracking-tighter text-foreground truncate max-w-[140px]">
                {config?.companyName ||
                  (isPlatformStaff ? "PLATFORM_ROOT" : "NODE_v16")}
              </span>
              <div
                className="mt-1.5 origin-left scale-90"
                onClick={() => impact("light")}
              >
                <IdentityBadge role={role} />
              </div>
            </div>
          </div>
        )}

        {/* --- DESKTOP BREADCRUMB --- */}
        {!isMobile && (
          <div className="hidden lg:flex items-center gap-4 ml-2 pl-6 border-l border-white/5">
            <span className="text-[7.5px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 italic">
              {isPlatformStaff ? "OVERSIGHT" : "TERMINAL"}
            </span>
            <ChevronRight className="size-3 text-white/5" />
            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] italic truncate max-w-[140px]",
                themeAmber ? "text-amber-500/60" : "text-primary/60"
              )}
            >
              {activeItem?.name || "ROOT_NODE"}
            </span>
          </div>
        )}
      </div>

      {/* --- CENTER: MOBILE STATUS / DESKTOP SEARCH --- */}
      {isMobile ? (
        <div className="flex flex-col items-center leading-none absolute left-1/2 -translate-x-1/2">
          {/* 🏁 THE SYNC: HUD Elements must share the same vertical displacement */}
          <div className="mt-[6px]">
            <span className="text-[6px] font-black uppercase tracking-[0.4em] opacity-20 italic">
              Node_Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={cn(
                  "size-1 rounded-full animate-pulse",
                  themeAmber ? "bg-amber-500" : "bg-primary"
                )}
              />
              <span className="text-[8px] font-black uppercase tracking-tighter text-foreground italic">
                SYNC_OK
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden xl:flex relative group px-10 flex-1 max-w-lg transition-all">
          <Search
            className={cn(
              "absolute left-14 top-1/2 -translate-y-1/2 size-4 opacity-20",
              themeAmber
                ? "group-focus-within:text-amber-500"
                : "group-focus-within:text-primary"
            )}
          />
          <input
            onFocus={() => impact("light")}
            type="text"
            placeholder={
              isPlatformStaff ? "QUERY_CLUSTERS..." : "FILTER_NODE..."
            }
            className={cn(
              "w-full h-10 border rounded-xl pl-11 pr-6 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-4 transition-all placeholder:opacity-10 italic",
              themeAmber
                ? "bg-amber-500/[0.02] border-amber-500/10 focus:ring-amber-500/5"
                : "bg-white/[0.01] border-white/5 focus:ring-primary/5"
            )}
          />
        </div>
      )}

      {/* --- RIGHT: SYSTEM ACTIONS --- */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Aligning Right Actions with the HUD Line */}
        <div className="mt-[6px] flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => impact("light")}
            className={cn(
              "relative size-9 rounded-xl border transition-all active:scale-90 group",
              themeAmber
                ? "bg-amber-500/5 border-amber-500/10"
                : "bg-white/[0.01] border-white/5"
            )}
          >
            <Bell
              className={cn(
                "size-4 transition-colors",
                themeAmber
                  ? "text-amber-500/20 group-hover:text-amber-500"
                  : "text-white/10 group-hover:text-primary"
              )}
            />
            <span
              className={cn(
                "absolute top-2.5 right-2.5 size-1.5 rounded-full",
                themeAmber ? "bg-amber-500" : "bg-primary"
              )}
            />
          </Button>

          <div className={cn("h-6 w-px bg-white/5 mx-1", isMobile && "hidden")} />

          {isMobile && <IdentityBadge role={role} />}
        </div>

        {/* Desktop-Only Command */}
        {!isMobile && (role === "super_admin" || role === "merchant") && (
          <Link href="/dashboard/services/new" onClick={() => impact("medium")}>
            <Button
              className={cn(
                "h-10 md:h-11 px-5 rounded-xl font-black uppercase italic tracking-[0.2em] text-[9px] shadow-lg transition-all",
                themeAmber
                  ? "bg-amber-500 text-black shadow-amber-500/10"
                  : "bg-primary text-white shadow-primary/10"
              )}
            >
              <Zap className="mr-2.5 size-4 fill-current" />
              Deploy
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}