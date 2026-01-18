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

// 🛠️ Atomic UI Components
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
 * Fix: Synchronized mt-[6px] to align with Sheet 'X' and TopNav triggers.
 * Fix: Apex Z-Index 100 prevents viewport bleed through.
 */
export function NavGuard({
  heartbeatStatus,
  systemConfig,
  dashboardContext,
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
    if (!botUsername) return toast.error("SYSTEM_ERR", { description: "BOT_ID_MISSING" });
    window.open(`https://t.me/${botUsername}?start=terminal_access`, "IdentityHandshake", "width=550,height=750");
  };

  if (pathname === "/dashboard/login" || pathname === "/dashboard") return null;

  const getBreadcrumbLabel = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 1 ? `${segments[segments.length - 1].toUpperCase()}` : "ROOT_NODE";
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
          isMobile ? "h-14 px-3" : "h-12 md:h-14 px-6",
          isStaffFlavor ? "bg-amber-500/[0.01] border-amber-500/10 shadow-sm" : "bg-black/40 border-white/5 shadow-md"
        )}
      >
        <div className="flex h-full w-full items-center justify-between relative z-10 leading-none">
          
          {/* --- LEFT: ALIGNED HAMBURGER & BACK --- */}
          <div className="flex items-center gap-1.5">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => impact("medium")}
                    className={cn(
                      "size-9 rounded-xl bg-white/5 border border-white/10 active:scale-95",
                      /* 🏁 THE SYNC: Buffer (18px) + mt-[6px] = 24px offset */
                      "mt-[6px] ml-1"
                    )}
                  >
                    <Menu className={cn("size-4", isStaffFlavor ? "text-amber-500" : "text-primary")} />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="left" className="w-[280px] p-0 bg-zinc-950 border-r border-white/5">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Terminal_Context_Menu</SheetTitle>
                  </SheetHeader>
                  <DashboardSidebar context={dashboardContext} />
                </SheetContent>
              </Sheet>
            )}

            <Button
              variant="ghost"
              onClick={() => { impact("light"); router.back(); }}
              className={cn(
                "h-8 px-2 text-[8px] font-black uppercase tracking-widest transition-all rounded-lg mt-[6px]",
                isStaffFlavor ? "text-amber-500/40 hover:text-amber-500" : "text-muted-foreground/20 hover:text-primary"
              )}
            >
              <ArrowLeft className="mr-1.5 size-3" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>

          {/* --- CENTER: PATH TRACER --- */}
          <div className="flex flex-col items-center leading-tight truncate absolute left-1/2 -translate-x-1/2 mt-[6px]">
            <div className="flex items-center gap-2">
              <div className={cn("size-1 rounded-full animate-pulse", heartbeatStatus === "ACTIVE" ? (isStaffFlavor ? "bg-amber-500" : "bg-primary") : "bg-destructive")} />
              <span className={cn("text-[8px] font-black uppercase tracking-[0.2em] italic truncate", isStaffFlavor ? "text-amber-500/60" : "text-primary/40")}>
                {getBreadcrumbLabel(pathname)}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-10 mt-0.5">
              <Terminal className="size-2" />
              <span className="text-[5px] font-black uppercase tracking-widest">v16.31_Apex</span>
            </div>
          </div>

          {/* --- RIGHT: EXIT --- */}
          <div className="flex items-center gap-2 mt-[6px]">
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