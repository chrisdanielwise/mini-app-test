"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Terminal,
  ChevronRight,
  Download,
  ShieldCheck,
  UserPlus,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { hapticFeedback } from "@/lib/telegram/webapp";

interface Subscriber {
  id: string;
  telegramName: string;
  telegramId: string;
  plan: string;
  status: "ACTIVE" | "EXPIRED" | "PENDING";
  joinedAt: string;
  revenue: string;
}

/**
 * 🏛️ SUBSCRIBER LEDGER (Apex Tier)
 * Normalized: World-standard fluid typography and responsive grid constraints.
 * Optimized: Adaptive Safe-Zones for high-resiliency mobile auditing.
 */
export function SubscriberTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const subscribers: Subscriber[] = [
    {
      id: "1",
      telegramName: "Alex_FX",
      telegramId: "7482910",
      plan: "PRO_SIGNAL",
      status: "ACTIVE",
      joinedAt: "2026-01-05",
      revenue: "$149.00",
    },
    {
      id: "2",
      telegramName: "Sam_Signals",
      telegramId: "9283741",
      plan: "STARTER_NODE",
      status: "EXPIRED",
      joinedAt: "2025-12-20",
      revenue: "$49.00",
    },
    {
      id: "3",
      telegramName: "CryptoWhale",
      telegramId: "1029384",
      plan: "ELITE_ACCESS",
      status: "ACTIVE",
      joinedAt: "2026-01-08",
      revenue: "$1,200.00",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-w-0">
      
      {/* --- COMMAND UTILITY BAR --- */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-center justify-between bg-card/40 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-border/40 backdrop-blur-3xl shadow-xl">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="FILTER BY IDENTITY..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl bg-muted/10 border-border/40 font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] focus:ring-primary/20 transition-all placeholder:opacity-30"
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={() => hapticFeedback("light")}
            className="flex-1 lg:flex-none h-12 md:h-14 px-4 md:px-8 rounded-xl md:rounded-2xl border-border/40 bg-muted/5 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-muted/20 active:scale-95 transition-all"
          >
            <Filter className="mr-2 h-3.5 w-3.5" /> Filter
          </Button>
          <Button 
            onClick={() => hapticFeedback("medium")}
            className="flex-1 lg:flex-none h-12 md:h-14 px-4 md:px-8 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-2xl shadow-primary/20 bg-primary text-primary-foreground active:scale-95 transition-all"
          >
            <Download className="mr-2 h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* --- DATA GRID NODE --- */}
      <div className="rounded-2xl md:rounded-[3rem] border border-border/40 bg-card/30 overflow-hidden backdrop-blur-3xl shadow-2xl relative">
        
        {/* DESKTOP PROTOCOL (Row Based) */}
        <div className="hidden md:block overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-muted/30 border-b border-border/10">
              <tr>
                {[
                  "Subscriber Node",
                  "Protocol Type",
                  "Identity ID",
                  "Status",
                  "LTV Flow",
                  "",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 md:px-10 py-6 md:py-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {subscribers.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-primary/[0.03] transition-all group cursor-default"
                >
                  <td className="px-6 md:px-10 py-6 md:py-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black italic shadow-inner">
                        {sub.telegramName[0]}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <span className="text-xs md:text-sm font-black uppercase italic tracking-tighter block leading-none truncate">
                          {sub.telegramName}
                        </span>
                        <div className="flex items-center gap-1.5 opacity-40">
                          <UserPlus className="h-2.5 w-2.5" />
                          <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest">
                            {sub.joinedAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3 w-3 text-primary opacity-40 shrink-0" />
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground italic truncate">
                        {sub.plan}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8 font-mono text-[9px] md:text-[10px] font-black tracking-widest opacity-40">
                    {sub.telegramId}
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8">
                    <Badge
                      className={cn(
                        "rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] px-2 md:px-3 py-1 border shadow-sm",
                        sub.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}
                    >
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8 font-black italic text-sm md:text-base tracking-tighter whitespace-nowrap">
                    {sub.revenue}
                  </td>
                  <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                    <button 
                      onClick={() => hapticFeedback("light")}
                      className="p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground active:scale-90"
                    >
                      <MoreHorizontal className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE PROTOCOL (Card Based) */}
        <div className="md:hidden p-4 space-y-4">
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              onClick={() => hapticFeedback("selection")}
              className="p-5 rounded-2xl md:rounded-[2.5rem] bg-muted/10 border border-border/10 space-y-4 hover:bg-muted/20 active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black italic shadow-inner">
                    {sub.telegramName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black uppercase italic tracking-tighter leading-none truncate">
                      {sub.telegramName}
                    </p>
                    <p className="text-[8px] font-black text-primary uppercase tracking-widest mt-1.5 opacity-60 italic truncate">
                      {sub.plan}
                    </p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    "rounded-lg text-[7px] font-black uppercase tracking-widest px-2 py-0.5 border shadow-sm",
                    sub.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  )}
                >
                  {sub.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border/10">
                <div className="space-y-1">
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">
                    ID
                  </p>
                  <p className="text-[9px] font-mono font-black tracking-widest truncate">
                    {sub.telegramId}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">
                    Flow
                  </p>
                  <p className="text-xs font-black italic tracking-tighter">
                    {sub.revenue}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full h-10 rounded-xl text-[8px] font-black uppercase tracking-widest border border-border/10 hover:bg-primary/5 hover:text-primary transition-all"
              >
                Inspect Node <ChevronRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* Tactical Footer Watermark */}
        <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-primary/5 rounded-full blur-3xl opacity-20 pointer-events-none" />
      </div>
    </div>
  );
}