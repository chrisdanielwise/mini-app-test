"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG } from "@/lib/config/navigation"; 
import { Search, Zap, ChevronRight, Bell, Activity, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";
import { Button } from "@/components/ui/button";
import { IdentityBadge } from "@/components/dashboard/identity-badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export function DashboardTopNav({ context }: { context: any }) {
  const pathname = usePathname();
  const { flavor } = useLayout();
  const { impact } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();
  
  const role = context?.role || "merchant";
  const config = context?.config || {};
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);
  const themeAmber = flavor === "AMBER";

  const activeItem = NAVIGATION_CONFIG.find(item => 
    item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
  );

  if (!isReady) return <header className="h-14 w-full bg-black/40 border-b border-white/5 animate-pulse" />;

  return (
    <header 
      className={cn(
        "sticky top-0 z-[60] flex items-center justify-between w-full transition-all duration-700 backdrop-blur-xl border-b",
        // 🛡️ TACTICAL SLIM: h-14 is cleaner when a global buffer exists
        isMobile ? "h-14 px-4" : "h-14 md:h-16 px-6 md:px-8",
        themeAmber 
          ? "bg-amber-500/[0.01] border-amber-500/10" 
          : "bg-black/40 border-white/5"
      )}
      // 🏁 REMOVED paddingTop: It was causing double-spacing because of your RootLayout buffer.
    >
      {/* --- LEFT: TRIGGER & BRAND --- */}
      <div className="flex items-center gap-3 min-w-0">
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => impact("medium")} className="size-9 rounded-lg bg-white/5 border border-white/10">
                <Menu className={cn("size-4", themeAmber ? "text-amber-500" : "text-primary")} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-zinc-950 border-r border-white/5">
              <SheetHeader className="sr-only"><SheetTitle>Navigation</SheetTitle></SheetHeader>
              <DashboardSidebar context={context} />
            </SheetContent>
          </Sheet>
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn("size-8 shrink-0 rounded-lg flex items-center justify-center font-black italic text-[10px]", themeAmber ? "bg-amber-500 text-black" : "bg-primary text-white")}>Z</div>
          {!isMobile && (
            <div className="flex flex-col leading-none">
              <span className="font-black uppercase italic text-[11px] tracking-tighter text-foreground truncate max-w-[120px]">
                {config?.companyName || "ROOT_NODE"}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* --- CENTER: TELEMETRY (Mobile Only) --- */}
      {isMobile && (
        <div className="flex flex-col items-center leading-none absolute left-1/2 -translate-x-1/2">
          <span className="text-[6px] font-black uppercase tracking-[0.4em] opacity-20 italic">Node_Status</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={cn("size-1 rounded-full animate-pulse", themeAmber ? "bg-amber-500" : "bg-primary")} />
            <span className="text-[8px] font-black uppercase tracking-tighter text-foreground italic">SYNC_OK</span>
          </div>
        </div>
      )}

      {/* --- RIGHT: ACTIONS --- */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative size-9 rounded-lg border border-white/5">
          <Bell className={cn("size-4", themeAmber ? "text-amber-500/40" : "text-white/20")} />
          <span className={cn("absolute top-2 right-2 size-1 rounded-full", themeAmber ? "bg-amber-500" : "bg-primary")} />
        </Button>
        <IdentityBadge role={role} />
      </div>
    </header>
  );
}