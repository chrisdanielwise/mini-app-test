"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Copy, Trash2, Settings2, Loader2 } from "lucide-react";
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
import { revokeCouponAction } from "@/src/lib/actions/coupon.actions";
import { toast } from "sonner";

export function CouponActionWrapper({ couponId, code }: { couponId: string; code: string }) {
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Protocol Copied: " + code);
  };

  const handleRevoke = async () => {
    setIsPending(true);
    try {
      const result = await revokeCouponAction(couponId);
      if (result.success) {
        toast.success("Promotion Revoked Successfully");
        setShowConfirm(false);
      } else {
        toast.error(result.error || "Revocation failed");
      }
    } finally {
      setIsPending(false);
    }
  };

  if (!mounted) {
    return <div className="h-11 w-11 rounded-2xl bg-muted/20 animate-pulse ml-auto" />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-2xl bg-muted/30 border border-border/10 hover:bg-primary hover:text-white transition-all duration-300"
          >
            <Settings2 className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px] rounded-[1.5rem] p-3 z-[100]">
          <DropdownMenuItem onClick={copyCode} className="rounded-xl font-black uppercase text-[10px] py-3.5 cursor-pointer">
            <Copy className="h-3.5 w-3.5 mr-2" /> Copy Protocol
          </DropdownMenuItem>
          
          <div className="h-px bg-border/50 my-2 mx-1" />
          
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            className="rounded-xl text-destructive font-black uppercase text-[10px] py-3.5 cursor-pointer focus:bg-destructive focus:text-white"
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" /> Revoke Authorization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🛡️ CONFIRMATION GUARD */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-md rounded-[2.5rem] p-10 shadow-2xl z-[110]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-destructive">
              Revoke Promotion?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed mt-2">
              Terminating code <span className="text-foreground">{code}</span> will immediately disable this discount across all linked nodes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex flex-row gap-3">
            <AlertDialogCancel disabled={isPending} className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleRevoke();
              }}
              disabled={isPending}
              className="flex-1 rounded-xl h-12 bg-destructive text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-destructive/20"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}