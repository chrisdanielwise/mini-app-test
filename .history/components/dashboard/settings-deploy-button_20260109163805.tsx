"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { updateMerchantSettingsAction } from "@/lib/actions/merchant-actions";

/**
 * 🛰️ SETTINGS DEPLOYMENT PROTOCOL
 * Optimized for hydration safety and atomic database updates.
 */
export function SettingsDeployButton({ formData }: { formData: any }) {
  const [mounted, setMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // 🛡️ HYDRATION GUARD: Prevents ID mismatch crashes
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeploy = async () => {
    setIsPending(true);
    const toastId = toast.loading("Syncing node settings...");
    
    try {
      const result = await updateMerchantSettingsAction(formData);
      if (result?.success) {
        toast.success("Protocol Updated", { id: toastId });
      } else {
        toast.error(result?.error || "Update failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Network Error: Connectivity lost.", { id: toastId });
    } finally {
      setIsPending(false);
    }
  };

  if (!mounted) {
    return <div className="h-12 w-40 rounded-xl bg-muted/20 animate-pulse" />;
  }

  return (
    <Button
      onClick={handleDeploy}
      disabled={isPending}
      className="rounded-xl h-12 px-8 bg-primary text-primary-foreground font-black uppercase italic tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deploying...
        </>
      ) : (
        <>
          <Zap className="mr-2 h-4 w-4 fill-current" />
          Deploy Changes
        </>
      )}
    </Button>
  );
}