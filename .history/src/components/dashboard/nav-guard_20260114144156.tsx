"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Terminal, Globe, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { HeartbeatStatus } from "@/lib/hooks/use-heartbeat";
import { toast } from "sonner";

/**
 * 🛰️ GLOBAL NAV GUARD (Institutional v16.0.0)
 * Logic: Synchronized with Universal Identity & Heartbeat status.
 * Feature: Integrated Staff Recovery Node for desynced mobile sessions.
 */
export function NavGuard({ heartbeatStatus }: { heartbeatStatus?: HeartbeatStatus }) {
  const pathname = usePathname();
  const router = useRouter();
  const { flavor, mounted } = useLayout(); 
  
  const isStaffFlavor = flavor === "AMBER";

  // 🤖 STAFF RECOVERY HANDSHAKE
  const handleStaffRecovery = () => {
    hapticFeedback("medium");
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;
    if (!botUsername) return toast.error("SYSTEM_ERR: BOT_ID_MISSING");
    
    const telegramUrl = `https://t.me/${botUsername}?start=terminal_access`;
    window.open(telegramUrl, "IdentityHandshake", "width=550,height=750");
  };

  // 🛡️ HYDRATION PLACEHOLDER
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-40 w-full bg-background/40 border-b border-border/10 backdrop-blur-2xl h-12 md:h-14 flex items-center px-4 md:px-6">
        <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto animate-pulse">
          <Skeleton className="h-8 w-24 rounded-xl bg-muted/20" />
          <Skeleton className="h-4 w-32 bg-muted/20" />
          <Skeleton className="h-8 w-24 rounded-xl bg-muted/20" />
        </div>
      </nav>
    );
  }

  if (pathname === "/dashboard/login" || pathname === "/dashboard") return null;

  const getBreadcrumbLabel = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return segments.length > 1 
      ? `CLUSTER // ${segments[segments.length - 1].toUpperCase()}`
      : "NODE // ROOT";
  };

  return (\

    {/* 🚀 Render the banner if active data exists in the profile/heartbeat */}
    {systemConfig?.broadcastActive && (
      <EmergencyBanner 
        active={systemConfig.broadcastActive} 
        message={systemConfig.broadcastMessage} 
        level={systemConfig.broadcastLevel} 
      />
    )}
    <nav className={cn(
      "sticky top-0 z-40 w-full backdrop-blur-2xl border-b transition-all duration-500 animate-in slide-in-from-top-4",
      isStaffFlavor ? "bg-amber-500/[0.02] border-amber-500/20" : "bg-background/40 border-border/40"
    )}>
      <div className="max-w-[1440px] mx-auto flex h-12 md:h-14 items-center justify-between px-4 md:px-6">
        
        {/* --- DYNAMIC BACK ACTION --- */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => {
              hapticFeedback("light");
              router.back();
            }}
            className={cn(
              "group rounded-lg md:rounded-xl h-9 md:h-10 px-3 md:px-4 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all border border-transparent active:scale-95",
              isStaffFlavor 
                ? "text-amber-500/60 hover:text-amber-500 hover:border-amber-500/20 hover:bg-amber-500/5" 
                : "text-muted-foreground hover:text-primary hover:border-primary/10 hover:bg-primary/5"
            )}
          >
            <ArrowLeft className="mr-1.5 md:mr-2 h-3 w-3 md:h-3.5 md:w-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden xs:inline">Previous</span>
          </Button>

          {/* ⚡ STAFF RECOVERY TRIGGER: High-priority button if session desyncs */}
          {isStaffFlavor && heartbeatStatus === "ERROR" && (
            <Button
              onClick={handleStaffRecovery}
              size="sm"
              className="h-8 rounded-lg bg-amber-500 text-black text-[7px] font-black uppercase tracking-tighter px-2 animate-pulse hover:animate-none active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <Zap className="h-3 w-3 mr-1 fill-black" />
              Sync Node
            </Button>
          )}
        </div>

        {/* --- BREADCRUMB + HEARTBEAT INDICATOR --- */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0 px-2">
          <div className="relative flex items-center justify-center">
            <div className={cn(
              "absolute h-2 w-2 rounded-full animate-ping opacity-20",
              isStaffFlavor ? "bg-amber-500" : "bg-primary"
            )} />
            
            <div className={cn(
              "relative h-1.5 w-1.5 rounded-full transition-colors duration-500",
              heartbeatStatus === "ACTIVE" 
                ? (isStaffFlavor ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]")
                : heartbeatStatus === "SYNCING" 
                  ? "bg-muted-foreground animate-pulse"
                  : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            )} />
          </div>
          
          <span className={cn(
            "text-[7px] md:text-[8px] font-black uppercase tracking-[0.25em] md:tracking-[0.4em] italic truncate",
            isStaffFlavor ? "text-amber-500/50" : "text-muted-foreground/40"
          )}>
            {getBreadcrumbLabel(pathname)}
          </span>
        </div>

        {/* --- COMMAND HUD EXIT --- */}
        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden sm:block h-4 w-px bg-border/40 mx-2" />
          <Link href="/dashboard" onClick={() => hapticFeedback("light")}>
            <Button 
              variant="ghost" 
              className="rounded-lg md:rounded-xl h-9 md:h-10 px-3 md:px-4 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 transition-all border border-transparent hover:border-rose-500/10 active:scale-95"
            >
              <span className="hidden xs:inline">Exit Node</span>
              <X className="xs:ml-2 h-3 w-3 md:h-3.5 md:w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}