import { Star } from "lucide-react";

function RatingStars({ value = 0, count, size = 16 }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={star <= Math.round(value) ? "fill-gold text-gold" : "text-slate-300"}
          />
        ))}
      </div>
      {count !== undefined ? <span className="text-xs text-slate-500">({count})</span> : null}
    </div>
  );
}

export default RatingStars;
