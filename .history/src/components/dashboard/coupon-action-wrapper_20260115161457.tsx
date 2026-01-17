"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Copy, Trash2, Settings2, Loader2, ShieldAlert, Terminal, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// 🏛️ Institutional Contexts & Hooks
import { revokeCouponAction } from "@/lib/actions/coupon.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 COUPON_ACTION_NODE (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Ingress | Vapour-Glass depth.
 * Logic: Morphology-aware termination guard with hardware-haptic ticks.
 */
export function CouponActionWrapper({ couponId, code }: { couponId: string; code: string }) {
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { isReady, screenSize, isMobile } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyCode = () => {
    impact("light");
    navigator.clipboard.writeText(code);
    toast.success("PROTOCOL_COPIED", {
      description: `Ingress Code: ${code} mapped to clipboard.`,
      position: isMobile ? "top-center" : "bottom-right",
    });
  };

  const handleRevoke = async () => {
    setIsPending(true);
    impact("heavy");
    try {
      const result = await revokeCouponAction(couponId);
      if (result.success) {
        notification("success");
        toast.success("REVOCATION_COMPLETE", { description: "Node terminated from cluster." });
        setShowConfirm(false);
      } else {
        notification("error");
        toast.error("OVERRIDE_FAILED", { description: result.error || "System rejected revocation." });
      }
    } finally {
      setIsPending(false);
    }
  };

  if (!mounted || !isReady) {
    return <div className="size-12 rounded-2xl bg-white/5 animate-pulse ml-auto border border-white/5" />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => impact("light")}
            className={cn(
              "size-12 md:size-14 rounded-2xl md:rounded-[1.4rem] border transition-all duration-700 shadow-apex group shrink-0",
              isStaff 
                ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500 hover:text-black hover:border-amber-500" 
                : "bg-white/5 border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary"
            )}
          >
            <Settings2 className="size-5 md:size-6 group-hover:rotate-90 transition-transform duration-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          sideOffset={12}
          className={cn(
            "w-[260px] border-white/10 bg-card/90 backdrop-blur-3xl p-4 z-[100] shadow-apex animate-in zoom-in-95 duration-500",
            "rounded-[2rem] md:rounded-[2.5rem]"
          )}
        >
          <div className="flex items-center gap-3 px-4 py-2 mb-3 border-b border-white/5">
            <Activity className="size-3 text-primary/40 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Node_Ops</p>
          </div>
          
          <DropdownMenuItem 
            onClick={copyCode} 
            className={cn(
              "rounded-xl font-black uppercase text-[10px] tracking-[0.2em] py-4 cursor-pointer transition-all duration-500",
              isStaff ? "focus:bg-amber-500/10 focus:text-amber-500" : "focus:bg-primary/10 focus:text-primary"
            )}
          >
            <Copy className="size-4 mr-4 opacity-40" /> Copy Protocol
          </DropdownMenuItem>
          
          <div className="h-px bg-white/5 my-2 mx-2" />
          
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              impact("medium");
              setShowConfirm(true);
            }}
            className="rounded-xl text-destructive font-black uppercase text-[10px] tracking-[0.2em] py-4 cursor-pointer focus:bg-destructive/10 focus:text-destructive transition-all duration-500"
          >
            <Trash2 className="size-4 mr-4 opacity-40" /> Revoke Auth
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🛡️ TERMINATION GUARD: Morphology-Aware Viewport */}
      <AlertDialog open={showConfirm} onOpenChange={(val) => { setShowConfirm(val); impact("light"); }}>
        <AlertDialogContent className={cn(
          "max-w-md border-white/10 bg-card/95 backdrop-blur-3xl shadow-apex z-[120] transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          "rounded-[3rem] md:rounded-[4rem]",
          screenSize === 'xs' ? "w-[94vw] p-8" : "w-[450px] p-12"
        )}>
          {/* Subsurface Vapour Radiance */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.08),transparent_70%)] pointer-events-none" />

          <AlertDialogHeader className="space-y-8 relative z-10">
            <div className="flex flex-row items-center gap-5">
              <div className="size-14 md:size-16 shrink-0 rounded-2xl md:rounded-[1.6rem] bg-destructive/10 flex items-center justify-center text-destructive shadow-inner border border-destructive/20">
                <ShieldAlert className="size-8 animate-pulse" />
              </div>
              <AlertDialogTitle className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-destructive leading-[0.9]">
                Confirm <br /> Termination?
              </AlertDialogTitle>
            </div>
            
            <div className="space-y-6">
              <AlertDialogDescription className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed italic px-1">
                Initiating immediate revocation of promotion <span className="text-foreground not-italic font-black border-b-2 border-destructive/40">{code}</span>.
              </AlertDialogDescription>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                <Terminal className="size-4 text-primary shrink-0" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-tight">
                  {isStaff ? "Universal_Oversight: Terminating global promo node from cluster." : "All active node discounts will be permanently terminated."}
                </p>
              </div>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-12 flex flex-col sm:flex-row gap-5 relative z-10">
            <AlertDialogCancel 
              className="w-full sm:flex-1 h-14 md:h-16 rounded-2xl md:rounded-3xl text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5 transition-all duration-500"
            >
              Abort
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleRevoke(); }}
              disabled={isPending}
              className="w-full sm:flex-1 h-14 md:h-16 rounded-2xl md:rounded-3xl bg-destructive text-white text-[10px] font-black uppercase tracking-widest shadow-apex hover:bg-destructive/90 active:scale-95 transition-all duration-500"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Syncing...</span>
                </div>
              ) : (
                "Authorize Revoke"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}