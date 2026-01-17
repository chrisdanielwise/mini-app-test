"use client";

import * as React from "react";
import { useState, useActionState, useEffect } from "react";
import { addTierAction } from "@/lib/actions/tier.actions";

// 🌊 WATER UI NODES
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
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";

// 🛠️ UTILS & TELEMETRY
import { Plus, Loader2, Layers, ShieldCheck, Zap, Terminal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";

interface AddTierModalProps {
  serviceId: string;
  merchantId: string;
}

/**
 * 💎 SYSTEM COMPONENT: ADD TIER (Apex Tier)
 * Scale: 1M+ User Optimized | Environment: Telegram Mini App / Web Terminal
 * Logic: Synchronized with Universal Identity for Staff & Merchant context.
 */
export function AddTierModal({ serviceId, merchantId }: AddTierModalProps) {
  const [open, setOpen] = useState(false);
  const { impact, notification } = useHaptics();
  const [state, formAction, isPending] = useActionState(addTierAction, null);

  // 🔄 HYDRATION SYNC: Protocol feedback loop
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("TIER DEPLOYED: Node is now live.");
      setOpen(false);
    }
    if (state?.error && !isPending) {
      notification("error");
      toast.error(`DEPLOYMENT ERROR: ${state.error}`);
    }
  }, [state, isPending, notification]);

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      impact("light");
    }}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          variant="default"
          className="shadow-2xl shadow-primary/20"
        >
          <Plus className="mr-2" /> Deploy New Tier
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl md:rounded-[3.5rem] p-0 overflow-hidden">
        <form action={formAction} className="flex flex-col h-full">
          {/* 🔑 SECURITY HANDSHAKE */}
          <input type="hidden" name="serviceId" value={serviceId} />
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 scrollbar-hide">
            <DialogHeader>
              <div className="flex items-center gap-5">
                <div className="size-12 md:size-14 shrink-0 rounded-2xl md:rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                  <Layers className="size-6 md:size-7" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-2xl md:text-3xl">
                    Tier <span className="text-primary">Deployment</span>
                  </DialogTitle>
                  <DialogDescription className="text-[9px] md:text-[11px] opacity-40">
                    Node Context: <span className="font-mono">{serviceId.slice(0, 16)}...</span>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-8 md:space-y-12">
              {/* --- Identity Label --- */}
              <div className="grid gap-4">
                <Label className="text-[10px] md:text-[11px] text-primary ml-1 uppercase font-black italic tracking-[0.3em]">
                  Identity Label
                </Label>
                <div className="relative group">
                  <Terminal className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                  <Input
                    name="name"
                    placeholder="E.G. PLATINUM PRO"
                    required
                    autoFocus
                    className="h-14 md:h-16 pl-14 rounded-2xl md:rounded-[1.5rem] border-white/10 bg-white/5 font-black uppercase text-xs tracking-widest focus:bg-white/10"
                  />
                </div>
              </div>

              {/* --- Financial Grid --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div className="grid gap-4">
                  <Label className="text-[10px] md:text-[11px] text-primary ml-1 uppercase font-black italic tracking-[0.3em]">
                    Liquidity Price (USD)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black text-sm">
                      $
                    </span>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="99.00"
                      required
                      className="h-14 md:h-16 pl-10 rounded-2xl md:rounded-[1.5rem] border-white/10 bg-white/5 font-black text-sm italic"
                    />
                  </div>
                </div>
                
                <div className="grid gap-4">
                  <Label className="text-[10px] md:text-[11px] text-primary ml-1 uppercase font-black italic tracking-[0.3em]">
                    Asset Class
                  </Label>
                  <select
                    name="type"
                    className="h-14 md:h-16 rounded-2xl md:rounded-[1.5rem] border border-white/10 bg-white/5 px-5 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/10 appearance-none transition-all"
                  >
                    <option value="STANDARD">Standard Cycle</option>
                    <option value="LIFETIME">Persistent / Lifetime</option>
                  </select>
                </div>
              </div>

              {/* --- Billing Logic --- */}
              <div className="grid gap-4">
                <Label className="text-[10px] md:text-[11px] text-primary ml-1 uppercase font-black italic tracking-[0.3em]">
                  Billing Protocol
                </Label>
                <select
                  name="interval"
                  className="h-14 md:h-16 rounded-2xl md:rounded-[1.5rem] border border-white/10 bg-white/5 px-5 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 appearance-none focus:bg-white/10"
                >
                  <option value="MONTH">Monthly Epoch</option>
                  <option value="WEEK">Weekly Sprint</option>
                  <option value="YEAR">Annual Horizon</option>
                  <option value="DAY">Daily Access</option>
                </select>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <Zap className="size-4 text-primary animate-pulse shrink-0" />
                  <p className="text-[9px] md:text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.15em] leading-relaxed">
                    Automated Protocol: Signals will de-sync upon payment lapse.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Footer Assembly --- */}
          <div className="bg-white/5 p-6 md:p-10 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-white/5 backdrop-blur-xl">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto h-12 px-8"
            >
              Abort Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="w-full sm:w-auto min-w-[200px] shadow-2xl shadow-primary/30"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Provisioning...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2" /> Initialize Tier
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}