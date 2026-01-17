"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowDownLeft, 
  Fingerprint,
  RefreshCcw,
  Search,
  ShieldCheck,
  Globe,
  Terminal,
  Lock,
  Waves,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🏛️ Institutional Contexts
import { useDeviceContext } from "@/components/providers/device-provider";
// import { useInstitutionalAuth } from "@lib/hooks/use-institutional-auth";
// import { useInstitutionalFetch } from "@lib/hooks/use-institutional-fetch";
import { useHaptics } from "@/lib/hooks/use-haptics";

// 🛠️ Atomic Components
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: "SUCCESS" | "FAILED" | "REJECTED" | "PENDING" | "REFUNDED" | "COMPLETED";
  gatewayProvider: string;
  createdAt: string;
  service: { name: string; };
  merchant: { companyName?: string; };
}

/**
 * 🌊 FINANCIAL LEDGER TERMINAL (Apex v16.16.29)
 * Priority: Full DeviceState Integration (xs -> xxl, isPortrait, viewportWidth).
 * Logic: morphology-aware filtering with Hardware-Fluid Interpolation.
 */
export default function HistoryPage() {
  const { isAuthenticated, isLocked, user } = useInstitutionalAuth();
  const { impact } = useHaptics();
  
  // 🛰️ DEVICE INGRESS: Consuming the full interface physics
  const { 
    screenSize, 
    isMobile, 
    isTablet, 
    isDesktop, 
    isPortrait, 
    safeArea, 
    viewportWidth,
    isReady 
  } = useDeviceContext();

  const [searchQuery, setSearchQuery] = useState("");

  // 🛰️ DATA INGRESS: Standardized Audit Sync
  const { data, loading, error } = useInstitutionalFetch<{ payments: Payment[] }>(
    isAuthenticated ? "/api/user/payments" : null
  );

  const payments = useMemo(() => 
    data?.payments?.filter(p => 
      p.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [],
  [data, searchQuery]);

  // 🛡️ HYDRATION & AUTH GUARD
  if (!isReady || isLocked) return <LoadingScreen message="SYNCING_AUDIT_LEDGER..." />;
  if (!isAuthenticated) return <IdentityNullFallback />;

  const getStatusConfig = (status: Payment["status"]) => {
    const isPositive = status === "SUCCESS" || status === "COMPLETED";
    const isNegative = status === "FAILED" || status === "REJECTED";
    
    return {
      icon: isPositive ? <CheckCircle className="size-3.5" /> : isNegative ? <XCircle className="size-3.5" /> : <RefreshCcw className="size-3.5 animate-spin-slow" />,
      color: isPositive ? "text-emerald-500" : isNegative ? "text-rose-500" : "text-amber-500",
      bg: isPositive ? "bg-emerald-500/10" : isNegative ? "bg-rose-500/10" : "bg-amber-500/10",
      glow: isPositive ? "shadow-emerald-500/10" : ""
    };
  };

  return (
    <div className="flex flex-col min-h-[var(--tg-viewport-h)] animate-in fade-in duration-1000 max-w-5xl mx-auto">
      
      {/* 🌊 FLUID HEADER: safeArea.top accountancy */}
      <header 
        className="sticky top-0 z-50 glass-module rounded-b-[2.5rem] md:rounded-b-[3.5rem] px-6 transition-all duration-700"
        style={{ paddingTop: `calc(${safeArea.top}px + 1rem)`, paddingBottom: "1.5rem" }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 opacity-30 italic">
              <Fingerprint className="size-3.5 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Audit_Ledger_v16</span>
            </div>
            <h1 className="text-[var(--fluid-h2)] font-black uppercase italic tracking-tighter leading-none">
              Financial <span className="opacity-30">Nodes</span>
            </h1>
          </div>
          
          {/* SEARCH TRIGGER: Morphing width based on screenSize */}
          <div className={cn(
            "relative group transition-all duration-700",
            isMobile ? "w-12" : "w-64"
          )}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-20" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isMobile ? "" : "FILTER_HASH..."}
              className={cn(
                "h-12 bg-black/20 border border-white/5 rounded-xl font-mono text-[10px] uppercase tracking-widest outline-none focus:border-primary/40 transition-all",
                isMobile ? "w-12 pl-0 text-center" : "w-full pl-12 pr-4"
              )}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 pb-40">
        {loading ? (
          <div className="space-y-6"><SkeletonList count={5} /></div>
        ) : error ? (
          <SyncErrorState />
        ) : payments.length > 0 ? (
          <div className={cn(
            "grid gap-6",
            (isDesktop || (isTablet && !isPortrait)) ? "grid-cols-2" : "grid-cols-1"
          )}>
            {payments.map((payment, idx) => {
              const config = getStatusConfig(payment.status);
              return (
                <div 
                  key={payment.id} 
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className={cn(
                    "group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-card/40 p-6 md:p-8 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:border-primary/20 hover:shadow-apex animate-in fade-in slide-in-from-bottom-4",
                    config.glow
                  )}
                >
                  {/* 🌊 KINETIC WATERMARK: Scales with viewportWidth */}
                  <ArrowDownLeft 
                    className="absolute -bottom-6 -right-6 opacity-[0.02] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000" 
                    style={{ width: `${Math.max(100, viewportWidth * 0.1)}px`, height: `${Math.max(100, viewportWidth * 0.1)}px` }}
                  />

                  <div className="flex items-start justify-between relative z-10 gap-6">
                    <div className="flex items-center gap-5 min-w-0">
                      <div className={cn(
                        "size-12 md:size-14 shrink-0 rounded-2xl border flex items-center justify-center shadow-inner transition-transform group-hover:rotate-6",
                        config.bg, config.color, "border-white/5"
                      )}>
                        {config.icon}
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <h3 className="text-base md:text-xl font-black uppercase italic tracking-tighter leading-none truncate">{payment.service.name}</h3>
                        <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] leading-none">
                          {screenSize === 'xs' ? `ID_${payment.id.slice(-6)}` : `NODE_${payment.id.toUpperCase()}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2 shrink-0">
                      <p className="text-xl md:text-2xl font-black italic tracking-tighter leading-none tabular-nums text-foreground">
                        ${parseFloat(payment.amount).toFixed(2)}
                      </p>
                      <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-none", config.bg, config.color)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-30 italic">
                       <Clock className="size-3" />
                       <span className="text-[9px] font-bold uppercase tracking-widest">
                         {new Date(payment.createdAt).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                       </span>
                    </div>
                    <div className="flex items-center gap-4 opacity-10">
                      <Activity className="size-3 animate-pulse" />
                      <span className="text-[8px] font-black uppercase tracking-[0.3em]">Ledger_Sync_V16</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyLedgerState />
        )}
      </main>

      {/* 🌊 FOOTER: Safe-area accountancy */}
      <footer className="flex flex-col items-center gap-4 py-12 mt-auto opacity-20 italic relative overflow-hidden">
         <Globe className="size-5" />
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-center px-10">
           Audit_Core // Synchronized Node: {user?.id?.slice(0, 12)}
         </p>
         <Waves className="absolute bottom-0 w-full h-10 opacity-10 pointer-events-none" />
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTS: Morphology accountancy ---

function IdentityNullFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80dvh] px-8 text-center animate-in fade-in zoom-in duration-1000">
      <div className="relative mb-10 group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative h-24 w-24 rounded-[2.5rem] bg-card border border-white/10 flex items-center justify-center shadow-apex">
          <Lock className="h-10 w-10 text-primary" />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Identity <span className="text-primary/60">Locked</span></h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] leading-relaxed max-w-[280px] mx-auto opacity-40 italic">
          CRITICAL: Authorization required to access encrypted financial telemetry.
        </p>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-12 h-14 px-10 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-apex"
      >
        Initiate_Resync
      </button>
    </div>
  );
}

function SyncErrorState() {
  return (
    <div className="rounded-[3rem] border-2 border-dashed border-rose-500/20 bg-rose-500/5 p-16 text-center space-y-6 shadow-inner animate-in zoom-in-95 duration-700">
      <ShieldCheck className="mx-auto h-12 w-12 text-rose-500 opacity-20 animate-pulse" />
      <p className="text-xs font-black uppercase italic tracking-[0.4em] text-rose-500">Sync_Protocol_Failure</p>
    </div>
  );
}

function EmptyLedgerState() {
  return (
    <div className="mt-12 rounded-[3.5rem] border border-dashed border-white/5 bg-white/[0.02] p-24 text-center relative overflow-hidden shadow-inner">
      <Terminal className="mx-auto mb-8 size-16 text-primary opacity-5 animate-pulse" />
      <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground/40 leading-none">Zero_Ingress_Detected</h3>
      <Waves className="absolute bottom-0 w-full h-12 opacity-5" />
    </div>
  );
}