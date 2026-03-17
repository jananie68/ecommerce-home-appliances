import React from "react";

function LoadingSkeleton({ cards = 8 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-3xl border border-white/70 bg-white/90 p-4 shadow-soft">
          <div className="h-48 rounded-2xl bg-brand-primary/10" />
          <div className="mt-4 h-4 w-24 rounded bg-brand-secondary/10" />
          <div className="mt-3 h-5 w-3/4 rounded bg-brand-primary/10" />
          <div className="mt-2 h-4 w-full rounded bg-brand-secondary/10" />
          <div className="mt-6 h-10 rounded-2xl bg-brand-accent/20" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
