"use client";

import * as React from "react";
import { useState } from "react";
import { 
  ArrowUpRight, RefreshCcw, Lock, ShieldCheck, 
  Coins, Activity, Zap, Terminal 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useInstitutionalFetch } from "@/lib/hooks/use-institutional-fetch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { requestPayoutAction } from "@/lib/actions/finance.actions";

/**
 * 🛰️ ASSET_VAULT (Institutional Apex v2026.1.20)
 * Logic: Secure Settlement Handshake with Tactical Haptics.
 * Standard: Next.js 15 Client Component.
 */
export function AssetVault({ 
  balance = 0, 
  pending = 0, 
  merchantId 
}: { 
  balance: number; 
  pending: number; 
  merchantId: string;
}) {
  const { isMobile, isReady, safeArea } = useDeviceContext();
  const { impact, hapticFeedback } = useHaptics();
  
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  // 🛡️ INSTITUTIONAL_FETCH: Bridge to Finance Actions
 const { execute: startWithdrawal, loading: isSyncing } = useInstitutionalFetch<
    any, 
    { merchantId: string; amount: number; destination: string }
  >(
    async (payload) => {
      // ✅ FIX: TS2345 - payload is now strictly typed via the second generic <P>
      if (!payload) throw new Error("VAULT_FAULT: Missing_Payload");

      const formData = new FormData();
      formData.append("merchantId", payload.merchantId);
      formData.append("amount", payload.amount.toString());
      formData.append("destination", payload.destination);
      
      return await requestPayoutAction(formData);
    },
    {
      manual: true, // Explicitly set for Server Action triggers
      onSuccess: () => {
        if (hapticFeedback) hapticFeedback("success");
        toast.success("VAULT_SYNC: Settlement_Initialized");
        setAddress("");
        setAmount("");
      },
      onError: (err: any) => {
        if (hapticFeedback) hapticFeedback("error");
        toast.error(`VAULT_FAULT: ${err.message || err}`);
      }
    }
  );
  const handleWithdrawal = () => {
    const numericAmount = parseFloat(amount);

    // 1. Validation Protocol
    if (!address.startsWith("T") || address.length < 30) {
      impact("medium");
      return toast.error("VAULT_FAULT: Invalid_TRC20_Identity");
    }

    if (isNaN(numericAmount) || numericAmount < 10) {
      impact("medium");
      return toast.error("VAULT_FAULT: Minimum_Settle_10_USDT");
    }

    if (numericAmount > balance) {
      impact("heavy");
      return toast.error("VAULT_FAULT: Insufficient_Liquidity_Depth");
    }

    // 2. Protocol Initialization
    impact("heavy");
    startWithdrawal(true, {
  merchantId,
  amount: Number(amount),
  destination: address
});
  };

  if (!isReady) {
    return <div className="h-64 w-full bg-card/20 animate-pulse rounded-3xl" />;
  }

  return (
    <div 
      className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
      style={{ paddingBottom: isMobile ? safeArea?.bottom : 0 }}
    >
      {/* 📊 LIQUIDITY HORIZON: High-Density Balance Nodes */}
      <div className={cn(
        "grid gap-4", 
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        <BalanceNode label="Available_Liquidity" value={balance} icon={Coins} active />
        <BalanceNode label="In_Transit_Epoch" value={pending} icon={RefreshCcw} isPending />
      </div>

      {/* 🛡️ CONTROL UNIT: Compressed Settlement Matrix */}
      
      <div className={cn(
        "relative overflow-hidden transition-all duration-700",
        "bg-card/30 backdrop-blur-3xl border border-white/5 shadow-2xl",
        "p-6 md:p-8 rounded-3xl"
      )}>
        {/* Header Unit */}
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <ArrowUpRight className="size-5 animate-pulse" />
          </div>
          <div className="leading-none">
            <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-foreground">
              Settlement_Handshake
            </h3>
            <div className="flex items-center gap-2 opacity-20 italic mt-1.5">
              <ShieldCheck className="size-2.5 text-emerald-500" />
              <p className="text-[7px] font-black uppercase tracking-[0.4em]">Protocol_AES_256_Active</p>
            </div>
          </div>
        </div>

        <div className={cn(
          "grid gap-8", 
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          {/* Input Cluster */}
          <div className="space-y-6">
            <VaultInput 
              label="TRC20_Identity_Address" 
              value={address} 
              onChange={setAddress} 
              placeholder="T..." 
              icon={Terminal} 
            />
            <VaultInput 
              label="Settlement_Amount" 
              value={amount} 
              onChange={setAmount} 
              placeholder="0.00" 
              isMax 
              onMax={() => { 
                impact("medium"); 
                setAmount(balance.toString()); 
              }} 
            />
          </div>

          {/* Telemetry Actions */}
          <div className="rounded-2xl bg-white/[0.01] border border-white/5 p-6 flex flex-col justify-between group">
            <div className="space-y-4">
              <TelemetryLine label="Network_Fee" value="1.00_USDT" />
              <TelemetryLine label="Est_Time" value="~15_Minutes" />
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2.5 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Lock className="size-2.5" />
                  <span className="text-[7px] font-black uppercase tracking-[0.4em]">Identity_Lock_Engaged</span>
                </div>
              </div>
            </div>

            <Button 
              disabled={isSyncing}
              onClick={handleWithdrawal}
              className={cn(
                "w-full h-12 rounded-xl transition-all duration-500 mt-8",
                "bg-primary text-primary-foreground font-black uppercase italic tracking-[0.2em] shadow-lg active:scale-95"
              )}
            >
              {isSyncing ? (
                <div className="flex items-center gap-2">
                  <Activity className="size-3.5 animate-spin" />
                  <span className="text-[10px]">Syncing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="size-4 fill-current" />
                  <span className="text-[10px]">Initialize_Sync</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC: VAULT_INPUT (Compressed h-11) */
function VaultInput({ label, value, onChange, placeholder, isMax, onMax, icon: Icon }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <label className="text-[7.5px] font-black uppercase tracking-[0.3em] text-primary/40 italic">
          {label}
        </label>
        {isMax && (
          <button 
            onClick={onMax} 
            className="text-[7px] font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors italic"
          >
            MAX_SETTLE
          </button>
        )}
      </div>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-primary/20" />}
        <input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-11 bg-white/[0.02] border border-white/5 rounded-xl focus:bg-white/[0.04] outline-none transition-all px-5 font-mono text-[11px] text-foreground",
            Icon && "pl-11"
          )}
        />
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC: TELEMETRY_LINE (Compressed text-9px) */
function TelemetryLine({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-20 italic">{label}</span>
      <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 italic">{value}</span>
    </div>
  );
}

/** 🛠️ ATOMIC: BALANCE_NODE (Compressed p-6) */
function BalanceNode({ label, value, icon: Icon, active, isPending }: any) {
  return (
    <div className={cn(
      "relative overflow-hidden p-6 rounded-2xl border transition-all duration-700",
      active ? "bg-primary/5 border-primary/20" : "bg-card/30 border-white/5"
    )}>
      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-2 opacity-20 italic">
          <Icon className={cn("size-3", isPending && "animate-spin")} />
          <span className="text-[7.5px] font-black uppercase tracking-[0.4em]">{label}</span>
        </div>
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="font-black tracking-tighter italic text-2xl md:text-3xl text-foreground tabular-nums">
            ${value.toLocaleString()}
          </span>
          <span className="text-[8px] font-black opacity-10 uppercase tracking-widest italic">USDT</span>
        </div>
      </div>
    </div>
  );
}