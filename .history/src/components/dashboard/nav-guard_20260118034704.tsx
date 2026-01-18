"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Zap, Activity, Terminal, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { EmergencyBanner } from "./emergency-banner";
import { HeartbeatStatus } from "@/lib/hooks/use-heartbeat";

// 🏎️ Orchestration Handshake
import { NotificationGroup } from "./notifications/group";

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
 * 🛰️ NAV_GUARD (Hardened v16.16.88)
 * Strategy: Vertical Compression & Kinetic Handshake Ingress.
 * Mission: Orchestrate HUD, Path Tracing, and Secret Overdrive Tunnel.
 */
export function NavGuard({
  heartbeatStatus,
  systemConfig,
  dashboardContext,
  onOpenOverdrive, // 🏎️ Handshake Prop
}: {
  heartbeatStatus?: HeartbeatStatus;
  systemConfig?: SystemConfig;
  dashboardContext?: any;
  onOpenOverdrive?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { isReady, isMobile } = useDeviceContext();
  const { impact, notification, selectionChange } = useHaptics();
  const { flavor, mounted } = useLayout();
  
  // 🛡️ INTERNAL_HANDSHAKE_STATE
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isL80 = ["super_admin", "platform_manager"].includes(
    dashboardContext?.role?.toLowerCase()
  );

  const isStaffFlavor = flavor === "AMBER";

  // 🏁 HUD_VISIBILITY_FILTER
  if (pathname === "/dashboard/login" || pathname === "/dashboard") return null;

  // 🛡️ HYDRATION SHIELD
  if (!mounted || !isReady) {
    return <nav className="sticky top-0 z-[60] w-full border-b border-white/5 bg-black/40 h-14 animate-pulse" />;
  }

  // --- 🛰️ HANDSHAKE_LOGIC ---
  const handleTouchStart = () => {
    if (!isL80 || !onOpenOverdrive) return;
    timerRef.current = setTimeout(() => {
      notification("warning"); // Physical warning pulse
      onOpenOverdrive();
    }, 2500); // 2.5s Threshold
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const getBreadcrumbLabel = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 1 ? segments[segments.length - 1].toUpperCase() : "ROOT_NODE";
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
          "w-full backdrop-blur-3xl border-b transition-all duration-700 relative z-20",
          isMobile ? "h-14 px-3" : "h-16 px-6",
          isStaffFlavor ? "bg-amber-500/[0.04] border-amber-500/10" : "bg-black/60 border-white/5"
        )}
      >
        <div className="flex h-full w-full items-center justify-between relative z-10">
          
          {/* --- LEFT: SIDEBAR & NAVIGATION --- */}
          <div className="flex items-center gap-1">
            {isMobile && (
              <Sheet onOpenChange={(val) => val && selectionChange()}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="active:scale-90">
                    <Menu className={cn("size-5", isStaffFlavor ? "text-amber-500" : "text-primary")} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0 bg-zinc-950 border-r border-white/5">
                  <SheetHeader className="sr-only"><SheetTitle>Terminal</SheetTitle></SheetHeader>
                  <DashboardSidebar context={dashboardContext} />
                </SheetContent>
              </Sheet>
            )}

            <Button
              variant="ghost"
              onClick={() => { impact("light"); router.back(); }}
              className={cn(
                "h-9 px-2 text-[8px] font-black uppercase tracking-widest transition-all rounded-lg",
                isStaffFlavor ? "text-amber-500/40 hover:text-amber-500" : "text-muted-foreground/30 hover:text-primary"
              )}
            >
              <ArrowLeft className="mr-1.5 size-3.5" />
              <span className="hidden sm:inline text-[7px]">Back</span>
            </Button>
          </div>

          {/* --- CENTER: SECRET_KINETIC_TRIGGER --- */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer select-none active:scale-95 transition-transform"
          >
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
            <div className="flex items-center gap-1 opacity-10 mt-0.5 leading-none">
              <Terminal className="size-2" />
              <span className="text-[5px] font-black uppercase tracking-[0.4em]">v16.88_STABLE</span>
            </div>
          </div>

          {/* --- RIGHT: SIGNAL_GROUP & EXIT --- */}
          <div className="flex items-center gap-3">
            {/* 🏎️ NOTIFICATION_NODE: Integrated Ledger Handshake */}
            <NotificationGroup />

            <Link href="/dashboard" onClick={() => impact("medium")}>
              <button className="h-9 px-2 flex items-center opacity-20 hover:opacity-100 hover:text-rose-500 transition-all">
                <X className="size-4" />
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}