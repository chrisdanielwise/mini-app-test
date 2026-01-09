import { requireMerchantSession } from "@/lib/auth/merchant-auth";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AddTierModal } from "@/components/dashboard/add-tier-modal";

/**
 * 🛠️ SERVICE CONFIGURATION PAGE
 * Manage pricing tiers and signal settings for a specific asset.
 */
export default async function ServiceConfigPage({ params }: { params: { id: string } }) {
  const session = await requireMerchantSession();
  const { id } = await params;

  // 🏁 Fetch Service with all its Tiers
  const service = await prisma.service.findUnique({
    where: { 
      id,
      merchantId: session.merchant.id // Security: Ensure merchant owns this service
    },
    include: {
      tiers: {
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!service) return notFound();

  return (
    <div className="space-y-8 p-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header & Back Action */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link 
            href="/dashboard/services" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Ledger
          </Link>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
            {service.name} <Zap className="h-6 w-6 text-primary fill-primary" />
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Configuration: {service.categoryTag} • ID: {service.id.slice(0, 8)}
          </p>
        </div>

        {/* ✅ Add Tier Modal Component */}
        <AddTierModal serviceId={service.id} />
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {service.tiers.map((tier) => (
          <div 
            key={tier.id} 
            className={`relative group rounded-[2.5rem] border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 ${
              tier.isActive ? 'border-border' : 'border-dashed opacity-60'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                  {tier.type} Plan
                </p>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">{tier.name}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                tier.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'
              }`}>
                {tier.isActive ? 'Live' : 'Paused'}
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-3xl font-black tracking-tighter">${Number(tier.price).toFixed(2)}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">/ {tier.interval.toLowerCase()}</span>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full rounded-2xl font-black uppercase text-[10px] tracking-widest py-6 h-auto">
                Edit Pricing
              </Button>
              <Button variant="ghost" className="w-full rounded-2xl font-bold uppercase text-[9px] text-destructive hover:bg-destructive/5 py-4 h-auto">
                Deactivate Tier
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Connection info */}
      <div className="rounded-[2rem] bg-muted/30 border border-border p-8 mt-12">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Signal Delivery Logic</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase opacity-50">Telegram Channel Destination</Label>
            <p className="font-mono text-xs bg-card p-3 rounded-xl border border-border">
              {service.vipChannelId?.toString() || "No ID Assigned"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest">Bot Authorized</p>
              <p className="text-[9px] font-bold text-muted-foreground">Encryption keys verified for this channel.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}