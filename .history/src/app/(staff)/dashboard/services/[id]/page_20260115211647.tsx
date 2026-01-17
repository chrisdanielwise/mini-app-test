"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft, Zap, ShieldCheck, Trophy, Settings2, Lock, Terminal,
  ShieldAlert, Activity, Globe, Layers, ChevronRight, Server,
  Building2, Cpu, Activity as ActivityIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts & Device Telemetry
import { useDeviceContext } from "@/components/providers/device-provider";
import { useLayout } from "@/context/layout-provider";

// 🛠️ Atomic UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AddTierModal } from "@/components/dashboard/add-tier-modal";

/**
 * 🌊 SERVICE_CONFIG_ENGINE (Institutional Apex v2026.1.15)
 * Aesthetics: Water-Ease Kinetic Ingress | Obsidian-OLED Depth.
 * Logic: morphology-aware safe-area clamping for Telegram 8.0+.
 */
export default function ServiceConfigPage({ service, session }: any) {
  const { flavor } = useLayout();
  const { 
    isReady, 
    isMobile, 
    screenSize, 
    safeArea, 
    viewportHeight 
  } = useDeviceContext();
  
  // 🛡️ IDENTITY RESOLUTION: Zero-Latency Role Gating
  const isPlatformStaff = flavor === "AMBER";

  // 🛡️ HYDRATION SHIELD: Prevent Layout Snapping
  if (!isReady) return <div className="min-h-screen bg-background animate-pulse" />;

  return (
    <div 
      className={cn(
        "max-w-[1400px] mx-auto space-y-10 md:space-y-16 pb-24",
        "animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      )}
      style={{ 
        paddingLeft: isMobile ? "1.5rem" : "0px",
        paddingRight: isMobile ? "1.5rem" : "0px"
      }}
    >
      
      {/* --- COMMAND HUD HEADER: Vapour-Glass Horizon --- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10 relative group">
        <div className="space-y-6">
          <Link
            href="/dashboard/services"
            className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 hover:text-primary transition-all duration-700 italic"
          >
            <ArrowLeft className="size-3 group-hover:-translate-x-2 transition-transform duration-700" />
            Cluster_Ledger
          </Link>

          <div className="flex flex-wrap items-center gap-6">
            <h1 className="text-[clamp(2.5rem,10vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.85] text-foreground">
              {service.name}
            </h1>
            <Badge className={cn(
              "rounded-xl text-[10px] font-black tracking-[0.3em] px-4 py-1.5 border-none italic shadow-apex",
              isPlatformStaff ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
            )}>
              <Zap className={cn("size-3.5 mr-2 animate-pulse", isPlatformStaff ? "fill-amber-500" : "fill-primary")} />
              {isPlatformStaff ? "ROOT_OVERSIGHT" : "ACTIVE_PROTO"}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 opacity-30 italic">
            {isPlatformStaff && (
              <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2.5 text-amber-500">
                <Building2 className="size-4" />
                Origin: <span>{service.merchant.companyName}</span>
              </p>
            )}
            <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2.5">
              <Globe className="size-4" />
              Node: <span className="uppercase">{service.id.slice(0, 12)}</span>
            </p>
            <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2.5">
              <Server className="size-4" />
              Status: <span className="text-emerald-500 uppercase">Sync_Stable</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 relative z-20">
          <AddTierModal serviceId={service.id} merchantId={service.merchantId} />
        </div>
      </div>

      {/* --- TELEGRAM HANDSHAKE MODULE --- */}
      <div
        className={cn(
          "rounded-[3.5rem] p-8 md:p-14 border transition-all duration-1000 relative overflow-hidden shadow-apex backdrop-blur-3xl",
          service.vipChannelId
            ? "bg-emerald-500/[0.04] border-emerald-500/20 shadow-apex-emerald"
            : "bg-amber-500/[0.04] border-amber-500/20 shadow-apex-amber"
        )}
      >
        {/* Subsurface Radiance */}
        <div className={cn(
          "absolute -right-24 -bottom-24 size-80 blur-[120px] opacity-10 pointer-events-none",
          service.vipChannelId ? "bg-emerald-500" : "bg-amber-500"
        )} />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "size-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform hover:rotate-12 duration-700",
                  service.vipChannelId
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}
              >
                <Lock className="size-6" />
              </div>
              <div className="flex flex-col">
                <h4 className={cn(
                  "text-[11px] font-black uppercase tracking-[0.4em] italic leading-none",
                  service.vipChannelId ? "text-emerald-500" : "text-amber-500"
                )}>
                  Gateway Handshake
                </h4>
                <span className="text-[8px] font-black uppercase tracking-widest mt-2 opacity-30 italic">v16.31_Encrypted_Link</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 ml-2 italic">
                Target_Telegram_Node
              </Label>
              <div className="bg-zinc-950/60 px-8 py-5 rounded-[1.5rem] border border-white/5 font-mono text-xs tracking-[0.2em] text-primary flex items-center gap-4 shadow-inner group transition-all duration-1000">
                <Terminal className="size-4 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="truncate italic">
                  {service.vipChannelId?.toString() || "AWAITING_LINK_SIGNAL..."}
                </span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "p-8 md:p-12 rounded-[2.5rem] border flex items-center justify-between backdrop-blur-md group transition-all duration-1000",
              service.vipChannelId
                ? "bg-emerald-500/5 border-emerald-500/10"
                : "bg-muted/10 border-white/5"
            )}
          >
            <div className="flex items-center gap-6">
              <div
                className={cn(
                  "size-16 md:size-20 rounded-[1.8rem] flex items-center justify-center transition-all duration-1000 group-hover:scale-110 shadow-2xl group-hover:rotate-12",
                  service.vipChannelId
                    ? "bg-emerald-500 text-white shadow-apex-emerald"
                    : "bg-white/5 text-muted-foreground/30"
                )}
              >
                {service.vipChannelId ? (
                  <ShieldCheck className="size-10 md:size-12" />
                ) : (
                  <ShieldAlert className="size-10 md:size-12" />
                )}
              </div>
              <div className="space-y-2">
                <p
                  className={cn(
                    "text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none transition-colors duration-1000",
                    service.vipChannelId ? "text-emerald-500" : "text-muted-foreground/30"
                  )}
                >
                  {service.vipChannelId ? "Node_Verified" : "Offline"}
                </p>
                <p className="text-[9px] font-black uppercase text-muted-foreground/20 tracking-[0.2em] italic">
                  {service.vipChannelId ? "Broadcast_Path_Established" : "Handshake_Required"}
                </p>
              </div>
            </div>
            <ChevronRight className="size-6 opacity-10 group-hover:opacity-40 group-hover:translate-x-3 transition-all duration-700" />
          </div>
        </div>
      </div>

      {/* --- PRICING ARCHITECTURE --- */}
      <div className="space-y-12">
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <div className="flex items-center gap-5">
            <ActivityIcon className={cn("size-6", isPlatformStaff ? "text-amber-500" : "text-primary")} />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
              Pricing <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Nodes</span>
            </h2>
          </div>
          <Badge
            variant="secondary"
            className="rounded-xl font-black italic text-[11px] px-5 py-1.5 bg-white/5 border-white/5 text-muted-foreground/60 tracking-[0.2em]"
          >
            {service.tiers.length} UNITS_Hydrated
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {service.tiers.length === 0 ? (
            <div className="col-span-full py-32 text-center border border-dashed border-white/5 rounded-[3rem] bg-white/[0.02] opacity-30 italic animate-in fade-in duration-1000">
              <Trophy className="size-16 mx-auto mb-8 opacity-40" />
              <p className="text-[12px] font-black uppercase tracking-[0.4em]">Zero_Active_Nodes_Detected</p>
            </div>
          ) : (
            service.tiers.map((tier: any, index: number) => (
              <div
                key={tier.id}
                style={{ animationDelay: `${index * 80}ms` }}
                className={cn(
                  "relative group rounded-[3.5rem] border bg-card/30 p-10 md:p-14 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-apex hover:bg-white/[0.02] animate-in fade-in slide-in-from-bottom-8",
                  isPlatformStaff ? "hover:border-amber-500/40" : "hover:border-primary/40",
                  !tier.isActive && "opacity-20 grayscale blur-[2px]"
                )}
              >
                <div className="absolute top-12 right-12">
                  <Badge
                    variant="outline"
                    className="rounded-xl text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 bg-black border-white/5 italic"
                  >
                    {tier.isActive ? "STABLE" : "PAUSED"}
                  </Badge>
                </div>

                <div className={cn(
                  "size-16 rounded-[1.8rem] flex items-center justify-center mb-12 border shadow-inner transition-all duration-1000 group-hover:rotate-12",
                  isPlatformStaff ? "bg-amber-500/10 border-amber-500/20" : "bg-primary/10 border-primary/20"
                )}>
                  <Layers className={cn("size-8", isPlatformStaff ? "text-amber-500" : "text-primary")} />
                </div>

                <div className="space-y-2 mb-10">
                  <p className={cn("text-[10px] font-black uppercase tracking-[0.5em] italic opacity-40 leading-none", isPlatformStaff ? "text-amber-500" : "text-primary")}>
                    {tier.interval} RECURRING_EPOCH
                  </p>
                  <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors duration-700 truncate">
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-3 mb-12">
                  <span className="text-5xl md:text-6xl font-black tracking-tighter italic tabular-nums leading-none">
                    ${Number(tier.price).toFixed(2)}
                  </span>
                  <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-20 italic">
                    USD
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-10 border-t border-white/5">
                  <Button className={cn(
                    "w-full h-16 rounded-2xl font-black uppercase italic text-[11px] tracking-[0.3em] shadow-apex transition-all duration-1000 active:scale-90",
                    isPlatformStaff ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-primary text-white hover:scale-[1.05]"
                  )}>
                    <Settings2 className="size-4 mr-3" /> Modify_Node
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- FOOTER SIGNAL --- */}
      <div 
        className="flex flex-col md:flex-row items-center justify-center gap-6 opacity-10 py-16 border-t border-white/5"
        style={{ paddingBottom: isMobile ? `calc(${safeArea.bottom}px + 2rem)` : "4rem" }}
      >
        <div className="flex items-center gap-4">
           <Cpu className="size-4 animate-pulse" />
           <p className="text-[10px] font-black uppercase tracking-[0.6em] text-foreground italic text-center leading-none">
             Handshake_Sync: Stable // Node_ID: {service.id.toUpperCase()}
           </p>
        </div>
        {!isMobile && <div className="size-1 rounded-full bg-foreground" />}
        <span className="text-[8px] font-mono tabular-nums opacity-60">[v16.31_STABLE]</span>
      </div>
    </div>
  );
}