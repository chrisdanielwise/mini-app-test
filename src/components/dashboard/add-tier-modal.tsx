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
import {
  Plus,
  Loader2,
  Layers,
  ShieldCheck,
  Zap,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AddTierModalProps {
  serviceId: string;
  merchantId: string; // 🛰️ IDENTITY SYNC: Now required for universal role support
}

/**
 * 💎 SYSTEM COMPONENT: ADD TIER (Apex Tier)
 * Logic: Synchronized with Universal Identity for Staff & Merchant context.
 */
export function AddTierModal({ serviceId, merchantId }: AddTierModalProps) {
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
        <Button className="rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-8 font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary text-primary-foreground text-[10px] md:text-xs">
          <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Deploy New Tier
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl w-[95vw] sm:w-full rounded-2xl md:rounded-[3rem] border-border/40 bg-card/95 backdrop-blur-3xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-h-[92dvh] flex flex-col">
        <form action={formAction} className="flex flex-col h-full overflow-hidden">
          {/* 🔑 SECURITY HANDSHAKE */}
          <input type="hidden" name="serviceId" value={serviceId} />
          
          {/* 🛡️ IDENTITY NODE: Injected to ensure Staff Oversight works correctly */}
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-6 sm:space-y-10 scrollbar-hide">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Layers className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none truncate">
                    Tier <span className="text-primary">Deployment</span>
                  </DialogTitle>
                  <DialogDescription className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground mt-1 opacity-60 truncate">
                    Node Context: {serviceId.slice(0, 12)}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 md:space-y-8">
              {/* --- Identity Label --- */}
              <div className="space-y-2 md:space-y-3">
                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                  Identity Label
                </Label>
                <div className="relative group">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary group-focus-within:opacity-100 transition-all" />
                  <Input
                    name="name"
                    placeholder="E.G. PLATINUM PRO"
                    required
                    className="rounded-xl md:rounded-2xl border-border/40 bg-muted/10 h-12 md:h-14 pl-12 font-black uppercase text-xs tracking-tight focus:ring-primary/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* --- Financial Grid --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                    Liquidity Price (USD)
                  </Label>
                  <div className="relative">
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="99.00"
                      required
                      className="rounded-xl md:rounded-2xl border-border/40 bg-muted/10 h-12 md:h-14 font-black text-sm pl-8 italic focus:ring-primary/20 transition-all shadow-inner"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">
                      $
                    </span>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                    Asset Class
                  </Label>
                  <div className="relative">
                    <select
                      name="type"
                      className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border border-border/40 bg-muted/10 px-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                    >
                      <option value="STANDARD">Standard Cycle</option>
                      <option value="LIFETIME">Persistent / Lifetime</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* --- Billing Logic --- */}
              <div className="space-y-2 md:space-y-3">
                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                  Billing Protocol
                </Label>
                <select
                  name="interval"
                  className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border border-border/40 bg-muted/10 px-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="MONTH">Monthly Epoch</option>
                  <option value="WEEK">Weekly Sprint</option>
                  <option value="YEAR">Annual Horizon</option>
                  <option value="DAY">Daily Access</option>
                </select>
                <div className="flex items-start md:items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <Zap className="h-3 w-3 text-primary animate-pulse shrink-0 mt-0.5 md:mt-0" />
                  <p className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">
                    Automated Protocol: Signals will de-sync upon payment lapse.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 border-t border-border/40 backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-11 md:h-12"
            >
              Abort Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto rounded-xl md:rounded-[1.5rem] bg-primary px-10 h-14 md:h-16 text-[10px] md:text-[11px] font-black uppercase italic tracking-[0.15em] shadow-2xl shadow-primary/30 transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Provisioning...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Initialize Tier
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}