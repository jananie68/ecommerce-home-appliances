import { useEffect, useState } from "react";
import { Bot, Heart, ShoppingCart, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api, getAssetUrl } from "../lib/api";
import { formatDate, formatCurrency } from "../lib/format";
import RatingStars from "../components/RatingStars";

function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${productId}`)
      .then((response) => {
        setProduct(response.data.product);
        setSelectedImage(response.data.product.images?.[0] || "");
      })
      .catch(() => {
        toast.error("Product not found.");
        navigate("/products");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, productId]);

  if (loading) {
    return (
      <div className="section-shell py-16">
        <div className="rounded-[36px] bg-white p-12 text-center text-sm font-semibold text-slate-500 shadow-soft">
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isWishlisted = user?.wishlist?.includes(product._id);

  async function handleWishlist() {
    if (!user) {
      toast("Please login to use wishlist.");
      navigate("/auth");
      return;
    }

    try {
      await toggleWishlist(product._id);
      toast.success(isWishlisted ? "Removed from wishlist." : "Saved to wishlist.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update wishlist.");
    }
  }

  async function handleAssistant(event) {
    event.preventDefault();

    if (!assistantPrompt.trim()) {
      return;
    }

    setAssistantLoading(true);

    try {
      const response = await api.post("/chatbot", {
        question: assistantPrompt,
        currentProductId: product._id
      });
      setAssistantReply(response.data.answer);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not get AI advice.");
    } finally {
      setAssistantLoading(false);
    }
  }

  async function handleReview(event) {
    event.preventDefault();

    if (!user) {
      toast("Please login to submit a review.");
      navigate("/auth");
      return;
    }

    try {
      const response = await api.post(`/products/${product._id}/reviews`, reviewForm);
      setProduct(response.data.product);
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Review submitted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not submit review.");
    }
  }

  return (
    <div className="section-shell py-12">
      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5 rounded-[36px] bg-white p-6 shadow-soft">
          <div className="overflow-hidden rounded-[30px] bg-slate-100">
            <img src={getAssetUrl(selectedImage)} alt={product.name} className="h-[28rem] w-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {product.images?.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`overflow-hidden rounded-[22px] border ${
                  selectedImage === image ? "border-coral" : "border-slate-200"
                }`}
              >
                <img src={getAssetUrl(image)} alt={product.name} className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[36px] bg-white p-8 shadow-soft">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              <span>{product.brand}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 tracking-normal text-slate-600">
                {product.category}
              </span>
              {product.isFeatured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 tracking-normal text-ink">
                  <Sparkles size={12} />
                  Featured
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 font-display text-4xl font-bold text-ink">{product.name}</h1>
            <p className="mt-4 text-base leading-8 text-slate-600">{product.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-4xl font-black text-ink">{formatCurrency(product.discountPrice || product.price)}</span>
              {product.discountPrice ? (
                <span className="text-lg text-slate-400 line-through">{formatCurrency(product.price)}</span>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <RatingStars value={product.ratingAverage} count={product.ratingCount} size={18} />
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                {product.stockQuantity > 0 ? `${product.stockQuantity} units ready` : "Out of stock"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                Warranty: {product.warranty}
              </span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={product.stockQuantity <= 0}
                onClick={() => addToCart(product)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-5 py-4 text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <ShoppingCart size={16} />
                Add to cart
              </button>
              <button
                type="button"
                onClick={handleWishlist}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-4 text-sm font-bold text-slate-700"
              >
                <Heart size={16} className={isWishlisted ? "fill-coral text-coral" : ""} />
                {isWishlisted ? "Saved in wishlist" : "Save to wishlist"}
              </button>
            </div>
          </div>

          <div className="rounded-[36px] bg-white p-8 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">Specifications</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {product.specifications?.map((spec) => (
                <div key={spec.label} className="rounded-[24px] bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{spec.label}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[36px] bg-white p-8 shadow-soft">
          <div className="flex items-center gap-3">
            <Bot className="text-coral" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">Ask AI about this product</p>
              <h2 className="font-display text-3xl font-bold text-ink">Need a quick recommendation?</h2>
            </div>
          </div>

          <form onSubmit={handleAssistant} className="mt-6 space-y-4">
            <textarea
              value={assistantPrompt}
              onChange={(event) => setAssistantPrompt(event.target.value)}
              rows={4}
              className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm"
              placeholder='Try "Tell me about this refrigerator" or "Is this good for a family of 4?"'
            />
            <button type="submit" className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">
              {assistantLoading ? "Thinking..." : "Ask assistant"}
            </button>
          </form>

          {assistantReply ? (
            <div className="mt-6 rounded-[24px] bg-slate-50 p-5 text-sm leading-7 text-slate-700">{assistantReply}</div>
          ) : null}
        </div>

        <div className="rounded-[36px] bg-white p-8 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">Ratings and reviews</p>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink">What customers are saying</h2>

          <div className="mt-6 space-y-5">
            {product.reviews?.length ? (
              product.reviews.map((review) => (
                <div key={review._id || review.user} className="rounded-[24px] bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{review.name}</p>
                      <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                    </div>
                    <RatingStars value={review.rating} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">Be the first to leave a review for this product.</p>
            )}
          </div>

          <form onSubmit={handleReview} className="mt-6 space-y-4 rounded-[24px] border border-slate-200 p-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} Star
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Review</label>
              <textarea
                value={reviewForm.comment}
                onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                placeholder="Share your experience with this appliance..."
              />
            </div>
            <button type="submit" className="rounded-full bg-coral px-5 py-3 text-sm font-bold text-white">
              Submit review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
