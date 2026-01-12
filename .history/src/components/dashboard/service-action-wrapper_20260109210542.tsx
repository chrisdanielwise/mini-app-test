"use client";

import { useEffect, useState } from "react";
import { Settings2, PlusCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RevokeServiceButton } from "@/components/dashboard/revoke-service-button";

export function ServiceActionWrapper({ serviceId }: { serviceId: string }) {
  const [mounted, setMounted] = useState(false);

  // 🛡️ Ensure Radix IDs are generated only on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-12 w-12 rounded-2xl bg-muted/20 animate-pulse ml-auto" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-2xl bg-muted/20 border border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group/btn"
        >
          <Settings2 className="h-5 w-5 group-hover/btn:rotate-90 transition-transform" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[240px] rounded-[2rem] border-border/50 shadow-2xl p-3 bg-card/95 backdrop-blur-2xl z-[100]"
      >
        <DropdownMenuItem asChild className="rounded-xl font-black uppercase text-[10px] py-4 tracking-widest cursor-pointer focus:bg-primary focus:text-white">
          <Link href={`/dashboard/services/${serviceId}`}>
            <PlusCircle className="h-4 w-4 mr-3" /> Expand Pricing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl font-black uppercase text-[10px] py-4 tracking-widest cursor-pointer focus:bg-primary focus:text-white">
          <Link href={`/dashboard/analytics?serviceId=${serviceId}`}>
            <BarChart3 className="h-4 w-4 mr-3" /> Node Metrics
          </Link>
        </DropdownMenuItem>

        <div className="h-px bg-border/50 my-2 mx-1" />
        
        {/* ✅ Integrated: This will now reliably trigger the confirmation popup */}
        <RevokeServiceButton serviceId={serviceId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}