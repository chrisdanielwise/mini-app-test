import React from "react";

/**
 * Clean, fast loading state for the Dashboard.
 * We remove the CSS/Font imports to prevent "Module not found" errors.
 */
export default function DashboardLoading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4">
      {/* A simple, CSS-based spinner that doesn't rely on external assets */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      
      <div className="flex flex-col items-center space-y-1">
        <h2 className="text-sm font-black uppercase italic tracking-widest text-primary">
          Initializing Link
        </h2>
        <p className="text-[10px] font-medium uppercase text-muted-foreground animate-pulse">
          Establishing Secure Connection to Neon...
        </p>
      </div>
    </div>
  );
}