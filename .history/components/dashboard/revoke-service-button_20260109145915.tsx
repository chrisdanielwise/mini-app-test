"use client";

import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { revokeServiceAction } from "@/lib/actions/service-actions";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function RevokeServiceButton({ serviceId }: { serviceId: string }) {
  const handleRevoke = async () => {
    const result = await revokeServiceAction(serviceId);
    if (result.success) {
      toast.success("Service Node Revoked Successfully");
    } else {
      toast.error(result.error || "Revocation failed");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-full flex items-center px-3 py-2 text-[10px] font-black uppercase text-destructive hover:bg-destructive/10 rounded-xl transition-all">
          <Trash2 className="h-3 w-3 mr-2" /> Revoke Authorization
        </button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="max-w-md rounded-[2.5rem] border-border bg-card p-10 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-destructive">
            Confirm Revocation?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed mt-2">
            This action will permanently terminate this signal node and all linked pricing tiers. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8 flex flex-row gap-3">
          <AlertDialogCancel className="flex-1 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest border-muted">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleRevoke}
            className="flex-1 rounded-xl h-12 bg-destructive text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-destructive/20 hover:bg-destructive/90"
          >
            Confirm Termination
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}