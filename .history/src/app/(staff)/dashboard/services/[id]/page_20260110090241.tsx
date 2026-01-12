import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import Link from "next/link";
import { AddTierModal } from "@/src/components/dashboard/add-tier-modal";
import { Label } from "@/src/components/ui/label";
import { cn } from "@/src/lib/utils";

/**
 * 🛠️ ENHANCED SERVICE CONFIGURATION ENGINE
 * Purpose: Direct control over service pricing, security, and Telegram node linkage.
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
    <div className="space-y-12 p-4 sm:p-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      {/* --- IMMERSIVE HEADER --- */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-12">
        <div className="space-y-2">
          <Link
            href="/dashboard/services"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all mb-6"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Services Ledger
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
              {service.name}
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="h-4 w-4 text-primary fill-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Node Active
              </span>
            </div>
          </div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-4">
            Type: {service.categoryTag || "General Signal"} • UUID:{" "}
            <span className="text-foreground">{service.id.slice(0, 12)}</span>
          </p>
        </div>

        {/* ✅ Dynamic Tier Deployment Trigger */}
        <div className="flex gap-4">
          <AddTierModal serviceId={service.id} />
        </div>
      </div>

      {/* --- TELEGRAM VIP INTEGRATION LEDGER (DYNAMIZED) --- */}
      <div
        className={cn(
          "rounded-[3rem] p-8 md:p-12 border transition-all duration-500 relative overflow-hidden",
          service.vipChannelId
            ? "bg-emerald-500/5 border-emerald-500/20"
            : "bg-amber-500/5 border-amber-500/20"
        )}
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          {service.vipChannelId ? (
            <ShieldCheck className="h-64 w-64" />
          ) : (
            <ShieldAlert className="h-64 w-64" />
          )}
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h4
              className={cn(
                "text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2",
                service.vipChannelId ? "text-emerald-500" : "text-amber-500"
              )}
            >
              <Lock className="h-3 w-3" />
              {service.vipChannelId
                ? "Connection Encrypted"
                : "Connection Pending"}
            </h4>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase opacity-60">
                Target Telegram Node ID
              </Label>
              <div className="flex items-center gap-3">
                <div className="bg-card px-6 py-4 rounded-2xl border border-border/40 shadow-inner font-mono text-sm tracking-tight text-primary flex items-center gap-3">
                  <Terminal className="h-4 w-4 opacity-40" />
                  {service.vipChannelId?.toString() || "UNASSIGNED_PROTOCOL"}
                </div>
                {!service.vipChannelId && (
                  <Badge className="bg-amber-500 text-[8px] font-black uppercase animate-bounce">
                    Required
                  </Badge>
                )}
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed max-w-sm">
                Automation will trigger invites to this ID upon successful
                payment verification.
              </p>
            </div>
          </div>

          <div
            className={cn(
              "p-8 rounded-[2.5rem] border flex items-center gap-6 backdrop-blur-sm",
              service.vipChannelId
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-muted/40 border-border/40"
            )}
          >
            <div
              className={cn(
                "h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg",
                service.vipChannelId
                  ? "bg-emerald-500/20 text-emerald-500"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <p
                className={cn(
                  "text-sm font-black uppercase italic tracking-widest",
                  service.vipChannelId
                    ? "text-emerald-500"
                    : "text-muted-foreground"
                )}
              >
                {service.vipChannelId ? "Signal Verified" : "System Offline"}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                {service.vipChannelId
                  ? "Handshake protocol completed."
                  : "Verify Bot Admin rights."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- PRICING TIERS ARCHITECTURE --- */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-foreground">
            Pricing Nodes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {service.tiers.length === 0 ? (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-border/40 rounded-[3.5rem] bg-muted/5 backdrop-blur-sm">
              <Trophy className="h-12 w-12 text-muted-foreground/20 mx-auto mb-6" />
              <p className="text-sm font-black uppercase italic text-muted-foreground tracking-widest">
                No Active Revenue Tiers
              </p>
              <p className="text-[10px] font-bold uppercase text-muted-foreground/50 mt-3 tracking-widest">
                Initialize a tier to begin user onboarding
              </p>
            </div>
          ) : (
            service.tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  "relative group rounded-[3.5rem] border bg-card/40 p-10 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
                  tier.isActive
                    ? "border-border/60"
                    : "border-dashed border-border/40 opacity-50 grayscale"
                )}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <span
                    className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      tier.isActive
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {tier.isActive ? "● Active Node" : "○ Paused"}
                  </span>
                </div>

                <div className="space-y-1 mb-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {tier.type || "STANDARD"} ACCESS
                  </p>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2 mb-12 border-b border-border/40 pb-10">
                  <span className="text-5xl font-black tracking-tighter italic text-foreground">
                    ${Number(tier.price).toFixed(2)}
                  </span>
                  <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                    / {tier.interval.toLowerCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Button className="w-full rounded-2xl font-black uppercase text-[10px] tracking-widest h-16 bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5">
                    <Settings2 className="h-4 w-4 mr-2" /> Modify Tier
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full rounded-2xl font-black uppercase text-[10px] text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 h-14 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Deactivate Node
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
