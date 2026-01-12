"use client";

import { useState, useActionState, useEffect } from "react";
import { createServiceAction } from "@/lib/actions/service.actions";
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
  Terminal,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

interface CreateServiceModalProps {
  merchantId: string;
}

/**
 * 🛰️ PREMIUM DEPLOYMENT ENGINE
 * Logic: Synchronized with Universal Identity.
 * Adaptive: Flavor-shifts (Amber/Emerald) based on operator context.
 */
export function CreateServiceModal({ merchantId }: CreateServiceModalProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  useEffect(() => {
    setMounted(true);
  }, []);

  const [tiers, setTiers] = useState([
    { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" },
  ]);

  const [state, formAction, isPending] = useActionState(createServiceAction, null);

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
    hapticFeedback("light");
    setTiers([...tiers, { id: Date.now(), name: "", price: "", interval: "MONTH", type: "CUSTOM" }]);
  };

  const removeTierRow = (id: number) => {
    hapticFeedback("warning");
    if (tiers.length > 1) setTiers(tiers.filter((t) => t.id !== id));
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button"
          onClick={() => hapticFeedback("light")}
          className={cn(
            "rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-8 font-black uppercase italic tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-95 text-[10px] md:text-[11px]",
            isStaff 
              ? "bg-amber-500 text-black shadow-amber-500/20" 
              : "bg-primary text-primary-foreground shadow-primary/20"
          )}
        >
          <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" /> New Deployment
        </Button>
      </DialogTrigger>

      <DialogContent 
        onPointerDownOutside={(e) => isPending && e.preventDefault()}
        className="w-[95vw] sm:w-full max-w-lg rounded-2xl md:rounded-[3.5rem] border-border/40 bg-card/95 backdrop-blur-3xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-h-[92dvh] flex flex-col"
      >
        <form action={formAction} className="flex flex-col h-full overflow-hidden">
          {/* 🛡️ IDENTITY HANDSHAKE: Hidden context for server-side RBAC */}
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-5 md:p-10 space-y-8 md:space-y-10 scrollbar-hide">
            <DialogHeader className="text-left space-y-3">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={cn(
                  "h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner",
                  isStaff ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                )}>
                  {isStaff ? <Globe className="h-5 w-5 md:h-6 md:w-6" /> : <Zap className="h-5 w-5 md:h-6 md:w-6 fill-current" />}
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none truncate">
                    Asset <span className={isStaff ? "text-amber-500" : "text-primary"}>Provisioning</span>
                  </DialogTitle>
                  <DialogDescription className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1 opacity-60 truncate">
                    {isStaff ? "Universal_Oversight_Action" : "Establishing Signal Node Infrastructure"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div className={cn("flex items-center gap-2 border-b border-border/10 pb-3", isStaff ? "text-amber-500" : "text-primary")}>
                <Terminal className="h-3.5 w-3.5" />
                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em]">Identity Protocol</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1 opacity-60">Asset Label</Label>
                  <Input name="name" placeholder="VIP SIGNALS" required className="h-11 md:h-12 rounded-xl bg-muted/10 border-border/40 text-[11px] font-black uppercase focus:ring-primary/20 shadow-inner" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1 opacity-60">Category Tag</Label>
                  <Input name="categoryTag" placeholder="FOREX" className="h-11 md:h-12 rounded-xl bg-muted/10 border-border/40 text-[11px] font-black uppercase focus:ring-primary/20 shadow-inner" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase ml-1 opacity-60">Target Telegram ID</Label>
                <div className="relative group">
                   <Globe className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 opacity-30 transition-colors", isStaff ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary")} />
                   <Input name="vipChannelId" placeholder="-100..." required className="h-11 md:h-12 pl-12 rounded-xl bg-muted/10 border-border/40 font-mono text-[11px] shadow-inner" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase ml-1 opacity-60">Protocol Manifest</Label>
                <Textarea name="description" placeholder="Brief system overview..." className="rounded-xl min-h-[80px] bg-muted/10 border-border/40 text-[10px] md:text-[11px] font-medium resize-none shadow-inner" />
              </div>
            </div>

            <div className="space-y-6 pb-6">
              <div className="flex flex-row items-center justify-between border-b border-border/10 pb-3">
                <div className={cn("flex items-center gap-2", isStaff ? "text-amber-500" : "text-emerald-500")}>
                  <Layers className="h-3.5 w-3.5" />
                  <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em]">Pricing Nodes</h3>
                </div>
                <button type="button" onClick={addTierRow} className={cn("text-[8px] md:text-[9px] font-black uppercase tracking-widest px-3 md:px-4 py-1.5 rounded-lg md:rounded-xl transition-all shadow-sm", isStaff ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : "bg-primary/10 text-primary hover:bg-primary/20")}>
                  + Add Node
                </button>
              </div>

              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div key={tier.id} className="p-5 md:p-6 rounded-2xl md:rounded-[2rem] bg-muted/20 border border-border/40 space-y-4 md:space-y-5 relative animate-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[8px] font-black uppercase opacity-50 ml-1">Node Title</Label>
                        <Input name="tierNames[]" placeholder="Standard" required className="h-10 md:h-11 rounded-xl bg-card border-border/40 text-[10px] md:text-[11px] font-black uppercase italic shadow-inner" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[8px] font-black uppercase opacity-50 ml-1">Liquidity (USD)</Label>
                        <Input name="tierPrices[]" type="number" step="0.01" placeholder="49.99" required className="h-10 md:h-11 rounded-xl bg-card border-border/40 text-[10px] md:text-[11px] font-black italic shadow-inner" />
                      </div>
                    </div>
                    
                    <div className="flex flex-row gap-3 items-end">
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <Label className="text-[8px] font-black uppercase opacity-50 ml-1">Billing Epoch</Label>
                        <select name="tierIntervals[]" className="w-full h-10 md:h-11 rounded-xl border border-border/40 bg-card px-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer">
                          <option value="MONTH">Monthly Epoch</option>
                          <option value="WEEK">Weekly Sprint</option>
                          <option value="YEAR">Annual Horizon</option>
                          <option value="DAY">Daily Node</option>
                        </select>
                        <input type="hidden" name="tierTypes[]" value="CUSTOM" />
                      </div>
                      {tiers.length > 1 && (
                        <Button type="button" variant="ghost" onClick={() => removeTierRow(tier.id)} className="h-10 w-10 p-0 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 md:p-8 bg-muted/30 border-t border-border/40 flex flex-col sm:flex-row items-center gap-3 md:gap-4 backdrop-blur-2xl">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="w-full sm:w-auto rounded-xl h-12 md:h-14 px-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
              Abort Sync
            </Button>
            <Button 
              disabled={isPending} 
              type="submit" 
              className={cn(
                "w-full sm:flex-1 h-14 md:h-16 rounded-xl md:rounded-[1.5rem] font-black uppercase italic tracking-[0.15em] text-[11px] md:text-[12px] shadow-2xl transition-all",
                isStaff 
                  ? "bg-amber-500 text-black shadow-amber-500/30" 
                  : "bg-primary text-primary-foreground shadow-primary/30"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                  <span>Provisioning...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
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