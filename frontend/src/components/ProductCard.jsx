import { motion } from "framer-motion";
import { Heart, ShoppingCart, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getAssetUrl } from "../lib/api";
import { formatCurrency } from "../lib/format";
import RatingStars from "./RatingStars";

function ProductCard({ product }) {
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
      className="group overflow-hidden rounded-[28px] border border-white/60 bg-white/90 shadow-soft backdrop-blur"
    >
      <div className="relative">
        <Link to={`/products/${product._id}`} className="block overflow-hidden bg-slate-100">
          <img
            src={getAssetUrl(product.images?.[0])}
            alt={product.name}
            className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
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

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            <span>{product.brand}</span>
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
          </div>
          <Link
            to={`/products/${product._id}`}
            className="block min-h-[3.5rem] font-display text-xl font-bold text-ink transition hover:text-coral"
          >
            {product.name}
          </Link>
          <p className="text-sm leading-6 text-slate-600">{product.shortDescription || product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-ink">
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
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-coral disabled:cursor-not-allowed disabled:bg-slate-300"
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
