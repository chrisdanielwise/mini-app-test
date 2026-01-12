"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Zap, Terminal, Globe } from "lucide-react";
import { toast } from "sonner";
import { updateMerchantSettingsAction } from "@/lib/actions/merchant-actions";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛰️ SETTINGS DEPLOYMENT PROTOCOL
 * Logic: Synchronized with Universal Identity.
 * Adaptive: Flavor-shifts (Amber/Emerald) based on operator context.
 */
export function SettingsDeployButton({ formData }: { formData: any }) {
  const [mounted, setMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  // 🛡️ HYDRATION GUARD
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeploy = async () => {
    hapticFeedback("medium"); // Physical confirmation of deployment protocol
    setIsPending(true);
    const toastId = toast.loading(isStaff ? "STAFF_SYNC: Updating platform parameters..." : "SYNC_INITIATED: Updating node parameters...");
    
    try {
      const result = await updateMerchantSettingsAction(formData);
      if (result?.success) {
        hapticFeedback("success");
        toast.success(isStaff ? "OVERSIGHT_STABLE: Global parameters updated." : "PROTOCOL_STABLE: Settings successfully deployed.", { 
          id: toastId,
          icon: <ShieldCheck className={cn("h-4 w-4", isStaff ? "text-amber-500" : "text-emerald-500")} />
        });
      } else {
        hapticFeedback("error");
        toast.error(result?.error || "DEPLOYMENT_FAILED: Parameter mismatch.", { id: toastId });
      }
    } catch (err) {
      toast.error("NETWORK_FAILURE: Telemetry connection lost.", { id: toastId });
    } finally {
      setIsPending(false);
    }
  };

  if (!mounted) {
    return (
      <div className="h-12 md:h-14 w-full sm:w-48 rounded-xl md:rounded-2xl bg-muted/10 border border-border/10 animate-pulse shadow-inner" />
    );
  }

  return (
    <div className="relative group w-full sm:w-auto">
      {/* 🔮 Role-Aware Background Glow Aura */}
      {!isPending && (
        <div className={cn(
          "absolute -inset-1 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          isStaff ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5" : "bg-gradient-to-r from-primary/20 to-primary/5"
        )} />
      )}

      <Button
        onClick={handleDeploy}
        disabled={isPending}
        className={cn(
          "relative w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl font-black uppercase italic tracking-[0.1em] md:tracking-[0.15em] text-[10px] md:text-[11px] shadow-2xl transition-all duration-500",
          "shadow-primary/20 hover:scale-[1.02] active:scale-95",
          isStaff ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-primary-foreground shadow-primary/20",
          "disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
        )}
      >
        <div className="flex items-center justify-center gap-3">
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
              <span>Synchronizing...</span>
            </>
          ) : (
            <>
              {isStaff ? (
                <Globe className="h-3.5 w-3.5 md:h-4 md:w-4 fill-current group-hover:animate-pulse" />
              ) : (
                <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 fill-current group-hover:animate-pulse" />
              )}
              <span>{isStaff ? "Apply Oversight" : "Deploy Configuration"}</span>
            </>
          )}
        </div>
      </Button>

      {/* ⚡ Status Indicator Tip */}
      <div className="absolute -bottom-5 md:-bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity whitespace-nowrap pointer-events-none">
         <div className="flex items-center gap-1.5">
           <Terminal className={cn("h-2.5 w-2.5", isStaff && "text-amber-500")} />
           <p className={cn("text-[6px] md:text-[7px] font-black uppercase tracking-[0.2em]", isStaff && "text-amber-500")}>
             {isStaff ? "Authorized_by_Platform_Staff" : `Authorized_by_Node_${formData?.merchantId?.slice(0, 4) || "User"}`}
           </p>
         </div>
      </div>
    </div>
  );
}