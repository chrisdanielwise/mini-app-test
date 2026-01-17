"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Wallet, ArrowUpRight, RefreshCcw, Lock, ShieldCheck, 
  Coins, Activity, Zap, Terminal 
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Hooks
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { useInstitutionalFetch } from "@/lib/hooks/use-institutional-fetch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * 🌊 ASSET_VAULT_TERMINAL (Institutional Apex v2026.1.15)
 * Strategy: High-density liquidity ingress with Obsidian-OLED depth.
 * Fix: Clamped typography and fixed-grid intervals to prevent layout distortion.
 */
export function AssetVault({ balance = 0, pending = 0 }) {
  const { isMobile, isReady, screenSize, safeArea } = useDeviceContext();
  const { impact, hapticFeedback } = useHaptics();
  
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const { execute: startWithdrawal, loading: isSyncing } = useInstitutionalFetch<any>(
    async (payload) => ({ success: true }),
    {
      onSuccess: () => {
        hapticFeedback("success");
        toast.success("VAULT_SYNC: Settlement_Initialized");
        setAddress("");
        setAmount("");
      },
      onError: (err) => toast.error(`VAULT_FAULT: ${err}`)
    }
  );

  const handleWithdrawal = () => {
    if (!address || !amount) {
      impact("medium");
      return toast.error("VAULT_FAULT: Incomplete_Payload");
    }
    impact("heavy");
    startWithdrawal({ address, amount });
  };

  if (!isReady) return <div className="h-96 w-full bg-card/20 animate-pulse rounded-[3rem]" />;

  return (
    <div 
      className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000"
      style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "0px" }}
    >
      
      {/* 📊 LIQUIDITY HORIZON: Clamped Grid Density */}
      <div className={cn(
        "grid gap-5 md:gap-8", 
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        <BalanceNode label="Available_Liquidity" value={balance} icon={Coins} active screenSize={screenSize} />
        <BalanceNode label="In_Transit_Epoch" value={pending} icon={RefreshCcw} isPending screenSize={screenSize} />
      </div>

      {/* 🛡️ CONTROL UNIT: Vapour-Glass Membrane */}
      <div className={cn(
        "relative overflow-hidden transition-all duration-1000",
        "bg-card/30 backdrop-blur-3xl border border-white/5 shadow-apex",
        "p-8 md:p-12 rounded-[3rem] md:rounded-[3.5rem]"
      )}>
        <div className="absolute -top-24 -left-24 size-64 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />

        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="size-12 md:size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <ArrowUpRight className="size-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">Settlement_Handshake</h3>
            <div className="flex items-center gap-2 opacity-30 italic">
              <ShieldCheck className="size-3 text-emerald-500" />
              <p className="text-[8px] font-black uppercase tracking-[0.4em]">Protocol_AES_256_Enabled</p>
            </div>
          </div>
        </div>

        <div className={cn(
          "grid gap-10 md:gap-14", 
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          {/* Input Cluster: Morphology-Aware Padding */}
          <div className="space-y-8">
            <VaultInput label="TRC20_Identity_Address" value={address} onChange={setAddress} placeholder="T..." icon={Terminal} />
            <VaultInput 
              label="Settlement_Amount" 
              value={amount} 
              onChange={setAmount} 
              placeholder="0.00" 
              isMax 
              onMax={() => { impact("medium"); setAmount(balance.toString()); }} 
            />
          </div>

          {/* Telemetry Actions */}
          <div className="rounded-[2.5rem] bg-white/[0.01] border border-white/5 p-8 md:p-10 flex flex-col justify-between group">
            <div className="space-y-6">
              <TelemetryLine label="Network_Fee" value="1.00_USDT" />
              <TelemetryLine label="Est_Time" value="~15_Minutes" />
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Lock className="size-3" />
                  <span className="text-[8px] font-black uppercase tracking-[0.5em]">Identity_Lock_Engaged</span>
                </div>
              </div>
            </div>

            <Button 
              disabled={isSyncing}
              onClick={handleWithdrawal}
              className={cn(
                "w-full h-16 md:h-18 rounded-2xl md:rounded-[1.6rem] transition-all duration-700 mt-10",
                "bg-primary text-primary-foreground font-black uppercase italic tracking-[0.2em] shadow-apex-primary hover:scale-[1.02] active:scale-95"
              )}
            >
              {isSyncing ? (
                <div className="flex items-center gap-3">
                  <Activity className="size-4 animate-spin" />
                  <span className="text-[11px]">Syncing_Vault...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="size-5 fill-current" />
                  <span className="text-[11px]">Initialize_Sync</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC: VAULT_INPUT */
function VaultInput({ label, value, onChange, placeholder, isMax, onMax, icon: Icon }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 italic">{label}</label>
        {isMax && (
          <button onClick={onMax} className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors italic">MAX_SETTLE</button>
        )}
      </div>
      <div className="relative">
        {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-primary/20" />}
        <input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-14 md:h-16 bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl focus:bg-white/[0.05] outline-none transition-all px-6 font-mono text-[13px] text-foreground",
            Icon && "pl-14"
          )}
        />
      </div>
    </div>
  );
}

/** 🛠️ ATOMIC: TELEMETRY_LINE */
function TelemetryLine({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-20 italic">{label}</span>
      <span className="text-[11px] font-black uppercase tracking-widest text-foreground/60 italic">{value}</span>
    </div>
  );
}

/** 🛠️ ATOMIC: BALANCE_NODE */
function BalanceNode({ label, value, icon: Icon, active, isPending, screenSize }: any) {
  const isXS = screenSize === 'xs';
  return (
    <div className={cn(
      "relative overflow-hidden p-8 md:p-10 rounded-[2.8rem] md:rounded-[3rem] border transition-all duration-1000",
      active ? "bg-primary/5 border-primary/20" : "bg-card/30 border-white/5"
    )}>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3 opacity-30 italic">
          <Icon className={cn("size-3.5", isPending && "animate-spin")} />
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={cn("font-black tracking-tighter italic leading-none text-foreground", isXS ? "text-3xl" : "text-5xl md:text-6xl")}>
            ${value.toLocaleString()}
          </span>
          <span className="text-[10px] font-black opacity-20 uppercase tracking-widest italic">USDT</span>
        </div>
      </div>
    </div>
  );
}