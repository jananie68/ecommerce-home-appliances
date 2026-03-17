import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getCategories, getFeaturedProducts, getProducts } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    sort: "featured"
  });

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      try {
        const [productsResponse, categoriesResponse, featuredResponse] = await Promise.all([
          getProducts({
            search,
            category: filters.category,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            rating: filters.rating,
            sort: filters.sort
          }),
          getCategories(),
          getFeaturedProducts()
        ]);

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
        setFeatured(featuredResponse.data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(loadPage, 200);
    return () => clearTimeout(timeout);
  }, [search, filters]);

  return (
    <div className="min-h-screen">
      <UserNavbar categories={categories.slice(0, 8)} search={search} onSearchChange={setSearch} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] bg-brand-gradient p-8 text-white shadow-panel">
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">Fresh arrivals</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight">
              Discover standout products with a faster, cleaner shopping experience
            </h1>
            <p className="mt-4 max-w-2xl text-white/85">
              Browse trending collections, save favorites to your wishlist, compare prices, and shop from a storefront designed for speed and style.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                Smart filters
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                Verified reviews
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                Fast checkout
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featured.slice(0, 2).map((product) => (
              <div key={product._id} className="themed-card p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-secondary">{product.category}</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-3 text-sm text-slate-500">{product.shortDescription || product.description}</p>
                <p className="mt-4 text-2xl font-bold text-brand-primary">Rs. {product.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <ProductFilters categories={categories} filters={filters} setFilters={setFilters} />

          <div>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Recommended products</h2>
                <p className="text-slate-500">{products.length} items matched your filters</p>
              </div>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Products;
