import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useStore } from "../context/StoreContext";
import { getImageUrl } from "../utils/image";

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const inWishlist = wishlist.some((item) => item._id === product._id);

  return (
    <article className="themed-card group relative overflow-hidden p-4">
      {product.discountPercentage > 0 && (
        <span className="absolute left-4 top-4 rounded-full bg-brand-accent px-3 py-1 text-xs font-bold text-white shadow-soft">
          {product.discountPercentage}% OFF
        </span>
      )}

      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute right-4 top-4 rounded-full px-3 py-2 text-sm ${
          inWishlist ? "bg-brand-primary/10 text-brand-primary" : "bg-white/90 text-slate-500 shadow-soft"
        }`}
      >
        {inWishlist ? "Saved" : "Wish"}
      </button>

      <Link to={`/product/${product._id}`} className="block">
        <div className="flex h-56 items-center justify-center rounded-[24px] bg-brand-gradient-soft p-6">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="max-h-full object-contain transition duration-300 group-hover:scale-110"
          />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-secondary">{product.category}</p>
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{product.shortDescription || product.description}</p>
      </Link>

      <div className="mt-4">
        <Rating value={product.rating || 0} count={product.numReviews || 0} compact />
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-brand-primary">Rs. {product.price}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm text-slate-400 line-through">Rs. {product.originalPrice}</p>
          )}
        </div>
        <button
          onClick={() => addToCart(product)}
          className="gradient-btn px-4 py-2 text-sm"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
