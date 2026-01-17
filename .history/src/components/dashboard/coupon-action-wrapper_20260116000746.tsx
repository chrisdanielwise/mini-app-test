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
 * 🛰️ COUPON_ACTION_NODE (Institutional Apex v2026.1.15)
 * Strategy: High-density, low-profile tactical node.
 * Fix: Standardized to fixed-width triggers to prevent layout distortion.
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
    return <div className="size-10 rounded-xl bg-white/5 animate-pulse ml-auto border border-white/5" />;
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
              "size-10 md:size-11 rounded-xl md:rounded-2xl border transition-all duration-500 shadow-apex group shrink-0",
              isStaff 
                ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500 hover:text-black" 
                : "bg-white/5 border-white/10 hover:bg-primary hover:text-white"
            )}
          >
            <Settings2 className="size-4 md:size-5 group-hover:rotate-45 transition-transform duration-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          sideOffset={8}
          className={cn(
            "w-[220px] border-white/5 bg-zinc-950/90 backdrop-blur-3xl p-2 z-[100] shadow-2xl animate-in zoom-in-95 duration-300",
            "rounded-2xl"
          )}
        >
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1 border-b border-white/5 opacity-30 italic">
            <Activity className="size-3 text-primary animate-pulse" />
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">Node_Ops</p>
          </div>
          
          <DropdownMenuItem 
            onClick={copyCode} 
            className={cn(
              "rounded-xl font-bold uppercase text-[9px] tracking-[0.2em] py-3 cursor-pointer transition-all",
              isStaff ? "focus:bg-amber-500/10 focus:text-amber-500" : "focus:bg-primary/10 focus:text-primary"
            )}
          >
            <Copy className="size-3.5 mr-3 opacity-40" /> Copy Protocol
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              impact("medium");
              setShowConfirm(true);
            }}
            className="rounded-xl text-rose-500 font-bold uppercase text-[9px] tracking-[0.2em] py-3 cursor-pointer focus:bg-rose-500/10 focus:text-rose-500 transition-all"
          >
            <Trash2 className="size-3.5 mr-3 opacity-40" /> Revoke Auth
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🛡️ TERMINATION GUARD: Institutional Modal */}
      <AlertDialog open={showConfirm} onOpenChange={(val) => { setShowConfirm(val); impact("light"); }}>
        <AlertDialogContent className={cn(
          "max-w-md border-white/5 bg-zinc-950/95 backdrop-blur-3xl shadow-2xl z-[120] animate-in zoom-in-95 duration-500",
          "rounded-[2.5rem]",
          isMobile ? "w-[92vw] p-8" : "w-[420px] p-10"
        )}>
          <AlertDialogHeader className="space-y-6 relative z-10">
            <div className="flex flex-row items-center gap-4">
              <div className="size-12 md:size-14 shrink-0 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner border border-rose-500/10">
                <ShieldAlert className="size-6 animate-pulse" />
              </div>
              <AlertDialogTitle className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-rose-500 leading-none">
                Confirm <br /> Termination?
              </AlertDialogTitle>
            </div>
            
            <div className="space-y-4">
              <AlertDialogDescription className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 leading-relaxed italic">
                Initiating immediate revocation of promotion <span className="text-foreground not-italic font-black border-b border-rose-500/40">{code}</span>.
              </AlertDialogDescription>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <Terminal className="size-3 text-primary shrink-0 opacity-40" />
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                  {isStaff ? "Universal_Oversight: Node expulsion protocol engaged." : "Active node discounts will be permanently terminated."}
                </p>
              </div>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-10 flex flex-col sm:flex-row gap-4 relative z-10">
            <AlertDialogCancel 
              className="w-full sm:flex-1 h-12 md:h-14 rounded-xl text-[9px] font-black uppercase tracking-widest border-white/5 bg-white/[0.02] hover:bg-white/10 transition-all"
            >
              Abort
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleRevoke(); }}
              disabled={isPending}
              className="w-full sm:flex-1 h-12 md:h-14 rounded-xl bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 active:scale-95 transition-all"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-3 animate-spin" />
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