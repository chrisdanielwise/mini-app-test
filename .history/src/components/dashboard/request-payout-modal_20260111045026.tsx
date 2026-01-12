"use client";

import { useState, useActionState, useEffect } from "react";
import { requestPayoutAction } from "@/lib/actions/payout.actions";
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
  Banknote,
  Loader2,
  ShieldCheck,
  Wallet,
  Info,
  Terminal,
  ArrowRightLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

interface RequestPayoutModalProps {
  merchantId: string;
  availableBalance: number | string;
}

/**
 * 🏦 ASSET LIQUIDATION PROTOCOL (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive safe-zones and institutional touch-targets for mobile staff.
 */
export function RequestPayoutModal({
  merchantId,
  availableBalance,
}: RequestPayoutModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [state, formAction, isPending] = useActionState(
    requestPayoutAction,
    null
  );

  const balanceValue = Number(availableBalance) || 0;

  useEffect(() => {
    if (state?.success && !isPending) {
      toast.success(
        "LIQUIDATION INITIALIZED: Request dispatched to finance node."
      );
      setOpen(false);
      setAmount("");
    }
  }, [state, isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => hapticFeedback("light")}
          className="rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-8 font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary text-primary-foreground text-[10px] md:text-xs"
        >
          <Banknote className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Request Liquidation
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl w-[95vw] sm:w-full rounded-2xl md:rounded-[3rem] border-border/40 bg-card/95 backdrop-blur-3xl p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 max-h-[92dvh] flex flex-col">
        <form action={formAction} className="flex flex-col h-full overflow-hidden">
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="flex-1 overflow-y-auto p-5 md:p-10 space-y-8 md:space-y-10 scrollbar-hide">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Wallet className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none truncate">
                    Asset <span className="text-primary">Liquidation</span>
                  </DialogTitle>
                  <DialogDescription className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground mt-1 opacity-60 truncate">
                    Disbursement Context: {merchantId.slice(0, 12)}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 md:space-y-8">
              {/* --- Amount Configuration --- */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Liquidity Amount
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      hapticFeedback("selection");
                      setAmount(balanceValue.toString());
                    }}
                    className="text-[8px] md:text-[9px] font-black uppercase text-primary border-b border-primary/20 hover:text-foreground hover:border-foreground transition-all italic whitespace-nowrap"
                  >
                    MAX: ${balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </button>
                </div>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-muted-foreground text-2xl md:text-3xl opacity-20 group-focus-within:opacity-100 transition-opacity">
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
                    className="rounded-2xl md:rounded-3xl border-border/40 bg-muted/10 h-16 md:h-20 pl-14 font-black text-2xl md:text-3xl tracking-tighter italic text-foreground focus:ring-primary/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* --- Network Protocol Grid --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                  <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                    Protocol
                  </Label>
                  <div className="relative group">
                    <ArrowRightLeft className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <select
                      name="method"
                      className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl border border-border/40 bg-muted/10 pl-12 pr-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all shadow-inner"
                    >
                      <option value="USDT_TRC20">USDT_TRC20 (FAST)</option>
                      <option value="USDT_ERC20">USDT_ERC20 (STABLE)</option>
                      <option value="BANK_TRANSFER">BANK_SWIFT (GLOBAL)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                    Target Address
                  </Label>
                  <div className="relative group">
                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-30 group-focus-within:text-primary transition-colors pointer-events-none" />
                    <Input
                      name="destination"
                      placeholder="ENTER_ID"
                      required
                      className="rounded-xl md:rounded-2xl border-border/40 bg-muted/10 h-12 md:h-14 pl-12 font-black uppercase text-[9px] md:text-[10px] tracking-tight focus:ring-primary/20 shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* --- Operational Notice --- */}
              <div className="rounded-xl md:rounded-[1.5rem] bg-primary/5 border border-primary/10 p-4 md:p-5 flex items-start gap-3 md:gap-4 shadow-sm">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase leading-relaxed tracking-wider opacity-80">
                  Withdrawals audited by <span className="text-foreground">Zipha Finance Nodes</span>.
                  Latency: 24h. Protocol verification is immutable once synchronized.
                </p>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 animate-in shake-1">
                <p className="text-[9px] md:text-[10px] font-black uppercase text-rose-500 text-center tracking-widest leading-none">
                  {state.error}
                </p>
              </div>
            )}
          </div>

          {/* --- TERMINAL ACTIONS --- */}
          <div className="bg-muted/30 p-5 md:p-8 flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 border-t border-border/40 backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                hapticFeedback("light");
                setOpen(false);
              }}
              className="w-full sm:w-auto rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-11 md:h-12 active:scale-95"
            >
              Abort Sync
            </Button>
            <Button
              type="submit"
              disabled={isPending || balanceValue <= 0}
              onClick={() => hapticFeedback("medium")}
              className="w-full sm:flex-1 h-14 md:h-16 rounded-xl md:rounded-[1.5rem] bg-primary text-primary-foreground font-black uppercase italic tracking-[0.15em] shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-20"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" /> Provisioning...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" /> Authorize Liquidation
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}