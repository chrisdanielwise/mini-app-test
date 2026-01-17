"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { Settings2, PlusCircle, BarChart3, Terminal, Globe, Activity } from "lucide-react";
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
 * 🛰️ SERVICE_ACTION_WRAPPER (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density h-9 trigger and py-2.5 items prevent table blowout.
 */
export function ServiceActionWrapper({ 
  serviceId, 
  compact = true 
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
        "rounded-lg bg-white/5 animate-pulse ml-auto",
        compact ? "size-8" : "size-10"
      )} />
    );
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "transition-all duration-500 shadow-sm group active:scale-95",
            // 🛡️ TACTICAL SLIM: h-9 (36px) is the institutional standard for row actions
            compact ? "size-8 rounded-lg" : "size-9 md:size-10 rounded-xl",
            isStaff 
              ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black" 
              : "bg-white/[0.02] border-white/5 hover:bg-primary hover:text-white"
          )}
        >
          <Settings2 className={cn(
            "transition-transform group-hover:rotate-90",
            compact ? "size-3.5" : "size-4.5"
          )} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "bg-zinc-950/95 backdrop-blur-xl p-1.5 shadow-3xl z-[100] border-white/5",
          isMobile ? "w-[200px] rounded-xl" : "w-[220px] rounded-xl"
        )}
      >
        {/* --- COMPRESSED HUD --- */}
        <div className="px-3 py-2 mb-1 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            {isStaff ? (
              <Globe className="size-3 text-amber-500 animate-pulse shrink-0" />
            ) : (
              <Terminal className="size-3 text-primary shrink-0" />
            )}
            <p className={cn(
              "text-[7.5px] font-black uppercase tracking-[0.3em] italic",
              isStaff ? "text-amber-500" : "text-primary/60"
            )}>
              {isStaff ? "Oversight" : "Ops_Node"}
            </p>
          </div>
          <Activity className="size-2.5 opacity-10 animate-pulse" />
        </div>

        <DropdownMenuItem asChild className="rounded-lg py-2.5 px-3 cursor-pointer focus:bg-white/5 group">
          <Link href={`/dashboard/services/${serviceId}`} className="flex items-center w-full">
            <PlusCircle className="size-3.5 mr-2.5 text-muted-foreground/30 group-focus:text-inherit" />
            <span className="text-[9px] font-black uppercase tracking-widest italic">Manifest</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="rounded-lg py-2.5 px-3 cursor-pointer focus:bg-white/5 group">
          <Link href={`/dashboard/analytics?serviceId=${serviceId}`} className="flex items-center w-full">
            <BarChart3 className="size-3.5 mr-2.5 text-muted-foreground/30 group-focus:text-inherit" />
            <span className="text-[9px] font-black uppercase tracking-widest italic">Telemetry</span>
          </Link>
        </DropdownMenuItem>

        <div className="h-px bg-white/5 my-1 mx-1.5" />
        
        {/* 🛡️ DESTRUCTIVE NODE */}
        <RevokeServiceButton serviceId={serviceId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}