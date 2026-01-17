"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Zap, Activity, ShieldCheck, Terminal } from "lucide-react";
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

interface SystemConfig {
  broadcastActive: boolean;
  broadcastMessage: string | null;
  broadcastLevel: "INFO" | "WARN" | "CRITICAL";
}

/**
 * 🛰️ NAV_GUARD (Institutional Apex v2026.1.16)
 * Strategy: High-density, low-profile tactical membrane.
 * Fix: Standardized heights and clamped typography to prevent layout distortion.
 */
export function NavGuard({
  heartbeatStatus,
  systemConfig,
}: {
  heartbeatStatus?: HeartbeatStatus;
  systemConfig?: SystemConfig;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // 🛰️ DEVICE & LAYOUT INGRESS
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();
  const { impact, notification } = useHaptics();
  const { flavor, mounted } = useLayout();

  const isStaffFlavor = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevents the "Bogus" layout snap during hardware handshake
  if (!mounted || !isReady) {
    return (
      <nav className="sticky top-0 z-[60] w-full border-b border-white/5 bg-black/40 backdrop-blur-3xl h-14 flex items-center px-6 animate-pulse">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
          <Skeleton className="h-8 w-24 rounded-lg bg-white/5" />
          <Skeleton className="h-8 w-24 rounded-lg bg-white/5" />
        </div>
      </nav>
    );
  }

  // 🤖 STAFF RECOVERY HANDSHAKE
  const handleStaffRecovery = () => {
    notification("warning");
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;
    if (!botUsername) return toast.error("SYSTEM_ERR", { description: "BOT_ID_MISSING" });

    const telegramUrl = `https://t.me/${botUsername}?start=terminal_access`;
    window.open(telegramUrl, "IdentityHandshake", "width=550,height=750");
  };

  if (pathname === "/dashboard/login" || pathname === "/dashboard") return null;

  const getBreadcrumbLabel = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 1
      ? `CLUSTER_NODE // ${segments[segments.length - 1].toUpperCase()}`
      : "ROOT_NODE // ACCESS_GRANTED";
  };

  return (
    <div className="sticky top-0 z-[100] w-full">
      {/* 🚀 EMERGENCY BROADCAST: Adaptive Signal Height */}
      {systemConfig?.broadcastActive && systemConfig.broadcastMessage && (
        <EmergencyBanner
          active={systemConfig.broadcastActive}
          message={systemConfig.broadcastMessage}
          level={systemConfig.broadcastLevel}
        />
      )}
      
      <nav
        className={cn(
          "w-full backdrop-blur-3xl border-b transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          // 🏛️ TACTICAL CLAMPING: Fixed 64px height on mobile/desktop to prevent distortion
          "h-16 flex items-center px-4 md:px-8",
          isStaffFlavor
            ? "bg-amber-500/[0.02] border-amber-500/10 shadow-lg shadow-amber-500/5"
            : "bg-black/60 border-white/5 shadow-2xl"
        )}
        style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
      >
        <div className="max-w-7xl mx-auto flex w-full items-center justify-between relative z-10">
          
          {/* --- LEFT: KINETIC BACK ACTION --- */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                impact("light");
                router.back();
              }}
              className={cn(
                "group h-10 px-4 text-[9px] font-black uppercase tracking-[0.2em] transition-all rounded-xl border border-transparent",
                isStaffFlavor
                  ? "text-amber-500/60 hover:text-amber-500 hover:bg-amber-500/10"
                  : "text-muted-foreground/30 hover:text-primary hover:bg-primary/5"
              )}
            >
              <ArrowLeft className="mr-3 size-3.5 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            {isStaffFlavor && heartbeatStatus === "ERROR" && (
              <Button
                onClick={handleStaffRecovery}
                size="sm"
                className="h-8 rounded-lg bg-amber-500 text-black text-[8px] font-black uppercase tracking-tighter px-3 animate-pulse"
              >
                <Zap className="size-3 mr-1.5 fill-current" />
                Sync
              </Button>
            )}
          </div>

          {/* --- CENTER: PATH TRACER & HEARTBEAT --- */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative size-4 flex items-center justify-center">
              <div
                className={cn(
                  "absolute inset-0 rounded-full animate-ping opacity-10 duration-[2000ms]",
                  heartbeatStatus === "ACTIVE" ? (isStaffFlavor ? "bg-amber-500" : "bg-primary") : "bg-destructive"
                )}
              />
              <div
                className={cn(
                  "relative size-2 rounded-full transition-all duration-1000",
                  heartbeatStatus === "ACTIVE"
                    ? isStaffFlavor ? "bg-amber-500" : "bg-primary"
                    : heartbeatStatus === "SYNCING" ? "bg-muted-foreground animate-pulse" : "bg-destructive"
                )}
              />
            </div>

            <div className="flex flex-col items-start leading-none truncate">
               <span className={cn(
                 "text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] italic truncate",
                 isStaffFlavor ? "text-amber-500/80" : "text-primary/60"
               )}>
                 {getBreadcrumbLabel(pathname)}
               </span>
               <div className="flex items-center gap-2 mt-1 opacity-20">
                  <Terminal className="size-2.5" />
                  <span className="text-[6px] font-black uppercase tracking-widest">v16.31 // SECURE</span>
               </div>
            </div>
          </div>

          {/* --- RIGHT: PROTOCOL TERMINATION --- */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block h-6 w-px bg-white/5 mr-2" />
            <Link href="/dashboard" onClick={() => impact("medium")}>
              <Button
                variant="ghost"
                className="h-10 px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 hover:text-destructive hover:bg-destructive/5 transition-all rounded-xl"
              >
                <span className="hidden sm:inline">Exit</span>
                <X className="sm:ml-3 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}