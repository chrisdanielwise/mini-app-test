"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Loader2, ShieldCheck, Zap, Terminal } from "lucide-react";
import { toast } from "sonner";
import { updateMerchantSettingsAction } from "@/lib/actions/merchant.actions";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SETTINGS DEPLOYMENT PROTOCOL (Tier 2)
 * High-resiliency execution switch for merchant system configurations.
 * Optimized for atomic database synchronization and real-time feedback.
 */
export function SettingsDeployButton({ formData }: { formData: any }) {
  const [mounted, setMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // 🛡️ HYDRATION GUARD: Prevents ID mismatch between Server and Client clusters
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeploy = async () => {
    setIsPending(true);
    const toastId = toast.loading("SYNC_INITIATED: Updating node parameters...");
    
    try {
      const result = await updateMerchantSettingsAction(formData);
      if (result?.success) {
        toast.success("PROTOCOL_STABLE: Settings successfully deployed.", { 
          id: toastId,
          icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />
        });
      } else {
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
      <div className="h-14 w-48 rounded-2xl bg-muted/10 border border-border/20 animate-pulse shadow-inner" />
    );
  }

  return (
    <div className="relative group">
      {/* 🔮 Background Glow Aura */}
      {!isPending && (
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <Button
        onClick={handleDeploy}
        disabled={isPending}
        className={cn(
          "relative h-14 px-10 rounded-2xl font-black uppercase italic tracking-[0.15em] text-[11px] shadow-2xl transition-all duration-500",
          "bg-primary text-primary-foreground shadow-primary/20 hover:scale-[1.03] active:scale-95",
          "disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
        )}
      >
        <div className="flex items-center gap-3">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Synchronizing...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 fill-current group-hover:animate-pulse" />
              <span>Deploy Configuration</span>
            </>
          )}
        </div>
      </Button>

      {/* ⚡ Status Indicator Tip */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity whitespace-nowrap">
         <div className="flex items-center gap-1.5">
           <Terminal className="h-2.5 w-2.5" />
           <p className="text-[7px] font-black uppercase tracking-[0.2em]">
             Authorized by Node_{formData?.merchantId?.slice(0, 4) || "Staff"}
           </p>
         </div>
      </div>
    </div>
  );
}