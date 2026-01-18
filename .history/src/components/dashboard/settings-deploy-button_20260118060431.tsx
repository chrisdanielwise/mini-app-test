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
  Cpu,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { updateMerchantSettingsAction } from "@/lib/actions/merchant-actions";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ SETTINGS_DEPLOY_BUTTON (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Hardware Bridge Sync.
 * Integration: Merged Legacy label logic with Hardened 2026 Chassis.
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
    impact("medium"); // Physical confirmation of deployment protocol
    setIsPending(true);
    
    const toastId = toast.loading(
      isStaff ? "STAFF_SYNC: Updating platform parameters..." : "SYNC_INIT: Updating node parameters..."
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
      toast.error("NET_FAILURE: Telemetry connection lost.", { id: toastId });
    } finally {
      setIsPending(false);
    }
  }, [formData, isStaff, impact, notification]);

  // 🛡️ HYDRATION_SHIELD: Prevents "Bogus" layout snaps on mobile ingress
  if (!mounted || !isReady) {
    return (
      <div className="h-12 md:h-14 w-full sm:w-48 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
    );
  }

  return (
    <div className="relative group w-full sm:w-auto">
      {/* 🌫️ TACTICAL RADIANCE: Role-Aware Background Glow */}
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
          // 🛡️ TACTICAL SLIM: Compressed h-12 (Mobile) / h-11 (Desktop) footprint
          isMobile ? "h-12 px-6 rounded-xl" : "h-11 px-8 rounded-xl",
          "text-[9px] md:text-[10px] font-black uppercase italic tracking-widest",
          isStaff ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10" : "bg-primary text-white shadow-lg shadow-primary/10",
          "disabled:opacity-20"
        )}
      >
        <div className="flex items-center justify-center gap-3 relative z-10 leading-none">
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span className="animate-pulse">Synchronizing...</span>
            </>
          ) : (
            <>
              {isStaff ? (
                <Globe className="size-3.5 transition-transform group-hover:rotate-90" />
              ) : (
                <Zap className="size-3.5 transition-transform group-hover:scale-110" />
              )}
              <span>{isStaff ? "Apply Oversight" : "Deploy Configuration"}</span>
            </>
          )}
        </div>
      </Button>

      {/* ⚡ STATUS INDICATOR: Scaling Tooltip */}
      {!isMobile && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-30 transition-all pointer-events-none whitespace-nowrap">
           <div className="flex items-center gap-2">
             <Terminal className={cn("size-2.5", isStaff ? "text-amber-500" : "text-primary")} />
             <p className={cn("text-[6.5px] font-black uppercase tracking-[0.2em] italic", isStaff && "text-amber-500")}>
               {isStaff ? "AUTHORIZED_BY_PLATFORM_CORE" : `NODE_SIG_${formData?.merchantId?.slice(0, 4) || "LOCAL"}_VERIFIED`}
             </p>
           </div>
        </div>
      )}
    </div>
  );
}