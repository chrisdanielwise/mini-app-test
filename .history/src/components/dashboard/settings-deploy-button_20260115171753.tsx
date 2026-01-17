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
  Activity,
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
 * 🌊 SETTINGS_DEPLOY_BUTTON (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Momentum | Vapour-Glass depth.
 * Logic: morphology-aware safe-area clamping with Role-Aware Radiance.
 */
export function SettingsDeployButton({ formData }: { formData: any }) {
  const [mounted, setMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  // 🛰️ DEVICE & TACTILE INGRESS
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, screenSize, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeploy = useCallback(async () => {
    impact("medium"); // 🏁 TACTILE SYNC: Initial pressure of the sync broadcast
    setIsPending(true);
    
    const toastId = toast.loading(
      isStaff ? "STAFF_SYNC: Updating platform mesh..." : "SYNC_INITIATED: Updating node parameters..."
    );
    
    try {
      const result = await updateMerchantSettingsAction(formData);
      if (result?.success) {
        notification("success");
        toast.success(isStaff ? "OVERSIGHT_STABLE" : "PROTOCOL_STABLE", { 
          id: toastId,
          description: isStaff ? "Global parameters synchronized." : "Settings successfully deployed to node.",
          icon: <ShieldCheck className={cn("size-4", isStaff ? "text-amber-500" : "text-primary")} />
        });
      } else {
        notification("error");
        toast.error("DEPLOYMENT_FAILED", { 
          id: toastId,
          description: result?.error || "Parameter mismatch." 
        });
      }
    } catch (err) {
      notification("error");
      toast.error("NETWORK_FAILURE", { 
        id: toastId,
        description: "Telemetry connection lost." 
      });
    } finally {
      setIsPending(false);
    }
  }, [formData, isStaff, impact, notification]);

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!mounted || !isReady) {
    return (
      <div className="h-16 w-full sm:w-64 rounded-2xl md:rounded-[1.4rem] bg-card/20 animate-pulse border border-white/5 shadow-inner" />
    );
  }

  return (
    <div className="relative group w-full sm:w-auto">
      {/* 🌫️ VAPOUR RADIANCE: Role-Based Subsurface Glow */}
      {!isPending && (
        <div className={cn(
          "absolute -inset-4 blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-1000 pointer-events-none",
          isStaff ? "bg-amber-500/20" : "bg-primary/20"
        )} />
      )}

      <Button
        onClick={handleDeploy}
        disabled={isPending}
        className={cn(
          "relative w-full sm:w-auto h-16 md:h-18 px-10 rounded-2xl md:rounded-[1.5rem] font-black uppercase italic tracking-[0.25em] text-[10px] md:text-[11px]",
          "transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-apex active:scale-95",
          isStaff ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-white shadow-primary/30",
          "disabled:opacity-20 disabled:grayscale"
        )}
      >
        <div className="flex items-center justify-center gap-4 relative z-10">
          {isPending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span className="animate-pulse">Syncing_Protocol...</span>
            </>
          ) : (
            <>
              {isStaff ? (
                <Globe className="size-5 fill-current transition-transform duration-1000 group-hover:rotate-180" />
              ) : (
                <Zap className="size-5 fill-current transition-transform duration-700 group-hover:scale-125" />
              )}
              <span>{isStaff ? "Apply Oversight" : "Deploy Config"}</span>
            </>
          )}
        </div>
        
        {/* 🚀 KINETIC MOMENTUM: Subtle shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
      </Button>

      {/* 🏛️ INSTITUTIONAL STATUS LABEL */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-30 transition-all duration-1000 translate-y-3 group-hover:translate-y-0 pointer-events-none whitespace-nowrap">
         <div className="flex items-center gap-3">
           <Terminal className={cn("size-3", isStaff ? "text-amber-500" : "text-primary")} />
           <p className={cn("text-[8px] font-black uppercase tracking-[0.4em] italic", isStaff ? "text-amber-500" : "text-primary")}>
             {isStaff ? "Authorized_by_Platform_Staff" : "Auth_by_Node_v16.31"}
           </p>
         </div>
      </div>

      {/* 📊 TELEMETRY SUB-DETAIL (Desktop Only) */}
      {!isMobile && (
        <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000">
          <div className="flex items-center gap-2 italic">
            <Cpu className="size-2.5" />
            <span className="text-[7px] font-black uppercase tracking-widest leading-none">Mesh_Sync_Ready</span>
          </div>
        </div>
      )}
    </div>
  );
}