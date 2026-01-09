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
import { Banknote, Loader2, ShieldCheck, Wallet, ArrowRight } from "lucide-react";

interface RequestPayoutModalProps {
  merchantId: string;
  availableBalance: number;
}

export function RequestPayoutModal({ merchantId, availableBalance }: RequestPayoutModalProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [state, formAction, isPending] = useActionState(requestPayoutAction, null);

  // Auto-close on success
  useEffect(() => {
    if (state?.success && !isPending) {
      setOpen(false);
      setAmount("");
    }
  }, [state, isPending]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-12 px-6 font-black uppercase italic tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-transform bg-primary text-primary-foreground">
          <Banknote className="mr-2 h-4 w-4" /> Request Payout
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl rounded-[2.5rem] border-border bg-card p-0 overflow-hidden shadow-2xl">
        <form action={formAction}>
          <input type="hidden" name="merchantId" value={merchantId} />

          <div className="p-8 space-y-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" /> Withdrawal Request
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Move your earnings to your external wallet or bank account.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Amount Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <Label className="text-[9px] font-black uppercase">Amount to Withdraw</Label>
                  <button 
                    type="button"
                    onClick={() => setAmount(availableBalance.toString())}
                    className="text-[8px] font-black uppercase text-primary hover:underline"
                  >
                    Use Max: ${availableBalance.toFixed(2)}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground">$</span>
                  <Input
                    name="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    className="rounded-xl border-muted bg-muted/20 h-14 pl-8 font-black text-xl"
                  />
                </div>
              </div>

              {/* Payout Method */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Method</Label>
                  <select
                    name="method"
                    className="w-full h-12 rounded-xl border border-muted bg-muted/20 px-3 text-xs font-bold uppercase cursor-pointer"
                  >
                    <option value="USDT_TRC20">USDT (TRC20)</option>
                    <option value="USDT_ERC20">USDT (ERC20)</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-black uppercase ml-1">Network/Bank</Label>
                  <Input
                    name="destination"
                    placeholder="Address or Acc No."
                    required
                    className="rounded-xl border-muted bg-muted/20 h-12 text-[10px] font-bold"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                <p className="text-[8px] font-bold text-muted-foreground uppercase leading-relaxed">
                  Payouts are processed manually by the Zipha Finance team within 24-48 hours. 
                  Please ensure your destination address is correct.
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
                <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Processing...</>
              ) : (
                <><ShieldCheck className="mr-2 h-3 w-3" /> Confirm Withdrawal</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}