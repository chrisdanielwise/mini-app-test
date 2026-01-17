"use client";

import * as React from "react";
import { useState, useActionState, useEffect } from "react";
import { addTierAction } from "@/lib/actions/tier.actions";

// 🌊 INSTITUTIONAL UI NODES
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density inputs (h-12) prevent vertical blowout.
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
      toast.success("TIER DEPLOYED");
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
        <Button 
          size="lg" 
          className="rounded-xl h-11 px-6 bg-primary shadow-apex transition-all active:scale-95 group"
        >
          <Plus className="size-3.5 text-white mr-2 transition-transform group-hover:rotate-90" />
          <span className="font-black uppercase italic tracking-widest text-[9px] text-white">Deploy_Tier</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-lg border-white/5 bg-background/80 backdrop-blur-xl p-0 overflow-hidden",
          isMobile ? "fixed bottom-0 rounded-t-3xl w-full" : "rounded-2xl"
        )}
      >
        <form action={formAction} className="flex flex-col relative z-10">
          <input type="hidden" name="serviceId" value={serviceId} />
          <input type="hidden" name="merchantId" value={merchantId} />

          {/* --- 🛡️ COMPRESSED COMMAND HUD --- */}
          <div className="shrink-0 p-6 border-b border-white/5 bg-white/[0.02]">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Layers className="size-5" />
                </div>
                <div className="leading-none">
                  <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-foreground">
                    Tier <span className="text-primary">Deploy</span>
                  </DialogTitle>
                  <p className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground mt-1.5 italic">Protocol_Active</p>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* --- 🚀 TACTICAL SLIM CONTENT --- */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
            {/* Identity Block */}
            <div className="space-y-2">
              <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-primary/40 italic ml-1">Identity_Label</Label>
              <div className="relative group">
                <Terminal className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3 text-primary opacity-20" />
                <Input
                  name="name"
                  placeholder="EX: APEX_INFRASTRUCTURE"
                  required
                  className="h-11 pl-10 rounded-xl border-white/5 bg-white/[0.03] font-black uppercase text-[10px] tracking-widest focus:ring-primary/20 placeholder:opacity-10"
                />
              </div>
            </div>

            {/* Liquidity Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-primary/40 italic ml-1">Market_Price_USD</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xs opacity-40">$</span>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    className="h-11 pl-8 rounded-xl border-white/5 bg-white/[0.03] font-black text-xs italic"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-primary/40 italic ml-1">Asset_Class</Label>
                <select name="type" className="w-full h-11 px-4 rounded-xl border border-white/5 bg-white/[0.03] text-[9px] font-black uppercase italic text-foreground outline-none appearance-none">
                  <option value="STANDARD">Standard_Epoch</option>
                  <option value="LIFETIME">Persistent_Node</option>
                </select>
              </div>
            </div>

            {/* Interval & Auto-Notice */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-primary/40 italic ml-1">Billing_Cycle</Label>
                <select name="interval" className="w-full h-11 px-4 rounded-xl border border-white/5 bg-white/[0.03] text-[9px] font-black uppercase italic text-foreground outline-none appearance-none">
                  <option value="MONTH">Monthly_Pulse</option>
                  <option value="YEAR">Annual_Orbit</option>
                  <option value="WEEK">Weekly_Sprint</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <Zap className="size-3 text-primary animate-pulse shrink-0" />
                <p className="text-[7px] font-black text-primary/60 uppercase tracking-widest leading-tight italic">
                  Terminal will auto-terminate nodes on liquidity lapse.
                </p>
              </div>
            </div>
          </div>

          {/* --- 🌊 SLIM FOOTER --- */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="h-9 px-5 rounded-lg font-black uppercase italic tracking-widest text-[8px] text-muted-foreground hover:text-foreground"
            >
              Abort
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 px-6 rounded-xl bg-primary text-white shadow-lg min-w-[140px]"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-3 animate-spin" />
                  <span className="font-black uppercase italic tracking-tighter text-[9px]">Syncing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4" />
                  <span className="font-black uppercase italic tracking-tighter text-[9px]">Initialize_Node</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}