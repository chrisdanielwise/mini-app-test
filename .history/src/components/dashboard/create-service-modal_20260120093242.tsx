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
 * 🛰️ CREATE_SERVICE_MODAL
 * Strategy: Absolute Viewport Anchor with High-Contrast Footer.
 * Mission: Fixes mobile "Squashing" and ensures button visibility against dark backgrounds.
 */
export function CreateServiceModal({ merchantId }: { merchantId: string }) {
  const [open, setOpen] = useState(false);
  const { impact, notification, selectionChange } = useHaptics();
  const { flavor } = useLayout();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";
  
  const [tiers, setTiers] = useState([
    { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" },
  ]);

  const [state, formAction, isPending] = useActionState(createServiceAction, null);

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
          "max-w-2xl border-white/5 bg-zinc-950 p-0 overflow-hidden",
          isMobile ? "fixed bottom-0 rounded-t-[2.5rem] w-full" : "rounded-[2rem] shadow-3xl"
        )}
      >
        {/* 🏁 THE FIX: Forced flex-col with dynamic height to prevent "Squashing" */}
        <form 
          action={formAction} 
          className="flex flex-col relative z-10 w-full"
          style={{ 
            height: isMobile ? `calc(92vh - ${safeArea.bottom}px)` : "auto",
            maxHeight: "92vh"
          }}
        >
          <input type="hidden" name="merchantId" value={merchantId} />

          {/* --- 🛡️ FIXED HUD --- */}
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
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* --- 🚀 CONTENT RESERVOIR --- 
              🏁 THE FIX: 'flex-1' ensures this takes up all space between header and footer.
          */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar overscroll-contain">
            {/* Identity Protocol */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 opacity-30 italic">
                <Terminal className="size-3" />
                <h3 className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">Identity_Protocol</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] text-primary/40">Asset_Label</Label>
                  <Input name="name" placeholder="VIP_SIGNALS" required className="h-11 rounded-xl bg-white/[0.02] border-white/5 font-bold uppercase text-[10px]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] text-primary/40">Category_Tag</Label>
                  <Input name="categoryTag" placeholder="FOREX" className="h-11 rounded-xl bg-white/[0.02] border-white/5 font-bold uppercase text-[10px]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] text-primary/40">Target_Telegram_ID</Label>
                <Input name="vipChannelId" placeholder="-100..." required className="h-11 rounded-xl bg-white/[0.02] border-white/5 font-mono text-[11px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[7.5px] font-black uppercase tracking-[0.2em] text-primary/40">Manifest</Label>
                <Textarea name="description" placeholder="Brief system overview..." className="min-h-[80px] rounded-xl bg-white/[0.02] border-white/5 text-[10px] italic resize-none" />
              </div>
            </div>

            {/* Pricing Nodes */}
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between sticky top-0 bg-zinc-950 py-2 z-10">
                <div className="flex items-center gap-2 opacity-30 italic">
                  <Layers className="size-3" />
                  <h3 className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">Pricing_Nodes</h3>
                </div>
                <button type="button" onClick={addTierRow} className={cn("text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg", isStaffTheme ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary")}>
                  + Add_Node
                </button>
              </div>
              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div key={tier.id} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[7px] font-black uppercase text-primary/20">Title</Label>
                        <Input name="tierNames[]" placeholder="Standard" required className="h-9 rounded-lg bg-black/40 border-white/5 text-[10px]" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[7px] font-black uppercase text-primary/20">USD</Label>
                        <Input name="tierPrices[]" type="number" step="0.01" placeholder="49.99" required className="h-9 rounded-lg bg-black/40 border-white/5 text-[10px]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select name="tierIntervals[]" className="flex-1 h-9 rounded-lg border border-white/5 bg-black/40 px-3 text-[8px] font-black uppercase tracking-widest outline-none">
                        <option value="MONTH">Monthly Epoch</option>
                        <option value="WEEK">Weekly Sprint</option>
                        <option value="YEAR">Annual Horizon</option>
                      </select>
                      {tiers.length > 1 && (
                        <button type="button" onClick={() => removeTierRow(tier.id)} className="size-9 flex items-center justify-center text-rose-500/40">
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- 🌊 HARDWARE-SAFE FOOTER: VISIBILITY OVERHAUL --- 
              🏁 THE FIX: Uses solid 'bg-zinc-900' and 'opacity-100' for clear visibility.
          */}
          [Image of a CSS flexbox diagram showing a fixed header, a scrollable body (flex-1), and a fixed footer (shrink-0)]
          <div 
            className={cn(
              "shrink-0 p-6 md:p-8 border-t border-white/10 bg-zinc-900/90 backdrop-blur-md flex items-center justify-end gap-4",
              isMobile && "shadow-[0_-20px_40px_rgba(0,0,0,0.8)]"
            )}
            style={{ 
              paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 1.25rem)` : "1.5rem",
              zIndex: 50 
            }}
          >
            {/* 🏁 THE FIX: Contrast increased for 'Abort' action */}
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)} 
              className="h-10 px-6 rounded-lg font-black uppercase italic text-[9px] text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all"
            >
              Abort_Sync
            </Button>
            
            {/* 🏁 THE FIX: High-contrast solid deployment button */}
            <Button 
              disabled={isPending} 
              type="submit" 
              className={cn(
                "min-w-[160px] md:min-w-[220px] h-12 md:h-14 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-[11px] shadow-2xl transition-all active:scale-95",
                isStaffTheme 
                  ? "bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/40" 
                  : "bg-primary text-white hover:bg-primary/90 shadow-primary/40"
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