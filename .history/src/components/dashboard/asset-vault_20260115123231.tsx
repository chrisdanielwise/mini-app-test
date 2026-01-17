"use client";

import { useState } from "react";
import { Wallet, ArrowUpRight, RefreshCcw, Lock, ShieldCheck, Coins } from "lucide-react";
import { useInstitutionalFetch } from "@/hooks/use-institutional-fetch";
import { requestWithdrawal } from "@/app/(dashboard)/actions"; 
import { useDevice } from "@/context/device-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * 🌊 ASSET_VAULT_TERMINAL (v16.16.31)
 * Standard: v16.16.12 Institutional Refinement.
 * Logic: Secure Withdrawal Handshake with Haptic Ingress.
 */
export function AssetVault({ balance = 0, pending = 0 }) {
  const { isMobile } = useDevice();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const { execute: startWithdrawal, loading: isSyncing } = useInstitutionalFetch(
    requestWithdrawal,
    {
      onSuccess: () => {
        toast.success("WITHDRAWAL_INITIALIZED: Tx_Relay_Propagating");
        setAddress("");
        setAmount("");
      },
      onError: (err) => toast.error(`VAULT_ERROR: ${err}`)
    }
  );

  const handleWithdrawal = () => {
    if (!address || !amount) return toast.error("VAULT_ERROR: Incomplete_Payload");
    startWithdrawal({ address, amount });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* TELEMETRY HORIZON */}
      <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-2")}>
        <BalanceNode label="Available_Liquidity" value={balance} icon={Coins} active />
        <BalanceNode label="In_Transit_Epoch" value={pending} icon={RefreshCcw} isPending />
      </div>

      {/* WITHDRAWAL CONTROL UNIT */}
      <div className="glass-module p-8 md:p-12 rounded-[3rem]">
        <div className="flex items-center gap-4 mb-10">
          <div className="size-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary">
            <ArrowUpRight className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Withdraw_Asset</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Protocol_Security_Active</p>
          </div>
        </div>

        <div className={cn("grid gap-8", isMobile ? "grid-cols-1" : "grid-cols-2")}>
          <div className="space-y-6">
            <InputNode label="USDT_TRC20_ADDRESS" value={address} onChange={setAddress} placeholder="T..." isMono />
            <InputNode 
              label="AMOUNT_TO_SETTLE" 
              value={amount} 
              onChange={setAmount} 
              placeholder="0.00" 
              isMax 
              onMax={() => setAmount(balance.toString())} 
            />
          </div>

          <div className="rounded-[2rem] bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-between">
            <VaultMetrics />
            <Button 
              disabled={isSyncing}
              onClick={handleWithdrawal}
              className="h-16 rounded-2xl font-black uppercase italic tracking-[0.2em] bg-primary text-primary-foreground shadow-apex transition-all active:scale-95"
            >
              {isSyncing ? "Syncing_Vault..." : "Initialize_Handshake"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}