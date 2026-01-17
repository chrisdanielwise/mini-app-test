"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Globe, 
  Cpu
} from "lucide-react";
import { toast } from "sonner";
import { updateMerchantSettingsAction } from "@/lib/actions/merchant-settings";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SETTINGS_DEPLOY_BUTTON (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density footprint (h-11/h-12) prevents vertical blowout of settings grids.
 */
export function SettingsDeployButton({ formData }: { formData: any }) {
  const [mounted, setMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeploy = useCallback(async () => {
    impact("medium");
    setIsPending(true);
    
    const toastId = toast.loading(isStaff ? "STAFF_SYNC..." : "SYNC_INIT...");
    
    try {
      const result = await updateMerchantSettingsAction(formData);
      if (result?.success) {
        notification("success");
        toast.success(isStaff ? "OVERSIGHT_STABLE" : "PROTOCOL_STABLE", { 
          id: toastId,
          icon: <ShieldCheck className={cn("size-3.5", isStaff ? "text-amber-500" : "text-primary")} />
        });
      } else {
        notification("error");
        toast.error("FAULT_DETECTED", { id: toastId });
      }
    } catch (err) {
      notification("error");
      toast.error("NET_FAILURE", { id: toastId });
    } finally {
      setIsPending(false);
    }
  }, [formData, isStaff, impact, notification]);

  if (!mounted || !isReady) {
    return (
      <div className="h-10 w-full sm:w-48 rounded-xl bg-white/5 animate-pulse border border-white/5" />
    );
  }

  return (
    <div className="relative group w-full sm:w-auto">
      {/* 🌫️ TACTICAL RADIANCE */}
      {!isPending && (
        <div className={cn(
          "absolute -inset-2 blur-xl opacity-0 group-hover:opacity-20 transition-all duration-700 pointer-events-none",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} />
      )}

      <Button
        onClick={handleDeploy}
        disabled={isPending}
        className={cn(
          "relative w-full sm:w-auto transition-all duration-500 active:scale-95 border-none",
          // 🛡️ TACTICAL SLIM: Compressed h-11/h-12 footprint
          isMobile ? "h-12 px-6 rounded-xl" : "h-11 px-8 rounded-xl",
          "text-[9px] md:text-[9.5px] font-black uppercase italic tracking-widest",
          isStaff ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10" : "bg-primary text-white shadow-lg shadow-primary/10",
          "disabled:opacity-20"
        )}
      >
        <div className="flex items-center justify-center gap-3 relative z-10 leading-none">
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span className="animate-pulse">Syncing...</span>
            </>
          ) : (
            <>
              {isStaff ? (
                <Globe className="size-3.5 transition-transform group-hover:rotate-90" />
              ) : (
                <Zap className="size-3.5 transition-transform group-hover:scale-110" />
              )}
              <span>{isStaff ? "Apply Oversight" : "Deploy Config"}</span>
            </>
          )}
        </div>
      </Button>

      {/* 🏛️ INSTITUTIONAL STATUS LABEL: Slim scaling */}
      {!isMobile && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-20 transition-all pointer-events-none">
           <div className="flex items-center gap-2">
             <Terminal className={cn("size-2.5", isStaff ? "text-amber-500" : "text-primary")} />
             <p className="text-[6.5px] font-black uppercase tracking-[0.2em] italic">
               v16.31_PROVISIONED
             </p>
           </div>
        </div>
      )}
    </div>
  );
}