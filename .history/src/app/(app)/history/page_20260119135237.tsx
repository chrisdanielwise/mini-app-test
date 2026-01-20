
// --- SUB-COMPONENTS: Tactical Scaling ---

function IdentityNullFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center animate-in fade-in duration-700 leading-none">
      <div className="relative mb-6">
        <div className="size-16 rounded-xl bg-zinc-950/60 border border-white/10 flex items-center justify-center shadow-2xl">
          <Lock className="size-7 text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">Identity <span className="text-primary/60">Locked</span></h2>
        <p className="text-[8px] font-black text-muted-foreground/20 uppercase tracking-[0.2em] max-w-[220px] italic">
          Authorization required for financial telemetry egress.
        </p>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-8 h-10 px-8 bg-primary text-primary-foreground rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
      >
        Initiate_Resync
      </button>
    </div>
  );
}

function SyncErrorState() {
  return (
    <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-12 text-center space-y-3 shadow-inner">
      <Terminal className="mx-auto size-8 text-rose-500 opacity-20 animate-pulse" />
      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-rose-500">Sync_Protocol_Failure</p>
    </div>
  );
}

function EmptyLedgerState() {
  return (
    <div className="mt-8 rounded-2xl border border-white/5 bg-zinc-950/40 p-16 text-center relative overflow-hidden">
      <h3 className="text-base font-black uppercase italic tracking-tighter text-foreground/10">Zero_Ingress_Detected</h3>
    </div>
  );
}