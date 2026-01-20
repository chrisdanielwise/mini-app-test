
function NavCard({ href, label, icon: Icon, active, isStaff }: any) {
  const { impact } = useHaptics();
  return (
    <Link 
      href={href} 
      onClick={() => impact("medium")}
      className={cn(
        "group relative flex flex-col items-center gap-2.5 rounded-xl md:rounded-2xl border p-5 transition-all shadow-lg active:scale-95",
        active ? "bg-zinc-950/40 border-white/5" : "bg-white/[0.01] border-white/5 opacity-30 grayscale pointer-events-none"
      )}
    >
      <div className={cn(
        "size-9 md:size-10 flex items-center justify-center rounded-lg border shadow-inner transition-all",
        isStaff ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-primary/5 text-primary border-primary/10"
      )}>
        <Icon className="size-4.5" />
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest opacity-20">{label}</span>
    </Link>
  );
}

function EmptyState({ isMerchant }: { isMerchant: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/5 bg-zinc-950/20 p-12 text-center shadow-inner leading-none">
      <Sparkles className="mb-4 size-10 text-primary opacity-5 animate-pulse" />
      <h3 className="text-sm font-black text-foreground/20 uppercase tracking-widest italic">
        Vault_Idle
      </h3>
      {!isMerchant && (
        <Link href="/services" className="w-full mt-6">
          <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-black uppercase italic tracking-widest text-[9px] shadow-lg">Sync_Market</Button>
        </Link>
      )}
    </div>
  );
}

function IdentityNullFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background leading-none">
      <div className="rounded-2xl bg-zinc-950/60 border border-rose-500/10 p-8 shadow-2xl text-center space-y-6 max-w-sm">
        <div className="size-14 bg-rose-500/10 rounded-xl flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
          <Lock className="size-6 text-rose-500 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-foreground">Identity_Null</h1>
          <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-widest italic">
            Handshake required. Re-anchor node.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full h-11 rounded-xl bg-rose-500 text-white font-black uppercase italic tracking-widest text-[9px] shadow-lg">Initiate_Re-Sync</Button>
      </div>
    </div>
  );
}