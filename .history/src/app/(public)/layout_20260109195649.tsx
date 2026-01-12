import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, LayoutDashboard, Globe } from "lucide-react";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30 antialiased">
      {/* 🌐 NAV PROTOCOL */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl transition-all">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-black italic text-primary-foreground group-hover:rotate-6 transition-transform shadow-lg shadow-primary/20">
              Z
            </div>
            <span className="text-xl font-black uppercase italic tracking-tighter">
              Zipha<span className="text-primary">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {['Protocol', 'Pricing', 'Infrastructure'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
            <div className="h-4 w-px bg-border/50" />
            <Button asChild variant="ghost" className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6">
              <Link href="/dashboard/login">Sign In</Link>
            </Button>
            <Button asChild className="rounded-xl font-black uppercase tracking-widest text-[10px] h-11 px-6 shadow-xl shadow-primary/10">
              <Link href="/register">Deploy Node</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* 🏁 SYSTEM FOOTER */}
      <footer className="border-t border-border/40 py-24 bg-muted/20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-4 opacity-50">
              <Zap className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Zipha Protocol v2.0</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground max-w-xs uppercase leading-tight">
              The high-resiliency automation engine for the signal economy.
            </p>
          </div>
          <div className="flex justify-start md:justify-end gap-12">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase text-foreground">Compliance</p>
              <Link href="/terms" className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase">Terms</Link>
              <Link href="/privacy" className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase">Privacy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase text-foreground">Status</p>
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-emerald-500" />
                 <span className="text-[10px] font-bold text-muted-foreground uppercase">All Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}