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
import { Ticket, Loader2, Zap, ShieldCheck, RefreshCw } from "lucide-react";

interface CreateCouponModalProps {
  merchantId: string;
}

export function CreateCouponModal({ merchantId }: CreateCouponModalProps) {
  const [open, setOpen] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [state, formAction, isPending] = useActionState(createCouponAction, null);

  // 1. Fetch available services to populate the dropdown
  useEffect(() => {
    if (open) {
      fetch(`/api/merchant/${merchantId}/services`)
        .then((res) => res.json())
        .then((data) => setServices(data))
        .catch((err) => console.error("Failed to load services", err));
    }
  }, [open, merchantId]);

  // 2. Auto-close on success
  useEffect(() => {
    if (state?.success && !isPending) {
      setOpen(false);
      setCustomCode("");
    }
  }, [state, isPending]);

  // 3. Helper to generate a random high-sense code
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
        <Button className="rounded-2xl h-12 px-6 font-black uppercase italic tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform bg-primary text-primary-foreground">
          <Ticket className="mr-2 h-4 w-4" /> Create Promotion
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl rounded-[2.5rem] border-border bg-card p-0 overflow-hidden shadow-2xl">
        <form action={formAction}>
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" /> New Campaign
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Generate discount codes or 100% OFF gift vouchers.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* --- Code Identity --- */}
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase ml-1">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    name="code"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                    placeholder="E.G. NEWYEAR2026"
                    required
                    className="rounded-xl border-muted bg-muted/20 h-12 font-mono font-bold text-lg"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={generateCode}
                    className="h-12 w-12 rounded-xl border-muted"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* --- Benefit & Limit --- */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Discount (%)</Label>
                  <Input
                    name="discountPercent"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="10"
                    required
                    className="rounded-xl border-muted bg-muted/20 h-12 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Max Uses</Label>
                  <Input
                    name="maxUses"
                    type="number"
                    placeholder="Leave empty for ∞"
                    className="rounded-xl border-muted bg-muted/20 h-12 font-bold"
                  />
                </div>
              </div>

              {/* --- Service Target --- */}
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase ml-1">Applicable Service</Label>
                <select
                  name="serviceId"
                  className="w-full h-12 rounded-xl border border-muted bg-muted/20 px-3 text-xs font-bold uppercase cursor-pointer"
                >
                  <option value="global">Global (All Services)</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <p className="text-[8px] font-bold text-muted-foreground uppercase px-1">
                  Gift codes (100%) will grant access without requiring payment info.
                </p>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4">
                <p className="text-[10px] font-black uppercase text-destructive text-center">
                  {state.error}
                </p>
              </div>
            )}
          </div>

          <div className="bg-muted/30 p-6 flex justify-end gap-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-primary px-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10"
            >
              {isPending ? (
                <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Finalizing...</>
              ) : (
                <><ShieldCheck className="mr-2 h-3 w-3" /> Deploy Campaign</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}