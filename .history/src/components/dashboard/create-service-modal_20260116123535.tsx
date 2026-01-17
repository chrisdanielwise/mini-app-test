"use client";

import * as React from "react";
import { useState, useActionState, useEffect, useCallback } from "react";
import { createServiceAction } from "@/lib/actions/service.actions";

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
import { Textarea } from "@/components/ui/textarea";

// 🛠️ UTILS & TELEMETRY
import {
  Plus, Loader2, Zap, Layers, ShieldCheck,
  Trash2, Terminal, Globe, Activity
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ CREATE_SERVICE_MODAL (Institutional Apex v2026.1.20)
 * Strategy: Vertical Compression & Tactical Slim Geometry.
 * Fix: High-density inputs (h-11) and row compression prevents blowout.
 */
export function CreateServiceModal({ merchantId }: { merchantId: string }) {
  const [open, setOpen] = useState(false);
  const { impact, notification } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";
  const [tiers, setTiers] = useState([
    { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" },
  ]);

  const [state, formAction, isPending] = useActionState(createServiceAction, null);

  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CLUSTER_DEPLOYED");
      setOpen(false);
      setTiers([{ id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" }]);
    }
    if (state?.error && !isPending) {
      notification("error");
      toast.error("DEPLOYMENT_FAULT", { description: state.error });
    }
  }, [state, isPending, notification]);

  const addTierRow = useCallback(() => {
    impact("medium");
    setTiers(prev => [...prev, { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" }]);
  }, [impact]);

  const removeTierRow = useCallback((id: number) => {
    impact("light");
    if (tiers.length > 1) setTiers(prev => prev.filter((t) => t.id !== id));
  }, [impact, tiers.length]);

  if (!isReady) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); impact("light"); }}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className={cn(
            "rounded-xl h-11 px-5 shadow-apex transition-all active:scale-95 group",
            isStaffTheme ? "bg-amber-500 text-black" : "bg-primary text-white"
          )}
        >
          <Plus className="mr-2 size-3.5 transition-transform group-hover:rotate-90" />
          <span className="font-black uppercase italic tracking-widest text-[9px]">New_Deployment</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-2xl border-white/5 bg-zinc-950/98 backdrop-blur-2xl p-0 overflow-hidden",
          isMobile ? "fixed bottom-0 rounded-t-[2rem] w-full" : "rounded-2xl"
        )}
      >
        <form action={formAction} className="flex flex-col relative z-10">
          <input type="hidden" name="merchantId" value={merchantId} />

          {/* --- 🛡️ FIXED HUD: Compressed Header --- */}
          <div className="shrink-0 p-5 border-b border-white/5 bg-white/[0.02]">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "size-10 rounded-xl flex items-center justify-center border",
                  isStaffTheme ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  {isStaffTheme ? <Globe className="size-5" /> : <Zap className="size-5" />}
                </div>
                <div className="leading-none">
                  <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-foreground">
                    Asset <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Provision</span>
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1.5 opacity-20 italic">
                    <Activity className="size-2.5 animate-pulse text-primary" />
                    <span className="text-[7.5px] font-black uppercase tracking-[0.3em] text-foreground">
                      Establishing_Signal_Mesh
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* --- 🚀 TACTICAL SLIM CONTENT --- */}
          <div className="flex-1 overflow-y-auto max-h-[60vh] p-6 space-y-8 custom-scrollbar">
            
            {/* Identity Protocol Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 opacity-30">
                <Terminal className="size-3" />
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] italic">Identity_Protocol</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Asset_Label</Label>
                  <Input name="name" placeholder="EX: VIP_SIGNALS" required className="h-10 rounded-xl bg-white/[0.02] border-white/5 font-bold uppercase text-[10px] tracking-widest" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Category_Tag</Label>
                  <Input name="categoryTag" placeholder="EX: FOREX" className="h-10 rounded-xl bg-white/[0.02] border-white/5 font-bold uppercase text-[10px] tracking-widest" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Target_Telegram_ID</Label>
                <Input name="vipChannelId" placeholder="-100..." required className="h-10 rounded-xl bg-white/[0.02] border-white/5 font-mono text-[11px] tracking-widest" />
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Manifest</Label>
                <Textarea name="description" placeholder="System overview..." className="min-h-[80px] rounded-xl bg-white/[0.02] border-white/5 text-[11px] p-4 resize-none italic" />
              </div>
            </div>

            {/* Pricing Nodes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between opacity-30">
                <div className="flex items-center gap-2">
                  <Layers className="size-3" />
                  <h3 className="text-[8px] font-black uppercase tracking-[0.3em] italic">Pricing_Nodes</h3>
                </div>
                <button type="button" onClick={addTierRow} className="text-[7px] font-black uppercase tracking-widest border border-white/10 px-2 py-1 rounded hover:bg-white/5">+ Add</button>
              </div>

              <div className="space-y-3">
                {tiers.map((tier) => (
                  <div key={tier.id} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-4 group">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[7px] font-black uppercase text-primary/20 ml-1">Label</Label>
                        <Input name="tierNames[]" required className="h-9 rounded-lg bg-black/40 border-white/5 font-bold uppercase text-[10px]" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[7px] font-black uppercase text-primary/20 ml-1">Price (USD)</Label>
                        <Input name="tierPrices[]" type="number" step="0.01" required className="h-9 rounded-lg bg-black/40 border-white/5 font-black text-[12px]" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <select name="tierIntervals[]" className="w-full h-9 rounded-lg border border-white/5 bg-black/40 px-3 text-[8px] font-black uppercase tracking-widest outline-none">
                          <option value="MONTH">Monthly</option>
                          <option value="WEEK">Weekly</option>
                          <option value="YEAR">Annual</option>
                        </select>
                        <input type="hidden" name="tierTypes[]" value="CUSTOM" />
                      </div>
                      {tiers.length > 1 && (
                        <button type="button" onClick={() => removeTierRow(tier.id)} className="size-9 flex items-center justify-center text-rose-500/30 hover:text-rose-500 transition-all">
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- 🌊 SLIM FOOTER --- */}
          <div className="shrink-0 p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="h-9 px-5 rounded-lg font-black uppercase italic text-[8px] opacity-20 hover:opacity-100">
              Abort
            </Button>
            <Button 
              disabled={isPending} 
              type="submit" 
              className={cn(
                "min-w-[160px] h-10 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg transition-all active:scale-95",
                isStaffTheme ? "bg-amber-500 text-black" : "bg-primary text-white"
              )}
            >
              {isPending ? <Loader2 className="size-3.5 animate-spin mr-2" /> : <ShieldCheck className="size-4 mr-2" />}
              {isPending ? "Provisioning..." : "Deploy_Cluster"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}