"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { Settings2, PlusCircle, BarChart3, Terminal, Shield, Zap, Globe, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RevokeServiceButton } from "@/components/dashboard/revoke-service-button";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 SERVICE_ACTION_WRAPPER (Institutional Apex v16.16.31)
 * Strategy: Compact high-density mode to prevent horizontal table blowout.
 */
export function ServiceActionWrapper({ 
  serviceId, 
  compact = true // 🛡️ Default to compact to help table alignment
}: { 
  serviceId: string;
  compact?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      selectionChange();
      impact("light");
    }
  }, [selectionChange, impact]);

  if (!mounted || !isReady) {
    return (
      <div className={cn(
        "rounded-xl bg-card/20 border border-white/5 animate-pulse ml-auto",
        compact ? "size-10" : "size-12 md:size-14"
      )} />
    );
  }

  const menuWidth = isMobile ? "w-[90vw] sm:w-[280px]" : "w-[280px]";
  const menuRadius = isMobile ? "rounded-[2.5rem]" : "rounded-[2.25rem]";

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-apex group active:scale-90",
            // 🛡️ TIGHTENED: Reduced size for compact high-density tables
            compact ? "size-10 rounded-xl" : "size-12 md:size-14 rounded-2xl md:rounded-[1.4rem]",
            isStaff 
              ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black" 
              : "bg-white/[0.03] border-white/5 hover:bg-primary hover:text-white hover:border-primary"
          )}
        >
          <Settings2 className={cn(
            "transition-transform duration-1000 group-hover:rotate-180",
            compact ? "size-4" : "size-5 md:size-6"
          )} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        sideOffset={16}
        className={cn(
          "bg-card/90 backdrop-blur-3xl p-4 shadow-apex z-[100] animate-in zoom-in-95 duration-700 border-white/5",
          menuWidth,
          menuRadius
        )}
      >
        <div className="px-5 py-4 mb-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            {isStaff ? (
              <Globe className="size-4 text-amber-500 animate-pulse shrink-0" />
            ) : (
              <Terminal className="size-4 text-primary shrink-0" />
            )}
            <p className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em] italic",
              isStaff ? "text-amber-500" : "text-primary/60"
            )}>
              {isStaff ? "Oversight" : "Operations"}
            </p>
          </div>
          <Activity className="size-3 opacity-10 animate-pulse" />
        </div>

        <DropdownMenuItem asChild className="rounded-2xl py-5 px-5 cursor-pointer focus:bg-white/5 group">
          <Link href={`/dashboard/services/${serviceId}`} className="flex items-center w-full">
            <PlusCircle className="size-5 mr-4 text-muted-foreground/30 group-focus:text-inherit" />
            <span className="text-[11px] font-black uppercase tracking-widest italic">Pricing_Manifest</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="rounded-2xl py-5 px-5 cursor-pointer focus:bg-white/5 group">
          <Link href={`/dashboard/analytics?serviceId=${serviceId}`} className="flex items-center w-full">
            <BarChart3 className="size-5 mr-4 text-muted-foreground/30 group-focus:text-inherit" />
            <span className="text-[11px] font-black uppercase tracking-widest italic">Node_Telemetry</span>
          </Link>
        </DropdownMenuItem>

        <div className="h-px bg-white/5 my-4 mx-2" />
        <RevokeServiceButton serviceId={serviceId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}