"use client";

import { useEffect, useState } from "react";
import { Settings2, PlusCircle, BarChart3, Terminal, Shield, Zap } from "lucide-react";
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
import { hapticFeedback } from "@/lib/telegram/webapp";

/**
 * ⚙️ SERVICE ACTION WRAPPER (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive haptics and touch-safe targets for Service Node management.
 */
export function ServiceActionWrapper({ serviceId }: { serviceId: string }) {
  const [mounted, setMounted] = useState(false);

  // 🛡️ HYDRATION SYNC: Ensures Radix-generated IDs align with client DOM
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-muted/10 border border-border/20 animate-pulse ml-auto" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => hapticFeedback("light")}
          className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-muted/30 border border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-inner group/btn active:scale-90"
        >
          <Settings2 className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:rotate-90 transition-transform duration-500" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-[220px] md:w-[260px] rounded-[1.5rem] md:rounded-[2.25rem] border-border/40 bg-card/95 backdrop-blur-3xl p-2 md:p-3 shadow-2xl z-[100] animate-in zoom-in-95 duration-300"
      >
        <div className="px-3 md:px-4 py-2 md:py-3 mb-1 md:mb-2 flex items-center gap-2 border-b border-border/10">
          <Terminal className="h-3 w-3 text-primary opacity-40 shrink-0" />
          <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground italic">
            Node Operations
          </p>
        </div>

        <DropdownMenuItem 
          asChild 
          onClick={() => hapticFeedback("light")}
          className="rounded-lg md:rounded-xl py-3 md:py-4 px-3 md:px-4 cursor-pointer focus:bg-primary/10 transition-colors group"
        >
          <Link href={`/dashboard/services/${serviceId}`} className="flex items-center w-full">
            <PlusCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-3 text-muted-foreground group-focus:text-primary transition-colors" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest italic truncate">
              Expand Pricing
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem 
          asChild 
          onClick={() => hapticFeedback("light")}
          className="rounded-lg md:rounded-xl py-3 md:py-4 px-3 md:px-4 cursor-pointer focus:bg-primary/10 transition-colors group"
        >
          <Link href={`/dashboard/analytics?serviceId=${serviceId}`} className="flex items-center w-full">
            <BarChart3 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-3 text-muted-foreground group-focus:text-primary transition-colors" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest italic truncate">
              Node Metrics
            </span>
          </Link>
        </DropdownMenuItem>

        <div className="h-px bg-border/20 my-2 md:my-3 mx-1 md:mx-2" />
        
        <div className="px-3 md:px-4 py-2 mb-1 flex items-center gap-2 opacity-40">
           <Shield className="h-3 w-3 text-rose-500 shrink-0" />
           <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-rose-500">
            DANGER ZONE
           </p>
        </div>

        {/* 🛡️ Integrated Revocation Node */}
        <RevokeServiceButton serviceId={serviceId} />

        <div className="mt-2 flex items-center gap-2 px-3 py-1 opacity-10 italic">
          <Zap className="h-2 w-2" />
          <span className="text-[6px] font-black uppercase tracking-[0.4em]">Protocol_Active</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}