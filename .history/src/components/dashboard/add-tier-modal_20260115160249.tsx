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
 * 🌊 KINETIC_TIER_MODAL (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease movement | Vapour-Glass backdrop.
 * Logic: morphology-aware pre-painting with hardware-clamped viewport.
 */
export function AddTierModal({ serviceId, merchantId }: AddTierModalProps) {
  const [open, setOpen] = useState(false);
  const { impact, notification } = useHaptics();
  const { isReady, isMobile, screenSize, viewportHeight } = useDeviceContext();
  const [state, formAction, isPending] = useActionState(addTierAction, null);

  // 🔄 HYDRATION SYNC
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

  if (!isReady) return null;

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Logic: Clamping modal geometry to screen tier.
   */
  const modalRadius = isMobile ? "rounded-t-[3rem] rounded-b-none" : "rounded-[3.5rem]";
  const modalPosition = isMobile ? "fixed bottom-0 translate-y-0" : "";
  const steamEffect = "before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent before:pointer-events-none";

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      impact(val ? "medium" : "light");
    }}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="rounded-2xl md:rounded-3xl h-14 px-8 bg-primary shadow-apex transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="size-6 rounded-lg bg-white/20 flex items-center justify-center mr-3 transition-transform group-hover:rotate-90">
            <Plus className="size-4" />
          </div>
          <span className="font-black uppercase italic tracking-widest text-[10px]">Deploy_New_Tier</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-2xl border-white/5 bg-background/60 backdrop-blur-3xl shadow-apex p-0 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          modalRadius,
          modalPosition,
          steamEffect
        )}
        style={{ maxHeight: isMobile ? '90vh' : '85vh' }}
      >
        {/* 🧪 THE VAPOUR MASK: Kinetic Glass Ingress */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.1),transparent_70%)] pointer-events-none" />

        <form action={formAction} className="flex flex-col h-full relative z-10">
          <input type="hidden" name="serviceId" value={serviceId} />
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-8 md:p-14 space-y-12 custom-scrollbar">
            <DialogHeader className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="size-14 md:size-16 rounded-2xl md:rounded-[1.8rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner animate-pulse">
                    <Layers className="size-7" />
                  </div>
                  <div>
                    <DialogTitle className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">
                      Tier <span className="text-primary">Deploy</span>
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-2 opacity-30">
                      <Activity className="size-3 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em]">Protocol_Active</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block text-right">
                   <p className="text-[8px] font-black uppercase tracking-[0.5em] opacity-10">Institutional_Node</p>
                   <p className="text-[10px] font-black text-primary/40 italic">v16.16.31</p>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-10 md:space-y-14">
              {/* --- 🛰️ IDENTITY BLOCK --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 ml-2">
                  <Terminal className="size-3 text-primary" />
                  <Label className="text-[10px] md:text-[11px] text-primary uppercase font-black italic tracking-[0.4em]">Identity_Label</Label>
                </div>
                <Input
                  name="name"
                  placeholder="EX: APEX_INFRASTRUCTURE"
                  required
                  className="h-16 md:h-20 px-8 rounded-2xl md:rounded-[2rem] border-white/5 bg-white/[0.03] font-black uppercase text-xs tracking-[0.2em] focus:bg-white/[0.06] transition-all placeholder:text-white/10"
                />
              </div>

              {/* --- 💰 LIQUIDITY GRID --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div className="space-y-4">
                   <Label className="text-[10px] text-primary/40 uppercase font-black italic tracking-[0.4em] ml-2">Market_Price_USD</Label>
                   <div className="relative group">
                     <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-lg group-focus-within:animate-bounce">$</span>
                     <Input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        required
                        className="h-16 md:h-20 pl-14 rounded-2xl md:rounded-[2rem] border-white/5 bg-white/[0.03] font-black text-lg italic"
                     />
                   </div>
                </div>

                <div className="space-y-4">
                   <Label className="text-[10px] text-primary/40 uppercase font-black italic tracking-[0.4em] ml-2">Asset_Class</Label>
                   <select name="type" className="w-full h-16 md:h-20 px-6 rounded-2xl md:rounded-[2rem] border border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest outline-none transition-all focus:bg-white/[0.06] appearance-none">
                     <option value="STANDARD">Standard_Epoch</option>
                     <option value="LIFETIME">Persistent_Node</option>
                   </select>
                </div>
              </div>

              {/* --- ⚡ PROTOCOL INTERVAL --- */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-[10px] text-primary/40 uppercase font-black italic tracking-[0.4em] ml-2">Billing_Cycle</Label>
                  <select name="interval" className="w-full h-16 md:h-20 px-6 rounded-2xl md:rounded-[2rem] border border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest outline-none transition-all focus:bg-white/[0.06] appearance-none">
                    <option value="MONTH">Monthly_Pulse</option>
                    <option value="YEAR">Annual_Orbit</option>
                    <option value="WEEK">Weekly_Sprint</option>
                  </select>
                </div>

                <div className="flex items-center gap-5 p-6 rounded-3xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10">
                  <Zap className="size-5 text-primary animate-pulse shrink-0" />
                  <p className="text-[9px] font-black text-primary/60 uppercase tracking-[0.15em] leading-relaxed italic">
                    Automation_Handshake: Terminal will auto-terminate nodes on liquidity lapse.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- 🌊 VAPOUR FOOTER --- */}
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-end gap-6 border-t border-white/5 bg-white/[0.02] backdrop-blur-2xl">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full md:w-auto h-14 px-10 rounded-2xl md:rounded-3xl font-black uppercase italic tracking-widest text-[9px] opacity-30 hover:opacity-100"
            >
              Abort_Provision
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto min-w-[240px] h-14 md:h-16 rounded-2xl md:rounded-3xl bg-primary shadow-apex transition-all"
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="font-black uppercase italic tracking-widest text-[10px]">Syncing_Block...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5" />
                  <span className="font-black uppercase italic tracking-widest text-[10px]">Initialize_Node</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}