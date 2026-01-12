import { StatsCardSkeleton } from "@/src/components/dashboard/stats-card";
import { Search, Filter, Download, UserPlus } from "lucide-react";

export default function SubscribersLoading() {
  return (
    <div className="space-y-12 p-6 sm:p-10 pb-40 animate-pulse max-w-7xl mx-auto">
      
      {/* --- HEADER SKELETON --- */}
      <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3 opacity-20">
            <div className="h-8 w-8 rounded-lg bg-muted" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
          <div className="h-16 w-64 bg-muted rounded-3xl" />
          <div className="h-3 w-48 bg-muted/50 rounded mt-6" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-14 w-full sm:w-80 rounded-2xl bg-muted/20" />
          <div className="h-14 w-32 rounded-2xl bg-muted/20" />
          <div className="h-14 w-40 rounded-2xl bg-muted/20" />
        </div>
      </div>

      {/* --- LEDGER TABLE SKELETON --- */}
      <div className="rounded-[3.5rem] border border-border/40 bg-card/20 overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="bg-muted/30 border-b border-border/40 h-24 w-full" />
        <div className="divide-y divide-border/40">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-10 py-10 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-muted/40" />
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-muted/60 rounded-lg" />
                  <div className="h-3 w-24 bg-muted/20 rounded-md" />
                </div>
              </div>
              <div className="h-8 w-32 bg-muted/30 rounded-2xl hidden md:block" />
              <div className="h-10 w-24 bg-muted/20 rounded-2xl hidden lg:block" />
              <div className="h-12 w-12 bg-muted/40 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}