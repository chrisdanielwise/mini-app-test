"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Zap, Activity, Terminal, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { EmergencyBanner } from "./emergency-banner";
import { HeartbeatStatus } from "@/lib/hooks/use-heartbeat";

// 🛠️ Atomic UI Components (For organized mobile view)
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

interface SystemConfig {
  broadcastActive: boolean;
  broadcastMessage: string | null;
  broadcastLevel: "INFO" | "WARN" | "CRITICAL";
}

/**
 * 🛰️ NAV_GUARD (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Stationary Tactical Horizon.
 * Fix: Integrated Hamburger Drawer for world-standard mobile navigation.
 * Accessibility Fix: Added SheetTitle to satisfy Radix console requirements.
 */
export function NavGuard({
  heartbeatStatus,
  systemConfig,
  dashboardContext, // 👈 Pass your context here to feed the sidebar
}: {
  heartbeatStatus?: HeartbeatStatus;
  systemConfig?: SystemConfig;
  dashboardContext?: any;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { isReady, isMobile, safeArea } = useDeviceContext();
  const { impact, notification } = useHaptics();
  const { flavor, mounted } = useLayout();

  const isStaffFlavor = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Ultra-Slim Shimmer
  if (!mounted || !isReady) {
    return (
      <nav className="sticky top-0 z-[60] w-full border-b border-white/5 bg-black/40 h-12 flex items-center px-4 animate-pulse">
        <Skeleton className="h-6 w-20 rounded-md bg-white/5" />
      </nav>
    );
  }

  const handleStaffRecovery = () => {
    notification("warning");
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;
    if (!botUsername)
      return toast.error("SYSTEM_ERR", { description: "BOT_ID_MISSING" });
    window.open(
      `https://t.me/${botUsername}?start=terminal_access`,
      "IdentityHandshake",
      "width=550,height=750"
    );
  };

  if (pathname === "/dashboard/login" || pathname === "/dashboard") return null;

  const getBreadcrumbLabel = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 1
      ? `${segments[segments.length - 1].toUpperCase()}`
      : "ROOT_NODE";
  };

  return (
    <div className="sticky top-0 z-[100] w-full">
      {systemConfig?.broadcastActive && systemConfig.broadcastMessage && (
        <EmergencyBanner
          active={systemConfig.broadcastActive}
          message={systemConfig.broadcastMessage}
          level={systemConfig.broadcastLevel}
        />
      )}

      <nav
        className={cn(
          "w-full backdrop-blur-xl border-b transition-all duration-700",
          // 🛡️ TACTICAL SLIM: Compressed height profile (UNTOUCHED)
          isMobile ? "h-12 px-3" : "h-12 md:h-14 px-6",
          isStaffFlavor
            ? "bg-amber-500/[0.01] border-amber-500/10 shadow-sm"
            : "bg-black/40 border-white/5 shadow-md"
        )}
        style={{
          paddingTop: isMobile ? `calc(${safeArea.top}px * 0.25)` : "0px",
        }} // (UNTOUCHED)
      >
        <div className="flex h-full w-full items-center justify-between relative z-10 leading-none">
          {/* --- LEFT: MOBILE HAMBURGER & BACK --- */}
          <div className="flex items-center gap-1.5">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => impact("medium")}
                    className={cn(
                      "size-9 rounded-xl bg-white/5 border border-white/10 active:scale-95",
                     
                      "mt-8 ml-2"
                    )}
                  > */}
                    {/* <Menu
                      className={cn(
                        "size-3.5",
                        isStaffFlavor ? "text-amber-500" : "text-primary"
                      )}
                    /> */}
                  </Button>
                </SheetTrigger>
                
                <SheetContent
                  side="left"
                  className="w-[280px] p-0 bg-zinc-950 border-r border-white/5"
                >
                  {/* 🛡️ ACCESSIBILITY FIX: Required for Radix console compliance */}
                  <SheetHeader className="sr-only">
                    <SheetTitle>Terminal_Context_Menu</SheetTitle>
                  </SheetHeader>
                  <DashboardSidebar context={dashboardContext} />
                </SheetContent>
              </Sheet>
            )}

            <Button
              variant="ghost"
              onClick={() => {
                impact("light");
                router.back();
              }}
              className={cn(
                "h-8 px-2 text-[8px] font-black uppercase tracking-widest transition-all rounded-lg",
                isStaffFlavor
                  ? "text-amber-500/40 hover:text-amber-500"
                  : "text-muted-foreground/20 hover:text-primary"
              )}
            >
              <ArrowLeft className="mr-1.5 size-3" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>

          {/* --- CENTER: PATH TRACER --- */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative size-3 flex items-center justify-center">
              <div
                className={cn(
                  "absolute inset-0 rounded-full animate-ping opacity-10",
                  heartbeatStatus === "ACTIVE"
                    ? isStaffFlavor
                      ? "bg-amber-500"
                      : "bg-primary"
                    : "bg-destructive"
                )}
              />
              <div
                className={cn(
                  "relative size-1.5 rounded-full transition-all duration-700",
                  heartbeatStatus === "ACTIVE"
                    ? isStaffFlavor
                      ? "bg-amber-500"
                      : "bg-primary"
                    : heartbeatStatus === "SYNCING"
                    ? "bg-muted-foreground animate-pulse"
                    : "bg-destructive"
                )}
              />
            </div>

            <div className="flex flex-col items-start leading-tight truncate">
              <span
                className={cn(
                  "text-[8px] font-black uppercase tracking-[0.2em] italic truncate",
                  isStaffFlavor ? "text-amber-500/60" : "text-primary/40"
                )}
              >
                {getBreadcrumbLabel(pathname)}
              </span>
              <div className="flex items-center gap-1 opacity-10">
                <Terminal className="size-2" />
                <span className="text-[5px] font-black uppercase tracking-widest">
                  v16.31_Apex
                </span>
              </div>
            </div>
          </div>

          {/* --- RIGHT: EXIT --- */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard" onClick={() => impact("medium")}>
              <button className="h-8 px-3 text-[8px] font-black uppercase tracking-widest text-muted-foreground/10 hover:text-destructive transition-all flex items-center">
                <span className="hidden sm:inline mr-2">Exit</span>
                <X className="size-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
