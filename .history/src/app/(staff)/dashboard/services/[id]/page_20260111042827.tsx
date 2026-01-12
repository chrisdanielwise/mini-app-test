import { requireMerchantSession } from "@/lib/auth/merchant-session";
import prisma from "@/lib/db";
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
  ChevronRight,
  Server
} from "lucide-react";
import Link from "next/link";
import { AddTierModal } from "@/components/dashboard/add-tier-modal";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SERVICE CONFIGURATION ENGINE (Tier 2)
 * Hardened node management for Telegram Signal Assets.
 */
export default async function ServiceConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireMerchantSession();
  const { id } = await params;

  // 🏁 1. Fetch Service Protocol with Security Lock
  const service = await prisma.service.findUnique({
    where: {
      id,
      merchantId: session.merchantd,
    },
    include: {
      tiers: {
        orderBy: { price: "asc" },
      },
    },
  });

  if (!service) return notFound();

  return (
    <div className="space-y-16 p-6 sm:p-10 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-7xl mx-auto">
      
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <Link
            href="/dashboard/services"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all mb-8"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Node Cluster Ledger
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
              {service.name}
            </h1>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 shadow-inner">
              <Zap className="h-4 w-4 text-primary fill-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Protocol Active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
              <Globe className="h-3 w-3 opacity-40" />
              Node ID: <span className="text-foreground italic">{service.id.slice(0, 16)}...</span>
            </p>
            <div className="h-4 w-px bg-border/40" />
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
              <Server className="h-3 w-3 opacity-40" />
              Status: <span className="text-emerald-500 italic">Synchronized</span>
            </p>
          </div>
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
            ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-emerald-500/10"
            : "bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/10"
        )}
      >
        <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none rotate-12 scale-150">
          <Layers className="h-96 w-96 text-foreground" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <div className={cn(
                 "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner",
                 service.vipChannelId ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"
               )}>
                  <Lock className="h-5 w-5" />
               </div>
               <h4 className={cn("text-[12px] font-black uppercase tracking-[0.4em]", service.vipChannelId ? "text-emerald-500" : "text-amber-500")}>
                  Signal Gateway Handshake
               </h4>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Telegram Target Node ID</Label>
                <div className="flex-1 bg-muted/20 px-8 py-6 rounded-[1.5rem] border border-border/40 font-mono text-sm tracking-widest text-primary flex items-center gap-4 shadow-inner group transition-all hover:bg-muted/30">
                  <Terminal className="h-4 w-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                  {service.vipChannelId?.toString() || "AWAITING_PROTOCOL_LINK"}
                </div>
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase leading-relaxed tracking-widest opacity-60">
                Deployment Tip: Grant the bot administrative privileges in your channel to authorize signal broadcasting.
              </p>
            </div>
          </div>

          <div className={cn(
              "p-12 rounded-[3rem] border flex items-center justify-between backdrop-blur-md group transition-all duration-500",
              service.vipChannelId ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted/30 border-border/40"
          )}>
            <div className="flex items-center gap-8">
              <div className={cn(
                "h-24 w-24 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 duration-500",
                service.vipChannelId ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
              )}>
                {service.vipChannelId ? <ShieldCheck className="h-12 w-12" /> : <ShieldAlert className="h-12 w-12" />}
              </div>
              <div className="space-y-2">
                <p className={cn("text-2xl font-black uppercase italic tracking-tighter leading-none", service.vipChannelId ? "text-emerald-500" : "text-muted-foreground")}>
                  {service.vipChannelId ? "Link Verified" : "Offline"}
                </p>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-60">
                  {service.vipChannelId ? "Gateway Broadcasting Live" : "Handshake Protocol Failed"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 opacity-10 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>

      {/* --- PRICING ARCHITECTURE --- */}
      <div className="space-y-12">
        <div className="flex items-center justify-between border-b border-border/40 pb-8">
          <div className="flex items-center gap-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-[16px] font-black uppercase tracking-[0.4em] text-foreground">
              Pricing <span className="text-primary">Nodes</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-40 italic">System Total</span>
            <Badge variant="secondary" className="rounded-md font-black italic">{service.tiers.length}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {service.tiers.length === 0 ? (
            <div className="col-span-full py-48 text-center border border-dashed border-border/40 rounded-[4rem] bg-muted/5 backdrop-blur-sm group hover:border-primary/20 transition-all duration-700">
              <Trophy className="h-16 w-16 text-muted-foreground/20 mx-auto mb-8 transition-transform group-hover:scale-110" />
              <p className="text-xl font-black uppercase italic text-muted-foreground tracking-tighter">
                Zero Active Pricing Nodes
              </p>
              <p className="text-[10px] font-black uppercase text-muted-foreground/40 mt-4 tracking-[0.3em]">
                Initialize a pricing node to authorize user onboarding.
              </p>
            </div>
          ) : (
            service.tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  "relative group rounded-[4rem] border bg-card/40 p-12 backdrop-blur-3xl transition-all duration-700 hover:shadow-3xl hover:-translate-y-4",
                  tier.isActive
                    ? "border-border/60 hover:border-primary/40"
                    : "border-dashed border-border/40 opacity-40 grayscale"
                )}
              >
                <div className="absolute top-12 right-12">
                   <Badge variant="outline" className={cn(
                     "rounded-lg text-[9px] font-black uppercase tracking-widest px-4 py-2 border shadow-sm",
                     tier.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
                   )}>
                     {tier.isActive ? "NODE_STABLE" : "PROTOCOL_PAUSED"}
                   </Badge>
                </div>

                <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-inner mb-14 transition-transform group-hover:rotate-6">
                  <Layers className="h-10 w-10 text-primary" />
                </div>

                <div className="space-y-2 mb-14">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary italic">
                    {tier.interval} RECURRING NODE
                  </p>
                  <h3 className="text-5xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-none">
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 mb-16">
                  <span className="text-7xl font-black tracking-tighter italic text-foreground">
                    ${Number(tier.price).toFixed(2)}
                  </span>
                  <span className="text-[14px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">
                    USD
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-12 border-t border-border/20">
                  <Button className="w-full rounded-[1.75rem] font-black uppercase italic text-[12px] tracking-widest h-18 bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.03] transition-all active:scale-95">
                    <Settings2 className="h-4 w-4 mr-2" /> Modify Node
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 h-16 transition-all"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Terminate Node
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