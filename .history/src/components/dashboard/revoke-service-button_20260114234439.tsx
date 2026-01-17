"use client";

import * as React from "react";
import { useState } from "react";
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
import { Trash2, Loader2, ShieldAlert, Terminal, Zap, Globe } from "lucide-react";
import { revokeServiceAction } from "@/lib/actions/service.actions";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";

/**
 * 🌊 FLUID REVOCATION NODE (Institutional v16.16.12)
 * Logic: High-friction destruction with Haptic Confirmation Loop.
 * Design: v9.9.1 Hardened Glassmorphism with Oversized Squircle Geometry.
 */
export function RevokeServiceButton({ serviceId }: { serviceId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { impact, notification } = useHaptics();
  
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  const handleRevoke = async () => {
    impact("heavy"); // 🏁 TACTILE SYNC: Feel the protocol break
    setIsPending(true);
    try {
      const result = await revokeServiceAction(serviceId);
      if (result.success) {
        notification("success");
        toast.success("TERMINATION_COMPLETE: Node decoupled from cluster.");
        setShowConfirm(false);
      } else {
        notification("error");
        toast.error(result.error || "Override_Protocol_Failed");
      }
    } catch (err) {
      notification("error");
      toast.error("SYSTEM_ERROR: Handshake_Interrupted");
    } finally {
      setIsPending(false);
    }
  };

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

      {/* --- DESTRUCTION GUARD --- */}
      <AlertDialog open={showConfirm} onOpenChange={(val) => { setShowConfirm(val); impact("light"); }}>
        <AlertDialogContent className="max-w-md w-[92vw] rounded-[3rem] border-white/10 bg-card/95 backdrop-blur-3xl p-10 lg:p-14 shadow-2xl z-[110] animate-in zoom-in-95 duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]">
          
          {/* 🌊 AMBIENT RADIANCE: Destructive Warning Glow */}
          <div className="absolute -top-24 -right-24 size-64 bg-destructive/10 blur-[120px] pointer-events-none" />

          <AlertDialogHeader className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="size-14 shrink-0 rounded-[1.5rem] bg-destructive/10 flex items-center justify-center text-destructive shadow-inner border border-destructive/20">
                {isStaff ? <Globe className="size-7" /> : <ShieldAlert className="size-7" />}
              </div>
              <AlertDialogTitle className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-destructive leading-[0.9]">
                Confirm <br /> Termination?
              </AlertDialogTitle>
            </div>

            <div className="space-y-6">
              <AlertDialogDescription className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed italic px-1">
                Terminating node{" "}
                <span className="text-foreground not-italic font-black border-b border-destructive/40">
                  {serviceId.slice(0, 16)}...
                </span>{" "}
                will immediately disable all signal broadcasting and pricing tiers.
              </AlertDialogDescription>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <Terminal className="size-4 text-primary shrink-0 opacity-40" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-tight">
                  {isStaff ? "UNIVERSAL_OVERSIGHT_ACTION: Platform management revocation is logged." : "IMMEDIATE: This protocol override is logged and irreversible."}
                </p>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-12 flex flex-col sm:flex-row gap-4">
            <AlertDialogCancel
              disabled={isPending}
              className="w-full sm:flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5 active:scale-90 transition-all duration-500"
            >
              Abort Sync
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRevoke();
              }}
              disabled={isPending}
              className="w-full sm:flex-1 h-14 rounded-2xl bg-destructive text-destructive-foreground text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-destructive/30 hover:bg-destructive/90 active:scale-95 transition-all duration-500"
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="size-4 animate-spin" />
                  <span>DECOUPLING...</span>
                </div>
              ) : (
                "Authorize Revoke"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
          
          <Zap className="absolute -bottom-10 -left-10 size-32 opacity-[0.03] text-destructive rotate-12 pointer-events-none" />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}