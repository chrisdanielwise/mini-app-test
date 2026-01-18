"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation"; 
import { 
  Search, 
  Zap, 
  ChevronRight, 
  Terminal, 
  Bell,
  Activity,
  Globe,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { Button } from "@/components/ui/button";
import { IdentityBadge } from "@/components/dashboard/identity-badge";

/**
 * 🛰️ REVISED: DASHBOARD_TOP_NAV (Institutional Apex v2026.1.20)
 * Strategy: Stationary Horizon HUD with Tactical Mobile Trigger.
 */
export function DashboardTopNav({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const role = context?.role || "merchant";
  const config = context?.config || {};
  const themeAmber = flavor === "AMBER";

  if (!isReady) return <header className="h-16 w-full bg-black/40 border-b border-white/5 animate-pulse" />;

  return (
    <header 
      className={cn(
        "sticky top-0 z-[60] flex items-center justify-between w-full transition-all duration-700 backdrop-blur-xl border-b",
        isMobile ? "h-16 px-4" : "h-14 md:h-16 px-6 md:px-8",
        themeAmber ? "bg-amber-500/[0.01] border-amber-500/10" : "bg-black/60 border-white/5"
      )}
      style={{ paddingTop: isMobile ? `${safeArea.top}px` : "0px" }}
    >
      {/* 🍔 LEFT: MOBILE HAMBURGER (New World Standard) */}
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => impact("medium")}
              className="size-10 rounded-xl bg-white/5 border border-white/10"
            >
              <Menu className={cn("size-5", themeAmber ? "text-amber-500" : "text-primary")} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0 bg-zinc-950 border-r border-white/5">
            {/* Inject your Sidebar component here */}
            <DashboardSidebar context={context} />
          </SheetContent>
        </Sheet>
      ) : (
        /* DESKTOP IDENTITY: Matches your current logic */
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className={cn("size-10 rounded-xl flex items-center justify-center font-black italic", 
            themeAmber ? "bg-amber-500 text-black" : "bg-primary text-white")}>Z</div>
          <span className="font-black uppercase italic text-sm tracking-tighter truncate">
            {config?.companyName || "PLATFORM_ROOT"}
          </span>
        </div>
      )}

      {/* 🛰️ CENTER: VERIFIED NODE TELEMETRY (Mobile Only) */}
      {isMobile && (
        <div className="flex flex-col items-center leading-none">
          <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-20 italic">Node_Status</span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={cn("size-1 rounded-full animate-pulse", themeAmber ? "bg-amber-500" : "bg-primary")} />
            <span className="text-[9px] font-black uppercase tracking-tighter text-foreground italic">SYNC_OK</span>
          </div>
        </div>
      )}

      {/* 🔔 RIGHT: SYSTEM ACTIONS */}
      <div className="flex items-center gap-3 shrink-0">
        <NotificationBell />
        <IdentityBadge role={role} />
      </div>
    </header>
  );
}