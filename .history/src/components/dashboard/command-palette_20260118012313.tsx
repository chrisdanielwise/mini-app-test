/**
 * 🛰️ COMMAND_PALETTE (Refined v16.16.30)
 * Strategy: Vertical Compression & Kinetic Search.
 * Fix: Added hardware Close (X) button for mobile-first accessibility.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { flavor } = useLayout();
  const { impact, selectionChange } = useHaptics();
  const { isReady, isMobile, safeArea } = useDeviceContext();
  
  const isStaffTheme = flavor === "AMBER";

  // ... [useEffect Logic remains identical] ...

  return (
    <div className={cn(
      "fixed inset-0 z-[300] flex items-start justify-center p-4",
      isMobile ? "p-0" : "pt-[12vh]"
    )}>
      {/* ... [Backdrop remains identical] ... */}

      <div className={cn(
        "relative overflow-hidden border shadow-2xl transition-all duration-500",
        "bg-zinc-950/95 backdrop-blur-3xl animate-in zoom-in-95 slide-in-from-top-2",
        isStaffTheme ? "border-amber-500/20" : "border-white/5",
        isMobile ? "w-full h-full rounded-none" : "w-full max-w-lg rounded-2xl"
      )}>
        {/* 🚀 MOBILE_CLOSE_PROTOCOL */}
        {isMobile && (
          <button 
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-50 p-2 opacity-30 active:opacity-100"
            style={{ marginTop: `${safeArea.top}px` }}
          >
            <X className="size-4" />
          </button>
        )}

        {/* --- SEARCH INGRESS: Tactical h-12 --- */}
        <div 
          className="flex items-center px-4 h-12 border-b border-white/5 gap-3 relative z-10"
          style={{ marginTop: isMobile ? `${safeArea.top}px` : "0px" }}
        >
          <Search className={cn("size-3.5 opacity-30", isStaffTheme ? "text-amber-500" : "text-primary")} />
          <input
            autoFocus
            placeholder="INDEX_SEARCH..."
            className="flex-1 bg-transparent border-none outline-none text-[11px] font-black uppercase italic tracking-widest placeholder:opacity-10 text-foreground"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              selectionChange();
            }}
          />
        </div>

        {/* --- RESULT STREAM --- */}
        <div className={cn(
          "overflow-y-auto custom-scrollbar relative z-10 scrollbar-hide",
          isMobile ? "h-[calc(100vh-140px)]" : "max-h-[320px]"
        )}>
          {/* ... [Result mapping remains identical] ... */}
        </div>
      </div>
    </div>
  );
}