"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Zap, Terminal, Globe } from "lucide-react";
import { toast } from "sonner";
import { updateMerchantSettingsAction } from "@/lib/actions/merchant-settings";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID SETTINGS DEPLOYMENT (Institutional v16.16.12)
 * Logic: Haptic-synced parameter broadcast with Role-Aware Radiance.
 * Design: OLED-optimized Obsidian Depth with v9.9.1 Glassmorphism.
 */
export function SettingsDeployButton({ formData }: { formData: any }) {
  const [mounted, setMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const isStaff = flavor === "AMBER";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeploy = async () => {
    impact("medium"); // 🏁 TACTILE SYNC: Initial pressure of the sync broadcast
    setIsPending(true);
    
    const toastId = toast.loading(
      isStaff ? "STAFF_SYNC: Updating platform parameters..." : "SYNC_INITIATED: Updating node parameters..."
    );
    
    try {
      const result = await updateMerchantSettingsAction(formData);
      if (result?.success) {
        notification("success");
        toast.success(isStaff ? "OVERSIGHT_STABLE: Global parameters updated." : "PROTOCOL_STABLE: Settings successfully deployed.", { 
          id: toastId,
          icon: <ShieldCheck className={cn("size-4", isStaff ? "text-amber-500" : "text-primary")} />
        });
      } else {
        notification("error");
        toast.error(result?.error || "DEPLOYMENT_FAILED: Parameter mismatch.", { id: toastId });
      }
    } catch (err) {
      notification("error");
      toast.error("NETWORK_FAILURE: Telemetry connection lost.", { id: toastId });
    } finally {
      setIsPending(false);
    }
  };

  if (!mounted) {
    return (
      <div className="h-14 w-full sm:w-56 rounded-2xl bg-white/5 animate-pulse border border-white/5 shadow-inner" />
    );
  }

  return (
    <div className="relative group w-full sm:w-auto">
      {/* 🌊 AMBIENT RADIANCE: Role-Aware Hover Aura */}
      {!isPending && (
        <div className={cn(
          "absolute -inset-2 blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700 pointer-events-none",
          isStaff ? "bg-amber-500/20" : "bg-primary/20"
        )} />
      )}

      <Button
        onClick={handleDeploy}
        disabled={isPending}
        size="lg"
        className={cn(
          "relative w-full sm:w-auto px-10 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[10px] md:text-[11px]",
          "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl active:scale-90",
          isStaff ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-primary-foreground shadow-primary/30",
          "disabled:opacity-20 disabled:grayscale"
        )}
      >
        <div className="flex items-center justify-center gap-4">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span className="animate-pulse">Synchronizing...</span>
            </>
          ) : (
            <>
              {isStaff ? (
                <Globe className="size-4 fill-current group-hover:animate-spin-slow" />
              ) : (
                <Zap className="size-4 fill-current group-hover:animate-pulse" />
              )}
              <span>{isStaff ? "Apply Oversight" : "Deploy Configuration"}</span>
            </>
          )}
        </div>
      </Button>

      {/* 🏛️ INSTITUTIONAL STATUS LABEL */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-30 transition-all duration-1000 translate-y-2 group-hover:translate-y-0 pointer-events-none">
         <div className="flex items-center gap-3">
           <Terminal className={cn("size-3", isStaff && "text-amber-500")} />
           <p className={cn("text-[8px] font-black uppercase tracking-[0.4em] italic", isStaff && "text-amber-500")}>
             {isStaff ? "Authorized_by_Platform_Staff" : `Authorized_by_Node_Vector`}
           </p>
         </div>
      </div>
    </div>
  );
}