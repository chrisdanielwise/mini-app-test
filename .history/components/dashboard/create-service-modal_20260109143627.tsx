"use client";

import { useState, useActionState, useEffect } from "react";
// ✅ SYNCED: Using the hyphenated path as per your file structure
// import { createServiceAction } from "@/lib/actions/service-actions";
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
import {
  Plus,
  Loader2,
  Zap,
  Layers,
  ShieldCheck,
  Trash2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createServiceAction } from "@/lib/actions/service.actions";

interface CreateServiceModalProps {
  merchantId: string;
}

/**
 * 🚀 PREMIUM DEPLOYMENT ENGINE
 * Optimized for high-density mobile interaction and Schema V2 compliance.
 */
export function CreateServiceModal({ merchantId }: CreateServiceModalProps) {
  const [open, setOpen] = useState(false);

  // 💎 DYNAMIC STATE: Synchronized with V2 Enum Protocol (CUSTOM)
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
      toast.success("Nodes Deployed Successfully");
      setOpen(false);
      setTiers([{ id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" }]);
    }
  }, [state, isPending]);

  const addTierRow = () => {
    setTiers([...tiers, { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" }]);
  };

  const removeTierRow = (id: number) => {
    if (tiers.length > 1) setTiers(tiers.filter((t) => t.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl h-12 px-6 font-black uppercase italic tracking-widest shadow-lg bg-primary text-primary-foreground text-[10px] active:scale-95 transition-all">
          <Plus className="mr-2 h-4 w-4" /> New Deployment
        </Button>
      </DialogTrigger>

      {/* 📱 MOBILE FIX: Set w-[95vw] and max-w-md to stop horizontal bleeding */}
      <DialogContent className="w-[95vw] max-w-md rounded-[2.5rem] border-border bg-card p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <form action={formAction} className="flex flex-col max-h-[85vh]">
          <input type="hidden" name="merchantId" value={merchantId} />

          {/* --- SCROLLABLE CONTAINER --- */}
          <div className="p-6 space-y-8 overflow-y-auto scrollbar-hide">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                Deployment Protocol
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                Establish asset identity and pricing nodes.
              </DialogDescription>
            </DialogHeader>

            {/* --- IDENTITY NODES --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary border-b border-border/50 pb-2">
                <Zap className="h-3 w-3 fill-primary" />
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em]">Asset Identity</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[8px] font-black uppercase ml-1 opacity-70">Label</Label>
                  <Input name="name" placeholder="VIP GOLD" required className="h-11 rounded-xl bg-muted/10 border-muted text-[10px] font-bold uppercase tracking-tight" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[8px] font-black uppercase ml-1 opacity-70">Tag</Label>
                  <Input name="categoryTag" placeholder="FOREX" className="h-11 rounded-xl bg-muted/10 border-muted text-[10px] font-bold uppercase" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[8px] font-black uppercase ml-1 opacity-70">Telegram Target ID</Label>
                <Input name="vipChannelId" placeholder="-100..." required className="h-11 rounded-xl bg-primary/5 border-primary/20 font-mono text-[10px]" />
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-[8px] font-black uppercase ml-1 opacity-70">Description</Label>
                <Textarea name="description" placeholder="Brief protocol overview..." className="rounded-xl min-h-[80px] bg-muted/10 border-muted text-[10px] font-medium leading-relaxed" />
              </div>
            </div>

            {/* --- PRICING ARCHITECTURE --- */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Layers className="h-3 w-3" />
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em]">Pricing Nodes</h3>
                </div>
                <button type="button" onClick={addTierRow} className="text-[8px] font-black uppercase text-primary bg-primary/10 px-3 py-1 rounded-lg hover:bg-primary/20 transition-all">
                  + Add Tier
                </button>
              </div>

              <div className="space-y-3">
                {tiers.map((tier) => (
                  <div key={tier.id} className="p-4 rounded-2xl bg-muted/20 border border-border/50 space-y-4 relative animate-in slide-in-from-right-2 duration-300">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[7px] font-black uppercase opacity-50">Tier Name</Label>
                        <Input name="tierNames[]" placeholder="Monthly" required className="h-10 rounded-lg bg-card border-muted text-[10px] font-bold" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[7px] font-black uppercase opacity-50">Price (USD)</Label>
                        <Input name="tierPrices[]" type="number" step="0.01" placeholder="0.00" required className="h-10 rounded-lg bg-card border-muted text-[10px] font-bold" />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-end">
                      <div className="flex-1 space-y-1">
                        <Label className="text-[7px] font-black uppercase opacity-50">Billing Interval</Label>
                        <select name="tierIntervals[]" className="w-full h-10 rounded-lg border border-muted bg-card px-2 text-[9px] font-black uppercase outline-none focus:ring-1 focus:ring-primary/20">
                          <option value="MONTH">Monthly</option>
                          <option value="WEEK">Weekly</option>
                          <option value="YEAR">Annual</option>
                          <option value="DAY">Daily</option>
                        </select>
                        <input type="hidden" name="tierTypes[]" value="CUSTOM" />
                      </div>
                      {tiers.length > 1 && (
                        <Button type="button" variant="ghost" onClick={() => removeTierRow(tier.id)} className="h-10 w-10 p-0 text-destructive hover:bg-destructive/10 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- FIXED ACTION DOCK: Stays visible regardless of scroll position --- */}
          <div className="p-6 bg-card border-t border-border flex items-center gap-3 backdrop-blur-xl">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Abord
            </Button>
            <Button disabled={isPending} type="submit" className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[11px] shadow-xl shadow-primary/20 active:scale-95 transition-all">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShieldCheck className="mr-2 h-4 w-4" /> Deploy Nodes</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}