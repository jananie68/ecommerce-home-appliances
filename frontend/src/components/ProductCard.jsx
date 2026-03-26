import { motion } from "framer-motion";
import { Heart, ShoppingCart, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getAssetUrl } from "../lib/api";
import { formatCurrency } from "../lib/format";
import RatingStars from "./RatingStars";

function ProductCard({ product, compact = false }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, user } = useAuth();
  const isWishlisted = user?.wishlist?.includes(product._id);

  async function handleWishlist() {
    if (!user) {
      toast("Please login to save items to your wishlist.");
      navigate("/auth");
      return;
    }

    try {
      await toggleWishlist(product._id);
      toast.success(isWishlisted ? "Removed from wishlist." : "Saved to wishlist.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update your wishlist.");
    }
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className={`group overflow-hidden border border-white/60 bg-white/90 shadow-soft backdrop-blur ${
        compact ? "rounded-[24px]" : "rounded-[28px]"
      }`}
    >
      <div className="relative">
        <Link to={`/products/${product._id}`} className="block overflow-hidden bg-slate-100">
          <img
            src={getAssetUrl(product.images?.[0])}
            alt={product.name}
            className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
              compact ? "h-52" : "h-60"
            }`}
          />
        </Link>
        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute right-4 top-4 rounded-full border p-2.5 backdrop-blur ${
            isWishlisted
              ? "border-coral/20 bg-coral text-white"
              : "border-white/80 bg-white/80 text-slate-700"
          }`}
        >
          <Heart size={16} className={isWishlisted ? "fill-white" : ""} />
        </button>
        {product.isFeatured ? (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">
            <Sparkles size={12} />
            Featured
          </span>
        ) : null}
      </div>

      <div className={compact ? "space-y-3 p-4" : "space-y-4 p-5"}>
        <div className={compact ? "space-y-1.5" : "space-y-2"}>
          <div
            className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 ${
              compact ? "justify-start" : "justify-between"
            }`}
          >
            <span>{product.brand}</span>
            {!compact ? (
              <span
                className={`rounded-full px-2.5 py-1 tracking-normal ${
                  product.stockQuantity > 5
                    ? "bg-emerald-50 text-emerald-700"
                    : product.stockQuantity > 0
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700"
                }`}
              >
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
              </span>
            ) : null}
          </div>
          <Link
            to={`/products/${product._id}`}
            className={`block font-display font-bold text-ink transition hover:text-coral ${
              compact ? "min-h-[3rem] text-lg" : "min-h-[3.5rem] text-xl"
            }`}
          >
            {product.name}
          </Link>
          {!compact ? (
            <p className="text-sm leading-6 text-slate-600">{product.shortDescription || product.description}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`font-extrabold text-ink ${compact ? "text-lg" : "text-xl"}`}>
                {formatCurrency(product.discountPrice || product.price)}
              </span>
              {product.discountPrice ? (
                <span className="text-sm text-slate-400 line-through">{formatCurrency(product.price)}</span>
              ) : null}
            </div>
            <RatingStars value={product.ratingAverage} count={product.ratingCount} />
          </div>

          <button
            type="button"
            disabled={product.stockQuantity <= 0}
            onClick={() => addToCart(product)}
            className={`inline-flex items-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-coral disabled:cursor-not-allowed disabled:bg-slate-300 ${
              compact ? "px-3.5 py-2.5" : "px-4 py-3"
            }`}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
