import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { useStore } from "../context/StoreContext";
import { getMyOrders } from "../services/api";

function UserDashboard() {
  const { user, wishlist, cart } = useStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders()
      .then(({ data }) => setOrders(data))
      .catch((error) => console.error("Failed to load dashboard orders", error));
  }, []);

  return (
    <div className="min-h-screen">
      <UserNavbar categories={[]} search="" onSearchChange={() => {}} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="rounded-[32px] bg-brand-gradient p-8 text-white shadow-panel">
          <p className="text-sm uppercase tracking-[0.4em] text-white/80">Customer dashboard</p>
          <h1 className="mt-4 text-4xl font-bold">Welcome back, {user?.name}</h1>
          <p className="mt-3 max-w-2xl text-slate-200">
            Review your recent orders, saved products, and active cart in one place.
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="themed-card p-6">
            <p className="text-sm text-slate-500">Orders placed</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{orders.length}</p>
          </div>
          <div className="themed-card p-6">
            <p className="text-sm text-slate-500">Wishlist items</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{wishlist.length}</p>
          </div>
          <div className="themed-card p-6">
            <p className="text-sm text-slate-500">Cart items</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{cart.length}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="themed-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Recent orders</h2>
              <Link to="/orders" className="text-sm font-semibold text-brand-primary">
                View all
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {orders.slice(0, 4).map((order) => (
                <div key={order._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">#{order._id.slice(-8)}</p>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{order.orderItems.length} items</p>
                  <p className="mt-2 font-bold text-slate-900">Rs. {order.totalPrice}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="themed-card p-6">
            <h2 className="text-2xl font-bold text-slate-900">Account quick links</h2>
            <div className="mt-6 space-y-3">
              <Link to="/profile" className="block rounded-2xl bg-slate-50 px-4 py-3 font-medium text-slate-700">
                Edit profile and address
              </Link>
              <Link to="/wishlist" className="block rounded-2xl bg-slate-50 px-4 py-3 font-medium text-slate-700">
                Manage wishlist
              </Link>
              <Link to="/cart" className="block rounded-2xl bg-slate-50 px-4 py-3 font-medium text-slate-700">
                Checkout cart
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
