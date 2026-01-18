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
 * 🛰️ NAV_GUARD (Hardened v16.16.60)
 * Strategy: Vertical Compression & Stationary Tactical Horizon.
 * Fix: Synchronized HUD Baseline with Sidebar ingress.
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
  const { impact, notification, selectionChange } = useHaptics();
  const { flavor, mounted } = useLayout();

  const isStaffFlavor = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevents layout snap during device handshake
  if (!mounted || !isReady) {
    return (
      <nav className="sticky top-0 z-[60] w-full border-b border-white/5 bg-black/40 h-14 flex items-center px-4 animate-pulse" />
    );
  }

  // 🤖 STAFF RECOVERY HANDSHAKE
  const handleStaffRecovery = () => {
    notification("warning");
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;
    if (!botUsername) return toast.error("SYSTEM_ERR", { description: "BOT_ID_MISSING" });
    window.open(`https://t.me/${botUsername}?start=terminal_access`, "IdentityHandshake", "width=550,height=750");
  };

  // 🏁 HUD_VISIBILITY_FILTER
  if (pathname === "/dashboard/login" || pathname === "/dashboard") return null;

  const getBreadcrumbLabel = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 1 ? segments[segments.length - 1].toUpperCase() : "ROOT_NODE";
  };

  return (
    <div className="sticky top-0 z-[100] w-full">
      {/* 🚀 EMERGENCY BROADCAST: Hardware-Safe Broadcaster */}
      {systemConfig?.broadcastActive && systemConfig.broadcastMessage && (
        <EmergencyBanner
          active={systemConfig.broadcastActive}
          message={systemConfig.broadcastMessage}
          level={systemConfig.broadcastLevel}
        />
      )}

      <nav
        className={cn(
          "w-full backdrop-blur-3xl border-b transition-all duration-700",
          // 📐 TACTICAL COMPRESSION: h-14 matches the global HUD baseline
          isMobile ? "h-14 px-3" : "h-16 px-6",
          isStaffFlavor ? "bg-amber-500/[0.02] border-amber-500/10" : "bg-black/60 border-white/5"
        )}
      >
        <div className="flex h-full w-full items-center justify-between relative z-10">
          
          {/* --- LEFT: ERGONOMIC INGRESS --- */}
          <div className="flex items-center gap-1">
            {isMobile && (
              <Sheet onOpenChange={(val) => val && selectionChange()}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mt-1.5 active:scale-90">
                    <Menu className={cn("size-5", isStaffFlavor ? "text-amber-500" : "text-primary")} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0 bg-zinc-950 border-r border-white/5">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Terminal_Context</SheetTitle>
                  </SheetHeader>
                  <DashboardSidebar context={dashboardContext} />
                </SheetContent>
              </Sheet>
            )}

            <Button
              variant="ghost"
              onClick={() => { impact("light"); router.back(); }}
              className={cn(
                "h-9 px-2 text-[8px] font-black uppercase tracking-widest mt-1.5 transition-all rounded-lg",
                isStaffFlavor ? "text-amber-500/40 hover:text-amber-500" : "text-muted-foreground/30 hover:text-primary"
              )}
            >
              <ArrowLeft className="mr-1.5 size-3.5" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>

          {/* --- CENTER: KINETIC PATH TRACER --- */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center mt-1.5">
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "size-1 rounded-full animate-ping", 
                isStaffFlavor ? "bg-amber-500" : "bg-primary"
              )} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-tighter italic",
                isStaffFlavor ? "text-amber-500/60" : "text-primary/40"
              )}>
                {getBreadcrumbLabel(pathname)}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-10 mt-0.5">
              <Terminal className="size-2" />
              <span className="text-[5px] font-black uppercase tracking-[0.4em]">v16.60_STABLE</span>
            </div>
          </div>

          {/* --- RIGHT: EXIT COMMAND --- */}
          <div className="mt-1.5 flex items-center gap-2">
            {isStaffFlavor && heartbeatStatus === "ERROR" && (
                <button onClick={handleStaffRecovery} className="h-8 px-2 rounded-md bg-amber-500 text-black text-[6px] font-black uppercase animate-pulse">
                  Sync_Node
                </button>
            )}
            <Link href="/dashboard" onClick={() => impact("medium")}>
              <button className="h-9 px-3 flex items-center opacity-20 hover:opacity-100 hover:text-rose-500 transition-all">
                <span className="hidden sm:inline text-[8px] font-black uppercase tracking-widest mr-2">Abort</span>
                <X className="size-4" />
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}