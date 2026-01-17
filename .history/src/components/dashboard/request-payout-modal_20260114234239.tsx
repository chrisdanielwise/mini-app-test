"use client";

import * as React from "react";
import { useState, useActionState, useEffect } from "react";
import { requestPayoutAction } from "@/lib/actions/payout.actions";

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
  Banknote,
  Loader2,
  ShieldCheck,
  Wallet,
  Info,
  Terminal,
  ArrowRightLeft,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useLayout } from "@/context/layout-provider";

interface RequestPayoutModalProps {
  merchantId: string;
  availableBalance: number | string;
}

/**
 * 💎 SYSTEM COMPONENT: ASSET LIQUIDATION (Apex Tier)
 * Logic: Haptic-synced disbursement with Institutional Squircle geometry.
 * Optimization: Role-Aware visual flavor-swapping.
 */
export function RequestPayoutModal({
  merchantId,
  availableBalance,
}: RequestPayoutModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const { impact, notification } = useHaptics();
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  const [state, formAction, isPending] = useActionState(requestPayoutAction, null);
  const balanceValue = Number(availableBalance) || 0;

  // 🔄 HYDRATION SYNC: Haptic Confirmation Loop
  useEffect(() => {
    if (state?.success && !isPending) {
      notification("success");
      toast.success("LIQUIDATION_INITIALIZED: Request dispatched to finance node.");
      setOpen(false);
      setAmount("");
    }
    if (state?.error && !isPending) {
      notification("error");
    }
  }, [state, isPending, notification]);

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
          <Banknote className="mr-2" /> Request Liquidation
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
                  {isStaff ? <Globe className="size-6 md:size-7" /> : <Wallet className="size-6 md:size-7" />}
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-2xl md:text-3xl">
                    Asset <span className={isStaff ? "text-amber-500" : "text-primary"}>Liquidation</span>
                  </DialogTitle>
                  <DialogDescription className="text-[10px] md:text-[11px] opacity-40">
                    {isStaff ? "Institutional_Disbursement_Protocol" : `Context_Node: ${merchantId.slice(0, 16)}`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-8 md:space-y-12">
              {/* --- Amount Configuration (High Pressure Input) --- */}
              <div className="grid gap-5">
                <div className="flex justify-between items-end px-2">
                  <Label className={cn("text-[10px] md:text-[11px] font-black uppercase italic tracking-[0.3em]", isStaff ? "text-amber-500" : "text-primary")}>
                    Liquidity Amount
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      impact("medium");
                      setAmount(balanceValue.toString());
                    }}
                    className={cn(
                      "text-[9px] font-black uppercase border-b transition-all italic tracking-widest",
                      isStaff ? "text-amber-500/40 border-amber-500/10 hover:text-amber-500" : "text-primary/40 border-primary/10 hover:text-foreground"
                    )}
                  >
                    MAX: ${balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </button>
                </div>
                <div className="relative group">
                  <span className={cn(
                    "absolute left-8 top-1/2 -translate-y-1/2 font-black text-3xl opacity-20 group-focus-within:opacity-100 transition-opacity",
                    isStaff ? "text-amber-500" : "text-primary"
                  )}>
                    $
                  </span>
                  <Input
                    name="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className={cn(
                      "h-20 md:h-24 pl-16 rounded-[1.5rem] md:rounded-[2rem] border-white/10 bg-white/5 font-black text-3xl md:text-4xl tracking-tighter italic transition-all shadow-inner",
                      isStaff ? "focus:border-amber-500/40 focus:bg-amber-500/[0.02]" : "focus:border-primary/40 focus:bg-primary/[0.02]"
                    )}
                  />
                </div>
              </div>

              {/* --- Network Protocol Grid --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div className="grid gap-4">
                  <Label className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] opacity-40 ml-1">Protocol</Label>
                  <div className="relative">
                    <ArrowRightLeft className={cn("absolute left-5 top-1/2 -translate-y-1/2 size-4 opacity-30 pointer-events-none", isStaff ? "text-amber-500" : "text-primary")} />
                    <select
                      name="method"
                      className="h-14 md:h-16 w-full rounded-2xl md:rounded-[1.5rem] border border-white/10 bg-white/5 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 appearance-none focus:bg-white/10 transition-all"
                    >
                      <option value="USDT_TRC20">USDT_TRC20 (FAST)</option>
                      <option value="USDT_ERC20">USDT_ERC20 (STABLE)</option>
                      <option value="BANK_TRANSFER">BANK_SWIFT (GLOBAL)</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-4">
                  <Label className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] opacity-40 ml-1">Target Address</Label>
                  <div className="relative group">
                    <Terminal className={cn("absolute left-5 top-1/2 -translate-y-1/2 size-4 opacity-30 transition-colors pointer-events-none", isStaff ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary")} />
                    <Input
                      name="destination"
                      placeholder="ENTER_DESTINATION_ID"
                      required
                      className="h-14 md:h-16 pl-14 rounded-2xl md:rounded-[1.5rem] border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest"
                    />
                  </div>
                </div>
              </div>

              {/* --- Operational Notice --- */}
              <div className={cn("rounded-2xl md:rounded-[1.5rem] border p-5 flex items-start gap-4 shadow-sm", isStaff ? "bg-amber-500/5 border-amber-500/10" : "bg-primary/5 border-primary/10")}>
                <Info className={cn("size-5 shrink-0 mt-0.5", isStaff ? "text-amber-500" : "text-primary")} />
                <p className="text-[10px] md:text-[11px] font-black text-muted-foreground/50 uppercase leading-relaxed tracking-widest italic">
                  Withdrawals audited by <span className="text-foreground">Zipha_Finance_Nodes</span>.
                  Latency: 24h. Protocol verification is immutable once synchronized.
                </p>
              </div>
            </div>
          </div>

          {/* --- Terminal Footer --- */}
          <div className="p-8 md:p-12 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row items-center gap-4 backdrop-blur-3xl">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto h-12 px-10"
            >
              Abort Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending || balanceValue <= 0}
              size="lg"
              className={cn(
                "w-full sm:flex-1 min-w-[240px] shadow-2xl transition-all duration-700",
                isStaff ? "bg-amber-500 text-black shadow-amber-500/40" : "shadow-primary/40"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" /> Provisioning...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-5" /> Authorize Liquidation
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}