"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  UserMinus, 
  ExternalLink,
  ShieldCheck,
  Clock
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

export function SubscriberTable() {
  const [searchTerm, setSearchTerm] = useState("");

  // Placeholder data - In production, this comes from prisma.subscription.findMany()
  const subscribers: Subscriber[] = [
    { id: "1", telegramName: "Alex_FX", telegramId: "7482910", plan: "Professional", status: "ACTIVE", joinedAt: "2026-01-05", revenue: "$149.00" },
    { id: "2", telegramName: "Sam_Signals", telegramId: "9283741", plan: "Starter", status: "EXPIRED", joinedAt: "2025-12-20", revenue: "$49.00" },
    { id: "3", telegramName: "CryptoWhale", telegramId: "1029384", plan: "Elite", status: "ACTIVE", joinedAt: "2026-01-08", revenue: "$1,200.00" },
  ];

  return (
    <div className="space-y-6">
      {/* --- UTILITY BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/40 p-4 rounded-3xl border border-border/40 backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Telegram ID or Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 rounded-2xl bg-background/50 border-border/40 font-bold text-xs uppercase tracking-widest focus-visible:ring-primary"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-12 rounded-2xl border-border/40 bg-background/50 text-[10px] font-black uppercase tracking-widest">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="flex-1 md:flex-none h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
            Export Ledger
          </Button>
        </div>
      </div>

      {/* --- DATA NODE: TABLE (Desktop) / CARDS (Mobile) --- */}
      <div className="rounded-[2.5rem] border border-border/40 bg-card/20 overflow-hidden backdrop-blur-xl">
        {/* DESKTOP VIEW */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/30 border-b border-border/40">
              <tr>
                {["Subscriber", "Protocol", "Identity ID", "Status", "LTV", ""].map((header) => (
                  <th key={header} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black italic">
                        {sub.telegramName[0]}
                      </div>
                      <span className="text-sm font-black uppercase italic tracking-tight">{sub.telegramName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">
                    {sub.plan}
                  </td>
                  <td className="px-8 py-6 font-mono text-[10px] opacity-60">
                    {sub.telegramId}
                  </td>
                  <td className="px-8 py-6">
                    <Badge className={cn(
                      "rounded-lg text-[9px] font-black uppercase tracking-widest px-3 py-1",
                      sub.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 font-black italic text-sm">
                    {sub.revenue}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW (Transformed into Cards) */}
        <div className="lg:hidden p-6 space-y-4">
          {subscribers.map((sub) => (
            <div key={sub.id} className="p-6 rounded-3xl bg-muted/20 border border-border/40 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black italic text-sm">
                    {sub.telegramName[0]}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase italic tracking-tight">{sub.telegramName}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{sub.plan}</p>
                  </div>
                </div>
                <Badge className={cn(
                  "rounded-lg text-[8px] font-black uppercase px-2 py-0.5",
                  sub.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                )}>
                  {sub.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border/40">
                <div className="space-y-1">
                   <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Identity ID</p>
                   <p className="text-[10px] font-mono">{sub.telegramId}</p>
                </div>
                <div className="text-right space-y-1">
                   <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50">LTV</p>
                   <p className="text-xs font-black italic">{sub.revenue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}