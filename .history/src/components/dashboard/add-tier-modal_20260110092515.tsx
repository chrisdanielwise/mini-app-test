"use client";

import { useState, useActionState, useEffect } from "react";
import { addTierAction } from "@/src/lib/actions/tier.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Plus,
  Loader2,
  Layers,
  ShieldCheck,
  Zap,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

interface AddTierModalProps {
  serviceId: string;
}

/**
 * 💎 SYSTEM COMPONENT: ADD TIER
 * High-resiliency deployment interface for Merchant Pricing Tiers.
 */
export function AddTierModal({ serviceId }: AddTierModalProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addTierAction, null);

  // 🔄 HYDRATION SYNC: Protocol feedback loop
  useEffect(() => {
    if (state?.success && !isPending) {
      toast.success("TIER DEPLOYED: Node is now live.");
      setOpen(false);
    }
    if (state?.error && !isPending) {
      toast.error(`DEPLOYMENT ERROR: ${state.error}`);
    }
  }, [state, isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-14 px-8 font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary text-primary-foreground">
          <Plus className="mr-2 h-5 w-5" /> Deploy New Tier
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl rounded-[3rem] border-border/40 bg-card/95 backdrop-blur-2xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
        <form action={formAction}>
          {/* 🔑 SECURITY HANDSHAKE */}
          <input type="hidden" name="serviceId" value={serviceId} />

          <div className="p-10 space-y-10">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                    Tier <span className="text-primary">Deployment</span>
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1 opacity-60">
                    Registering pricing node for asset: {serviceId.slice(0, 8)}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-8">
              {/* --- Identity Node --- */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                  Identity Label
                </Label>
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                  <Input
                    name="name"
                    placeholder="E.G. PLATINUM PRO"
                    required
                    className="rounded-2xl border-border/40 bg-muted/10 h-14 pl-12 font-black uppercase text-xs tracking-tight focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* --- Financial Grid --- */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                    Liquidity Price (USD)
                  </Label>
                  <div className="relative">
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="99.00"
                      required
                      className="rounded-2xl border-border/40 bg-muted/10 h-14 font-black text-sm pl-8 italic"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">
                      $
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                    Asset Class
                  </Label>
                  <select
                    name="type"
                    className="w-full h-14 rounded-2xl border border-border/40 bg-muted/10 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                  >
                    <option value="STANDARD">Standard Cycle</option>
                    <option value="LIFETIME">Persistent / Lifetime</option>
                  </select>
                </div>
              </div>

              {/* --- Billing Logic --- */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                  Billing Protocol
                </Label>
                <select
                  name="interval"
                  className="w-full h-14 rounded-2xl border border-border/40 bg-muted/10 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="MONTH">Monthly Epoch</option>
                  <option value="WEEK">Weekly Sprint</option>
                  <option value="YEAR">Annual Horizon</option>
                  <option value="DAY">Daily Access</option>
                </select>
                <div className="flex items-center gap-2 px-1 py-2 rounded-xl bg-primary/5 border border-primary/10">
                  <Zap className="h-3 w-3 text-primary animate-pulse ml-2" />
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                    Signals will auto-disconnect upon payment lapse.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- TERMINAL ACTIONS --- */}
          <div className="bg-muted/30 p-8 flex items-center justify-end gap-4 border-t border-border/40 backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-12"
            >
              Abort Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-[1.5rem] bg-primary px-10 h-16 text-[11px] font-black uppercase italic tracking-[0.15em] shadow-2xl shadow-primary/30 transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Provisioning...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" /> Initialize Tier
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
