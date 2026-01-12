"use client";

import { useState, useActionState, useEffect } from "react";
/** * ✅ ARCHITECTURAL SYNC: 
 * Using the correct hyphenated path for actions.
 */
import { requestPayoutAction } from "@/src/lib/actions/payout.actions";
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
import { Banknote, Loader2, ShieldCheck, Wallet, Info } from "lucide-react";
import { toast } from "sonner";

interface RequestPayoutModalProps {
  merchantId: string;
  // Prop may arrive as string from server components
  availableBalance: number | string; 
}

/**
 * 🏦 WITHDRAWAL PROTOCOL
 * Optimized for secure asset liquidation and manual payout requests.
 */
export function RequestPayoutModal({ merchantId, availableBalance }: RequestPayoutModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [state, formAction, isPending] = useActionState(requestPayoutAction, null);

  // 🛡️ TYPE SAFETY: Convert to number to prevent .toFixed() crashes
  const balanceValue = Number(availableBalance) || 0;

  // 🔄 HYDRATION SYNC
  useEffect(() => {
    if (state?.success && !isPending) {
      toast.success("Withdrawal request dispatched to finance node.");
      setOpen(false);
      setAmount("");
    }
  }, [state, isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-12 px-6 font-black uppercase italic tracking-[0.1em] shadow-xl hover:scale-105 transition-all bg-primary text-primary-foreground active:scale-95">
          <Banknote className="mr-2 h-4 w-4" /> Request Payout
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl rounded-[3rem] border-border bg-card p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <form action={formAction}>
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="p-10 space-y-10">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                 <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Wallet className="h-5 w-5" />
                 </div>
                 <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">
                   Asset Liquidation
                 </DialogTitle>
              </div>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-70">
                Initiate a transfer from the <span className="text-foreground">Merchant Ledger</span> to an external node.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8">
              {/* --- Amount Selection --- */}
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Liquidation Amount</Label>
                  <button 
                    type="button"
                    onClick={() => setAmount(balanceValue.toString())}
                    className="text-[9px] font-black uppercase text-primary hover:text-foreground transition-colors"
                  >
                    Use Max: ${balanceValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-muted-foreground text-xl">$</span>
                  <Input
                    name="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="rounded-2xl border-muted bg-muted/10 h-16 pl-10 font-black text-2xl tracking-tighter focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* --- Payout Method --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Network Protocol</Label>
                  <select
                    name="method"
                    className="w-full h-14 rounded-2xl border border-muted bg-muted/10 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="USDT_TRC20">USDT (TRC20)</option>
                    <option value="USDT_ERC20">USDT (ERC20)</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Destination Address</Label>
                  <Input
                    name="destination"
                    placeholder="ENTER PROTOCOL ADDRESS"
                    required
                    className="rounded-2xl border-muted bg-muted/10 h-14 font-black uppercase text-[10px] tracking-tight"
                  />
                </div>
              </div>

              {/* --- System Notice --- */}
              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5 flex items-start gap-3">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-muted-foreground uppercase leading-relaxed tracking-wide">
                  Liquidations are processed manually by <span className="text-foreground">Zipha Finance Nodes</span> within 24-48 hours. 
                  Protocol verification is final once confirmed.
                </p>
              </div>
            </div>

            {/* --- Error Feedback --- */}
            {state?.error && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 animate-in shake-1">
                <p className="text-[10px] font-black uppercase text-destructive text-center tracking-widest">
                  {state.error}
                </p>
              </div>
            )}
          </div>

          {/* --- Action Suite --- */}
          <div className="bg-muted/20 p-8 flex items-center justify-end gap-4 border-t border-border/50 backdrop-blur-md">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground h-12"
            >
              Abord
            </Button>
            <Button
              type="submit"
              disabled={isPending || balanceValue <= 0}
              className="flex-1 h-16 rounded-[1.5rem] bg-primary text-primary-foreground font-black uppercase italic tracking-[0.1em] shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px] active:translate-y-[1px] disabled:opacity-30"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing Nodes...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Confirm Liquidation
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}