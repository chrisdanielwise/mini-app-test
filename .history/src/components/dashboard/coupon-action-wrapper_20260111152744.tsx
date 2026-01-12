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
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛡️ COUPON ACTION WRAPPER (Apex Tier)
 * Logic: Role-Aware promotional management.
 * Optimized: Unified theme flavors (Amber for Staff, Emerald for Merchants).
 */
export function CouponActionWrapper({ couponId, code }: { couponId: string; code: string }) {
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  useEffect(() => {
    setMounted(true);
  }, []);

  const copyCode = () => {
    hapticFeedback("light");
    navigator.clipboard.writeText(code);
    toast.success("PROTOCOL COPIED: " + code);
  };

  const handleRevoke = async () => {
    setIsPending(true);
    hapticFeedback("heavy");
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
    return <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-muted/20 animate-pulse ml-auto border border-border/10" />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => hapticFeedback("light")}
            className={cn(
              "h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl border transition-all duration-500 shadow-inner group shrink-0",
              isStaff 
                ? "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500 hover:text-black hover:border-amber-500" 
                : "bg-muted/30 border-border/40 hover:bg-primary hover:text-white hover:border-primary"
            )}
          >
            <Settings2 className="h-4 w-4 md:h-5 md:w-5 group-hover:rotate-90 transition-transform duration-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[220px] md:w-[240px] rounded-2xl md:rounded-[2rem] border-border/40 bg-card/95 backdrop-blur-3xl p-2 md:p-3 z-[100] shadow-2xl animate-in zoom-in-95 duration-300"
        >
          <div className="px-3 py-2 mb-1 border-b border-border/10">
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 italic">Node Management</p>
          </div>
          
          <DropdownMenuItem 
            onClick={copyCode} 
            className={cn(
              "rounded-lg md:rounded-xl font-black uppercase text-[9px] tracking-widest py-3 md:py-4 cursor-pointer transition-colors",
              isStaff ? "focus:bg-amber-500/10 focus:text-amber-500" : "focus:bg-primary/10 focus:text-primary"
            )}
          >
            <Copy className="h-3.5 w-3.5 md:h-4 md:w-4 mr-3 opacity-60" /> Copy Protocol
          </DropdownMenuItem>
          
          <div className="h-px bg-border/20 my-1 md:my-2 mx-1 md:mx-2" />
          
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              hapticFeedback("warning");
              setShowConfirm(true);
            }}
            className="rounded-lg md:rounded-xl text-rose-500 font-black uppercase text-[9px] tracking-widest py-3 md:py-4 cursor-pointer focus:bg-rose-500/10 focus:text-rose-500 transition-all"
          >
            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-3 opacity-60" /> Revoke Authorization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🛡️ TERMINATION GUARD */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-md w-[92vw] rounded-3xl md:rounded-[3rem] border-border/40 bg-card/95 backdrop-blur-3xl p-6 md:p-12 shadow-2xl z-[110] animate-in fade-in zoom-in-95 duration-500">
          <AlertDialogHeader className="space-y-4">
            <div className="flex flex-row items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner">
                <ShieldAlert className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <AlertDialogTitle className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-rose-500 leading-none">
                Confirm <br className="hidden sm:block" /> Termination?
              </AlertDialogTitle>
            </div>
            
            <div className="space-y-4 md:space-y-5">
              <AlertDialogDescription className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-widest text-muted-foreground leading-relaxed italic px-1 opacity-70">
                Initiating immediate revocation of promotion <span className="text-foreground not-italic font-black border-b border-rose-500/40">{code}</span>.
              </AlertDialogDescription>
              <div className="flex items-start md:items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/10">
                <Terminal className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 md:mt-0" />
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-tight">
                  {isStaff ? "Universal_Oversight_Action: Terminating global promo node." : "All active node discounts will be permanently terminated."}
                </p>
              </div>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4">
            <AlertDialogCancel 
              disabled={isPending} 
              className="w-full sm:flex-1 rounded-xl md:rounded-2xl h-12 md:h-14 text-[9px] font-black uppercase tracking-widest border-border/20 hover:bg-muted/10 transition-all active:scale-[0.98]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleRevoke();
              }}
              disabled={isPending}
              className="w-full sm:flex-1 rounded-xl md:rounded-2xl h-12 md:h-14 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 active:scale-[0.98] transition-all"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Revoke"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}