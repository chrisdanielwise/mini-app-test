"use client";

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { 
  Settings2, 
  PlusCircle, 
  BarChart3, 
  Terminal, 
  Shield, 
  Zap, 
  Globe, 
  Activity 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal, // 🏁 RESTORED: Required for scroll-container escape
} from "@/components/ui/dropdown-menu";
import { RevokeServiceButton } from "@/components/dashboard/revoke-service-button";
import { cn } from "@/lib/utils";

import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

export function ServiceActionWrapper({ serviceId, compact = true }: { serviceId: string; compact?: boolean }) {
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
        "rounded-xl bg-white/[0.02] border border-white/5 animate-pulse ml-auto",
        compact ? "size-9" : "size-10 md:size-12"
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
            "transition-all duration-500 shadow-inner group active:scale-90 border",
            compact ? "size-9 rounded-xl" : "size-10 md:size-12 rounded-xl md:rounded-2xl",
            isStaff 
              ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black" 
              : "bg-white/[0.02] border-white/5 hover:bg-primary hover:text-white"
          )}
        >
          <Settings2 className={cn(
            "transition-transform group-hover:rotate-90 duration-500",
            compact ? "size-4" : "size-5"
          )} />
        </Button>
      </DropdownMenuTrigger>
      
      {/* 🏁 THE PORTAL: Forces the menu to render at the root of the document.
          This prevents the table from cutting off the bottom of the menu on mobile. */}
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className={cn(
            "bg-zinc-950/95 backdrop-blur-2xl p-2 shadow-3xl z-[200] border-white/5 animate-in zoom-in-95 duration-300",
            isMobile ? "w-[210px] rounded-2xl" : "w-[240px] rounded-[1.8rem]"
          )}
        >
          {/* --- 🛡️ FIXED HUD --- */}
          <div className="px-3 py-2.5 mb-1.5 flex items-center justify-between border-b border-white/5 bg-white/[0.02] rounded-t-xl">
            <div className="flex items-center gap-2">
              {isStaff ? (
                <Globe className="size-3 text-amber-500 animate-pulse shrink-0" />
              ) : (
                <Terminal className="size-3 text-primary shrink-0" />
              )}
              <p className={cn(
                "text-[7.5px] font-black uppercase tracking-[0.4em] italic",
                isStaff ? "text-amber-500" : "text-muted-foreground/60"
              )}>
                {isStaff ? "Platform_Oversight" : "Node_Operations"}
              </p>
            </div>
            <Activity className="size-2.5 opacity-20 animate-pulse" />
          </div>

          {/* --- 🚀 ACTION VOLUME --- */}
          <DropdownMenuItem asChild className="rounded-xl py-3 px-3.5 cursor-pointer focus:bg-white/5 group">
            <Link href={`/dashboard/services/${serviceId}`} className="flex items-center w-full">
              <PlusCircle className="size-4 mr-3 text-muted-foreground/30 group-focus:text-primary transition-colors" />
              <span className="text-[9px] font-black uppercase tracking-widest italic truncate">Expand_Pricing</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="rounded-xl py-3 px-3.5 cursor-pointer focus:bg-white/5 group">
            <Link href={`/dashboard/analytics?serviceId=${serviceId}`} className="flex items-center w-full">
              <BarChart3 className="size-4 mr-3 text-muted-foreground/30 group-focus:text-primary transition-colors" />
              <span className="text-[9px] font-black uppercase tracking-widest italic truncate">Node_Metrics</span>
            </Link>
          </DropdownMenuItem>

          <div className="h-px bg-white/5 my-2 mx-2" />
          
          <div className="px-3.5 py-2 mb-1 flex items-center gap-2 opacity-40">
             <Shield className="size-3 text-rose-500 shrink-0" />
             <p className="text-[7.5px] font-black uppercase tracking-[0.3em] text-rose-500 italic">Danger_Zone</p>
          </div>

          <RevokeServiceButton serviceId={serviceId} />

          {/* --- 🌊 STATUS FOOTER --- */}
          <div className="mt-3 flex items-center justify-between px-3.5 py-1.5 opacity-20 border-t border-white/5">
            <div className="flex items-center gap-2 italic">
              <Zap className={cn("size-2.5", isStaff && "text-amber-500 animate-pulse")} />
              <span className="text-[6px] font-black uppercase tracking-[0.4em]">
                {isStaff ? "L80_Protocol_Locked" : "Protocol_Active"}
              </span>
            </div>
            <span className="text-[5.5px] font-mono opacity-50">[v16.58]</span>
          </div>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}