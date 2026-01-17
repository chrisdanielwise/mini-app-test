"use client";

import * as React from "react";
import { useState, useActionState, useEffect } from "react";
import { createCouponAction } from "@/lib/actions/coupon.actions";

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

// 🛠️ UTILS & TELEMETRY
import {
  Ticket,
  Loader2,
  Zap,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Layers,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";

interface CreateCouponModalProps {
  merchantId: string;
}

/**
 * 💎 SYSTEM COMPONENT: CREATE CAMPAIGN (Apex Tier)
 * Logic: Haptic-synced provisioning with Dynamic Role Flavoring.
 * Optimization: Liquid morphology for high-density touch-targets.
 */
export function CreateCouponModal({ merchantId }: CreateCouponModalProps) {
  const [open, setOpen] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const { impact, notification } = useHaptics();
  const { flavor } = useLayout();
  
  const [state, formAction, isPending] = useActionState(createCouponAction, null);
  const isStaff = flavor === "AMBER";

  // 📡 SERVICE DISCOVERY
  useEffect(() => {
    if (open && merchantId) {
      fetch(`/api/merchant/${merchantId}/services`)
        .then((res) => res.json())
        .then((data) => setServices(data))
        .catch((err) => console.error("SIGNAL_FETCH_FAILURE", err));
    }
  }, [open, merchantId]);

  // 🔄 HYDRATION SYNC: Haptic Confirmation Loop
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("CAMPAIGN_LIVE: Discount node broadcasted.");
      setOpen(false);
      setCustomCode("");
    }
    if (state?.error && !isPending) {
      notification("error");
    }
  }, [state, isPending, notification]);

  const generateCode = () => {
    impact("medium");
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomCode(result);
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
          <Ticket className="mr-2" /> Initialize Campaign
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl md:rounded-[3.5rem] p-0 overflow-hidden">
        <form action={formAction} className="flex flex-col h-full overflow-hidden">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 scrollbar-hide">
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
                    Campaign <span className={isStaff ? "text-amber-500" : "text-primary"}>Deployment</span>
                  </DialogTitle>
                  <DialogDescription className="text-[10px] md:text-[11px] opacity-40">
                    {isStaff ? "Universal_Oversight_Action" : `Provisioning_Node: ${merchantId.slice(0, 16)}`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-8 md:space-y-12">
              {/* --- Code Identity Protocol --- */}
              <div className="grid gap-4">
                <Label className={cn("text-[10px] md:text-[11px] ml-1 uppercase font-black italic tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                  Protocol Identity (Code)
                </Label>
                <div className="flex gap-4">
                  <div className="relative flex-1 group">
                    <Terminal className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                    <Input
                      name="code"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                      placeholder="E.G. ALPHA_NODE_2026"
                      required
                      className={cn(
                        "h-14 md:h-16 pl-14 rounded-2xl md:rounded-[1.5rem] font-mono font-black text-lg tracking-widest bg-white/5 border-white/10 focus:bg-white/10",
                        isStaff ? "text-amber-500 focus:border-amber-500/40" : "text-primary focus:border-primary/40"
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateCode}
                    className="h-14 w-14 md:h-16 md:w-16 rounded-2xl md:rounded-[1.5rem] border-white/10 bg-white/5 group"
                  >
                    <RefreshCw className={cn("size-5 group-active:rotate-180 transition-transform duration-700", isStaff && "text-amber-500")} />
                  </Button>
                </div>
              </div>

              {/* --- Financial Variables --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div className="grid gap-4">
                  <Label className={cn("text-[10px] md:text-[11px] ml-1 uppercase font-black italic tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                    Reduction (%)
                  </Label>
                  <Input
                    name="discountPercent"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="10"
                    required
                    className="h-14 md:h-16 rounded-2xl md:rounded-[1.5rem] border-white/10 bg-white/5 font-black text-sm italic"
                  />
                </div>
                <div className="grid gap-4">
                  <Label className={cn("text-[10px] md:text-[11px] ml-1 uppercase font-black italic tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                    Usage Cap
                  </Label>
                  <Input
                    name="maxUses"
                    type="number"
                    placeholder="INF_LIMIT"
                    className="h-14 md:h-16 rounded-2xl md:rounded-[1.5rem] border-white/10 bg-white/5 font-black text-sm italic"
                  />
                </div>
              </div>

              {/* --- Targeting Matrix --- */}
              <div className="grid gap-4">
                <Label className={cn("text-[10px] md:text-[11px] ml-1 uppercase font-black italic tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                  Target Service Node
                </Label>
                <div className="relative">
                  <select
                    name="serviceId"
                    className="w-full h-14 md:h-16 rounded-2xl md:rounded-[1.5rem] border border-white/10 bg-white/5 px-6 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 appearance-none focus:bg-white/10"
                  >
                    <option value="global">GLOBAL_CLUSTER (ALL_SERVICES)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className={cn("flex items-center gap-4 p-4 rounded-2xl border", isStaff ? "bg-amber-500/5 border-amber-500/10" : "bg-primary/5 border-primary/10")}>
                  <ShieldCheck className={cn("size-4 shrink-0", isStaff ? "text-amber-500" : "text-primary")} />
                  <p className="text-[9px] md:text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.15em] leading-relaxed">
                    Vouchers (100% OFF) grant instant VIP access bypassing gateway protocols.
                  </p>
                </div>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 animate-in shake-200">
                <p className="text-[10px] font-black uppercase text-destructive text-center tracking-widest">
                  {state.error}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white/5 p-6 md:p-10 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-white/5 backdrop-blur-xl">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto h-12"
            >
              Abort Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className={cn(
                "w-full sm:w-auto min-w-[220px] shadow-2xl transition-all duration-700",
                isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "shadow-primary/40"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Provisioning...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2" /> Deploy Campaign
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}