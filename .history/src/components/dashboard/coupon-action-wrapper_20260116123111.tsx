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
 * 🛰️ COUPON_ACTION_NODE (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: Reduced trigger size and tightened confirmation membrane.
 */
export function CouponActionWrapper({ couponId, code, compact = false }: { couponId: string; code: string; compact?: boolean }) {
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
        toast.success("REVOCATION_COMPLETE");
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
          className="w-[180px] border-white/5 bg-zinc-950/95 backdrop-blur-xl p-1.5 z-[100] shadow-2xl rounded-xl"
        >
          <div className="flex items-center gap-2 px-2 py-1 mb-1 border-b border-white/5 opacity-20">
            <Activity className="size-2.5 text-primary" />
            <p className="text-[7px] font-black uppercase tracking-[0.3em]">Node_Ops</p>
          </div>
          
          <DropdownMenuItem 
            onClick={copyCode} 
            className="rounded-lg font-bold uppercase text-[8px] tracking-[0.1em] py-2 cursor-pointer transition-colors"
          >
            <Copy className="size-3 mr-2.5 opacity-30" /> Copy Protocol
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              impact("medium");
              setShowConfirm(true);
            }}
            className="rounded-lg text-rose-500 font-bold uppercase text-[8px] tracking-[0.1em] py-2 cursor-pointer focus:bg-rose-500/10 focus:text-rose-500"
          >
            <Trash2 className="size-3 mr-2.5 opacity-40" /> Revoke Auth
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🛡️ TERMINATION GUARD: Compressed Confirmation Membrane */}
      <AlertDialog open={showConfirm} onOpenChange={(val) => { setShowConfirm(val); impact("light"); }}>
        <AlertDialogContent className={cn(
          "max-w-[380px] border-white/5 bg-zinc-950/98 backdrop-blur-2xl shadow-3xl z-[120] rounded-2xl p-6",
          isMobile ? "w-[94vw]" : ""
        )}>
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 shrink-0 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/10">
                <ShieldAlert className="size-5 animate-pulse" />
              </div>
              <AlertDialogTitle className="text-lg font-black uppercase italic tracking-tighter text-rose-500 leading-none">
                Terminate <br /> Node?
              </AlertDialogTitle>
            </div>
            
            <div className="space-y-3">
              <AlertDialogDescription className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40 leading-relaxed italic">
                Revoking promotion <span className="text-foreground not-italic font-black border-b border-rose-500/40">{code}</span>. This action is final.
              </AlertDialogDescription>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.01] border border-white/5">
                <Terminal className="size-2.5 text-primary opacity-30" />
                <p className="text-[7px] font-black uppercase tracking-[0.1em] text-muted-foreground/20">
                  {isStaff ? "Universal_Oversight engaged." : "Node will be expunged from the ledger."}
                </p>
              </div>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-6 flex flex-row gap-3">
            <AlertDialogCancel 
              className="flex-1 h-10 rounded-lg text-[8px] font-black uppercase tracking-widest border-white/5 bg-white/[0.02] hover:bg-white/5"
            >
              Abort
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleRevoke(); }}
              disabled={isPending}
              className="flex-1 h-10 rounded-lg bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg hover:bg-rose-600 transition-all"
            >
              {isPending ? <Loader2 className="size-3 animate-spin" /> : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}