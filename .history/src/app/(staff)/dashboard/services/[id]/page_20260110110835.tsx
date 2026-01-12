import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";
import prisma from "@/src/lib/db";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  Clock, 
  Settings2, 
  Trash2, 
  Lock, 
  Terminal, 
  ShieldAlert, 
  Activity,
  Globe,
  Layers,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { AddTierModal } from "@/src/components/dashboard/add-tier-modal";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

/**
 * 🛰️ SERVICE CONFIGURATION ENGINE (Tier 2)
 * High-resiliency node management for Telegram Signal Assets.
 */
export default async function ServiceConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireMerchantSession();
  const { id } = await params;

  // 🏁 1. Fetch Service with context-locked security
  const service = await prisma.service.findUnique({
    where: {
      id,
      merchantId: session.merchant.id,
    },
    include: {
      tiers: {
        orderBy: { price: "asc" },
      },
    },
  });

  if (!service) return notFound();

  return (
    <div className="space-y-16 p-6 sm:p-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <Link
            href="/dashboard/services"
            className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all mb-8"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Node Cluster Ledger
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
              {service.name}
            </h1>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-inner">
              <Zap className="h-4 w-4 text-primary fill-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Protocol Active
              </span>
            </div>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-6 flex items-center gap-3">
            <Globe className="h-3 w-3" />
            Node ID: <span className="text-foreground italic">{service.id}</span>
          </p>
        </div>

        <div className="flex gap-4">
          <AddTierModal serviceId={service.id} />
        </div>
      </div>

      {/* --- TELEGRAM HANDSHAKE MODULE --- */}
      <div
        className={cn(
          "rounded-[3.5rem] p-10 md:p-14 border transition-all duration-700 relative overflow-hidden shadow-2xl backdrop-blur-3xl",
          service.vipChannelId
            ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-emerald-500/5"
            : "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5"
        )}
      >
        {/* Background Decorative Icon */}
        <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none rotate-12 scale-150">
          <Layers className="h-96 w-96 text-foreground" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <div className={cn(
                 "h-10 w-10 rounded-xl flex items-center justify-center shadow-inner",
                 service.vipChannelId ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"
               )}>
                  <Lock className="h-5 w-5" />
               </div>
               <h4 className={cn("text-[11px] font-black uppercase tracking-[0.4em]", service.vipChannelId ? "text-emerald-500" : "text-amber-500")}>
                  Signal Handshake Protocol
               </h4>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[9px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Target Telegram Node</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-muted/20 px-8 py-5 rounded-[1.5rem] border border-border/40 font-mono text-sm tracking-widest text-primary flex items-center gap-4 shadow-inner group">
                    <Terminal className="h-4 w-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                    {service.vipChannelId?.toString() || "AWAITING_IDENTIFIER"}
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase leading-relaxed tracking-widest opacity-60">
                Instruction: Invite Bot to channel and grant admin privileges to authorize transmission.
              </p>
            </div>
          </div>

          <div className={cn(
              "p-10 rounded-[2.5rem] border flex items-center justify-between backdrop-blur-md group transition-all",
              service.vipChannelId ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted/30 border-border/40"
          )}>
            <div className="flex items-center gap-6">
              <div className={cn(
                "h-20 w-20 rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110",
                service.vipChannelId ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
              )}>
                {service.vipChannelId ? <ShieldCheck className="h-10 w-10" /> : <ShieldAlert className="h-10 w-10" />}
              </div>
              <div className="space-y-1">
                <p className={cn("text-xl font-black uppercase italic tracking-tighter", service.vipChannelId ? "text-emerald-500" : "text-muted-foreground")}>
                  {service.vipChannelId ? "Node Synchronized" : "Connection Failure"}
                </p>
                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-60">
                  {service.vipChannelId ? "Gateway broadcasting live." : "Identity verification pending."}
                </p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 opacity-10" />
          </div>
        </div>
      </div>

      {/* --- PRICING ARCHITECTURE --- */}
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b border-border/40 pb-6">
          <div className="flex items-center gap-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-foreground">
              Pricing <span className="text-primary">Nodes</span>
            </h2>
          </div>
          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
            Total Tiers: {service.tiers.length}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {service.tiers.length === 0 ? (
            <div className="col-span-full py-40 text-center border border-dashed border-border/40 rounded-[4rem] bg-muted/5 backdrop-blur-sm group hover:border-primary/20 transition-all">
              <Trophy className="h-16 w-16 text-muted-foreground/20 mx-auto mb-8 transition-transform group-hover:scale-110" />
              <p className="text-lg font-black uppercase italic text-muted-foreground tracking-tighter">
                Zero Active Revenue Tiers
              </p>
              <p className="text-[9px] font-black uppercase text-muted-foreground/40 mt-4 tracking-[0.3em]">
                Initialize a pricing node to authorize onboarding.
              </p>
            </div>
          ) : (
            service.tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  "relative group rounded-[4rem] border bg-card/40 p-12 backdrop-blur-3xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-3",
                  tier.isActive
                    ? "border-border/60 hover:border-primary/40"
                    : "border-dashed border-border/40 opacity-40 grayscale"
                )}
              >
                {/* Protocol Badge */}
                <div className="absolute top-10 right-10">
                   <Badge variant="outline" className={cn(
                     "rounded-lg text-[8px] font-black uppercase tracking-widest px-3 py-1.5 shadow-sm",
                     tier.isActive ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
                   )}>
                     {tier.isActive ? "NODE_ACTIVE" : "NODE_OFFLINE"}
                   </Badge>
                </div>

                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner mb-12">
                  <Layers className="h-8 w-8 text-primary" />
                </div>

                <div className="space-y-2 mb-12">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary italic">
                    {tier.interval} RECURRING NODE
                  </p>
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none">
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 mb-14">
                  <span className="text-6xl font-black tracking-tighter italic text-foreground">
                    ${Number(tier.price).toFixed(2)}
                  </span>
                  <span className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">
                    USD
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-10 border-t border-border/20">
                  <Button className="w-full rounded-[1.5rem] font-black uppercase italic text-[11px] tracking-widest h-16 bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
                    <Settings2 className="h-4 w-4 mr-2" /> Modify Node
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full rounded-[1.25rem] font-black uppercase text-[10px] tracking-widest text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 h-14 transition-all"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Terminate Tier
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}