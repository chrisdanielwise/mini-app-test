"use client";

import { useState, useActionState, useEffect } from "react";
import { addTierAction } from "@/lib/actions/tier.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Layers, ShieldCheck } from "lucide-react";

interface AddTierModalProps {
  serviceId: string;
}

/**
 * 💎 ADD TIER MODAL
 * Allows merchants to add additional pricing plans to a specific signal service.
 */
export function AddTierModal({ serviceId }: AddTierModalProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addTierAction, null);

  // Auto-close modal when tier is successfully deployed
  useEffect(() => {
    if (state?.success && !isPending) {
      setOpen(false);
    }
  }, [state, isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-12 px-6 font-black uppercase italic tracking-widest shadow-lg hover:scale-105 transition-transform bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add Pricing Tier
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl rounded-[2.5rem] border-border bg-card p-0 overflow-hidden shadow-2xl">
        <form action={formAction}>
          {/* 🔑 Critical: Link this tier to the parent service */}
          <input type="hidden" name="serviceId" value={serviceId} />

          <div className="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" /> New Pricing Plan
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Define a new subscription interval and price for this service.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* --- Tier Identity --- */}
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase ml-1">Tier Display Name</Label>
                <Input
                  name="name"
                  placeholder="e.g. Weekly Full Access"
                  required
                  className="rounded-xl border-muted bg-muted/20 h-12 font-bold"
                />
              </div>

              {/* --- Price & Logic --- */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Price (USD)</Label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="19.99"
                    required
                    className="rounded-xl border-muted bg-muted/20 h-12 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Plan Type</Label>
                  <select
                    name="type"
                    className="w-full h-12 rounded-xl border border-muted bg-muted/20 px-3 text-xs font-bold uppercase cursor-pointer"
                  >
                    <option value="CUSTOM">Standard Subscription</option>
                    <option value="LIFETIME">One-Time / Lifetime</option>
                  </select>
                </div>
              </div>

              {/* --- Billing Cycle --- */}
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase ml-1">Billing Interval</Label>
                <select
                  name="interval"
                  className="w-full h-12 rounded-xl border border-muted bg-muted/20 px-3 text-xs font-bold uppercase cursor-pointer"
                >
                  <option value="WEEK">Every Week</option>
                  <option value="MONTH">Every Month</option>
                  <option value="YEAR">Every Year</option>
                  <option value="DAY">Every Day</option>
                </select>
                <p className="text-[8px] font-bold text-muted-foreground uppercase px-1">
                  Access will be revoked automatically if renewal payment fails.
                </p>
              </div>
            </div>

            {/* --- Error Feedback --- */}
            {state?.error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4">
                <p className="text-[10px] font-black uppercase text-destructive text-center">
                  {state.error}
                </p>
              </div>
            )}
          </div>

          <div className="bg-muted/30 p-6 flex justify-end gap-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-primary px-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-3 w-3" /> Deploy Tier
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}