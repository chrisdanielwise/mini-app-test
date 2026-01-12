"use client";

import { useState, useActionState, useEffect } from "react";
import { createServiceAction } from "@/src/lib/actions/service.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
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
import { cn } from "@/src/lib/utils";

interface CreateServiceModalProps {
  merchantId: string;
}

/**
 * 🛰️ PREMIUM DEPLOYMENT ENGINE (Tier 2)
 * High-resiliency interface for launching multi-tier Signal Nodes.
 */
export function CreateServiceModal({ merchantId }: CreateServiceModalProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [tiers, setTiers] = useState([
    {
      id: Date.now(),
      name: "",
      price: "",
      interval: "MONTH",
      type: "CUSTOM",
    },
  ]);

  const [state, formAction, isPending] = useActionState(
    createServiceAction,
    null
  );

  useEffect(() => {
    if (state?.success && !isPending) {
      toast.success("CLUSTER DEPLOYED: Assets are now live.");
      setOpen(false);
      setTiers([{ id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" }]);
    }
    if (state?.error && !isPending) {
      toast.error(`DEPLOYMENT_FAILED: ${state.error}`);
    }
  }, [state, isPending]);

  const addTierRow = () => {
    setTiers([...tiers, { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" }]);
  };

  const removeTierRow = (id: number) => {
    if (tiers.length > 1) setTiers(tiers.filter((t) => t.id !== id));
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button"
          className="rounded-2xl h-14 px-8 font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20 bg-primary text-primary-foreground text-[11px] hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus className="mr-2 h-5 w-5" /> New Deployment
        </Button>
      </DialogTrigger>

      <DialogContent 
        onPointerDownOutside={(e) => isPending && e.preventDefault()}
        className="w-[95vw] max-w-lg rounded-[3.5rem] border-border/40 bg-card/95 backdrop-blur-3xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500"
      >
        <form action={formAction} className="flex flex-col max-h-[90vh]">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="p-10 space-y-10 overflow-y-auto scrollbar-hide">
            <DialogHeader className="text-left space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Zap className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                    Asset <span className="text-primary">Provisioning</span>
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1 opacity-60">
                    Establishing Signal Node Infrastructure
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* --- SECTION 1: IDENTITY --- */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary border-b border-border/40 pb-3">
                <Terminal className="h-3.5 w-3.5" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em]">Identity Protocol</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1 text-primary/60">Asset Label</Label>
                  <Input name="name" placeholder="VIP SIGNALS" required className="h-12 rounded-xl bg-muted/10 border-border/40 text-xs font-black uppercase tracking-tight focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1 text-primary/60">Category Tag</Label>
                  <Input name="categoryTag" placeholder="FOREX" className="h-12 rounded-xl bg-muted/10 border-border/40 text-xs font-black uppercase tracking-tight focus:ring-primary/20" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase ml-1 text-primary/60">Target Telegram ID</Label>
                <div className="relative">
                   <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                   <Input name="vipChannelId" placeholder="-100..." required className="h-12 pl-12 rounded-xl bg-primary/5 border-primary/20 font-mono text-xs text-primary" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase ml-1 text-primary/60">Protocol Manifest (Description)</Label>
                <Textarea name="description" placeholder="Brief system overview..." className="rounded-xl min-h-[100px] bg-muted/10 border-border/40 text-[11px] font-medium leading-relaxed resize-none" />
              </div>
            </div>

            {/* --- SECTION 2: PRICING NODES --- */}
            <div className="space-y-6 pb-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Layers className="h-3.5 w-3.5" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.25em]">Pricing Nodes</h3>
                </div>
                <button type="button" onClick={addTierRow} className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-xl hover:bg-primary/20 transition-all shadow-sm">
                  + Add Node
                </button>
              </div>

              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div key={tier.id} className="p-6 rounded-[2rem] bg-muted/20 border border-border/40 space-y-5 relative animate-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[8px] font-black uppercase opacity-50 ml-1">Node Title</Label>
                        <Input name="tierNames[]" placeholder="Standard" required className="h-11 rounded-xl bg-card border-border/40 text-[11px] font-black uppercase italic" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[8px] font-black uppercase opacity-50 ml-1">Liquidity (USD)</Label>
                        <Input name="tierPrices[]" type="number" step="0.01" placeholder="49.99" required className="h-11 rounded-xl bg-card border-border/40 text-[11px] font-black italic" />
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-end">
                      <div className="flex-1 space-y-1.5">
                        <Label className="text-[8px] font-black uppercase opacity-50 ml-1">Billing Epoch</Label>
                        <select name="tierIntervals[]" className="w-full h-11 rounded-xl border border-border/40 bg-card px-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
                          <option value="MONTH">Monthly Epoch</option>
                          <option value="WEEK">Weekly Sprint</option>
                          <option value="YEAR">Annual Horizon</option>
                          <option value="DAY">Daily Node</option>
                        </select>
                        <input type="hidden" name="tierTypes[]" value="CUSTOM" />
                      </div>
                      {tiers.length > 1 && (
                        <Button type="button" variant="ghost" onClick={() => removeTierRow(tier.id)} className="h-11 w-11 p-0 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- TERMINAL ACTIONS --- */}
          <div className="p-8 bg-muted/30 border-t border-border/40 flex items-center gap-4 backdrop-blur-xl">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl h-14 px-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Abort
            </Button>
            <Button disabled={isPending} type="submit" className="flex-1 h-16 rounded-[1.5rem] bg-primary text-primary-foreground font-black uppercase italic tracking-[0.15em] text-[12px] shadow-2xl shadow-primary/30 active:scale-95 transition-all">
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Provisioning...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Deploy Cluster</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}