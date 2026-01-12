"use client";

import { useState, useActionState, useEffect } from "react";
import { createCouponAction } from "@/lib/actions/coupon.actions";
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
import {
  Ticket,
  Loader2,
  Zap,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateCouponModalProps {
  merchantId: string;
}

/**
 * 🛰️ PROMOTION DEPLOYMENT NODE (Tier 2)
 * High-resiliency interface for generating discount protocols and gift vouchers.
 */
export function CreateCouponModal({ merchantId }: CreateCouponModalProps) {
  const [open, setOpen] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [state, formAction, isPending] = useActionState(
    createCouponAction,
    null
  );

  // 🏁 1. Fetch available services for protocol mapping
  useEffect(() => {
    if (open) {
      fetch(`/api/merchant/${merchantId}/services`)
        .then((res) => res.json())
        .then((data) => setServices(data))
        .catch((err) => console.error("SIGNAL_FETCH_FAILURE", err));
    }
  }, [open, merchantId]);

  // 🔄 2. Lifecycle Sync: Reset and close on successful deployment
  useEffect(() => {
    if (state?.success && !isPending) {
      setOpen(false);
      setCustomCode("");
    }
  }, [state, isPending]);

  // 🎲 3. Entropy Engine: Generate randomized high-sense protocol codes
  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomCode(result);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-14 px-8 font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary text-primary-foreground">
          <Ticket className="mr-2 h-5 w-5" /> Initialize Campaign
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl rounded-[3rem] border-border/40 bg-card/95 backdrop-blur-3xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
        <form action={formAction}>
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="p-10 space-y-10">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Zap className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                    Campaign <span className="text-primary">Deployment</span>
                  </DialogTitle>
                  <DialogDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1 opacity-60">
                    Provisioning new discount node for cluster:{" "}
                    {merchantId.slice(0, 8)}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-8">
              {/* --- Code Identity Protocol --- */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                  Protocol Identity (Code)
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                    <Input
                      name="code"
                      value={customCode}
                      onChange={(e) =>
                        setCustomCode(e.target.value.toUpperCase())
                      }
                      placeholder="E.G. ALPHA_NODE_2026"
                      required
                      className="rounded-2xl border-border/40 bg-muted/10 h-14 pl-12 font-mono font-black text-lg tracking-tighter text-primary focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateCode}
                    className="h-14 w-14 rounded-2xl border-border/40 bg-muted/10 hover:bg-primary/10 hover:text-primary transition-all group"
                  >
                    <RefreshCw className="h-5 w-5 group-active:rotate-180 transition-transform duration-500" />
                  </Button>
                </div>
              </div>

              {/* --- Financial Variables --- */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                    Reduction (%)
                  </Label>
                  <Input
                    name="discountPercent"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="10"
                    required
                    className="rounded-2xl border-border/40 bg-muted/10 h-14 font-black text-sm italic focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                    Usage Cap
                  </Label>
                  <Input
                    name="maxUses"
                    type="number"
                    placeholder="INF_LIMIT"
                    className="rounded-2xl border-border/40 bg-muted/10 h-14 font-black text-sm italic focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* --- Targeting Matrix --- */}
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-primary">
                  Target Service Node
                </Label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30" />
                  <select
                    name="serviceId"
                    className="w-full h-14 rounded-2xl border border-border/40 bg-muted/10 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                  >
                    <option value="global">
                      GLOBAL_CLUSTER (ALL_SERVICES)
                    </option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                    Vouchers (100% OFF) grant instant VIP access bypassing
                    gateway.
                  </p>
                </div>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 animate-in shake-200">
                <p className="text-[10px] font-black uppercase text-rose-500 text-center tracking-widest">
                  {state.error}
                </p>
              </div>
            )}
          </div>

          <div className="bg-muted/30 p-8 flex justify-end gap-4 border-t border-border/40 backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-12"
            >
              Abort Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-2xl bg-primary px-10 h-16 text-[11px] font-black uppercase italic tracking-[0.15em] shadow-2xl shadow-primary/30 transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Provisioning...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" /> Deploy Campaign
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
