"use client";

import { useState, useActionState, useEffect } from "react";
/** * ✅ ARCHITECTURAL SYNC: 
 * Linked to the secure server action that verifies merchant ownership.
 */
import { addTierAction } from "@/lib/actions/tier-actions";
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
import { Plus, Loader2, Layers, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

interface AddTierModalProps {
  serviceId: string;
}

/**
 * 💎 SYSTEM COMPONENT: ADD TIER
 * Provides a high-resiliency interface for deploying new pricing plans.
 */
export function AddTierModal({ serviceId }: AddTierModalProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addTierAction, null);

  // 🔄 HYDRATION SYNC: Handle lifecycle events after deployment
  useEffect(() => {
    if (state?.success && !isPending) {
      toast.success("Tier successfully deployed to node.");
      setOpen(false);
    }
    if (state?.error && !isPending) {
      toast.error(state.error);
    }
  }, [state, isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-12 px-6 font-black uppercase italic tracking-[0.1em] shadow-xl hover:scale-105 transition-all bg-primary text-primary-foreground active:scale-95">
          <Plus className="mr-2 h-4 w-4" /> Add Pricing Tier
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl rounded-[3rem] border-border bg-card p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <form action={formAction}>
          {/* 🔑 SECURITY HANDSHAKE: Hidden input for server-side ownership verification */}
          <input type="hidden" name="serviceId" value={serviceId} />

          <div className="p-10 space-y-10">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                   <Layers className="h-5 w-5" />
                </div>
                <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">
                  Deploy Node Tier
                </DialogTitle>
              </div>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-70">
                Register a new entry point for the <span className="text-foreground">Service Asset</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8">
              {/* --- Tier Identity --- */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary">Identity Label</Label>
                <Input
                  name="name"
                  placeholder="e.g. PREMIUM ACCESS"
                  required
                  className="rounded-2xl border-muted bg-muted/10 h-14 font-black uppercase text-xs tracking-tight focus:ring-primary/20"
                />
              </div>

              {/* --- Price & Logic --- */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary">Price (USD)</Label>
                  <div className="relative">
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="49.99"
                      required
                      className="rounded-2xl border-muted bg-muted/10 h-14 font-black text-sm pl-8"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">$</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary">Asset Class</Label>
                  <select
                    name="type"
                    className="w-full h-14 rounded-2xl border border-muted bg-muted/10 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="STANDARD">Standard Subscription</option>
                    <option value="LIFETIME">One-Time / Lifetime</option>
                  </select>
                </div>
              </div>

              {/* --- Billing Cycle --- */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-primary">Billing Interval</Label>
                <select
                  name="interval"
                  className="w-full h-14 rounded-2xl border border-muted bg-muted/10 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="MONTH">Monthly Cycle</option>
                  <option value="WEEK">Weekly Cycle</option>
                  <option value="YEAR">Annual Cycle</option>
                  <option value="DAY">Daily Node</option>
                </select>
                <div className="flex items-start gap-2 px-1 opacity-50">
                   <Zap className="h-3 w-3 text-primary mt-0.5" />
                   <p className="text-[8px] font-bold text-muted-foreground uppercase leading-tight">
                    Smart-contracts will auto-revoke access upon payment expiration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- ACTION SUITE --- */}
          <div className="bg-muted/20 p-8 flex items-center justify-end gap-4 border-t border-border/50 backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-12"
            >
              Abord Deployment
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-2xl bg-primary px-10 h-14 text-[11px] font-black uppercase italic tracking-[0.1em] shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Node Syncing...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Deploy Plan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}