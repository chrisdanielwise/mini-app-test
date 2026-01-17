"use client";

import * as React from "react";
import { useState, useActionState, useEffect } from "react";
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
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";

interface CreateServiceModalProps {
  merchantId: string;
}

/**
 * 💎 SYSTEM COMPONENT: CREATE SERVICE (Apex Tier)
 * Scale: 1M+ User Optimized | Logic: Staggered Tier Injection.
 * Design: v9.9.1 Hardened Glassmorphism with Flavor-Sync.
 */
export function CreateServiceModal({ merchantId }: CreateServiceModalProps) {
  const [open, setOpen] = useState(false);
  const { impact, notification } = useHaptics();
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  const [tiers, setTiers] = useState([
    { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" },
  ]);

  const [state, formAction, isPending] = useActionState(createServiceAction, null);

  // 🔄 HYDRATION SYNC: Haptic Confirmation Loop
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CLUSTER DEPLOYED: Assets are now live.");
      setOpen(false);
      setTiers([{ id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" }]);
    }
    if (state?.error && !isPending) {
      notification("error");
      toast.error(`DEPLOYMENT_FAILED: ${state.error}`);
    }
  }, [state, isPending, notification]);

  const addTierRow = () => {
    impact("medium");
    setTiers([...tiers, { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" }]);
  };

  const removeTierRow = (id: number) => {
    impact("light");
    if (tiers.length > 1) setTiers(tiers.filter((t) => t.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); impact("light"); }}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className={cn(
            "shadow-2xl transition-all duration-700",
            isStaff ? "bg-amber-500 text-black shadow-amber-500/30" : "shadow-primary/30"
          )}
        >
          <Plus className="mr-2" /> New Deployment
        </Button>
      </DialogTrigger>

      <DialogContent 
        className="max-w-xl md:rounded-[3.5rem] p-0 overflow-hidden"
        onPointerDownOutside={(e) => isPending && e.preventDefault()}
      >
        <form action={formAction} className="flex flex-col h-full overflow-hidden">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 scrollbar-hide">
            <DialogHeader>
              <div className="flex items-center gap-5">
                <div className={cn(
                  "size-12 md:size-14 shrink-0 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-inner border",
                  isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {isStaff ? <Globe className="size-6 md:size-7" /> : <Zap className="size-6 md:size-7 fill-current" />}
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-2xl md:text-3xl">
                    Asset <span className={isStaff ? "text-amber-500" : "text-primary"}>Provisioning</span>
                  </DialogTitle>
                  <DialogDescription className="text-[10px] md:text-[11px] opacity-40">
                    {isStaff ? "Universal_Oversight_Action" : "Establishing Signal Node Infrastructure"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* --- Identity Protocol --- */}
            <div className="space-y-6">
              <div className={cn("flex items-center gap-3 border-b border-white/5 pb-4", isStaff ? "text-amber-500" : "text-primary")}>
                <Terminal className="size-4" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic">Identity_Protocol</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Asset Label</Label>
                  <Input name="name" placeholder="VIP SIGNALS" required className="h-12 rounded-xl bg-white/5 border-white/10 font-black uppercase tracking-widest" />
                </div>
                <div className="grid gap-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Category Tag</Label>
                  <Input name="categoryTag" placeholder="FOREX" className="h-12 rounded-xl bg-white/5 border-white/10 font-black uppercase tracking-widest" />
                </div>
              </div>

              <div className="grid gap-3">
                <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Target Telegram ID</Label>
                <div className="relative group">
                   <Globe className={cn("absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-30 transition-colors", isStaff ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary")} />
                   <Input name="vipChannelId" placeholder="-100..." required className="h-12 pl-12 rounded-xl bg-white/5 border-white/10 font-mono text-[11px] tracking-widest" />
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label className="text-[9px] font-black uppercase tracking-widest opacity-40 ml-1">Protocol Manifest</Label>
                <Textarea name="description" placeholder="Brief system overview..." className="rounded-xl min-h-[100px] bg-white/5 border-white/10 text-[11px] font-medium resize-none" />
              </div>
            </div>

            {/* --- Pricing Nodes (Staggered List) --- */}
            <div className="space-y-8 pb-8">
              <div className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                <div className={cn("flex items-center gap-3", isStaff ? "text-amber-500" : "text-emerald-500")}>
                  <Layers className="size-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic">Pricing_Nodes</h3>
                </div>
                <Button type="button" onClick={addTierRow} variant="outline" className="h-10 px-4 rounded-xl text-[9px]">
                  + Add Node
                </Button>
              </div>

              <div className="space-y-6">
                {tiers.map((tier, index) => (
                  <div 
                    key={tier.id} 
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="p-8 rounded-[2rem] bg-white/5 border border-white/5 space-y-6 relative animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <Label className="text-[8px] font-black uppercase tracking-widest opacity-30 ml-1">Node Title</Label>
                        <Input name="tierNames[]" placeholder="Standard" required className="h-11 rounded-xl bg-card border-white/10 font-black uppercase italic tracking-widest" />
                      </div>
                      <div className="grid gap-3">
                        <Label className="text-[8px] font-black uppercase tracking-widest opacity-30 ml-1">Liquidity (USD)</Label>
                        <Input name="tierPrices[]" type="number" step="0.01" placeholder="49.99" required className="h-11 rounded-xl bg-card border-white/10 font-black italic" />
                      </div>
                    </div>
                    
                    <div className="flex flex-row gap-4 items-end">
                      <div className="flex-1 grid gap-3 min-w-0">
                        <Label className="text-[8px] font-black uppercase tracking-widest opacity-30 ml-1">Billing Epoch</Label>
                        <select name="tierIntervals[]" className="w-full h-11 rounded-xl border border-white/10 bg-card px-5 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:bg-white/10">
                          <option value="MONTH">Monthly Epoch</option>
                          <option value="WEEK">Weekly Sprint</option>
                          <option value="YEAR">Annual Horizon</option>
                          <option value="DAY">Daily Node</option>
                        </select>
                        <input type="hidden" name="tierTypes[]" value="CUSTOM" />
                      </div>
                      {tiers.length > 1 && (
                        <Button type="button" variant="ghost" onClick={() => removeTierRow(tier.id)} className="size-11 p-0 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-xl">
                          <Trash2 className="size-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- Terminal Footer --- */}
          <div className="p-8 md:p-12 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row items-center gap-4 backdrop-blur-3xl">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="w-full sm:w-auto px-10 h-12">
              Abort Sync
            </Button>
            <Button 
              disabled={isPending} 
              type="submit" 
              size="lg"
              className={cn(
                "w-full sm:flex-1 shadow-2xl transition-all duration-700",
                isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "shadow-primary/40"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" /> Provisioning...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5" /> Deploy Cluster
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}