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
} from "@/src/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/src/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Trash2, Loader2, ShieldAlert, Terminal } from "lucide-react";
import { revokeServiceAction } from "@/src/lib/actions/service.actions";
import { cn } from "@/src/lib/utils";

/**
 * 🛡️ SERVICE REVOCATION BUTTON (Tier 2)
 * High-friction destruction protocol for terminating signal nodes.
 */
export function RevokeServiceButton({ serviceId }: { serviceId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleRevoke = async () => {
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
          setShowConfirm(true); 
        }}
        className="rounded-xl text-rose-500 font-black uppercase text-[9px] tracking-widest py-4 cursor-pointer focus:bg-rose-500 focus:text-white transition-all"
      >
        <Trash2 className="h-4 w-4 mr-3 opacity-60" /> Revoke Deployment
      </DropdownMenuItem>

      {/* --- DESTRUCTION GUARD --- */}
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
                Terminating node <span className="text-foreground not-italic font-black border-b border-rose-500/40">{serviceId.slice(0, 12)}</span> will immediately disable all signal broadcasting and associated pricing tiers.
              </AlertDialogDescription>
              
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/40">
                <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none">
                  This action is logged and permanent.
                </p>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-10 flex flex-row gap-4">
            <AlertDialogCancel
              disabled={isPending}
              className="flex-1 rounded-2xl h-14 text-[9px] font-black uppercase tracking-widest border-border/40 hover:bg-muted/50 transition-all"
            >
              Abort
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); 
                handleRevoke();
              }}
              disabled={isPending}
              className="flex-1 rounded-2xl h-14 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 active:scale-95 transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Syncing...
                </>
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