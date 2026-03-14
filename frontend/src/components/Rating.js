import React from "react";

function Rating({ value = 0, count = 0, compact = false }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? "text-sm" : ""}`}>
      <div className="flex text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>{value >= star ? "★" : "☆"}</span>
        ))}
      </div>
      <span className="text-slate-500">{value.toFixed(1)}{count ? ` (${count})` : ""}</span>
    </div>
  );
}

export default Rating;
