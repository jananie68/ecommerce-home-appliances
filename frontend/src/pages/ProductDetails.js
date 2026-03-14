import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ProductCard from "../components/ProductCard";
import Rating from "../components/Rating";
import UserNavbar from "../components/UserNavbar";
import { useStore } from "../context/StoreContext";
import { getImageUrl } from "../utils/image";
import {
  createProductReview,
  getCategories,
  getProduct,
  getRelatedProducts
} from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useStore();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const [productResponse, relatedResponse, categoriesResponse] = await Promise.all([
          getProduct(id),
          getRelatedProducts(id),
          getCategories()
        ]);
        setProduct(productResponse.data);
        setRelatedProducts(relatedResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Failed to load product details", error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    await createProductReview(id, reviewForm);
    const { data } = await getProduct(id);
    setProduct(data);
    setReviewForm({ rating: 5, comment: "" });
  };

  return (
    <div className="min-h-screen">
      <UserNavbar categories={categories.slice(0, 8)} search="" onSearchChange={() => {}} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {loading || !product ? (
          <LoadingSkeleton cards={2} />
        ) : (
          <>
            <section className="themed-card grid gap-8 p-8 lg:grid-cols-[1fr_1.1fr]">
              <div className="rounded-[24px] bg-brand-gradient-soft p-8">
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="mx-auto max-h-[420px] object-contain"
                />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{product.category}</p>
                <h1 className="mt-3 text-4xl font-bold text-slate-900">{product.name}</h1>
                <div className="mt-4">
                  <Rating value={product.rating || 0} count={product.numReviews || 0} />
                </div>
                <p className="mt-6 text-3xl font-bold text-slate-900">Rs. {product.price}</p>
                {product.originalPrice && (
                  <p className="mt-1 text-sm text-slate-400 line-through">Rs. {product.originalPrice}</p>
                )}
                <p className="mt-5 text-base leading-7 text-slate-600">{product.description}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {(product.features || []).map((feature) => (
                    <div key={feature} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button onClick={() => addToCart(product)} className="gradient-btn px-6 py-3">
                    Add to cart
                  </button>
                  <button
                    onClick={() => {
                      addToCart(product);
                      navigate("/cart");
                    }}
                    className="rounded-full border border-brand-secondary/30 bg-white px-6 py-3 font-semibold text-brand-primary shadow-soft transition hover:-translate-y-0.5 hover:border-brand-primary/40"
                  >
                    Buy now
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div className="themed-card p-6">
                <h2 className="text-2xl font-bold text-slate-900">Customer reviews</h2>
                <div className="mt-6 space-y-5">
                  {(product.reviews || []).map((review) => (
                    <div key={review._id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900">{review.name}</p>
                        <Rating value={review.rating} compact />
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
                    </div>
                  ))}
                  {product.reviews?.length === 0 && <p className="text-slate-500">No reviews yet.</p>}
                </div>
              </div>

              <form onSubmit={submitReview} className="themed-card p-6">
                <h2 className="text-2xl font-bold text-slate-900">Write a review</h2>
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-slate-600">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(event) =>
                      setReviewForm((current) => ({ ...current, rating: Number(event.target.value) }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} star
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-slate-600">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(event) =>
                      setReviewForm((current) => ({ ...current, comment: event.target.value }))
                    }
                    rows="5"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                  />
                </div>
                <button className="gradient-btn mt-5">
                  Submit review
                </button>
              </form>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-slate-900">Related products</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ProductDetails;
