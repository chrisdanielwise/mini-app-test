import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30 antialiased">
      {/* 🌐 Global Public Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
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
            {['Features', 'Pricing', 'Docs'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                {item}
              </Link>
            ))}
            <div className="h-4 w-px bg-border/50" />
            <Button asChild variant="ghost" className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10">
              <Link href="/dashboard/login">Sign In</Link>
            </Button>
            <Button asChild className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10 shadow-lg shadow-primary/10">
              <Link href="/register">Start Node</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 py-20 bg-muted/20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-8 opacity-20">
            <Zap className="h-6 w-6" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
            ZIPHA PROTOCOL © 2026 • AUTOMATION FOR ELITE MERCHANTS
          </p>
        </div>
      </footer>
    </div>
  );
}