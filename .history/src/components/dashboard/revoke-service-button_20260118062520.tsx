"use client";

import * as React from "react";
import { useState, useCallback } from "react";
// import { revokeServiceAction } from "@/lib/actions/service.actions";

// 🏛️ INSTITUTIONAL UI NODES
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

// 🛠️ UTILS & TELEMETRY
import { 
  Trash2, 
  Loader2, 
  ShieldAlert, 
  Terminal, 
  Zap, 
  Globe, 
  Activity 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ REVOKE_SERVICE_BUTTON (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & High-Friction Tactical Membrane.
 * Fix: Merged Legacy Logic with Bottom-Sheet Ingress (Mobile).
 */
export function RevokeServiceButton({ serviceId }: { serviceId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { impact, notification } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  const handleRevoke = useCallback(async () => {
    impact("heavy"); // Physical confirmation of high-friction action
    setIsPending(true);
    try {
      const result = await revokeServiceAction(serviceId);
      if (result.success) {
        notification("success");
        toast.success("TERMINATION_COMPLETE", {
          description: "Node successfully decoupled from mesh cluster."
        });
        setShowConfirm(false);
      } else {
        notification("error");
        toast.error("OVERRIDE_FAILED", { description: result.error || "Handshake rejected." });
      }
    } catch (err) {
      notification("error");
      toast.error("SYSTEM_ERROR", { description: "Node broadcast interrupted." });
    } finally {
      setIsPending(false);
    }
  }, [serviceId, impact, notification]);

  // 🛡️ HYDRATION_SHIELD
  if (!isReady) return null;

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          impact("light");
          setShowConfirm(true);
        }}
        className="rounded-lg text-destructive font-black uppercase text-[9px] tracking-widest py-3 cursor-pointer focus:bg-destructive/10 focus:text-destructive transition-all"
      >
        <Trash2 className="size-3.5 mr-2.5 opacity-40" /> Revoke_Deployment
      </DropdownMenuItem>

      <AlertDialog open={showConfirm} onOpenChange={(val) => { setShowConfirm(val); impact("light"); }}>
        <AlertDialogContent 
          className={cn(
            "max-w-md border-white/5 bg-zinc-950/90 backdrop-blur-xl p-0 overflow-hidden shadow-2xl transition-all duration-500",
            isMobile 
              ? "fixed bottom-0 rounded-t-[2.5rem] w-full translate-y-0 border-t" 
              : "rounded-[2.5rem]"
          )}
        >
          {/* --- 🛡️ FIXED HUD: Destructive Header --- */}
          <div className="shrink-0 p-6 md:p-8 border-b border-white/5 bg-destructive/5 relative overflow-hidden">
            <AlertDialogHeader>
              <div className="flex items-center gap-4 relative z-10">
                <div className="size-10 md:size-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-inner">
                  {isStaff ? <Globe className="size-6" /> : <ShieldAlert className="size-6" />}
                </div>
                <div className="leading-none">
                  <AlertDialogTitle className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-destructive">
                    Confirm <span className="text-foreground">Decouple</span>
                  </AlertDialogTitle>
                  <div className="flex items-center gap-1.5 mt-1.5 opacity-40 italic">
                    <Activity className="size-2.5 animate-pulse text-destructive" />
                    <span className="text-[7.5px] md:text-[8px] font-black uppercase tracking-[0.3em]">Critical_Decouple</span>
                  </div>
                </div>
              </div>
            </AlertDialogHeader>
            <Zap className="absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.03] text-destructive rotate-12 pointer-events-none" />
          </div>

          {/* --- 🚀 TACTICAL CONTENT --- */}
          <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[50vh] scrollbar-hide">
            <div className="space-y-4">
              <AlertDialogDescription className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 leading-relaxed italic">
                Decoupling node <span className="text-foreground not-italic font-black border-b border-destructive/30">{serviceId.slice(0, 12)}...</span> will immediately terminate mesh signal broadcasts and liquidate associated tiers.
              </AlertDialogDescription>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                <Terminal className="size-3.5 text-destructive opacity-30 shrink-0 mt-0.5" />
                <p className="text-[7.5px] md:text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 leading-tight">
                  {isStaff 
                    ? "STAFF_ROOT_ACTION: Platform management revocation is logged to core ledger." 
                    : "PROTOCOL_OVERRIDE: This action is irreversible once synchronized on-chain."}
                </p>
              </div>
            </div>
          </div>

          {/* --- 🌊 SLIM FOOTER --- */}
          <div 
            className="shrink-0 p-6 md:p-8 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-end gap-3"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1.5rem)` : "2rem" }}
          >
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => { impact("light"); setShowConfirm(false); }}
              className="w-full sm:w-auto h-12 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest border-white/5 bg-white/[0.02] hover:bg-white/5 active:scale-95 transition-all"
            >
              Abort_Sync
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleRevoke(); }}
              disabled={isPending}
              className="w-full sm:min-w-[180px] h-14 md:h-16 rounded-2xl bg-destructive text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-destructive/20 active:scale-95 transition-all"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>DECOUPLING...</span>
                </div>
              ) : (
                "Authorize_Revoke"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}