"use client";

import { useState, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { useApi } from "@/lib/hooks/use-api";
import { useTelegramContext } from "@/components/telegram/telegram-provider";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { ServiceCard } from "@/components/app/service-card";
import { SkeletonList } from "@/components/ui/skeleton-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Package,
  ShieldCheck,
  Zap,
  Globe,
  Terminal,
  Lock,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isUUID } from "@/lib/utils/validators";

// --- INTERFACES ---
interface Service {
  id: string;
  name: string;
  description?: string;
  currency: string;
  categoryTag?: string;
  tiers: Array<{
    id: string;
    name: string;
    price: string;
    interval: string;
    type: string;
  }>;
}

interface MerchantData {
  merchant: {
    id: string;
    companyName?: string;
    botUsername?: string;
  };
  services: Service[];
}

/**
 * 🛰️ APEX DISCOVERY CORE
 * Logic: Synchronized with Universal Identity Protocol. Supports Staff Oversight.
 */
function ServicesTerminalContent() {
  const { auth, isReady, user: tgUser } = useTelegramContext();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const urlMerchantId = searchParams.get("merchant");
  // Priority: URL Param -> Token Payload -> Context State
  const targetMerchantId = urlMerchantId || auth.user?.merchantId || tgUser?.merchantId;

  // 🛡️ DATA AUDIT: Fetch only if identity is verified and ID is valid
  const { data, isLoading, error } = useApi<MerchantData>(
    auth.isAuthenticated && targetMerchantId && isUUID(targetMerchantId)
      ? `/api/merchant/${targetMerchantId}/services`
      : null
  );

  // 1. SYSTEM INITIALIZATION
  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Establishing Identity Link..." />;
  }

  // 2. CRYPTOGRAPHIC GATE: Block unverified sessions
  if (!auth.isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center p-6 bg-background animate-in fade-in duration-500">
        <div className="rounded-[2.5rem] bg-card border border-rose-500/10 p-10 shadow-2xl text-center space-y-5 max-w-xs relative overflow-hidden">
          <div className="absolute inset-0 bg-rose-500/5 blur-3xl -z-10" />
          <Lock className="h-12 w-12 text-rose-500 mx-auto opacity-30" />
          <div className="space-y-1">
            <h1 className="text-xl font-black uppercase italic tracking-tighter">Handshake Failed</h1>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed opacity-60">
              Identity signature invalid. Please re-verify via official Bot terminal.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full h-11 rounded-xl bg-muted/10 border border-border/10 text-[9px] font-black uppercase tracking-widest"
          >
            Initiate Resync
          </button>
        </div>
      </div>
    );
  }

  const isStaff = auth.user?.role && ["super_admin", "platform_manager"].includes(auth.user.role);

  const filteredServices = data?.services?.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-6 md:space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      
      {/* --- HUD HEADER: ROLE AWARE --- */}
      <header className="px-5 py-8 md:p-10 md:pt-14 bg-card/40 border-b border-border/40 backdrop-blur-3xl rounded-b-[2.5rem] md:rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className={cn(
          "absolute -top-10 -right-10 h-32 w-32 md:h-40 md:w-40 blur-[80px] rounded-full pointer-events-none",
          isStaff ? "bg-amber-500/10" : "bg-primary/5"
        )} />
        
        <div className="relative z-10 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isStaff ? "bg-amber-500" : "bg-primary")} />
              <span className={cn("text-[10px] font-black uppercase tracking-[0.4em]", isStaff ? "text-amber-500" : "text-primary")}>
                {isStaff ? "Universal Oversight" : "Cluster Ingress"}
              </span>
            </div>
            {isStaff && (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-black text-[7px] tracking-widest">
                STAFF_ACCESS
              </Badge>
            )}
          </div>

          <div className="space-y-1 md:space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none truncate pr-8">
              {data?.merchant?.companyName || "Syncing Mesh..."}
            </h1>
            <div className="flex items-center gap-3 opacity-40 italic">
              <Globe className={cn("h-3 w-3", isStaff && "text-amber-500")} />
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">
                Node_ID: {targetMerchantId?.slice(0, 16) || "PENDING"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 space-y-8 md:space-y-10">
        {/* --- SEARCH PROTOCOL --- */}
        <div className="relative group px-1">
          <Search className={cn(
            "absolute left-5 md:left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors z-10",
            isStaff ? "group-focus-within:text-amber-500" : "group-focus-within:text-primary"
          )} />
          <Input
            type="search"
            placeholder="FILTER SIGNAL NODES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "pl-12 md:pl-14 h-14 md:h-16 rounded-xl md:rounded-2xl bg-card/60 border-border/40 font-black uppercase italic text-xs tracking-tighter shadow-inner transition-all active:scale-[0.99]",
              isStaff ? "focus-visible:ring-amber-500/50" : "focus-visible:ring-primary/50"
            )}
          />
        </div>

        {/* --- SERVICE MESH LAYER --- */}
        <section className="space-y-6 md:space-y-8">
          <div className="flex items-center justify-between px-2 opacity-30 italic">
            <div className="flex items-center gap-2">
              <Terminal className={cn("h-3 w-3", isStaff && "text-amber-500")} />
              <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">
                {isStaff ? "Platform Cluster Audit" : "Available Assets"}
              </h2>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">
              {filteredServices?.length || 0} Nodes Live
            </span>
          </div>

          {isLoading ? (
            <SkeletonList count={3} />
          ) : error || (!targetMerchantId && !isLoading) ? (
            <div className="rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-rose-500/20 bg-rose-500/5 p-12 md:p-16 text-center space-y-4 shadow-inner">
              <ShieldCheck className="mx-auto h-10 w-10 md:h-12 md:w-12 text-rose-500 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">
                {!targetMerchantId
                  ? "Identity Context Missing"
                  : "Protocol Error: Cluster Sync Failed"}
              </p>
            </div>
          ) : filteredServices && filteredServices.length > 0 ? (
            <div className="space-y-6 md:space-y-8">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  {...service}
                  merchantId={targetMerchantId!}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2.5rem] md:rounded-[4rem] border border-dashed border-border/40 bg-card/20 p-16 md:p-20 text-center shadow-inner relative overflow-hidden">
              <Package className="mx-auto mb-4 md:mb-6 h-12 w-12 md:h-16 md:w-16 text-primary opacity-10" />
              <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none opacity-40">
                Zero Signal Nodes
              </h3>
              <p className="mt-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-20">
                Broadcast Cluster empty.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/**
 * 🛡️ SUSPENSE BOUNDARY
 */
export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Initializing Mesh..." />}>
      <ServicesTerminalContent />
    </Suspense>
  );
}