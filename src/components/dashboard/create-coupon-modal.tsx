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
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";
import { useLayout } from "@/context/layout-provider";

interface CreateCouponModalProps {
  merchantId: string;
}

/**
 * 🛰️ PROMOTION DEPLOYMENT NODE
 * Logic: Synchronized with Universal Identity. 
 * Feature: Hot-swaps visual flavor (Amber/Emerald) based on operator role.
 */
export function CreateCouponModal({ merchantId }: CreateCouponModalProps) {
  const [open, setOpen] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [state, formAction, isPending] = useActionState(createCouponAction, null);

  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  // 📡 SERVICE DISCOVERY: Fetching service nodes for the target merchant
  useEffect(() => {
    if (open && merchantId) {
      fetch(`/api/merchant/${merchantId}/services`)
        .then((res) => res.json())
        .then((data) => setServices(data))
        .catch((err) => console.error("SIGNAL_FETCH_FAILURE", err));
    }
  }, [open, merchantId]);

  // 🔄 HYDRATION SYNC
  useEffect(() => {
    if (state?.success && !isPending) {
      setOpen(false);
      setCustomCode("");
    }
  }, [state, isPending]);

  const generateCode = () => {
    hapticFeedback("light");
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
        <Button className={cn(
          "rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-8 font-black uppercase italic tracking-widest transition-all",
          "shadow-2xl hover:scale-[1.02] active:scale-95 text-[10px] md:text-xs",
          isStaff 
            ? "bg-amber-500 text-black shadow-amber-500/20" 
            : "bg-primary text-primary-foreground shadow-primary/20"
        )}>
          <Ticket className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Initialize Campaign
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl w-[95vw] sm:w-full rounded-2xl md:rounded-[3rem] border-border/40 bg-card/95 backdrop-blur-3xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-h-[92dvh] flex flex-col">
        <form action={formAction} className="flex flex-col h-full overflow-hidden">
          {/* 🛡️ IDENTITY HANDSHAKE: Hidden context for server-side RBAC */}
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-5 md:p-10 space-y-6 md:space-y-10 scrollbar-hide">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={cn(
                  "h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner",
                  isStaff ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
                )}>
                  {isStaff ? <Globe className="h-5 w-5 md:h-6 md:w-6" /> : <Zap className="h-5 w-5 md:h-6 md:w-6 fill-current" />}
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none truncate">
                    Campaign <span className={isStaff ? "text-amber-500" : "text-primary"}>Deployment</span>
                  </DialogTitle>
                  <DialogDescription className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground mt-1 opacity-60 truncate">
                    {isStaff ? "Universal_Oversight_Action" : `Provisioning discount node: ${merchantId.slice(0, 12)}`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 md:space-y-8">
              {/* --- Code Identity Protocol --- */}
              <div className="space-y-2 md:space-y-3">
                <Label className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1", isStaff ? "text-amber-500" : "text-primary")}>
                  Protocol Identity (Code)
                </Label>
                <div className="flex gap-2 md:gap-3">
                  <div className="relative flex-1">
                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground opacity-30" />
                    <Input
                      name="code"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                      placeholder="E.G. ALPHA_NODE_2026"
                      required
                      className={cn(
                        "rounded-xl md:rounded-2xl border-border/40 bg-muted/10 h-12 md:h-14 pl-12 font-mono font-black text-base md:text-lg tracking-tighter transition-all shadow-inner",
                        isStaff ? "text-amber-500 focus:ring-amber-500/20" : "text-primary focus:ring-primary/20"
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateCode}
                    className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl border-border/40 bg-muted/10 hover:bg-muted/20 transition-all group shrink-0"
                  >
                    <RefreshCw className={cn("h-4 w-4 md:h-5 md:w-5 group-active:rotate-180 transition-transform duration-500", isStaff && "text-amber-500")} />
                  </Button>
                </div>
              </div>

              {/* --- Financial Variables --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <Label className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1", isStaff ? "text-amber-500" : "text-primary")}>
                    Reduction (%)
                  </Label>
                  <Input
                    name="discountPercent"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="10"
                    required
                    className={cn("rounded-xl md:rounded-2xl border-border/40 bg-muted/10 h-12 md:h-14 font-black text-sm italic shadow-inner", isStaff ? "focus:ring-amber-500/20" : "focus:ring-primary/20")}
                  />
                </div>
                <div className="space-y-2 md:space-y-3">
                  <Label className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1", isStaff ? "text-amber-500" : "text-primary")}>
                    Usage Cap
                  </Label>
                  <Input
                    name="maxUses"
                    type="number"
                    placeholder="INF_LIMIT"
                    className={cn("rounded-xl md:rounded-2xl border-border/40 bg-muted/10 h-12 md:h-14 font-black text-sm italic shadow-inner", isStaff ? "focus:ring-amber-500/20" : "focus:ring-primary/20")}
                  />
                </div>
              </div>

              {/* --- Targeting Matrix --- */}
              <div className="space-y-2 md:space-y-3">
                <Label className={cn("text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1", isStaff ? "text-amber-500" : "text-primary")}>
                  Target Service Node
                </Label>
                <div className="relative group">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors" />
                  <select
                    name="serviceId"
                    className={cn(
                      "w-full h-12 md:h-14 rounded-xl md:rounded-2xl border border-border/40 bg-muted/10 pl-12 pr-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none transition-all appearance-none",
                      isStaff ? "focus:ring-amber-500/20" : "focus:ring-primary/20"
                    )}
                  >
                    <option value="global">GLOBAL_CLUSTER (ALL_SERVICES)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={cn("flex items-start gap-2 p-3 rounded-xl border", isStaff ? "bg-amber-500/5 border-amber-500/10" : "bg-primary/5 border-primary/10")}>
                  <ShieldCheck className={cn("h-3 w-3 shrink-0 mt-0.5", isStaff ? "text-amber-500" : "text-primary")} />
                  <p className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-relaxed">
                    Vouchers (100% OFF) grant instant VIP access bypassing gateway protocols.
                  </p>
                </div>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 animate-in shake-200">
                <p className="text-[9px] font-black uppercase text-rose-500 text-center tracking-widest leading-tight">
                  {state.error}
                </p>
              </div>
            )}
          </div>

          <div className="bg-muted/30 p-5 md:p-8 flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 border-t border-border/40 backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-11 md:h-12"
            >
              Abort Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full sm:w-auto rounded-xl md:rounded-2xl px-10 h-14 md:h-16 text-[10px] md:text-[11px] font-black uppercase italic tracking-[0.15em] shadow-2xl transition-all hover:translate-y-[-2px] active:translate-y-[1px]",
                isStaff 
                  ? "bg-amber-500 text-black shadow-amber-500/30" 
                  : "bg-primary text-primary-foreground shadow-primary/30"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Provisioning...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Deploy Campaign
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}