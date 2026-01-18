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
 * 🛰️ COUPON_ACTION_NODE (Hardened v16.16.32)
 * Strategy: Vertical Compression & Kinetic Destruction.
 * Logic: Role-Aware (Amber/Emerald) with Hardware-Synced Confirmation.
 */
export function CouponActionWrapper({ couponId, code }: { couponId: string; code: string }) {
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const { isReady, isMobile } = useDeviceContext();
  const isStaff = flavor === "AMBER";

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyCode = () => {
    impact("light");
    navigator.clipboard.writeText(code);
    toast.success("PROTOCOL_COPIED", {
      description: `Ingress Code: ${code} secured.`,
    });
  };

  const handleRevoke = async () => {
    setIsPending(true);
    impact("heavy");
    try {
      const result = await revokeCouponAction(couponId);
      if (result.success) {
        notification("success");
        toast.success("REVOCATION_COMPLETE", {
          description: `Node_${code}_Expunged_Successfully`,
        });
        setShowConfirm(false);
      } else {
        notification("error");
        toast.error("OVERRIDE_FAILED", { description: result.error });
      }
    } finally {
      setIsPending(false);
    }
  };

  if (!mounted || !isReady) {
    return <div className="size-8 rounded-lg bg-white/5 animate-pulse ml-auto" />;
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
              "size-8 rounded-lg border transition-all duration-300 shadow-sm shrink-0",
              isStaff 
                ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500 hover:text-black" 
                : "bg-white/5 border-white/10 hover:bg-primary hover:text-white"
            )}
          >
            <Settings2 className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          sideOffset={6}
          className="w-[200px] border-white/5 bg-zinc-950/95 backdrop-blur-3xl p-1.5 z-[100] shadow-2xl rounded-2xl animate-in zoom-in-95 duration-300"
        >
          {/* Node Operations Header */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 mb-1 border-b border-white/5 opacity-20 italic">
            <Activity className="size-2.5 text-primary animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-[0.3em]">Node_Ops_v2026</span>
          </div>
          
          <DropdownMenuItem 
            onClick={copyCode} 
            className={cn(
                "rounded-lg font-bold uppercase text-[8px] tracking-[0.15em] py-3 cursor-pointer transition-colors",
                isStaff ? "focus:bg-amber-500/10 focus:text-amber-500" : "focus:bg-primary/10 focus:text-primary"
            )}
          >
            <Copy className="size-3 mr-2.5 opacity-30" /> Copy Protocol
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              impact("medium");
              setShowConfirm(true);
            }}
            className="rounded-lg text-rose-500 font-bold uppercase text-[8px] tracking-[0.15em] py-3 cursor-pointer focus:bg-rose-500/10 focus:text-rose-500"
          >
            <Trash2 className="size-3 mr-2.5 opacity-40" /> Revoke Auth
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🛡️ TERMINATION GUARD: Hardened Confirmation Membrane */}
      <AlertDialog open={showConfirm} onOpenChange={(val) => { setShowConfirm(val); if(!val) impact("light"); }}>
        <AlertDialogContent className={cn(
          "max-w-[380px] border-white/5 bg-zinc-950/98 backdrop-blur-3xl z-[300] rounded-[2rem] p-6 shadow-3xl",
          isMobile ? "w-[94vw] mb-safe" : ""
        )}>
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 shrink-0 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/10">
                <ShieldAlert className="size-5 animate-pulse" />
              </div>
              <AlertDialogTitle className="text-xl font-black uppercase italic tracking-tighter text-rose-500 leading-none">
                Terminate <br /> Node?
              </AlertDialogTitle>
            </div>
            
            <div className="space-y-3">
              <AlertDialogDescription className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40 leading-relaxed italic">
                Revoking promotion <span className="text-foreground not-italic font-black border-b border-rose-500/40">{code}</span>. This action is irreversible.
              </AlertDialogDescription>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.01] border border-white/5">
                <Terminal className="size-2.5 text-primary opacity-30" />
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/20">
                  {isStaff ? "Universal_Oversight engaged." : "Node will be expunged from the ledger."}
                </p>
              </div>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-8 flex flex-row gap-3">
            <AlertDialogCancel 
              disabled={isPending}
              className="flex-1 h-12 rounded-xl text-[8px] font-black uppercase tracking-widest border-white/5 bg-white/[0.02] hover:bg-white/5 active:scale-95 transition-all"
            >
              Abort
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleRevoke(); }}
              disabled={isPending}
              className="flex-1 h-12 rounded-xl bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 active:scale-95 transition-all"
            >
              {isPending ? <Loader2 className="size-3 animate-spin" /> : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}