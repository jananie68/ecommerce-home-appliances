import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { Funnel, Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard.jsx";

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ categories: [], brands: [] });
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const deferredSearch = useDeferredValue(searchInput);
  const category = searchParams.get("category") || "All";
  const brand = searchParams.get("brand") || "All";
  const sort = searchParams.get("sort") || "featured";

  useEffect(() => {
    const nextSearch = searchParams.get("search") || "";
    if (nextSearch !== searchInput) {
      setSearchInput(nextSearch);
    }
  }, [searchInput, searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (deferredSearch) {
      params.set("search", deferredSearch);
    } else {
      params.delete("search");
    }

    if (params.toString() !== searchParams.toString()) {
      startTransition(() => {
        setSearchParams(params, { replace: true });
      });
    }
  }, [deferredSearch, searchParams, setSearchParams]);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/products?${searchParams.toString()}`)
      .then((response) => {
        setProducts(response.data.products);
        setFilters(response.data.filters);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  function updateParam(key, value) {
    const nextParams = new URLSearchParams(searchParams);

    if (!value || value === "All" || value === "featured") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    startTransition(() => {
      setSearchParams(nextParams);
    });
  }

  return (
    <div className="section-shell py-12">
      <div className="rounded-[36px] bg-white p-8 shadow-soft sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">Product listing</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">Find the right appliance without the showroom guesswork.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
          Search by category, brand, price direction, and popularity. Every listing includes stock, pricing, reviews, and warranty visibility.
        </p>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="space-y-5 rounded-[32px] bg-white p-6 shadow-soft">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-coral">
              <Funnel size={16} />
              Filter
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
              <Search size={16} className="text-slate-400" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="w-full border-none bg-transparent text-sm focus:ring-0"
                placeholder="Search products..."
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-ink">Category</p>
            <div className="mt-3 space-y-2">
              {["All", ...filters.categories].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => updateParam("category", item)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                    category === item ? "bg-ink text-white" : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-ink">Brand</p>
            <select
              value={brand}
              onChange={(event) => updateParam("brand", event.target.value)}
              className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
            >
              <option>All</option>
              {filters.brands.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-col gap-4 rounded-[32px] bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Available products</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-ink">{products.length} appliances matched</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                <SlidersHorizontal size={16} />
                Sort
              </div>
              <select
                value={sort}
                onChange={(event) => updateParam("sort", event.target.value)}
                className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Top rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="latest">Latest</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="rounded-[32px] bg-white p-12 text-center text-sm font-semibold text-slate-500 shadow-soft">
              Loading catalog...
            </div>
          ) : products.length ? (
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[32px] bg-white p-12 text-center shadow-soft">
              <p className="font-display text-3xl font-bold text-ink">No products found</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Try removing a filter or searching for a different appliance category.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CatalogPage;
