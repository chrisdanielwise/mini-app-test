"use client";

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

/**
 * 🛡️ COUPON ACTION WRAPPER (Tier 2)
 * High-resiliency override controller for promotional protocols.
 */
export function CouponActionWrapper({ couponId, code }: { couponId: string; code: string }) {
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("PROTOCOL COPIED: " + code);
  };

  const handleRevoke = async () => {
    setIsPending(true);
    try {
      const result = await revokeCouponAction(couponId);
      if (result.success) {
        toast.success("REVOCATION COMPLETE: Code terminated.");
        setShowConfirm(false);
      } else {
        toast.error(result.error || "Override Protocol Failed");
      }
    } finally {
      setIsPending(false);
    }
  };

  if (!mounted) {
    return <div className="h-12 w-12 rounded-2xl bg-muted/20 animate-pulse ml-auto border border-border/40" />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl bg-muted/30 border border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 shadow-inner group"
          >
            <Settings2 className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px] rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-2xl p-3 z-[100] shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="px-3 py-2 mb-2">
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">Manage Code</p>
          </div>
          
          <DropdownMenuItem onClick={copyCode} className="rounded-xl font-black uppercase text-[9px] tracking-widest py-4 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors">
            <Copy className="h-4 w-4 mr-3 opacity-60" /> Copy Protocol
          </DropdownMenuItem>
          
          <div className="h-px bg-border/40 my-2 mx-2" />
          
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            className="rounded-xl text-rose-500 font-black uppercase text-[9px] tracking-widest py-4 cursor-pointer focus:bg-rose-500 focus:text-white transition-all"
          >
            <Trash2 className="h-4 w-4 mr-3 opacity-60" /> Revoke Authorization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🛡️ TERMINATION GUARD */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-md rounded-[3rem] border-border/40 bg-card/95 backdrop-blur-3xl p-12 shadow-2xl z-[110] animate-in fade-in zoom-in-95 duration-500">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <AlertDialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-rose-500 leading-none">
                Confirm <br /> Termination?
              </AlertDialogTitle>
            </div>
            
            <div className="space-y-3">
              <AlertDialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed italic px-1">
                Initiating immediate revocation of promotion <span className="text-foreground not-italic font-black border-b border-rose-500/40">{code}</span>.
              </AlertDialogDescription>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/40">
                <Terminal className="h-3 w-3 text-muted-foreground" />
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none">
                  All active node discounts will expire.
                </p>
              </div>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-10 flex flex-row gap-4">
            <AlertDialogCancel disabled={isPending} className="flex-1 rounded-2xl h-14 text-[9px] font-black uppercase tracking-widest border-border/40 hover:bg-muted/50 transition-all">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleRevoke();
              }}
              disabled={isPending}
              className="flex-1 rounded-2xl h-14 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 active:scale-95 transition-all"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Revoke"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}