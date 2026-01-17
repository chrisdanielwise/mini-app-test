"use client";

import * as React from "react";
import { useState, useActionState, useEffect, useCallback } from "react";
import { createServiceAction } from "@/lib/actions/service.actions";

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
import { Textarea } from "@/components/ui/textarea";

// 🛠️ UTILS & TELEMETRY
import {
  Plus,
  Loader2,
  Zap,
  Layers,
  ShieldCheck,
  Trash2,
  Terminal,
  Globe,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🌊 CREATE_SERVICE_MODAL (Institutional Apex v16.16.31)
 * Aesthetics: Water-Ease Kinetic Ingress | Vapour-Glass depth.
 * Logic: Morphology-aware infrastructure provisioning with staggered tier nodes.
 */
export function CreateServiceModal({ merchantId }: { merchantId: string }) {
  const [open, setOpen] = useState(false);
  const { impact, notification } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, screenSize, safeArea } = useDeviceContext();
  
  const isStaff = flavor === "AMBER";
  const [tiers, setTiers] = useState([
    { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" },
  ]);

  const [state, formAction, isPending] = useActionState(createServiceAction, null);

  // 🔄 HYDRATION SYNC
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CLUSTER_DEPLOYED", { description: "Infrastructure nodes are now live." });
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

  /**
   * 🕵️ MORPHOLOGY RESOLUTION
   * Logic: Balancing geometry for 6-tier hardware spectrum.
   */
  const modalRadius = isMobile ? "rounded-t-[3rem] rounded-b-none" : "rounded-[3.5rem]";
  const modalPosition = isMobile ? "fixed bottom-0 translate-y-0" : "";
  const containerPadding = screenSize === 'xs' ? "p-8" : "p-14";

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); impact("light"); }}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className={cn(
            "rounded-2xl md:rounded-3xl h-14 md:h-16 px-8 shadow-apex transition-all hover:scale-105 active:scale-95 group",
            isStaff ? "bg-amber-500 text-black shadow-amber-500/20" : "bg-primary text-white shadow-primary/20"
          )}
        >
          <Plus className="mr-3 size-5 transition-transform group-hover:rotate-90" />
          <span className="font-black uppercase italic tracking-widest text-[10px]">New_Deployment</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-2xl border-white/5 bg-background/60 backdrop-blur-3xl shadow-apex p-0 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          modalRadius,
          modalPosition
        )}
        style={{ maxHeight: isMobile ? '94vh' : '85vh' }}
        onPointerDownOutside={(e) => isPending && e.preventDefault()}
      >
        {/* 🌫️ VAPOUR MASK */}
        <div className={cn(
          "absolute inset-0 opacity-10 blur-[100px] pointer-events-none transition-colors duration-[2000ms]",
          isStaff ? "bg-amber-500" : "bg-primary"
        )} />

        <form action={formAction} className="flex flex-col h-full relative z-10">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className={cn("flex-1 overflow-y-auto space-y-12 custom-scrollbar", containerPadding)}>
            <DialogHeader className="space-y-6">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "size-14 md:size-16 rounded-2xl md:rounded-[1.8rem] flex items-center justify-center shadow-inner border transition-all duration-700",
                  isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {isStaff ? <Globe className="size-7" /> : <Zap className="size-7 fill-current" />}
                </div>
                <div>
                  <DialogTitle className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">
                    Asset <span className={isStaff ? "text-amber-500" : "text-primary"}>Provision</span>
                  </DialogTitle>
                  <div className="flex items-center gap-3 mt-2 opacity-30 italic">
                    <Activity className="size-3 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                      {isStaff ? "Universal_Oversight_Enabled" : "Establishing_Signal_Mesh"}
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* --- 📡 IDENTITY BLOCK --- */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className={cn("flex items-center gap-4 border-b border-white/5 pb-4", isStaff ? "text-amber-500" : "text-primary")}>
                <Terminal className="size-3.5" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic">Identity_Protocol</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 ml-2">Asset_Label</Label>
                  <Input name="name" placeholder="EX: VIP_SIGNALS" required className="h-16 md:h-18 px-6 rounded-2xl md:rounded-[1.8rem] bg-white/[0.03] border-white/5 font-black uppercase italic tracking-widest focus:bg-white/[0.06]" />
                </div>
                <div className="space-y-4">
                  <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 ml-2">Category_Tag</Label>
                  <Input name="categoryTag" placeholder="EX: FOREX" className="h-16 md:h-18 px-6 rounded-2xl md:rounded-[1.8rem] bg-white/[0.03] border-white/5 font-black uppercase italic tracking-widest focus:bg-white/[0.06]" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 ml-2">Target_Telegram_ID</Label>
                <div className="relative group">
                   <Globe className={cn("absolute left-6 top-1/2 -translate-y-1/2 size-4 opacity-30 transition-colors group-focus-within:opacity-100", isStaff ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary")} />
                   <Input name="vipChannelId" placeholder="-100..." required className="h-16 md:h-18 pl-16 rounded-2xl md:rounded-[1.8rem] bg-white/[0.03] border-white/5 font-mono text-sm tracking-widest focus:bg-white/[0.06]" />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 ml-2">Protocol_Manifest</Label>
                <Textarea name="description" placeholder="Brief system overview..." className="rounded-2xl md:rounded-[1.8rem] min-h-[120px] bg-white/[0.03] border-white/5 text-sm p-6 resize-none focus:bg-white/[0.06] transition-all" />
              </div>
            </div>

            {/* --- 💰 PRICING NODES --- */}
            <div className="space-y-10 pb-10">
              <div className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                <div className={cn("flex items-center gap-4", isStaff ? "text-amber-500" : "text-emerald-500")}>
                  <Layers className="size-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic">Pricing_Nodes</h3>
                </div>
                <Button type="button" onClick={addTierRow} variant="outline" className="h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/5">
                  + Add_Node
                </Button>
              </div>

              <div className="space-y-8">
                {tiers.map((tier, index) => (
                  <div 
                    key={tier.id} 
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8 relative animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Node_Title</Label>
                        <Input name="tierNames[]" placeholder="Standard" required className="h-14 rounded-xl md:rounded-2xl bg-black/20 border-white/5 font-black uppercase italic tracking-widest focus:bg-black/40" />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Liquidity_USD</Label>
                        <Input name="tierPrices[]" type="number" step="0.01" placeholder="0.00" required className="h-14 rounded-xl md:rounded-2xl bg-black/20 border-white/5 font-black italic focus:bg-black/40" />
                      </div>
                    </div>
                    
                    <div className="flex flex-row gap-6 items-end">
                      <div className="flex-1 space-y-4 min-w-0">
                        <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/30 ml-2">Billing_Epoch</Label>
                        <div className="relative">
                          <select name="tierIntervals[]" className="w-full h-14 rounded-xl md:rounded-2xl border border-white/5 bg-black/20 px-6 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:bg-black/40 transition-all">
                            <option value="MONTH">Monthly_Pulse</option>
                            <option value="WEEK">Weekly_Sprint</option>
                            <option value="YEAR">Annual_Orbit</option>
                            <option value="DAY">Daily_Node</option>
                          </select>
                          <Activity className="absolute right-6 top-1/2 -translate-y-1/2 size-3 opacity-20 pointer-events-none" />
                        </div>
                        <input type="hidden" name="tierTypes[]" value="CUSTOM" />
                      </div>
                      {tiers.length > 1 && (
                        <Button type="button" variant="ghost" onClick={() => removeTierRow(tier.id)} className="size-14 p-0 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all">
                          <Trash2 className="size-6" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- 🌊 VAPOUR FOOTER --- */}
          <div 
            className="p-8 md:p-12 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row items-center gap-6 backdrop-blur-2xl transition-all duration-700"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : '3rem' }}
          >
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="w-full md:w-auto h-14 px-10 rounded-2xl md:rounded-3xl font-black uppercase italic tracking-widest text-[9px] opacity-30 hover:opacity-100">
              Abort_Sync
            </Button>
            <Button 
              disabled={isPending} 
              type="submit" 
              className={cn(
                "w-full md:flex-1 h-14 md:h-20 rounded-2xl md:rounded-3xl shadow-apex transition-all duration-700",
                isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "bg-primary text-white shadow-primary/40"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="size-5 animate-spin" />
                  <span className="font-black uppercase italic tracking-widest text-[10px]">Provisioning_Block...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-6" />
                  <span className="font-black uppercase italic tracking-widest text-[10px]">Deploy_Cluster_Node</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}