import { requireStaff } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Zap,
  ShieldCheck,
  Trophy,
  Settings2,
  Lock,
  Terminal,
  ShieldAlert,
  Activity,
  Globe,
  Layers,
  ChevronRight,
  Server,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { AddTierModal } from "@/components/dashboard/add-tier-modal";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 🛰️ SERVICE CONFIGURATION ENGINE (Institutional v9.4.4)
 * Fix: Dynamic RBAC Filter prevents crash for Super Admins (null merchantId).
 * Fix: Amber accent injection for Platform Staff oversight mode.
 */
export default async function ServiceConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireStaff();
  const { id } = await params;
  
  // 🛡️ IDENTITY PROTOCOLS
  const { role } = session.user;
  const realMerchantId = session.merchantId;
  const isPlatformStaff = ["super_admin", "platform_manager", "platform_support"].includes(role);

  // 🏁 1. Fetch Service Protocol with Security Bypass for Staff
  // Logic: If Staff, findUnique by ID only. If Merchant, enforce ownership check.
  const service = await prisma.service.findUnique({
    where: {
      id,
      ...(realMerchantId ? { merchantId: realMerchantId } : {}),
    },
    include: {
      merchant: { select: { companyName: true } }, // Audit visibility for staff
      tiers: {
        orderBy: { price: "asc" },
      },
    },
  });

  if (!service) return notFound();

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 px-4 text-foreground">
      
      {/* --- COMMAND HEADER: MODE AWARE --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border/40 pb-6">
        <div className="space-y-2 flex-1 min-w-0">
          <Link
            href="/dashboard/services"
            className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Cluster Ledger
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight uppercase italic leading-none truncate">
              {service.name}
            </h1>
            <Badge className={cn(
              "rounded-lg text-[9px] font-black tracking-widest px-2 py-0.5 border-none",
              isPlatformStaff ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
            )}>
              <Zap className={cn("h-2.5 w-2.5 mr-1 animate-pulse", isPlatformStaff ? "fill-amber-500" : "fill-primary")} />
              {isPlatformStaff ? "ROOT_OVERSIGHT" : "ACTIVE_PROTO"}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 opacity-40">
            {isPlatformStaff && (
              <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-amber-500">
                <Building2 className="h-3 w-3" />
                Origin: <span className="italic">{service.merchant.companyName}</span>
              </p>
            )}
            <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Globe className="h-3 w-3" />
              Node: <span className="italic uppercase">{service.id.slice(0, 12)}</span>
            </p>
            <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Server className="h-3 w-3" />
              Status: <span className="text-emerald-500 italic uppercase">Sync_Ok</span>
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <AddTierModal
            serviceId={service.id}
            merchantId={service.merchantId}
          />
        </div>
      </div>

      {/* --- TELEGRAM HANDSHAKE MODULE --- */}
      <div
        className={cn(
          "rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 border transition-all duration-500 relative overflow-hidden shadow-xl backdrop-blur-3xl",
          service.vipChannelId
            ? "bg-emerald-500/[0.02] border-emerald-500/20 shadow-emerald-500/5"
            : "bg-amber-500/[0.02] border-amber-500/20 shadow-amber-500/5"
        )}
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center border",
                  service.vipChannelId
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}
              >
                <Lock className="h-4 w-4" />
              </div>
              <h4
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em]",
                  service.vipChannelId ? "text-emerald-500" : "text-amber-500"
                )}
              >
                Gateway Handshake
              </h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                  Target Telegram Node
                </Label>
                <div className="bg-muted/10 px-6 py-4 rounded-xl border border-border/40 font-mono text-xs tracking-wider text-primary flex items-center gap-3 shadow-inner group transition-all">
                  <Terminal className="h-3.5 w-3.5 opacity-20 group-hover:opacity-100" />
                  {service.vipChannelId?.toString() || "AWAITING_LINK_SIGNAL..."}
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "p-6 md:p-8 rounded-2xl border flex items-center justify-between backdrop-blur-md group transition-all",
              service.vipChannelId
                ? "bg-emerald-500/5 border-emerald-500/10"
                : "bg-muted/20 border-border/40"
            )}
          >
            <div className="flex items-center gap-5">
              <div
                className={cn(
                  "h-14 w-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xl",
                  service.vipChannelId
                    ? "bg-emerald-500 text-white shadow-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {service.vipChannelId ? (
                  <ShieldCheck className="h-8 w-8" />
                ) : (
                  <ShieldAlert className="h-8 w-8" />
                )}
              </div>
              <div className="space-y-1">
                <p
                  className={cn(
                    "text-xl font-black uppercase italic tracking-tight leading-none",
                    service.vipChannelId
                      ? "text-emerald-500"
                      : "text-muted-foreground"
                  )}
                >
                  {service.vipChannelId ? "Node Verified" : "Offline"}
                </p>
                <p className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest opacity-40">
                  {service.vipChannelId
                    ? "Broadcast Path Established"
                    : "Handshake Required"}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 opacity-10 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* --- PRICING ARCHITECTURE --- */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <Activity className={cn("h-4 w-4", isPlatformStaff ? "text-amber-500" : "text-primary")} />
            <h2 className="text-[14px] font-black uppercase tracking-widest">
              Pricing <span className={cn(isPlatformStaff ? "text-amber-500" : "text-primary")}>Nodes</span>
            </h2>
          </div>
          <Badge
            variant="secondary"
            className="rounded-lg font-black italic text-[10px] px-3"
          >
            {service.tiers.length} UNITS
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {service.tiers.length === 0 ? (
            <div className="col-span-full py-24 text-center border border-dashed border-border/40 rounded-3xl bg-muted/5 opacity-40">
              <Trophy className="h-10 w-10 mx-auto mb-4" />
              <p className="text-sm font-black uppercase italic tracking-tight">
                Zero Active Nodes
              </p>
            </div>
          ) : (
            service.tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  "relative group rounded-[2rem] border bg-card/40 p-8 md:p-10 transition-all duration-500 hover:shadow-2xl",
                  isPlatformStaff ? "hover:border-amber-500/40" : "hover:border-primary/40",
                  !tier.isActive && "opacity-40 grayscale"
                )}
              >
                <div className="absolute top-10 right-10">
                  <Badge
                    variant="outline"
                    className="rounded-lg text-[8px] font-black uppercase tracking-tighter px-2 py-1 bg-background border-border/40"
                  >
                    {tier.isActive ? "STABLE" : "PAUSED"}
                  </Badge>
                </div>

                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center mb-10 border shadow-inner",
                  isPlatformStaff ? "bg-amber-500/10 border-amber-500/20" : "bg-primary/10 border-primary/20"
                )}>
                  <Layers className={cn("h-6 w-6", isPlatformStaff ? "text-amber-500" : "text-primary")} />
                </div>

                <div className="space-y-1 mb-8">
                  <p className={cn("text-[9px] font-black uppercase tracking-widest italic", isPlatformStaff ? "text-amber-500/60" : "text-primary/60")}>
                    {tier.interval} RECURRING
                  </p>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors truncate">
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-5xl font-black tracking-tighter italic tabular-nums">
                    ${Number(tier.price).toFixed(2)}
                  </span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-30 italic">
                    USD
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-8 border-t border-border/10">
                  <Button className={cn(
                    "w-full rounded-xl font-black uppercase italic text-[10px] tracking-widest h-12 shadow-lg transition-all active:scale-95",
                    isPlatformStaff ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-primary text-primary-foreground hover:scale-[1.02]"
                  )}>
                    <Settings2 className="h-3.5 w-3.5 mr-1.5" /> Modify Node
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 opacity-20 py-10">
        <Terminal className="h-3 w-3" />
        <p className="text-[8px] font-black uppercase tracking-[0.4em] italic text-center">
          Handshake Sync: Optimal // Node_ID: {service.id.toUpperCase()}
        </p>
      </div>
    </div>
  );
}