"use client";

import * as React from "react";
import { useState, useCallback } from "react";
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
import { toast } from "sonner";
import { Trash2, Loader2, ShieldAlert, Terminal, Zap, Globe, Activity } from "lucide-react";
import { revokeServiceAction } from "@/lib/actions/service.actions";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 REVOCATION_NODE (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Transition | Vapour-Glass depth.
 * Logic: morphology-aware high-friction termination with haptic sync.
 */
export function RevokeServiceButton({ serviceId }: { serviceId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { impact, notification } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea, screenSize } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";

  const handleRevoke = useCallback(async () => {
    impact("heavy"); // 🏁 TACTILE SYNC: Physical protocol break
    setIsPending(true);
    try {
      const result = await revokeServiceAction(serviceId);
      if (result.success) {
        notification("success");
        toast.success("TERMINATION_COMPLETE", { 
          description: "Node successfully decoupled from the cluster." 
        });
        setShowConfirm(false);
      } else {
        notification("error");
        toast.error("OVERRIDE_FAILED", { description: result.error });
      }
    } catch (err) {
      notification("error");
      toast.error("SYSTEM_ERROR", { description: "Handshake_Interrupted" });
    } finally {
      setIsPending(false);
    }
  }, [serviceId, impact, notification]);

  if (!isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Logic: Balancing geometry for 6-tier hardware spectrum.
   */
  const modalRadius = isMobile ? "rounded-t-[3rem] rounded-b-none" : "rounded-[3.5rem]";
  const modalPosition = isMobile ? "fixed bottom-0 translate-y-0" : "";

  return (
    <>
      {/* --- TRIGGER NODE --- */}
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
          impact("light");
          setShowConfirm(true);
        }}
        className="rounded-xl text-destructive font-black uppercase text-[10px] tracking-widest py-4 cursor-pointer focus:bg-destructive/10 focus:text-destructive transition-all duration-500"
      >
        <Trash2 className="size-4 mr-3 opacity-40" /> Revoke_Deployment
      </DropdownMenuItem>

      {/* --- DESTRUCTION GUARD: Vapour-Glass Portal --- */}
      <AlertDialog open={showConfirm} onOpenChange={(val) => { setShowConfirm(val); impact("light"); }}>
        <AlertDialogContent 
          className={cn(
            "max-w-xl border-white/5 bg-background/60 backdrop-blur-3xl shadow-apex p-0 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            modalRadius,
            modalPosition
          )}
          style={{ 
            maxHeight: isMobile ? '90vh' : 'auto',
            paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : '0px'
          }}
        >
          {/* 🌫️ VAPOUR MASK: Subsurface Kinetic Warning */}
          <div className="absolute inset-0 bg-gradient-to-b from-destructive/10 to-transparent opacity-20 pointer-events-none transition-opacity duration-1000" />
          
          <div className="flex flex-col h-full relative z-10 p-10 md:p-14">
            <AlertDialogHeader className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="size-16 shrink-0 rounded-[1.8rem] bg-destructive/10 flex items-center justify-center text-destructive shadow-inner border border-destructive/20 transition-all duration-1000">
                  {isStaff ? <Globe className="size-8" /> : <ShieldAlert className="size-8" />}
                </div>
                <div>
                  <AlertDialogTitle className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-destructive leading-[0.85]">
                    Confirm <br /> <span className="text-foreground">Termination?</span>
                  </AlertDialogTitle>
                  <div className="flex items-center gap-3 mt-2 opacity-30 italic">
                    <Activity className="size-3 animate-pulse text-destructive" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">High_Friction_Action</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <AlertDialogDescription className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 leading-relaxed italic">
                  Terminating node{" "}
                  <span className="text-foreground not-italic font-black border-b-2 border-destructive/20 tabular-nums">
                    {serviceId.slice(0, 16)}...
                  </span>{" "}
                  will immediately decouple all signal broadcasting mesh and liquidate pricing tiers.
                </AlertDialogDescription>

                <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                  <Terminal className="size-5 text-destructive shrink-0 opacity-40" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-tight">
                    {isStaff 
                      ? "UNIVERSAL_OVERSIGHT: Platform-level revocation is logged to the core ledger." 
                      : "PROTOCOL_OVERRIDE: This action is irreversible once broadcast to the mesh."}
                  </p>
                </div>
              </div>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-14 flex flex-col sm:flex-row gap-6">
              <AlertDialogCancel
                disabled={isPending}
                className="w-full sm:flex-1 h-16 md:h-20 rounded-2xl md:rounded-3xl text-[11px] font-black uppercase tracking-widest border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all duration-700"
              >
                Abort_Sync
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleRevoke();
                }}
                disabled={isPending}
                className="w-full sm:flex-1 h-16 md:h-20 rounded-2xl md:rounded-3xl bg-destructive text-white text-[11px] font-black uppercase tracking-widest shadow-apex-rose hover:bg-destructive/90 transition-all duration-700"
              >
                {isPending ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="size-5 animate-spin" />
                    <span>DECOUPLING...</span>
                  </div>
                ) : (
                  "Authorize_Revoke"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
          
          <Zap className="absolute -bottom-10 -left-10 size-48 opacity-[0.02] text-destructive rotate-12 pointer-events-none" />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}