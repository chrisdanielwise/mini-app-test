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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
 * 🏛️ SUBSCRIBER LEDGER (Tier 2)
 * High-resiliency data node for auditing the active user base.
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* --- COMMAND UTILITY BAR --- */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between bg-card/40 p-6 rounded-[2rem] border border-border/40 backdrop-blur-2xl shadow-xl">
        <div className="relative w-full xl:w-[450px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="FILTER BY IDENTITY ID OR NAME..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 rounded-2xl bg-muted/10 border-border/40 font-black text-[10px] uppercase tracking-[0.2em] focus:ring-primary/20 transition-all placeholder:opacity-30"
          />
        </div>
        <div className="flex gap-3 w-full xl:w-auto">
          <Button
            variant="outline"
            className="flex-1 xl:flex-none h-14 px-8 rounded-2xl border-border/40 bg-muted/5 text-[10px] font-black uppercase tracking-[0.15em] hover:bg-muted/20"
          >
            <Filter className="mr-2 h-4 w-4" /> Filter Node
          </Button>
          <Button className="flex-1 xl:flex-none h-14 px-8 rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] shadow-2xl shadow-primary/20 bg-primary text-primary-foreground">
            <Download className="mr-2 h-4 w-4" /> Export Ledger
          </Button>
        </div>
      </div>

      {/* --- DATA GRID NODE --- */}
      <div className="rounded-[3rem] border border-border/40 bg-card/30 overflow-hidden backdrop-blur-3xl shadow-2xl">
        {/* DESKTOP PROTOCOL */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-border/40">
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
                    className="px-10 py-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {subscribers.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-primary/[0.03] transition-all group cursor-default"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black italic shadow-inner">
                        {sub.telegramName[0]}
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-black uppercase italic tracking-tighter block leading-none">
                          {sub.telegramName}
                        </span>
                        <div className="flex items-center gap-1.5 opacity-40">
                          <UserPlus className="h-2.5 w-2.5" />
                          <span className="text-[8px] font-bold uppercase tracking-widest">
                            Joined: {sub.joinedAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3 w-3 text-primary opacity-40" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                        {sub.plan}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 font-mono text-[10px] font-black tracking-widest opacity-40">
                    {sub.telegramId}
                  </td>
                  <td className="px-10 py-8">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-lg text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 border shadow-sm",
                        sub.status === "ACTIVE"
                          ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10"
                          : "bg-rose-500/5 text-rose-500 border-rose-500/20 shadow-rose-500/10"
                      )}
                    >
                      {sub.status === "ACTIVE" && (
                        <ShieldCheck className="mr-1.5 h-3 w-3" />
                      )}
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="px-10 py-8 font-black italic text-base tracking-tighter">
                    {sub.revenue}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 rounded-xl hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground border border-transparent hover:border-border/40">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE PROTOCOL */}
        <div className="lg:hidden p-8 space-y-6">
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              className="p-8 rounded-[2.5rem] bg-muted/10 border border-border/40 space-y-6 hover:bg-muted/20 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black italic text-lg shadow-inner">
                    {sub.telegramName[0]}
                  </div>
                  <div>
                    <p className="text-base font-black uppercase italic tracking-tighter leading-none">
                      {sub.telegramName}
                    </p>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-2 opacity-60 italic">
                      {sub.plan}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-lg text-[9px] font-black uppercase tracking-widest px-3 py-1 border shadow-sm",
                    sub.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  )}
                >
                  {sub.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/40">
                <div className="space-y-1.5">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">
                    Identity ID
                  </p>
                  <p className="text-[11px] font-mono font-black tracking-widest">
                    {sub.telegramId}
                  </p>
                </div>
                <div className="text-right space-y-1.5">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">
                    LTV Flow
                  </p>
                  <p className="text-sm font-black italic tracking-tighter">
                    {sub.revenue}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full h-12 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-border/40"
              >
                Inspect Node <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
