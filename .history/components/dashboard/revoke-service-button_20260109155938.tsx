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
// import { revokeServiceAction } from "@/lib/actions/service-actions";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { revokeServiceAction } from "@/lib/actions/service.actions";

export function RevokeServiceButton({ serviceId }: { serviceId: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleRevoke = async () => {
    setIsPending(true);
    try {
      const result = await revokeServiceAction(serviceId);
      if (result.success) {
        toast.success("Service Node Terminated");
        setShowConfirm(false);
      } else {
        toast.error(result.error || "Revocation failed");
      }
    } catch (err) {
      toast.error("Protocol Error: Check connection.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {/* 1. The Trigger: This sits inside your Dropdown Menu */}
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault(); // ✅ STOP dropdown from closing immediately
          setShowConfirm(true); // ✅ MANUALLY trigger the alert dialog
        }}
        className="rounded-xl text-destructive font-black uppercase text-[10px] py-3.5 cursor-pointer focus:bg-destructive focus:text-white transition-all"
      >
        <Trash2 className="h-3.5 w-3.5 mr-2" /> Revoke Deployment
      </DropdownMenuItem>

      {/* 2. The Modal: Controlled by state to ensure it pops up */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-md rounded-[2.5rem] border-border bg-card p-10 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-destructive">
              Confirm Termination?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed mt-2">
              Executing this protocol will permanently erase this signal node
              and all linked pricing tiers from the cluster.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex flex-row gap-3">
            <AlertDialogCancel
              disabled={isPending}
              className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest border-muted"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Prevent auto-closing so we can show the loader
                handleRevoke();
              }}
              disabled={isPending}
              className="flex-1 rounded-xl h-12 bg-destructive text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-destructive/20 hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />{" "}
                  Syncing...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
