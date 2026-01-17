
export function DashboardHeader({ title, subtitle }: { title: string; subtitle: string; }) {
  const { flavor } = useLayout();
  const isStaff = flavor === "AMBER";

  return (
    <div className="flex flex-col gap-1.5 mb-6 animate-in fade-in slide-in-from-left-2 duration-500 min-w-0">
      <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-foreground truncate">
        {(title || "").split(" ").map((word, i) => (
          <React.Fragment key={i}>
            <span className={cn(i === 1 && (isStaff ? "text-amber-500" : "text-primary"))}>
              {word}
            </span>{" "}
          </React.Fragment>
        ))}
      </h1>
      <div className="flex items-center gap-3">
        <div className={cn("h-[0.5px] w-8", isStaff ? "bg-amber-500/20" : "bg-primary/20")} />
        <p className="text-[7.5px] text-muted-foreground/30 font-black uppercase tracking-[0.3em] italic leading-none whitespace-nowrap">
          {subtitle || "STATUS_OPTIMAL"}
        </p>
      </div>
    </div>
  );
}