"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft, Zap, ShieldCheck, Trophy, Settings2, Lock, Terminal,
  ShieldAlert, Activity, Globe, Layers, ChevronRight, Server, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Contexts & UI
import { useDeviceContext } from "@/components/providers/device-provider";
import { useHaptics } from "@/lib/hooks/use-haptics";
import { AddTierModal } from "@/components/dashboard/add-tier-modal";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ServiceConfigClient({ service, isPlatformStaff }: any) {
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea, viewportHeight } = useDeviceContext();

  if (!isReady) return (
    <div className="flex h-screen w-full items-center justify-center bg-black/40">
      <div className="size-10 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
    </div>
  );

  return (
    <div 
      className={cn(
        "max-w-6xl mx-auto transition-all duration-1000 animate-in fade-in slide-in-from-bottom-12",
        viewportHeight < 700 ? "space-y-6" : "space-y-12"
      )}
      style={{ 
        paddingTop: isMobile ? `${safeArea.top}px` : "1rem",
        paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 7rem)` : "5rem",
        paddingLeft: isMobile ? "1.25rem" : "2rem",
        paddingRight: isMobile ? "1.25rem" : "2rem"
      }}
    >
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-white/5 pb-8">
        {/* 🛡️ FIX: min-w-0 is required here to allow the text child to truncate */}
        <div className="space-y-4 flex-1 min-w-0">
          <Link
            href="/dashboard/services"
            onClick={() => selectionChange()}
            className="group flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all italic"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            CLUSTER_LEDGER
          </Link>
          <div className="flex flex-wrap items-center gap-5 min-w-0">
            {/* 🛡️ FIX: Added truncate and constrained max-width to handle names like "GAMMA INSIDER INTEL" */}
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none truncate max-w-[100%]">
              {service.name}
            </h1>
            <Badge className={cn(
              "rounded-xl text-[10px] font-black tracking-widest px-3 py-1 border shadow-lg shrink-0",
              isPlatformStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
            )}>
              <Zap className={cn("size-3 mr-2 animate-pulse", isPlatformStaff ? "fill-amber-500" : "fill-primary")} />
              {isPlatformStaff ? "ROOT_OVERSIGHT" : "ACTIVE_PROTO"}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 opacity-30 italic">
            {isPlatformStaff && (
              <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-amber-500">
                <Building2 className="size-3.5" />
                Origin: <span>{service.merchant.companyName}</span>
              </p>
            )}
            <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-foreground">
              <Globe className="size-3.5" />
              Node: <span className="uppercase">{service.id.slice(0, 12)}</span>
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-foreground">
              <Server className="size-3.5" />
              Status: <span className="text-emerald-500">Sync_Ok</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 relative z-10">
          <AddTierModal
            serviceId={service.id}
            merchantId={service.merchantId}
          />
        </div>
      </div>

      {/* --- TELEGRAM HANDSHAKE MODULE --- */}
      <div
        className={cn(
          "rounded-[2.5rem] p-8 md:p-12 border transition-all duration-700 relative overflow-hidden shadow-2xl backdrop-blur-3xl",
          service.vipChannelId
            ? "bg-emerald-500/[0.02] border-emerald-500/20 shadow-emerald-500/10"
            : "bg-amber-500/[0.02] border-amber-500/20 shadow-amber-500/10"
        )}
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "size-12 rounded-2xl flex items-center justify-center border shadow-inner transition-transform hover:rotate-6",
                  service.vipChannelId
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}
              >
                <Lock className="size-5" />
              </div>
              <h4
                className={cn(
                  "text-[11px] font-black uppercase tracking-[0.4em] italic",
                  service.vipChannelId ? "text-emerald-500" : "text-amber-500"
                )}
              >
                Gateway_Handshake
              </h4>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                  Target_Telegram_Node
                </Label>
                <div className="bg-white/[0.03] px-8 py-5 rounded-2xl border border-white/5 font-mono text-xs tracking-[0.2em] text-primary flex items-center gap-4 shadow-inner group transition-all">
                  <Terminal className="size-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                  {service.vipChannelId || "AWAITING_LINK_SIGNAL..."}
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => { impact("medium"); }}
            className={cn(
              "p-8 md:p-10 rounded-[2rem] border flex items-center justify-between backdrop-blur-md group transition-all cursor-pointer",
              service.vipChannelId
                ? "bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10"
                : "bg-white/5 border-white/5 hover:bg-white/10"
            )}
          >
            <div className="flex items-center gap-6">
              <div
                className={cn(
                  "size-16 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-2xl",
                  service.vipChannelId
                    ? "bg-emerald-500 text-white shadow-emerald-500/40"
                    : "bg-white/5 text-muted-foreground"
                )}
              >
                {service.vipChannelId ? (
                  <ShieldCheck className="size-10" />
                ) : (
                  <ShieldAlert className="size-10" />
                )}
              </div>
              <div className="space-y-1">
                <p
                  className={cn(
                    "text-2xl font-black uppercase italic tracking-tighter leading-none",
                    service.vipChannelId ? "text-emerald-500" : "text-muted-foreground/40"
                  )}
                >
                  {service.vipChannelId ? "Node_Verified" : "Offline"}
                </p>
                <p className="text-[10px] font-black uppercase text-muted-foreground/30 tracking-widest italic">
                  {service.vipChannelId ? "Broadcast Path Established" : "Handshake Required"}
                </p>
              </div>
            </div>
            <ChevronRight className="size-6 opacity-10 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>

      {/* --- PRICING ARCHITECTURE --- */}
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Activity className={cn("size-5", isPlatformStaff ? "text-amber-500" : "text-primary")} />
            <h2 className="text-[16px] font-black uppercase tracking-[0.4em] italic">
              Pricing_<span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Nodes</span>
            </h2>
          </div>
          <Badge
            variant="outline"
            className="rounded-xl font-black italic text-[11px] px-4 py-1 border-white/5 bg-white/5"
          >
            {service.tiers.length} UNITS
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {service.tiers.length === 0 ? (
            <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] opacity-20 italic">
              <Trophy className="size-12 mx-auto mb-6" />
              <p className="text-sm font-black uppercase tracking-[0.5em]">Zero_Active_Nodes</p>
            </div>
          ) : (
            service.tiers.map((tier: any) => (
              <div
                key={tier.id}
                onMouseEnter={() => impact("light")}
                className={cn(
                  "relative group rounded-[3rem] border bg-card/40 p-10 md:p-12 transition-all duration-700 hover:shadow-2xl overflow-hidden",
                  isPlatformStaff ? "hover:border-amber-500/30" : "hover:border-primary/30",
                  !tier.isActive && "opacity-40 grayscale"
                )}
              >
                <div className="absolute top-12 right-12">
                  <Badge
                    variant="outline"
                    className="rounded-xl text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-black/40 border-white/5"
                  >
                    {tier.isActive ? "STABLE" : "PAUSED"}
                  </Badge>
                </div>

                <div className={cn(
                  "size-14 rounded-2xl flex items-center justify-center mb-12 border shadow-inner transition-transform group-hover:rotate-6",
                  isPlatformStaff ? "bg-amber-500/10 border-amber-500/20" : "bg-primary/10 border-primary/20"
                )}>
                  <Layers className={cn("size-7", isPlatformStaff ? "text-amber-500" : "text-primary")} />
                </div>

                <div className="space-y-2 mb-10 min-w-0">
                  <p className={cn("text-[10px] font-black uppercase tracking-[0.3em] italic opacity-40", isPlatformStaff ? "text-amber-500" : "text-primary")}>
                    {tier.interval} RECURRING
                  </p>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-[0.9] group-hover:text-primary transition-colors truncate">
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 mb-12">
                  <span className="text-6xl font-black tracking-tighter italic tabular-nums leading-none">
                    ${Number(tier.price).toFixed(2)}
                  </span>
                  <span className="text-[11px] font-black text-muted-foreground/30 uppercase tracking-[0.4em] italic">
                    USD
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-10 border-t border-white/5">
                  <Button 
                    onClick={() => { impact("medium"); }}
                    className={cn(
                      "w-full rounded-2xl font-black uppercase italic text-[11px] tracking-[0.3em] h-14 shadow-2xl transition-all active:scale-95",
                      isPlatformStaff ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-primary text-primary-foreground hover:scale-[1.02]"
                    )}
                  >
                    <Settings2 className="size-4 mr-3" /> MODIFY_NODE
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 opacity-10 py-16">
        <Terminal className="size-4" />
        <p className="text-[9px] font-black uppercase tracking-[0.6em] italic text-center leading-none">
          Handshake_Sync: Optimal // Node_ID: {service.id.toUpperCase()}
        </p>
      </div>
    </div>
  );
}