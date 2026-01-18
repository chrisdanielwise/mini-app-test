"use client";

import * as React from "react";
import { useState, useActionState, useEffect } from "react";
import { addTierAction } from "@/lib/actions/tier.actions";

// 🏛️ INSTITUTIONAL UI NODES
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

// 🛠️ UTILS & TELEMETRY
import { Plus, Loader2, Layers, ShieldCheck, Zap, Terminal, Activity } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useDeviceContext } from "@/components/providers/device-provider";

interface AddTierModalProps {
  serviceId: string;
  merchantId: string;
}

/**
 * 🛰️ ADD_TIER_MODAL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Morphology-Aware Ingress.
 * Merged: Restores Obsidian Depth & Terminal Typography from legacy node.
 */
export function AddTierModal({ serviceId, merchantId }: AddTierModalProps) {
  const [open, setOpen] = useState(false);
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  const [state, formAction, isPending] = useActionState(addTierAction, null);

  useEffect(() => {
    if (!state || isPending) return;
    if (state.success) {
      notification("success");
      toast.success("TIER DEPLOYED: Node is now live.");
      setOpen(false);
    } else if (state.error) {
      notification("error");
      toast.error(`DEPLOYMENT ERROR: ${state.error}`);
    }
  }, [state, isPending, notification]);

  if (!isReady) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      impact(val ? "medium" : "light");
    }}>
      <DialogTrigger asChild>
        {/* 🏎️ RESTORED: Kinetic legacy animation and scale factors */}
        <Button 
          size="lg" 
          className="rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-8 bg-primary shadow-apex hover:scale-[1.02] active:scale-95 transition-all group"
        >
          <Plus className="size-4 md:size-5 text-white mr-2 transition-transform group-hover:rotate-90" />
          <span className="font-black uppercase italic tracking-widest text-[10px] md:text-xs text-white">Deploy_New_Tier</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "z-[500] max-w-xl w-[95vw] sm:w-full border-white/5 bg-background/90 backdrop-blur-3xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500",
          isMobile ? "fixed bottom-0 rounded-t-3xl" : "rounded-2xl md:rounded-[3rem]"
        )}
        style={{
          /* 📐 DYNAMIC DISPLACEMENT: Modal sits exactly above the Command Hub */
          paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 5.5rem)` : "0px"
        }}
      >
        <form action={formAction} className="flex flex-col relative z-10 max-h-[92dvh]">
          <input type="hidden" name="serviceId" value={serviceId} />
          <input type="hidden" name="merchantId" value={merchantId} />

          {/* --- 🛡️ LEGACY IDENTITY NODE --- */}
          <div className="shrink-0 p-6 md:p-10 border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                  <Layers className="size-5 md:size-6" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-foreground leading-none">
                    Tier <span className="text-primary">Deployment</span>
                  </DialogTitle>
                  <DialogDescription className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1.5 opacity-60 italic">
                    Node Context: {serviceId.slice(0, 12)}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* --- 🚀 TERMINAL INPUT FIELDSET --- */}
          <div className="flex-1 p-6 md:p-10 space-y-6 md:space-y-8 overflow-y-auto scrollbar-hide">
            <div className="space-y-2 md:space-y-3">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 italic ml-1">Identity_Label</Label>
              <div className="relative group">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-primary opacity-20 group-focus-within:opacity-100 transition-all" />
                <Input
                  name="name"
                  placeholder="E.G. PLATINUM PRO"
                  required
                  className="h-12 md:h-14 pl-12 rounded-xl md:rounded-2xl border-white/5 bg-white/[0.03] font-black uppercase text-xs tracking-tight focus:ring-primary/20 shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-2 md:space-y-3">
                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 italic ml-1">Market_Price_USD</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xs opacity-40">$</span>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="99.00"
                    required
                    className="h-12 md:h-14 pl-8 rounded-xl md:rounded-2xl border-white/5 bg-white/[0.03] font-black text-sm italic shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 italic ml-1">Asset_Class</Label>
                <select name="type" className="w-full h-12 md:h-14 px-4 rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.03] text-[9px] md:text-[10px] font-black uppercase italic text-foreground outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20">
                  <option value="STANDARD">Standard Cycle</option>
                  <option value="LIFETIME">Persistent / Lifetime</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 italic ml-1">Billing_Protocol</Label>
              <select name="interval" className="w-full h-12 md:h-14 px-4 rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.03] text-[9px] md:text-[10px] font-black uppercase italic text-foreground outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20">
                <option value="MONTH">Monthly Epoch</option>
                <option value="WEEK">Weekly Sprint</option>
                <option value="YEAR">Annual Horizon</option>
                <option value="DAY">Daily Access</option>
              </select>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <Zap className="size-3 text-primary animate-pulse shrink-0" />
                <p className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed italic">
                  Automated Protocol: Signals will de-sync upon payment lapse.
                </p>
              </div>
            </div>
          </div>

          {/* --- 🌊 OBSIDIAN FOOTER --- */}
          <div className="p-6 md:p-8 border-t border-white/5 bg-muted/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto h-11 md:h-12 px-6 rounded-xl font-black uppercase italic tracking-widest text-[9px] md:text-[10px] text-muted-foreground hover:text-foreground"
            >
              Abort Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto h-14 md:h-16 px-10 rounded-xl md:rounded-[1.5rem] bg-primary text-white shadow-2xl shadow-primary/30 active:scale-95 transition-all"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="font-black uppercase italic tracking-tighter text-[10px] md:text-[11px]">Provisioning...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5" />
                  <span className="font-black uppercase italic tracking-tighter text-[10px] md:text-[11px]">Initialize Tier</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}