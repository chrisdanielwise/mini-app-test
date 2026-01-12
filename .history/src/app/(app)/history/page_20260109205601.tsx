"use client";

import { useApi } from "@/src/lib/hooks/use-api";
import { useTelegramContext } from "@/src/components/telegram/telegram-provider";
import { LoadingScreen } from "@/src/components/ui/loading-spinner";
import { SkeletonList } from "@/src/components/ui/skeleton-card";
import { Badge } from "@/src/components/ui/badge";
import { Receipt, CheckCircle, XCircle, Clock, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: "SUCCESS" | "FAILED" | "REJECTED" | "PENDING" | "REFUNDED" | "COMPLETED"; // Added COMPLETED from our webhook logic
  gatewayProvider: string;
  createdAt: string;
  service: {
    name: string;
  };
  merchant: {
    companyName?: string;
  };
}

export default function HistoryPage() {
  const { auth, isReady } = useTelegramContext();

  const { data, isLoading, error } = useApi<{ payments: Payment[] }>(
    auth.isAuthenticated ? "/api/user/payments" : null
  );

  if (!isReady || auth.isLoading) {
    return <LoadingScreen message="Decrypting Ledger..." />;
  }

  const payments = data?.payments || [];

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "SUCCESS":
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "FAILED":
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-rose-500" />;
      case "REFUNDED":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: Payment["status"]) => {
    const variants: Record<Payment["status"], string> = {
      SUCCESS: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
      COMPLETED: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
      FAILED: "bg-rose-500/15 text-rose-500 border-rose-500/20",
      REJECTED: "bg-rose-500/15 text-rose-500 border-rose-500/20",
      PENDING: "bg-amber-500/15 text-amber-500 border-amber-500/20",
      REFUNDED: "bg-blue-500/15 text-blue-500 border-blue-500/20",
    };

    return (
      <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md", variants[status])}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen space-y-6 animate-in fade-in duration-700">
      {/* High-Density Header */}
      <header className="sticky top-0 z-20 space-y-1 bg-background/80 p-6 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3 w-3 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
            Financial Audit
          </span>
        </div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Ledger <span className="text-muted-foreground opacity-50">History</span>
        </h1>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-24">
        {isLoading ? (
          <SkeletonList count={6} />
        ) : error ? (
          <div className="rounded-[2rem] border border-dashed border-destructive/30 bg-destructive/5 p-10 text-center">
            <XCircle className="mx-auto mb-4 h-10 w-10 text-destructive opacity-40" />
            <p className="text-[10px] font-black uppercase tracking-widest text-destructive">
              Protocol Error: Could not sync ledger data
            </p>
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="group relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/50 p-6 transition-all active:scale-[0.98] hover:border-primary/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/30 border border-border/50 shadow-inner">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase italic tracking-tight text-foreground">
                        {payment.service.name}
                      </h3>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        {payment.merchant.companyName || "Service Provider"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <p className="text-lg font-black italic tracking-tighter">
                      {new Intl.NumberFormat(undefined, {
                        style: 'currency',
                        currency: payment.currency
                      }).format(parseFloat(payment.amount))}
                    </p>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 opacity-30">
                   <Clock className="h-3 w-3" />
                   <span className="text-[8px] font-black uppercase tracking-widest">
                     {new Date(payment.createdAt).toLocaleString(undefined, {
                       month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                     })}
                   </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[3rem] border border-dashed border-border/60 bg-card/30 p-16 text-center backdrop-blur-sm">
            <Receipt className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-black uppercase italic tracking-tighter">Empty Ledger</h3>
            <p className="mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto">
              Deployment records will manifest here upon successful subscription.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}