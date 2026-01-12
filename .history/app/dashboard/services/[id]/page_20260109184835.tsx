import { requireMerchantSession } from "@/src/lib/auth/merchant-auth";
import prisma from "@/src/lib/db";
import { notFound } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { 
  ArrowLeft, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  Clock, 
  Settings2,
  Trash2,
  Lock
} from "lucide-react";
import Link from "next/link";
import { AddTierModal } from "@/src/components/dashboard/add-tier-modal";
import { Label } from "@/src/components/ui/label";

/**
 * 🛠️ SERVICE CONFIGURATION ENGINE
 * Features: Dynamic Tier Management, Channel Verification, and Immersive UI.
 */
export default async function ServiceConfigPage({ params }: { params: { id: string } }) {
  const session = await requireMerchantSession();
  const { id } = await params;

  // 🏁 1. Fetch Service with full Pricing Tier ledger
  const service = await prisma.service.findUnique({
    where: { 
      id,
      merchantId: session.merchant.id // Security: Context-locked to merchant UUID
    },
    include: {
      tiers: {
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!service) return notFound();

  return (
    <div className="space-y-12 p-4 sm:p-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- IMMERSIVE HEADER & OVERLAP PROTECTION --- */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border pb-10">
        <div className="space-y-1">
          <Link 
            href="/dashboard/services" 
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mb-4"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> 
            Back to Services Ledger
          </Link>
          <div className="flex items-center gap-3">
             <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              {service.name}
            </h1>
            <Zap className="h-8 w-8 text-primary fill-primary animate-pulse" />
          </div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Deployment Type: {service.categoryTag} • Node: {service.id.slice(0, 8)}
          </p>
        </div>

        {/* ✅ Dynamic Tier Deployment Modal */}
        <AddTierModal serviceId={service.id} />
      </div>

      {/* --- PRICING TIERS ARCHITECTURE --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {service.tiers.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-muted/5">
            <Trophy className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-xs font-black uppercase italic text-muted-foreground">No Pricing Tiers Deployed</p>
            <p className="text-[9px] font-bold uppercase text-muted-foreground mt-2 opacity-50">Add a tier to start accepting payments</p>
          </div>
        ) : (
          service.tiers.map((tier) => (
            <div 
              key={tier.id} 
              className={`relative group rounded-[3rem] border bg-card p-10 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2 ${
                tier.isActive ? 'border-border' : 'border-dashed opacity-50 grayscale'
              }`}
            >
              {/* Tier Status Badge */}
              <div className="flex justify-between items-start mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                   <Clock className="h-6 w-6 text-primary" />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  tier.isActive 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : 'bg-muted text-muted-foreground border-border'
                }`}>
                  {tier.isActive ? '● Live' : '○ Paused'}
                </span>
              </div>

              <div className="space-y-1 mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-70">
                  {tier.type} Access Plan
                </p>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                  {tier.name}
                </h3>
              </div>

              <div className="flex items-baseline gap-2 mb-10 border-b border-border/50 pb-8">
                <span className="text-4xl font-black tracking-tighter">${Number(tier.price).toFixed(2)}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  / {tier.interval}
                </span>
              </div>

              {/* Action Suite */}
              <div className="grid grid-cols-1 gap-3">
                <Button className="w-full rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5">
                  <Settings2 className="h-3.5 w-3.5 mr-2" /> Modify Tier
                </Button>
                <Button variant="ghost" className="w-full rounded-2xl font-black uppercase text-[9px] text-destructive/60 hover:text-destructive hover:bg-destructive/5 h-12 transition-colors">
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Deactivate
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- TELEGRAM VIP INTEGRATION LEDGER --- */}
      <div className="rounded-[3rem] bg-muted/10 border border-border p-10 mt-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
          <ShieldCheck className="h-40 w-40" />
        </div>
        
        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-2">
          <Lock className="h-3 w-3" /> Connection Security
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase opacity-60 ml-1">Target Telegram Channel ID</Label>
            <div className="bg-card p-4 rounded-2xl border border-border shadow-inner font-mono text-sm tracking-tight text-primary">
              {service.vipChannelId?.toString() || "NULL // UNASSIGNED"}
            </div>
            <p className="text-[9px] font-bold text-muted-foreground uppercase ml-1">
              Signals will be dispatched exclusively to this node.
            </p>
          </div>

          <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
            <div className="h-16 w-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[12px] font-black uppercase tracking-widest text-emerald-600 italic">Auth Verified</p>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase">
                Bot permission confirmed. <br />Node communication is encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}