import React from "react";
import ProductCard from "../components/ProductCard";
import UserNavbar from "../components/UserNavbar";
import { useStore } from "../context/StoreContext";

function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <div className="min-h-screen">
      <UserNavbar categories={[]} search="" onSearchChange={() => {}} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900">Your wishlist</h1>
        <p className="mt-2 text-slate-500">Save products for later and compare deals before checkout.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {wishlist.length === 0 && <p className="mt-8 text-slate-500">No saved items yet.</p>}
      </main>
    </div>
  );
}

export default WishlistPage;
