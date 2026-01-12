"use client";

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
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

/**
 * 🛡️ SERVICE REVOCATION BUTTON
 * Logic: Synchronized with Universal Identity.
 * Protocol: High-friction destruction with role-aware oversight.
 */
export function RevokeServiceButton({ serviceId }: { serviceId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  const handleRevoke = async () => {
    hapticFeedback("heavy"); // Physical confirmation of high-friction action
    setIsPending(true);
    try {
      const result = await revokeServiceAction(serviceId);
      if (result.success) {
        toast.success("TERMINATION COMPLETE: Node decoupled from cluster.");
        setShowConfirm(false);
      } else {
        toast.error(result.error || "Override Protocol Failed");
      }
    } catch (err) {
      toast.error("SYSTEM ERROR: Handshake interrupted.");
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
          hapticFeedback("selection");
          setShowConfirm(true);
        }}
        className="rounded-xl text-rose-500 font-black uppercase text-[9px] tracking-widest py-3 md:py-4 cursor-pointer focus:bg-rose-500/10 focus:text-rose-500 transition-all"
      >
        <Trash2 className="h-4 w-4 mr-3 opacity-60" /> Revoke Deployment
      </DropdownMenuItem>

      {/* --- DESTRUCTION GUARD --- */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-md w-[92vw] rounded-2xl md:rounded-[3rem] border-border/40 bg-card/95 backdrop-blur-3xl p-6 md:p-10 lg:p-12 shadow-2xl z-[110] animate-in fade-in zoom-in-95 duration-500 max-h-[90dvh] overflow-y-auto">
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner">
                {isStaff ? <Globe className="h-5 w-5 md:h-6 md:w-6" /> : <ShieldAlert className="h-5 w-5 md:h-6 md:w-6" />}
              </div>
              <AlertDialogTitle className="text-xl md:text-2xl lg:text-3xl font-black uppercase italic tracking-tighter text-rose-500 leading-none">
                Confirm <br className="hidden sm:block" /> Termination?
              </AlertDialogTitle>
            </div>

            <div className="space-y-4">
              <AlertDialogDescription className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed italic px-1 opacity-70">
                Terminating node{" "}
                <span className="text-foreground not-italic font-black border-b border-rose-500/40">
                  {serviceId.slice(0, 12)}
                </span>{" "}
                will immediately disable all signal broadcasting and pricing tiers.
              </AlertDialogDescription>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/30 border border-border/20">
                <Terminal className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-40" />
                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-tight">
                  {isStaff ? "UNIVERSAL_OVERSIGHT_ACTION: Platform management revocation is logged." : "IMMEDIATE: This protocol override is logged and irreversible."}
                </p>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4">
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => {
                hapticFeedback("light");
                setShowConfirm(false);
              }}
              className="w-full sm:flex-1 rounded-xl md:rounded-2xl h-12 md:h-14 text-[9px] font-black uppercase tracking-widest border-border/20 hover:bg-muted/10 transition-all active:scale-[0.98]"
            >
              Abort Sync
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRevoke();
              }}
              disabled={isPending}
              className="w-full sm:flex-1 rounded-xl md:rounded-2xl h-12 md:h-14 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 active:scale-[0.98] transition-all"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>DECOUPLING...</span>
                </div>
              ) : (
                "Authorize Revoke"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
          
          <Zap className="absolute -bottom-6 -right-6 h-24 w-24 opacity-[0.03] text-rose-500 rotate-12 pointer-events-none" />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}