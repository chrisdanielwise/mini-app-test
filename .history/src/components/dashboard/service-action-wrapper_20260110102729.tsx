"use client";

import { useEffect, useState } from "react";
import { Settings2, PlusCircle, BarChart3, Terminal, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { RevokeServiceButton } from "@/src/components/dashboard/revoke-service-button";
import { cn } from "@/src/lib/utils";

/**
 * ⚙️ SERVICE ACTION WRAPPER (Tier 2)
 * High-resiliency control valve for Service Node management.
 * Synchronized with Radix UI for client-side hydration safety.
 */
export function ServiceActionWrapper({ serviceId }: { serviceId: string }) {
  const [mounted, setMounted] = useState(false);

  // 🛡️ HYDRATION SYNC: Ensures Radix-generated IDs align with the client DOM
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-12 w-12 rounded-2xl bg-muted/10 border border-border/20 animate-pulse ml-auto" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-2xl bg-muted/30 border border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-inner group/btn"
        >
          <Settings2 className="h-5 w-5 group-hover/btn:rotate-90 transition-transform duration-500" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[260px] rounded-[2.25rem] border-border/40 bg-card/95 backdrop-blur-3xl p-3 shadow-2xl z-[100] animate-in zoom-in-95 duration-300"
      >
        <div className="px-4 py-3 mb-2 flex items-center gap-2 border-b border-border/20">
          <Terminal className="h-3 w-3 text-primary opacity-50" />
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            Node Operations
          </p>
        </div>

        <DropdownMenuItem asChild className="rounded-xl py-4 px-4 cursor-pointer focus:bg-primary/10 transition-colors group">
          <Link href={`/dashboard/services/${serviceId}`} className="flex items-center w-full">
            <PlusCircle className="h-4 w-4 mr-3 text-muted-foreground group-focus:text-primary transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">
              Expand Pricing
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="rounded-xl py-4 px-4 cursor-pointer focus:bg-primary/10 transition-colors group">
          <Link href={`/dashboard/analytics?serviceId=${serviceId}`} className="flex items-center w-full">
            <BarChart3 className="h-4 w-4 mr-3 text-muted-foreground group-focus:text-primary transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">
              Node Metrics
            </span>
          </Link>
        </DropdownMenuItem>

        <div className="h-px bg-border/40 my-3 mx-2" />
        
        <div className="px-4 py-2 mb-1 flex items-center gap-2">
           <Shield className="h-3 w-3 text-rose-500 opacity-50" />
           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-rose-500/50">
            DANGER ZONE
           </p>
        </div>

        {/* 🛡️ Integrated Revocation Node */}
        <RevokeServiceButton serviceId={serviceId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}