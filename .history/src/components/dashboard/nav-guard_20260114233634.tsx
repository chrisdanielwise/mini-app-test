"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartbeatStatus } from "@/lib/hooks/use-heartbeat";
import { toast } from "sonner";
import { EmergencyBanner } from "./emergency-banner";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface SystemConfig {
  broadcastActive: boolean;
  broadcastMessage: string | null;
  broadcastLevel: "INFO" | "WARN" | "CRITICAL";
}

/**
 * 🌊 FLUID NAV GUARD (Institutional v16.16.12)
 * Logic: Haptic-synced security horizon with role-aware status.
 * Design: v9.9.1 Hardened Glassmorphism.
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
  const { impact, notification } = useHaptics();
  const { flavor, mounted } = useLayout();

  const isStaffFlavor = flavor === "AMBER";

  // 🤖 STAFF RECOVERY HANDSHAKE
  const handleStaffRecovery = () => {
    notification("warning");
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;
    if (!botUsername) return toast.error("SYSTEM_ERR: BOT_ID_MISSING");

    const telegramUrl = `https://t.me/${botUsername}?start=terminal_access`;
    window.open(telegramUrl, "IdentityHandshake", "width=550,height=750");
  };

  // 🛡️ SHIMMERING HANDSHAKE: Loading state
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-black/40 backdrop-blur-3xl h-14 flex items-center px-6">
        <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto animate-pulse">
          <Skeleton className="h-10 w-28 rounded-xl bg-white/5" />
          <Skeleton className="h-2 w-48 bg-white/5 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-xl bg-white/5" />
        </div>
      </nav>
    );
  }

  // Exempt specific identity layers
  if (pathname === "/dashboard/login" || pathname === "/dashboard") return null;

  const getBreadcrumbLabel = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 1
      ? `CLUSTER // ${segments[segments.length - 1].toUpperCase()}`
      : "NODE // ROOT";
  };

  return (
    <div className="sticky top-0 z-[60] w-full">
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
          "w-full backdrop-blur-3xl border-b transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] animate-in slide-in-from-top-4",
          isStaffFlavor
            ? "bg-amber-500/[0.04] border-amber-500/20"
            : "bg-black/20 border-white/5"
        )}
      >
        <div className="max-w-[1440px] mx-auto flex h-14 items-center justify-between px-6 md:px-10">
          
          {/* --- DYNAMIC BACK ACTION --- */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                impact("light");
                router.back();
              }}
              className={cn(
                "group h-11 px-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl",
                isStaffFlavor
                  ? "text-amber-500/60 hover:text-amber-500 hover:bg-amber-500/5"
                  : "text-muted-foreground/40 hover:text-primary hover:bg-primary/5"
              )}
            >
              <ArrowLeft className="mr-3 size-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Previous_Node</span>
            </Button>

            {/* ⚡ STAFF RECOVERY TRIGGER */}
            {isStaffFlavor && heartbeatStatus === "ERROR" && (
              <Button
                onClick={handleStaffRecovery}
                size="sm"
                className="h-9 rounded-xl bg-amber-500 text-black text-[8px] font-black uppercase tracking-tighter px-3 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                <Zap className="size-3.5 mr-2 fill-black" />
                Sync_Node
              </Button>
            )}
          </div>

          {/* --- BREADCRUMB + HEARTBEAT INDICATOR --- */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative size-4 flex items-center justify-center">
              <div
                className={cn(
                  "absolute size-3 rounded-full animate-ping opacity-20",
                  isStaffFlavor ? "bg-amber-500" : "bg-primary"
                )}
              />
              <div
                className={cn(
                  "relative size-2 rounded-full transition-all duration-700",
                  heartbeatStatus === "ACTIVE"
                    ? isStaffFlavor
                      ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]"
                      : "bg-primary shadow-[0_0_10px_#10b981]"
                    : heartbeatStatus === "SYNCING"
                    ? "bg-muted-foreground animate-pulse"
                    : "bg-destructive shadow-[0_0_10px_#f43f5e]"
                )}
              />
            </div>

            <span
              className={cn(
                "text-[9px] font-black uppercase tracking-[0.4em] italic truncate",
                isStaffFlavor ? "text-amber-500/60" : "text-muted-foreground/30"
              )}
            >
              {getBreadcrumbLabel(pathname)}
            </span>
          </div>

          {/* --- COMMAND HUD EXIT --- */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block h-6 w-px bg-white/5" />
            <Link href="/dashboard" onClick={() => impact("light")}>
              <Button
                variant="ghost"
                className="h-11 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 transition-all rounded-xl"
              >
                <span className="hidden sm:inline">Exit_Node</span>
                <X className="sm:ml-3 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}