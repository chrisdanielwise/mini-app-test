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
 * 🌊 NAV_GUARD (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with Hardware-Pulse sync.
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

  // 🛡️ SHIMMERING HANDSHAKE: Loading state
  if (!mounted || !isReady) {
    return (
      <nav className="sticky top-0 z-[60] w-full border-b border-white/5 bg-card/40 backdrop-blur-3xl h-16 flex items-center px-6 animate-pulse">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
          <Skeleton className="h-10 w-32 rounded-2xl bg-white/5" />
          <Skeleton className="h-3 w-40 bg-white/5 rounded-full hidden md:block" />
          <Skeleton className="h-10 w-32 rounded-2xl bg-white/5" />
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

  // Exempt specific identity layers
  if (pathname === "/dashboard/login" || pathname === "/dashboard") return null;

  const getBreadcrumbLabel = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 1
      ? `CLUSTER_NODE // ${segments[segments.length - 1].toUpperCase()}`
      : "ROOT_NODE // ACCESS_GRANTED";
  };

  return (
    <div className="sticky top-0 z-[100] w-full">
      {/* 🚀 EMERGENCY BROADCAST: High-Priority Surface Ripple */}
      {systemConfig?.broadcastActive && systemConfig.broadcastMessage && (
        <EmergencyBanner
          active={systemConfig.broadcastActive}
          message={systemConfig.broadcastMessage}
          level={systemConfig.broadcastLevel}
        />
      )}
      
      <nav
        className={cn(
          "w-full backdrop-blur-3xl border-b transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "h-16 md:h-20 flex items-center",
          isStaffFlavor
            ? "bg-amber-500/[0.04] border-amber-500/20 shadow-apex-amber"
            : "bg-black/40 border-white/5 shadow-apex"
        )}
        style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
      >
        <div className="max-w-7xl mx-auto flex w-full items-center justify-between px-6 md:px-12 relative z-10">
          
          {/* --- LEFT: KINETIC BACK ACTION --- */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                impact("light");
                router.back();
              }}
              className={cn(
                "group h-12 px-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all rounded-2xl",
                isStaffFlavor
                  ? "text-amber-500/60 hover:text-amber-500 hover:bg-amber-500/10"
                  : "text-muted-foreground/30 hover:text-primary hover:bg-primary/5"
              )}
            >
              <ArrowLeft className="mr-4 size-4 group-hover:-translate-x-1.5 transition-transform duration-700" />
              <span className="hidden sm:inline">Previous_Node</span>
            </Button>

            {isStaffFlavor && heartbeatStatus === "ERROR" && (
              <Button
                onClick={handleStaffRecovery}
                size="sm"
                className="h-10 rounded-2xl bg-amber-500 text-black text-[9px] font-black uppercase tracking-tighter px-4 animate-pulse shadow-apex-amber"
              >
                <Zap className="size-4 mr-2 fill-current" />
                Sync_Mesh
              </Button>
            )}
          </div>

          {/* --- CENTER: PATH TRACER & HEARTBEAT --- */}
          <div className="flex items-center gap-6 min-w-0">
            <div className="relative size-5 flex items-center justify-center">
              <div
                className={cn(
                  "absolute inset-0 rounded-full animate-ping opacity-20 duration-[2000ms]",
                  heartbeatStatus === "ACTIVE" ? (isStaffFlavor ? "bg-amber-500" : "bg-primary") : "bg-destructive"
                )}
              />
              <div
                className={cn(
                  "relative size-2.5 rounded-full transition-all duration-1000",
                  heartbeatStatus === "ACTIVE"
                    ? isStaffFlavor
                      ? "bg-amber-500 shadow-[0_0_12px_#f59e0b]"
                      : "bg-primary shadow-[0_0_12px_#10b981]"
                    : heartbeatStatus === "SYNCING"
                    ? "bg-muted-foreground animate-pulse"
                    : "bg-destructive shadow-[0_0_12px_#f43f5e]"
                )}
              />
            </div>

            <div className="flex flex-col items-start leading-none truncate">
               <span className={cn(
                 "text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic truncate transition-colors duration-1000",
                 isStaffFlavor ? "text-amber-500/80" : "text-primary/60"
               )}>
                 {getBreadcrumbLabel(pathname)}
               </span>
               <div className="flex items-center gap-2 mt-1.5 opacity-20">
                  <Terminal className="size-2.5" />
                  <span className="text-[7px] font-black uppercase tracking-widest">v16.16.31 // NODE_STABLE</span>
               </div>
            </div>
          </div>

          {/* --- RIGHT: PROTOCOL TERMINATION --- */}
          <div className="flex items-center gap-6">
            <div className="hidden md:block h-8 w-px bg-white/5" />
            <Link href="/dashboard" onClick={() => impact("medium")}>
              <Button
                variant="ghost"
                className="h-12 px-5 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 hover:text-destructive hover:bg-destructive/10 transition-all rounded-2xl"
              >
                <span className="hidden sm:inline">Exit_Node</span>
                <X className="sm:ml-4 size-5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}