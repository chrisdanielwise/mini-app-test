"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Settings2, PlusCircle, BarChart3, Terminal, Shield, Zap, Globe } from "lucide-react";
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
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID SERVICE ACTION (Institutional v16.16.12)
 * Logic: Haptic-synced node management with role-aware radiance.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function ServiceActionWrapper({ serviceId }: { serviceId: string }) {
  const [mounted, setMounted] = useState(false);
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const isStaff = flavor === "AMBER";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="size-12 rounded-2xl bg-white/5 border border-white/5 animate-pulse ml-auto" />
    );
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && selectionChange()}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => impact("light")}
          className={cn(
            "size-12 rounded-2xl border transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl group/btn active:scale-90",
            isStaff 
              ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black" 
              : "bg-white/5 border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary"
          )}
        >
          <Settings2 className="size-5 group-hover/btn:rotate-90 transition-transform duration-700" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        sideOffset={16}
        className="w-[260px] rounded-[2.25rem] border-white/10 bg-card/90 backdrop-blur-3xl p-3 shadow-2xl z-[100] animate-in zoom-in-95 duration-500"
      >
        {/* --- ROLE AURA HEADER --- */}
        <div className="px-4 py-3 mb-2 flex items-center gap-3 border-b border-white/5">
          {isStaff ? (
            <Globe className="size-3.5 text-amber-500/60 animate-pulse shrink-0" />
          ) : (
            <Terminal className="size-3.5 text-primary/60 shrink-0" />
          )}
          <p className={cn(
            "text-[9px] font-black uppercase tracking-[0.4em] italic",
            isStaff ? "text-amber-500" : "text-muted-foreground/60"
          )}>
            {isStaff ? "Platform_Oversight" : "Node_Operations"}
          </p>
        </div>

        <DropdownMenuItem 
          asChild 
          onClick={() => impact("light")}
          className={cn(
            "rounded-xl py-4 px-4 cursor-pointer transition-all duration-500 group",
            isStaff ? "focus:bg-amber-500/10 focus:text-amber-500" : "focus:bg-primary/10 focus:text-primary"
          )}
        >
          <Link href={`/dashboard/services/${serviceId}`} className="flex items-center w-full">
            <PlusCircle className="size-4 mr-4 text-muted-foreground/40 group-focus:text-inherit transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest italic truncate">
              Expand Pricing
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem 
          asChild 
          onClick={() => impact("light")}
          className={cn(
            "rounded-xl py-4 px-4 cursor-pointer transition-all duration-500 group",
            isStaff ? "focus:bg-amber-500/10 focus:text-amber-500" : "focus:bg-primary/10 focus:text-primary"
          )}
        >
          <Link href={`/dashboard/analytics?serviceId=${serviceId}`} className="flex items-center w-full">
            <BarChart3 className="size-4 mr-4 text-muted-foreground/40 group-focus:text-inherit transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest italic truncate">
              Node Metrics
            </span>
          </Link>
        </DropdownMenuItem>

        <div className="h-px bg-white/5 my-3 mx-2" />
        
        <div className="px-4 py-2 mb-2 flex items-center gap-3 opacity-30">
           <Shield className="size-3.5 text-destructive shrink-0" />
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-destructive">
            Danger_Zone
           </p>
        </div>

        {/* 🛡️ INTEGRATED REVOCATION NODE */}
        <RevokeServiceButton serviceId={serviceId} />

        {/* --- SYSTEM TELEMETRY FOOTER --- */}
        <div className="mt-3 flex items-center justify-between px-4 py-2 opacity-10 italic">
          <div className="flex items-center gap-2">
            <Zap className={cn("size-2.5", isStaff && "text-amber-500")} />
            <span className="text-[7px] font-black uppercase tracking-[0.4em]">
              {isStaff ? "Staff_Protocol_Locked" : "Protocol_Active"}
            </span>
          </div>
          <span className="text-[7px] font-mono">[v16.16.12]</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}