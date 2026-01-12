import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      {/* 🌐 Global Marketing Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center font-black italic text-primary-foreground group-hover:rotate-6 transition-transform">Z</div>
            <span className="text-xl font-black uppercase italic tracking-tighter">Zipha<span className="text-primary">.</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Docs'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                {item}
              </Link>
            ))}
            <Button asChild variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px] border-border/50">
              <Link href="/dashboard/login">Merchant Login</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* 🏁 Simple Marketing Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            © 2026 Zipha Protocol • High-Resiliency Signal Automation
          </p>
        </div>
      </footer>
    </div>
  );
}