import React from "react";

function ProductFilters({ categories, filters, setFilters }) {
  return (
    <aside className="themed-card p-6">
      <h3 className="text-lg font-semibold text-slate-900">Filter products</h3>

      <div className="mt-6 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Category</label>
          <select
            value={filters.category}
            onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category._id || category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Price range</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Minimum rating</label>
          <select
            value={filters.rating}
            onChange={(event) => setFilters((current) => ({ ...current, rating: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">All ratings</option>
            <option value="4">4 stars and above</option>
            <option value="3">3 stars and above</option>
            <option value="2">2 stars and above</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">Sort by</label>
          <select
            value={filters.sort}
            onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>
    </aside>
  );
}

export default ProductFilters;
