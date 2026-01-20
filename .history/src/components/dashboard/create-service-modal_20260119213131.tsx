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
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// 🛠️ UTILS & TELEMETRY
import {
  Plus, Loader2, Zap, Layers, ShieldCheck,
  Trash2, Terminal, Globe, Activity, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";
import { useDeviceContext } from "@/components/providers/device-provider";

/**
 * 🛰️ CREATE_SERVICE_MODAL (Hardened v16.16.43)
 * Strategy: Vertical Compression & Morphology-Aware Density.
 * Features: Multi-Tier Provisioning & Hardware-Safe Handshake.
 */
export function CreateServiceModal({ merchantId }: { merchantId: string }) {
  const [open, setOpen] = useState(false);
  const { impact, notification, selectionChange } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";
  
  // 🏦 RESTORED: Multi-Tier Pricing Logic
  const [tiers, setTiers] = useState([
    { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" },
  ]);

  const [state, formAction, isPending] = useActionState(createServiceAction, null);

  // 🔄 HYDRATION & NOTIFICATION SYNC
  useEffect(() => {
    if (state && "success" in state && state.success && !isPending) {
      notification("success");
      toast.success("CLUSTER_DEPLOYED", { description: "Asset nodes are now live on ledger." });
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
          onClick={() => selectionChange()}
          className={cn(
            "rounded-xl h-12 md:h-14 px-6 md:px-8 shadow-apex transition-all active:scale-95 group",
            isStaffTheme ? "bg-amber-500 text-black" : "bg-primary text-white"
          )}
        >
          <Plus className="mr-2 size-4 transition-transform group-hover:rotate-90" />
          <span className="font-black uppercase italic tracking-widest text-[10px] md:text-xs">New_Deployment</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className={cn(
          "max-w-2xl border-white/5 bg-zinc-950/98 backdrop-blur-3xl p-0 overflow-hidden",
          isMobile ? "fixed bottom-0 rounded-t-[2.5rem] w-full" : "rounded-[2rem] shadow-3xl"
        )}
      >
        <form action={formAction} className="flex flex-col relative z-10 max-h-[90dvh]">
          {/* 🛡️ IDENTITY HANDSHAKE */}
          <input type="hidden" name="merchantId" value={merchantId} />

          {/* --- 🛡️ FIXED HUD: Compressed Header --- */}
          <div className="shrink-0 p-6 border-b border-white/5 bg-white/[0.02]">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "size-10 md:size-12 rounded-xl md:rounded-2xl flex items-center justify-center border shadow-inner",
                  isStaffTheme ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  {isStaffTheme ? <Globe className="size-5 md:size-6" /> : <Zap className="size-5 md:size-6" />}
                </div>
                <div className="leading-none">
                  <DialogTitle className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-foreground">
                    Asset <span className={isStaffTheme ? "text-amber-500" : "text-primary"}>Provision</span>
                  </DialogTitle>
                  <DialogDescription className="text-[7.5px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mt-1.5 italic">
                    {isStaffTheme ? "Universal_Oversight_Sync" : "Establishing_Signal_Mesh"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* --- 🚀 TACTICAL SLIM CONTENT --- */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar scroll-smooth">
            
            {/* 🕵️ Identity Protocol Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 opacity-30 italic">
                <Terminal className="size-3" />
                <h3 className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">Identity_Protocol</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label className="text-[7.5px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Asset_Label</Label>
                  <Input name="name" placeholder="VIP_SIGNALS" required className="h-11 md:h-12 rounded-xl bg-white/[0.02] border-white/5 font-bold uppercase text-[10px] tracking-widest" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[7.5px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Category_Tag</Label>
                  <Input name="categoryTag" placeholder="FOREX" className="h-11 md:h-12 rounded-xl bg-white/[0.02] border-white/5 font-bold uppercase text-[10px] tracking-widest" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[7.5px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Target_Telegram_ID</Label>
                <div className="relative group">
                   <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/10 group-focus-within:text-primary transition-colors" />
                   <Input name="vipChannelId" placeholder="-100..." required className="h-11 md:h-12 pl-12 rounded-xl bg-white/[0.02] border-white/5 font-mono text-[11px] tracking-widest" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[7.5px] md:text-[8px] font-black uppercase tracking-[0.2em] text-primary/40 ml-1">Manifest</Label>
                <Textarea name="description" placeholder="Brief system overview..." className="min-h-[80px] rounded-xl bg-white/[0.02] border-white/5 text-[10px] md:text-[11px] p-4 resize-none italic" />
              </div>
            </div>

            {/* 🏧 RESTORED: Pricing Nodes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 opacity-30 italic">
                  <Layers className="size-3" />
                  <h3 className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">Pricing_Nodes</h3>
                </div>
                <button 
                  type="button" 
                  onClick={addTierRow} 
                  className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all",
                    isStaffTheme ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                  )}
                >
                  + Add_Node
                </button>
              </div>

              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div key={tier.id} className="p-5 md:p-6 rounded-2xl bg-white/[0.01] border border-white/5 space-y-5 group animate-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[7px] md:text-[8px] font-black uppercase text-primary/20 ml-1">Node_Title</Label>
                        <Input name="tierNames[]" placeholder="Standard" required className="h-10 rounded-xl bg-black/40 border-white/5 font-bold uppercase text-[10px]" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[7px] md:text-[8px] font-black uppercase text-primary/20 ml-1">Liquidity (USD)</Label>
                        <Input name="tierPrices[]" type="number" step="0.01" placeholder="49.99" required className="h-10 rounded-xl bg-black/40 border-white/5 font-black text-xs tabular-nums" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <select name="tierIntervals[]" className="w-full h-10 rounded-xl border border-white/5 bg-black/40 px-4 text-[9px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer">
                          <option value="MONTH">Monthly Epoch</option>
                          <option value="WEEK">Weekly Sprint</option>
                          <option value="YEAR">Annual Horizon</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-3 opacity-20 pointer-events-none" />
                        <input type="hidden" name="tierTypes[]" value="CUSTOM" />
                      </div>
                      {tiers.length > 1 && (
                        <button type="button" onClick={() => removeTierRow(tier.id)} className="size-10 flex items-center justify-center text-rose-500/40 hover:text-rose-500 transition-all active:scale-90">
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- 🌊 HARDWARE-SAFE FOOTER --- */}
          <div className={cn(
            "shrink-0 p-6 md:p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-3",
            isMobile && "pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
          )}>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => { impact("light"); setOpen(false); }} 
              className="h-10 px-6 rounded-lg font-black uppercase italic text-[8px] md:text-[9px] opacity-20 hover:opacity-100"
            >
              Abort_Sync
            </Button>
            <Button 
              disabled={isPending} 
              type="submit" 
              className={cn(
                "min-w-[160px] md:min-w-[200px] h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-[11px] shadow-lg transition-all active:scale-95",
                isStaffTheme ? "bg-amber-500 text-black shadow-amber-500/30" : "bg-primary text-white shadow-primary/30"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Provisioning...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4" />
                  <span>Deploy_Cluster</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}