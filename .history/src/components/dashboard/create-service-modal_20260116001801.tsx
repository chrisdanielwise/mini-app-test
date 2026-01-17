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
 * 🌊 CREATE_SERVICE_MODAL (Institutional Apex v2026.1.15)
 * Strategy: High-density data ingress with morphology-aware safe-area clamping.
 * Fix: Clamped typography and fixed heights to prevent "bogus" oversized distortion.
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

  // 🔄 HYDRATION SYNC: Broadcast Result
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

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); impact("light"); }}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className={cn(
            "rounded-xl md:rounded-2xl h-12 md:h-14 px-6 shadow-apex transition-all hover:scale-[1.02] active:scale-95 group border-none",
            isStaffTheme ? "bg-amber-500 text-black shadow-apex-amber" : "bg-primary text-white shadow-apex-primary"
          )}
        >
          <Plus className="mr-2.5 size-4 transition-transform group-hover:rotate-90" />
          <span className="font-black uppercase italic tracking-[0.3em] text-[10px]">New_Deployment</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-2xl border-white/5 bg-zinc-950/95 backdrop-blur-3xl shadow-2xl p-0 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          isMobile ? "fixed bottom-0 translate-y-0 rounded-t-[2.5rem] rounded-b-none w-full" : "rounded-[2.5rem]"
        )}
        style={{ 
          maxHeight: isMobile ? `calc(95vh - ${safeArea.top}px)` : '85vh'
        }}
        onPointerDownOutside={(e) => isPending && e.preventDefault()}
      >
        <div className={cn(
          "absolute inset-0 opacity-5 blur-[120px] pointer-events-none transition-colors duration-[2000ms]",
          isStaffTheme ? "bg-amber-500" : "bg-primary"
        )} />

        <form action={formAction} className="flex flex-col h-full relative z-10">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className={cn("flex-1 overflow-y-auto space-y-10 custom-scrollbar p-6 md:p-10")}>
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "size-12 md:size-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner border transition-all",
                  isStaffTheme ? "bg-amber-500/10 text-amber-500 border-amber-500/10" : "bg-primary/10 text-primary border-primary/10"
                )}>
                  {isStaffTheme ? <Globe className="size-6" /> : <Zap className="size-6 fill-current" />}
                </div>
                <div>
                  <DialogTitle className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none text-foreground">
                    Asset <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Provision</span>
                  </DialogTitle>
                  <div className="flex items-center gap-2.5 mt-2.5 opacity-30 italic leading-none">
                    <Activity className="size-3 animate-pulse text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-foreground">
                      {isStaffTheme ? "Universal_Oversight_v16" : "Establishing_Signal_Mesh"}
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* --- 📡 IDENTITY BLOCK --- */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={cn("flex items-center gap-3 border-b border-white/5 pb-3", isStaffTheme ? "text-amber-500" : "text-primary")}>
                <Terminal className="size-3" />
                <h3 className="text-[9px] font-black uppercase tracking-[0.4em] italic">Identity_Protocol</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/40 ml-1">Asset_Label</Label>
                  <Input name="name" placeholder="EX: VIP_SIGNALS" required className="h-12 md:h-14 px-5 rounded-xl md:rounded-2xl bg-white/[0.02] border-white/5 font-bold uppercase italic tracking-widest text-[12px] text-foreground" />
                </div>
                <div className="space-y-3">
                  <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/40 ml-1">Category_Tag</Label>
                  <Input name="categoryTag" placeholder="EX: FOREX" className="h-12 md:h-14 px-5 rounded-xl md:rounded-2xl bg-white/[0.02] border-white/5 font-bold uppercase italic tracking-widest text-[12px] text-foreground" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/40 ml-1">Target_Telegram_ID</Label>
                <div className="relative group">
                   <Globe className={cn("absolute left-5 top-1/2 -translate-y-1/2 size-3.5 opacity-20", isStaffTheme ? "text-amber-500" : "text-primary")} />
                   <Input name="vipChannelId" placeholder="-100..." required className="h-12 md:h-14 pl-12 rounded-xl md:rounded-2xl bg-white/[0.02] border-white/5 font-mono text-sm tracking-widest text-foreground" />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/40 ml-1">Protocol_Manifest</Label>
                <Textarea name="description" placeholder="Brief system overview..." className="rounded-xl md:rounded-2xl min-h-[100px] bg-white/[0.02] border-white/5 text-[12px] p-5 resize-none text-foreground italic" />
              </div>
            </div>

            {/* --- 💰 PRICING NODES --- */}
            <div className="space-y-8 pb-6">
              <div className="flex flex-row items-center justify-between border-b border-white/5 pb-3">
                <div className={cn("flex items-center gap-3", isStaffTheme ? "text-amber-500" : "text-emerald-500")}>
                  <Layers className="size-3.5" />
                  <h3 className="text-[9px] font-black uppercase tracking-[0.4em] italic">Pricing_Nodes</h3>
                </div>
                <Button type="button" onClick={addTierRow} variant="outline" className="h-8 px-4 rounded-lg text-[8px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5">
                  + Add_Node
                </Button>
              </div>

              <div className="space-y-4">
                {tiers.map((tier, index) => (
                  <div 
                    key={tier.id} 
                    className="p-6 md:p-8 rounded-[1.5rem] bg-white/[0.01] border border-white/5 space-y-6 relative animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/30 ml-1">Node_Title</Label>
                        <Input name="tierNames[]" placeholder="Standard" required className="h-11 rounded-lg md:rounded-xl bg-black/40 border-white/5 font-bold uppercase italic tracking-widest text-[11px] text-foreground" />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/30 ml-1">Liquidity_USD</Label>
                        <Input name="tierPrices[]" type="number" step="0.01" placeholder="0.00" required className="h-11 rounded-lg md:rounded-xl bg-black/40 border-white/5 font-black italic text-[13px] text-foreground" />
                      </div>
                    </div>
                    
                    <div className="flex flex-row gap-4 items-end">
                      <div className="flex-1 space-y-3 min-w-0">
                        <Label className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/30 ml-1">Billing_Epoch</Label>
                        <select name="tierIntervals[]" className="w-full h-11 rounded-lg md:rounded-xl border border-white/5 bg-black/40 px-5 text-[9px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer text-foreground">
                          <option value="MONTH">Monthly_Pulse</option>
                          <option value="WEEK">Weekly_Sprint</option>
                          <option value="YEAR">Annual_Orbit</option>
                          <option value="DAY">Daily_Node</option>
                        </select>
                        <input type="hidden" name="tierTypes[]" value="CUSTOM" />
                      </div>
                      {tiers.length > 1 && (
                        <Button type="button" variant="ghost" onClick={() => removeTierRow(tier.id)} className="size-11 p-0 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                          <Trash2 className="size-5" />
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
            className="p-6 md:p-8 bg-white/[0.01] border-t border-white/5 flex flex-col md:flex-row items-center gap-4 backdrop-blur-2xl"
            style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1.5rem)` : '2rem' }}
          >
            <Button type="button" variant="ghost" onClick={() => { impact("light"); setOpen(false); }} className="w-full md:w-auto h-12 px-8 rounded-xl md:rounded-2xl font-black uppercase italic tracking-[0.3em] text-[9px] opacity-20 hover:opacity-100 transition-all text-foreground">
              Abort_Provision
            </Button>
            <Button 
              disabled={isPending} 
              type="submit" 
              className={cn(
                "w-full md:flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl shadow-apex transition-all border-none italic",
                isStaffTheme ? "bg-amber-500 text-black shadow-apex-amber" : "bg-primary text-white shadow-apex-primary"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="font-black uppercase tracking-[0.3em] text-[10px]">Provisioning_Block...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5" />
                  <span className="font-black uppercase tracking-[0.3em] text-[10px]">Deploy_Cluster_Node</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}