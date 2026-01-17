"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Copy, Trash2, Settings2, Loader2, ShieldAlert, Terminal } from "lucide-react";
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
import { revokeCouponAction } from "@/lib/actions/coupon.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLayout } from "@/context/layout-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";

/**
 * 🌊 FLUID COUPON ACTION (Institutional v16.16.12)
 * Logic: Role-Aware protocol termination with haptic-synced confirmation.
 * Design: v9.9.1 Hardened Glassmorphism.
 */
export function CouponActionWrapper({ couponId, code }: { couponId: string; code: string }) {
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { flavor } = useLayout();
  const { impact, notification } = useHaptics();
  const isStaff = flavor === "AMBER";

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyCode = () => {
    impact("light");
    navigator.clipboard.writeText(code);
    toast.success("PROTOCOL_COPIED: " + code);
  };

  const handleRevoke = async () => {
    setIsPending(true);
    impact("heavy");
    try {
      const result = await revokeCouponAction(couponId);
      if (result.success) {
        notification("success");
        toast.success("REVOCATION_COMPLETE: Node terminated.");
        setShowConfirm(false);
      } else {
        notification("error");
        toast.error(result.error || "Override_Protocol_Failed");
      }
    } finally {
      setIsPending(false);
    }
  };

  if (!mounted) {
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
              "size-12 rounded-2xl border transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl group shrink-0",
              isStaff 
                ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500 hover:text-black hover:border-amber-500" 
                : "bg-white/5 border-white/10 hover:bg-primary hover:text-primary-foreground hover:border-primary"
            )}
          >
            <Settings2 className="size-5 group-hover:rotate-90 transition-transform duration-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[240px] rounded-[2rem] border-white/10 bg-card/90 backdrop-blur-3xl p-3 z-[100] shadow-2xl animate-in zoom-in-95 duration-500"
        >
          <div className="px-4 py-2 mb-2 border-b border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Node_Management</p>
          </div>
          
          <DropdownMenuItem 
            onClick={copyCode} 
            className={cn(
              "rounded-xl font-black uppercase text-[10px] tracking-widest py-4 cursor-pointer transition-all duration-500",
              isStaff ? "focus:bg-amber-500/10 focus:text-amber-500" : "focus:bg-primary/10 focus:text-primary"
            )}
          >
            <Copy className="size-4 mr-3 opacity-40" /> Copy Protocol
          </DropdownMenuItem>
          
          <div className="h-px bg-white/5 my-2 mx-2" />
          
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              impact("medium");
              setShowConfirm(true);
            }}
            className="rounded-xl text-destructive font-black uppercase text-[10px] tracking-widest py-4 cursor-pointer focus:bg-destructive/10 focus:text-destructive transition-all duration-500"
          >
            <Trash2 className="size-4 mr-3 opacity-40" /> Revoke Auth
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🛡️ TERMINATION GUARD */}
      <AlertDialog open={showConfirm} onOpenChange={(val) => { setShowConfirm(val); impact("light"); }}>
        <AlertDialogContent className="max-w-md w-[92vw] rounded-[3rem] border-white/10 bg-card/95 backdrop-blur-3xl p-12 shadow-2xl z-[110] animate-in fade-in zoom-in-95 duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]">
          <AlertDialogHeader className="space-y-6">
            <div className="flex flex-row items-center gap-4">
              <div className="size-14 shrink-0 rounded-[1.5rem] bg-destructive/10 flex items-center justify-center text-destructive shadow-inner border border-destructive/20">
                <ShieldAlert className="size-7" />
              </div>
              <AlertDialogTitle className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-destructive leading-none">
                Confirm <br /> Termination?
              </AlertDialogTitle>
            </div>
            
            <div className="space-y-6">
              <AlertDialogDescription className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed italic px-1">
                Initiating immediate revocation of promotion <span className="text-foreground not-italic font-black border-b border-destructive/40">{code}</span>.
              </AlertDialogDescription>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                <Terminal className="size-4 text-primary shrink-0" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 leading-tight">
                  {isStaff ? "Universal_Oversight_Action: Terminating global promo node." : "All active node discounts will be permanently terminated."}
                </p>
              </div>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-12 flex flex-col sm:flex-row gap-4">
            <AlertDialogCancel 
              className="w-full sm:flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5 active:scale-90 transition-all duration-500"
            >
              Abort
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleRevoke();
              }}
              disabled={isPending}
              className="w-full sm:flex-1 h-14 rounded-2xl bg-destructive text-destructive-foreground text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-destructive/30 hover:bg-destructive/90 active:scale-95 transition-all duration-500"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "Authorize Revoke"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}